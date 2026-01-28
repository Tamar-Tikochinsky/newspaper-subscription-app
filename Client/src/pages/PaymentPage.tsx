import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    amount: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
    } else if (name === 'expiryDate') {
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length >= 2) {
        formattedValue = formattedValue.slice(0, 2) + '/' + formattedValue.slice(2, 4);
      }
    } else if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 3);
    }

    setFormData({
      ...formData,
      [name]: formattedValue,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call to Cardcom
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 to-green-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Back Button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="text-white hover:text-gray-200 mb-6 flex items-center gap-2"
        >
          ← חזור
        </button>

        {success ? (
          <div className="bg-white rounded-lg shadow-2xl p-12 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-3xl font-bold text-green-600 mb-2">התשלום בוצע בהצלחה!</h1>
            <p className="text-gray-600 mb-4">הנך מחזור לדף הראשי...</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full animate-pulse"></div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-2xl p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">ביצוע תשלום</h1>
            <p className="text-gray-600 mb-8">הזן את פרטי כרטיס האשראי שלך בבטחה</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  סכום תשלום (₪)
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="הזן סכום"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent text-lg"
                  required
                />
              </div>

              {/* Card Holder Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  שם בעל הכרטיס
                </label>
                <input
                  type="text"
                  name="cardName"
                  value={formData.cardName}
                  onChange={handleChange}
                  placeholder="כפי שמופיע בכרטיס"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  required
                />
              </div>

              {/* Card Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  מספר כרטיס אשראי
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent font-mono text-lg"
                    required
                  />
                  <div className="absolute left-4 top-3">
                    <span className="text-2xl">💳</span>
                  </div>
                </div>
              </div>

              {/* Expiry and CVV */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    תאריך תפוגה
                  </label>
                  <input
                    type="text"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    placeholder="MM/YY"
                    maxLength={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVV
                  </label>
                  <input
                    type="password"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleChange}
                    placeholder="123"
                    maxLength={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent font-mono"
                    required
                  />
                </div>
              </div>

              {/* Security Note */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                <span className="text-xl">🔒</span>
                <p className="text-sm text-blue-800">
                  הנתונים שלך מוצפנים ומאובטחים על ידי Cardcom. אנחנו לא משמרים פרטים של כרטיס אשראי.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 text-lg"
              >
                {loading ? 'מעבד את התשלום...' : `ביצוע תשלום ₪${formData.amount || '0.00'}`}
              </button>

              {/* Back Button */}
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="w-full border-2 border-gray-300 text-gray-700 font-bold py-3 px-4 rounded-lg hover:bg-gray-50 transition duration-200"
              >
                ביטול
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
