import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  joinDate: string;
}

export const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'דוד כהן',
      email: 'david@example.com',
      status: 'active',
      joinDate: '2025-01-15',
    },
    {
      id: '2',
      name: 'שרה ישראל',
      email: 'sarah@example.com',
      status: 'active',
      joinDate: '2025-01-10',
    },
  ]);

  const [showAddUser, setShowAddUser] = useState(false);
  const [showChargeModal, setShowChargeModal] = useState(false);
  const [chargeAmount, setChargeAmount] = useState('');
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '' });

  const handleAddUser = () => {
    if (newUser.name && newUser.email && newUser.password) {
      setUsers([
        ...users,
        {
          id: Date.now().toString(),
          name: newUser.name,
          email: newUser.email,
          status: 'active',
          joinDate: new Date().toISOString().split('T')[0],
        },
      ]);
      setNewUser({ name: '', email: '', password: '' });
      setShowAddUser(false);
    }
  };

  const handleDeleteUser = (id: string) => {
    if (confirm('האם אתה בטוח שברצונך למחוק משתמש זה?')) {
      setUsers(users.filter(u => u.id !== id));
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <p className="text-gray-600 text-sm">סך המשתמשים הפעילים</p>
            <p className="text-3xl font-bold text-purple-600">
              {users.filter(u => u.status === 'active').length}
            </p>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">שם</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">דוא"ל</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">תאריך הצטרפות</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">סטטוס</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">פעולות</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{user.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{user.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{user.joinDate}</td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                        {user.status === 'active' ? '✅ פעיל' : '❌ לא פעיל'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 font-medium">
                        ✏️ עריכה
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
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
        </div>

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
                    value={newUser.name}
                    onChange={e => setNewUser({ ...newUser, name: e.target.value })}
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
