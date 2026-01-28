import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

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
              <h1 className="text-2xl font-bold text-blue-600">💳 PaySmart</h1>
            </div>
            <div className="flex items-center space-x-4 gap-4">
              <button
                onClick={() => navigate('/payment')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition duration-200"
              >
                ביצוע תשלום
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <span>👤</span>
                  <span className="text-sm">{user?.name}</span>
                </button>
                {showMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-10">
                    <button
                      onClick={() => navigate('/admin')}
                      className="w-full text-right px-4 py-2 hover:bg-gray-100 text-gray-700"
                    >
                      🔧 פנל מנהל
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-right px-4 py-2 hover:bg-gray-100 text-red-600 border-t"
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

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Welcome Card */}
          <div className="bg-white rounded-lg shadow-lg p-8 lg:col-span-2">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              שלום, {user?.name}! 👋
            </h2>
            <p className="text-gray-600 text-lg mb-6">
              ברוכים הבאים לאפליקציית ניהול התשלומים שלנו
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                <span className="text-2xl">✅</span>
                <p className="text-gray-700">חשבון מוגן ומאובטח עם הצפנה</p>
              </div>
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                <span className="text-2xl">💰</span>
                <p className="text-gray-700">תשלומים קלים ובטוחים דרך Cardcom</p>
              </div>
              <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
                <span className="text-2xl">📊</span>
                <p className="text-gray-700">ניהול פרטים ודוחות בזמן אמת</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">פעולות מהירות</h3>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/payment')}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
              >
                💳 תשלום חדש
              </button>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200">
                📋 היסטוריה
              </button>
              <button className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200">
                ⚙️ הגדרות
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h4 className="text-gray-600 text-sm font-medium mb-2">סך הכל תשלומים</h4>
            <p className="text-3xl font-bold text-blue-600">₪ 0.00</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h4 className="text-gray-600 text-sm font-medium mb-2">מנויים פעילים</h4>
            <p className="text-3xl font-bold text-green-600">0</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h4 className="text-gray-600 text-sm font-medium mb-2">תשלומים החודש</h4>
            <p className="text-3xl font-bold text-purple-600">0</p>
          </div>
        </div>
      </main>
    </div>
  );
};
