import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  return (
    <div className="bg-gradient-to-b from-cyan-50 to-white min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white shadow-sm border-b-2 border-purple-400">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent">
              עיתון דיגיטלי
            </h1>
            <div className="space-x-4">
              {!isLoggedIn ? (
                <>
                  <button
                    onClick={() => navigate('/login')}
                    className="px-4 py-2 text-gray-700 hover:text-cyan-600 font-medium transition"
                  >
                    כניסה
                  </button>
                  <button
                    onClick={() => navigate('/signup')}
                    className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-purple-600 text-white rounded-lg hover:from-cyan-700 hover:to-purple-700 transition font-medium"
                  >
                    הרשמה
                  </button>
                </>
              ) : (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-purple-600 text-white rounded-lg hover:from-cyan-700 hover:to-purple-700 transition font-medium"
                >
                  האזור האישי שלי
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-cyan-600 via-purple-600 to-cyan-600 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">
            הישארו מעודכנים בחדשות
          </h1>
          <p className="text-xl text-cyan-100 mb-8">
            קרא את החדשות העדכניות ביותר מכל העולם במקום אחד
          </p>
          <button
            onClick={() => navigate('/signup')}
            className="px-8 py-3 bg-gradient-to-r from-amber-400 to-yellow-400 text-purple-900 font-bold rounded-lg hover:from-amber-300 hover:to-yellow-300 transition text-lg"
          >
            התחילו עכשיו
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
            מה אנחנו מציעים
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-cyan-50 to-purple-50 rounded-lg p-6 border-2 border-cyan-400 hover:shadow-lg transition">
              <div className="text-3xl mb-4">📰</div>
              <h3 className="text-xl font-bold text-cyan-700 mb-3">
                חדשות בזמן אמת
              </h3>
              <p className="text-gray-700">
                קבל עדכונים מיידיים על האירועים החשובים ביותר בעולם
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-purple-50 to-cyan-50 rounded-lg p-6 border-2 border-purple-600 hover:shadow-lg transition">
              <div className="text-3xl mb-4">🔒</div>
              <h3 className="text-xl font-bold text-purple-700 mb-3">
                קריאה בטוחה
              </h3>
              <p className="text-gray-700">
                חשבון מאובטח עם אפשרויות פרטיות מתקדמות לשמירת הנתונים שלך
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg p-6 border-2 border-amber-500 hover:shadow-lg transition">
              <div className="text-3xl mb-4">⭐</div>
              <h3 className="text-xl font-bold text-amber-700 mb-3">
                תוכן בחר
              </h3>
              <p className="text-gray-700">
                בחר את הנושאים שמעניינים אותך וקבל חדשות מותאמות אישית
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
            תוכניות מנוי
          </h2>
          <div className="flex flex-col md:flex-row justify-center gap-8 items-center">
            {/* Basic Plan */}
            <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-cyan-400 w-full md:w-80 hover:shadow-2xl transition">
              <h3 className="text-2xl font-bold text-cyan-700 mb-2">
                בסיסי
              </h3>
              <p className="text-gray-600 mb-4">מושלם להתחלה</p>
              <div className="text-4xl font-bold text-cyan-600 mb-6">
                ₪29<span className="text-lg text-gray-600">/חודש</span>
              </div>
              <ul className="space-y-3 mb-8 text-gray-700">
                <li className="flex items-center">
                  <span className="text-cyan-600 font-bold mr-2">✓</span>
                  קריאת כתבות חדשות
                </li>
                <li className="flex items-center">
                  <span className="text-cyan-600 font-bold mr-2">✓</span>
                  חדשות בעברית
                </li>
                <li className="flex items-center">
                  <span className="text-cyan-600 font-bold mr-2">✓</span>
                  דוא"ל יומי
                </li>
              </ul>
              <button
                onClick={() => navigate('/signup')}
                className="w-full px-6 py-2 bg-gradient-to-r from-cyan-600 to-purple-600 text-white font-bold rounded-lg hover:from-cyan-700 hover:to-purple-700 transition"
              >
                בחרו תוכנית זו
              </button>
            </div>

            {/* Premium Plan */}
            <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-purple-600 w-full md:w-80 hover:shadow-2xl transition md:relative md:scale-105">
              <div className="absolute top-0 right-0 -mt-3 -mr-3 bg-gradient-to-r from-amber-400 to-yellow-400 text-purple-900 px-3 py-1 rounded-full text-sm font-bold">
                הפופולרי
              </div>
              <h3 className="text-2xl font-bold text-purple-700 mb-2 mt-4">
                פרימיום
              </h3>
              <p className="text-gray-600 mb-4">הבחירה הטובה</p>
              <div className="text-4xl font-bold text-purple-600 mb-6">
                ₪79<span className="text-lg text-gray-600">/חודש</span>
              </div>
              <ul className="space-y-3 mb-8 text-gray-700">
                <li className="flex items-center">
                  <span className="text-purple-600 font-bold mr-2">✓</span>
                  כל היתרונות של בסיסי
                </li>
                <li className="flex items-center">
                  <span className="text-purple-600 font-bold mr-2">✓</span>
                  גישה לאפליקציה
                </li>
                <li className="flex items-center">
                  <span className="text-purple-600 font-bold mr-2">✓</span>
                  ללא מודעות
                </li>
                <li className="flex items-center">
                  <span className="text-purple-600 font-bold mr-2">✓</span>
                  אחסון כתבות לקריאה מאוחרת
                </li>
              </ul>
              <button
                onClick={() => navigate('/signup')}
                className="w-full px-6 py-2 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-cyan-700 transition"
              >
                בחרו תוכנית זו
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-cyan-600 via-purple-600 to-amber-500 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            התחילו את מסע החדשות שלכם היום
          </h2>
          <p className="text-lg text-cyan-100 mb-8">
            קבלו גישה למאות כתבות יומיות ועדכונים בזמן אמת
          </p>
          <button
            onClick={() => navigate('/signup')}
            className="px-8 py-3 bg-white text-purple-700 font-bold rounded-lg hover:bg-gray-100 transition text-lg"
          >
            הרשמה בחינם
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 px-4 sm:px-6 lg:px-8 border-t-2 border-amber-500">
        <div className="max-w-6xl mx-auto text-center">
          <p>&copy; 2024 עיתון דיגיטלי. כל הזכויות שמורות.</p>
        </div>
      </footer>
    </div>
  );
}
