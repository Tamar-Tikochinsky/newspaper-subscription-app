import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User } from '../types/models';

interface AdminUser extends User {
  status: 'active' | 'inactive';
  joinDate: string;
  subscriptionStart?: Date;
  subscriptionEnd?: Date;
}

interface PaymentRecord {
  _id: string;
  user: { _id: string; fullName: string; email: string };
  amount: number;
  status: 'pending' | 'success' | 'failed';
  billingType: 'immediate' | 'deferred';
  createdAt: string;
}

export const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPayments, setShowPayments] = useState(false);

  // load users from API on mount
  useEffect(() => {
    const load = async () => {
      try {
        const all = await (await import('../services/api')).userApi.getAll();
        // map backend user shape to AdminUser
        const mapped: AdminUser[] = all.map((u: any) => ({
          _id: u._id || u.id || '',
          fullName: u.fullName,
          email: u.email,
          isAdmin: u.isAdmin,
          status: u.subscriptionEnd && new Date(u.subscriptionEnd) > new Date() ? 'active' : 'inactive',
          joinDate: u.createdAt ? new Date(u.createdAt).toISOString().split('T')[0] : '',
          subscriptionStart: u.subscriptionStart as any,
          subscriptionEnd: u.subscriptionEnd as any,
        }));
        setUsers(mapped);
      } catch (err) {
        console.error('failed to load users', err);
      }
    };
    load();
  }, []);

  // load payments when showing payment history
  useEffect(() => {
    if (showPayments) {
      const loadPayments = async () => {
        try {
          const allPayments = await (await import('../services/api')).paymentApi.getAllPayments();
          setPayments(allPayments);
        } catch (err) {
          console.error('failed to load payments', err);
        }
      };
      loadPayments();
    }
  }, [showPayments]);

  // Filter users by search query
  const filteredUsers = users.filter(user => {
    const query = searchQuery.toLowerCase();
    return (
      user.fullName.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    );
  });

  // Export emails to CSV
  const exportEmailsToCSV = () => {
    const emails = users.map(u => u.email).join(',');
    const csvContent = `data:text/csv;charset=utf-8,${emails}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'emails.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export payments to CSV
  const exportPaymentsToCSV = () => {
    const headers = ['תאריך', 'משתמש', 'דוא"ל', 'סכום', 'סטטוס', 'סוג חיוב'];
    const rows = payments.map(p => [
      new Date(p.createdAt).toLocaleDateString('he-IL'),
      p.user?.fullName || 'לא ידוע',
      p.user?.email || 'לא ידוע',
      p.amount,
      p.status === 'success' ? 'הצליח' : p.status === 'failed' ? 'נכשל' : 'ממתין',
      p.billingType === 'immediate' ? 'מיידי' : 'דחוי',
    ]);
    
    const csvContent = `data:text/csv;charset=utf-8,${headers.join(',')}\n${rows.map(r => r.join(',')).join('\n')}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'payments_history.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const [showAddUser, setShowAddUser] = useState(false);
  const [showChargeModal, setShowChargeModal] = useState(false);
  const [chargeAmount, setChargeAmount] = useState('');
  const [newUser, setNewUser] = useState({ fullName: '', email: '', password: '' });

  const handleAddUser = () => {
    if (newUser.fullName && newUser.email && newUser.password) {
      setUsers([
        ...users,
        {
          _id: Date.now().toString(),
          fullName: newUser.fullName,
          email: newUser.email,
          isAdmin: false,
          status: 'active',
          joinDate: new Date().toISOString().split('T')[0],
        },
      ]);
      setNewUser({ fullName: '', email: '', password: '' });
      setShowAddUser(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (confirm('האם אתה בטוח שברצונך למחוק משתמש זה?')) {
      try {
        await (await import('../services/api')).userApi.delete(id);
        setUsers(users.filter(u => u._id !== id));
      } catch (err) {
        console.error('delete failed', err);
      }
    }
  };

  const handleCancelSubscription = async (_id: string) => {
    if (confirm('האם אתה רוצה לבטל את המנוי של משתמש זה?')) {
      alert('בשרת זה הפונקציה לביטול מנוי אינה נתמכת דרך ה-API הנוכחי.');
    }
  };

  const handleChargeAll = () => {
    if (chargeAmount) {
      alert(`גוביה של ₪${chargeAmount} בוצעה לכל ${users.filter(u => u.status === 'active').length} משתמשים פעילים`);
      setShowChargeModal(false);
      setChargeAmount('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-red-600">🔧 פנל מנהל</h1>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg"
            >
              חזור
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <button
            onClick={() => setShowAddUser(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center gap-2"
          >
            ➕ הוסף משתמש
          </button>
          <button
            onClick={() => setShowChargeModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center gap-2"
          >
            💰 גביית סכום מכל המנויים
          </button>
          <button
            onClick={() => setShowPayments(!showPayments)}
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center gap-2"
          >
            📊 {showPayments ? 'הסתר היסטוריית חיובים' : 'הצג היסטוריית חיובים'}
          </button>
          <button
            onClick={exportEmailsToCSV}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center gap-2"
          >
            📧 ייצא מיילים ל-CSV
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent text-lg"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <p className="text-gray-600 text-sm">סך המשתמשים הפעילים</p>
            <p className="text-3xl font-bold text-purple-600">
              {users.filter(u => u.status === 'active').length}
            </p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <p className="text-gray-600 text-sm">סך המשתמשים</p>
            <p className="text-3xl font-bold text-blue-600">{users.length}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <p className="text-gray-600 text-sm">תוצאות חיפוש</p>
            <p className="text-3xl font-bold text-green-600">{filteredUsers.length}</p>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">שם</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">דוא"ל</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">תאריך הצטרפות</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">סטטוס</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">התחלת מנוי</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">סיום מנוי</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">פעולות</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user._id} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{user.fullName}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{user.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{user.joinDate}</td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                        {user.status === 'active' ? '✅ פעיל' : '❌ לא פעיל'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {user.subscriptionStart ? new Date(user.subscriptionStart).toLocaleDateString('he-IL') : '-'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {user.subscriptionEnd ? new Date(user.subscriptionEnd).toLocaleDateString('he-IL') : '-'}
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 font-medium">
                        ✏️ עריכה
                      </button>
                      {user.status === 'active' && (
                        <button
                          onClick={() => handleCancelSubscription(user._id!)}
                          className="text-yellow-600 hover:text-yellow-800 font-medium mr-2"
                        >
                          ❌ בטל מנוי
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteUser(user._id!)}
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        🗑️ מחיקה
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredUsers.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              לא נמצאו משתמשים התואמים את החיפוש
            </div>
          )}
        </div>

        {/* Payment History Section */}
        {showPayments && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-orange-50 px-6 py-4 border-b border-orange-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-orange-800">📊 היסטוריית חיובים</h2>
              <button
                onClick={exportPaymentsToCSV}
                className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 flex items-center gap-2"
              >
                📥 ייצא ל-CSV
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">תאריך</th>
                    <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">משתמש</th>
                    <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">דוא"ל</th>
                    <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">סכום</th>
                    <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">סטטוס</th>
                    <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">סוג חיוב</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map(payment => (
                    <tr key={payment._id} className="border-t border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {new Date(payment.createdAt).toLocaleDateString('he-IL')}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {payment.user?.fullName || 'לא ידוע'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {payment.user?.email || 'לא ידוע'}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-green-600">
                        ₪{payment.amount}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                          payment.status === 'success' ? 'text-green-700 bg-green-100' :
                          payment.status === 'failed' ? 'text-red-700 bg-red-100' :
                          'text-yellow-700 bg-yellow-100'
                        }`}>
                          {payment.status === 'success' ? '✅ הצליח' : 
                           payment.status === 'failed' ? '❌ נכשל' : '⏳ ממתין'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {payment.billingType === 'immediate' ? 'מיידי' : 'דחוי'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {payments.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                אין נתוני חיובים
              </div>
            )}
          </div>
        )}

        {/* Add User Modal */}
        {showAddUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">הוסף משתמש חדש</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    שם
                  </label>
                  <input
                    type="text"
                    value={newUser.fullName}
                    onChange={e => setNewUser({ ...newUser, fullName: e.target.value })}
                    placeholder="הזן שם משתמש"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    דוא"ל
                  </label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                    placeholder="user@example.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    סיסמא ראשונית
                  </label>
                  <input
                    type="password"
                    value={newUser.password}
                    onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                    placeholder="הזן סיסמא"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={handleAddUser}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
                  >
                    הוסף
                  </button>
                  <button
                    onClick={() => setShowAddUser(false)}
                    className="flex-1 border border-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-50"
                  >
                    ביטול
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Charge Modal */}
        {showChargeModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">גביית סכום מכל המנויים</h2>
              <p className="text-gray-600 mb-6">
                {users.filter(u => u.status === 'active').length} משתמשים פעילים
              </p>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  סכום לגביה (₪)
                </label>
                <input
                  type="number"
                  value={chargeAmount}
                  onChange={e => setChargeAmount(e.target.value)}
                  placeholder="הזן סכום"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent text-lg font-bold"
                />
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4 mb-6">
                <p className="text-sm text-yellow-800">
                  ⚠️ פעולה זו תגביה ₪{chargeAmount || '0'} מ-{users.filter(u => u.status === 'active').length} משתמשים
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleChargeAll}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg"
                >
                  אישור
                </button>
                <button
                  onClick={() => {
                    setShowChargeModal(false);
                    setChargeAmount('');
                  }}
                  className="flex-1 border border-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-50"
                >
                  ביטול
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
