import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent">📰 האזור האישי</h1>
            </div>
            <div className="flex items-center space-x-4 gap-4">
              <button
                onClick={() => navigate('/')}
                className="text-gray-700 hover:text-cyan-600 font-medium transition"
              >
                דף הבית
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <span>👤</span>
                  <span className="text-sm">{user?.fullName}</span>
                </button>
                {showMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-10">
                    <button
                      onClick={handleLogout}
                      className="w-full text-right px-4 py-2 hover:bg-gray-100 text-red-600 border-t rounded-lg"
                    >
                      🚪 התנתק
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Tabs */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-4 px-4 font-medium border-b-2 transition ${
                activeTab === 'profile'
                  ? 'border-cyan-600 text-cyan-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              👤 פרופיל
            </button>
            <button
              onClick={() => setActiveTab('subscription')}
              className={`py-4 px-4 font-medium border-b-2 transition ${
                activeTab === 'subscription'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              📰 המנוי שלי
            </button>
            <button
              onClick={() => setActiveTab('billing')}
              className={`py-4 px-4 font-medium border-b-2 transition ${
                activeTab === 'billing'
                  ? 'border-amber-600 text-amber-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              💳 תשלומים
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">📋 פרטי החשבון</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">שם</label>
                    <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-700">
                      {user?.name}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">דוא"ל</label>
                    <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-700">
                      {user?.email}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">תאריך הצטרפות</label>
                    <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-700">
                      {new Date().toLocaleDateString('he-IL')}
                    </div>
                  </div>
                  <button className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200">
                    ✏️ עדכן פרטים
                  </button>
                </div>
              </div>
            </div>
            {/* Account Status */}
            <div>
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h3 className="text-lg font-bold text-gray-800 mb-4">📊 מצב החשבון</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-gray-600 mb-1">סטטוס</p>
                    <p className="text-lg font-bold text-green-600">✅ פעיל</p>
                  </div>
                  <div className="p-4 bg-cyan-50 rounded-lg border border-cyan-200">
                    <p className="text-sm text-gray-600 mb-1">חברות</p>
                    <p className="text-lg font-bold text-purple-600">🔒 עמיד</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Subscription Tab */}
        {activeTab === 'subscription' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">📰 המנויים שלי</h2>
              <div className="space-y-4">
                <div className="border-2 border-purple-500 rounded-lg p-6 bg-purple-50">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">פרימיום</h3>
                      <p className="text-sm text-gray-600">כל המאמרים + ללא פרסומות</p>
                    </div>
                    <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                      פעיל
                    </div>
                  </div>
                  <div className="space-y-3 text-sm text-gray-700 mb-4">
                    <p>💰 ₪79 לחודש</p>
                    <p>📅 מחודש הבא: {new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('he-IL')}</p>
                  </div>
                  <button className="w-full text-red-600 hover:bg-red-50 py-2 px-4 rounded-lg transition border border-red-300">
                    ❌ ביטול מנוי
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-lg font-bold text-gray-800 mb-4">📚 תכנים זמינים</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-gray-700">
                  <span className="text-cyan-600">✓</span> גישה מלאה לכל המאמרים
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <span className="text-cyan-600">✓</span> ללא פרסומות
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <span className="text-cyan-600">✓</span> התראות בזמן אמת
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <span className="text-cyan-600">✓</span> ארכיון חדשות מלא
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <span className="text-cyan-600">✓</span> תמיכה עדיפות
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Billing Tab */}
        {activeTab === 'billing' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">💳 פרטי התשלום</h2>
                
                <div className="bg-gradient-to-r from-cyan-600 to-purple-600 rounded-lg p-8 text-white mb-8">
                  <p className="text-sm opacity-75 mb-2">מספר כרטיס</p>
                  <p className="text-2xl font-bold mb-8">•••• •••• •••• 4242</p>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs opacity-75 mb-1">בעל הכרטיס</p>
                      <p className="font-semibold">{user?.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs opacity-75 mb-1">תוקף</p>
                      <p className="font-semibold">12/26</p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">עדכן כרטיס אשראי</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">מספר כרטיס</label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">תוקף</label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                        <input
                          type="text"
                          placeholder="123"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none"
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => navigate('/payment')}
                      className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
                    >
                      💾 שמור כרטיס
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            <div>
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h3 className="text-lg font-bold text-gray-800 mb-4">📊 סיכום תשלומים</h3>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">חודשי</span>
                    <span className="font-semibold">₪79.00</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">מס</span>
                    <span className="font-semibold">₪0.00</span>
                  </div>
                  <div className="flex justify-between py-2 bg-purple-50 px-2 rounded">
                    <span className="text-gray-800 font-bold">סה"כ</span>
                    <span className="text-purple-600 font-bold text-lg">₪79.00</span>
                  </div>
                </div>
                <button className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200">
                  🧾 הדפס חשבונית
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
