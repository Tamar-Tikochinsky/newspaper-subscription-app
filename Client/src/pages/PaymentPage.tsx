import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { paymentApi } from '../services/api';

export const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: user?.fullName || '',
    expiryDate: '',
    cvv: '',
    plan: 'premium',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const planPrices: Record<string, { name: string; price: number; features: string[] }> = {
    basic: { name: 'בסיסי', price: 29, features: ['גישה לחדשות יומיות', '5 מאמרים בחודש'] },
    premium: { name: 'פרימיום', price: 79, features: ['גישה מלאה לכל המאמרים', 'ללא פרסומות', 'התראות בזמן אמת'] },
    vip: { name: 'VIP', price: 149, features: ['כל המאמרים + ארכיון מלא', 'ללא פרסומות', 'גישה מוקדמת'] },
  };

  const selectedPlan = planPrices[formData.plan];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target as HTMLInputElement;
    let v = value;
    if (name === 'cardNumber') {
      v = value.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})/g, '$1 ').trim();
    }
    if (name === 'expiryDate') {
      v = value.replace(/\D/g, '').slice(0, 4);
      if (v.length >= 3) v = v.slice(0, 2) + '/' + v.slice(2);
    }
    if (name === 'cvv') v = value.replace(/\D/g, '').slice(0, 3);

    setFormData((prev) => ({ ...prev, [name]: v }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    // basic validation
    const digits = formData.cardNumber.replace(/\s/g, '');
    if (digits.length !== 16) return setError('מספר כרטיס צריך להכיל 16 ספרות');
    if (!formData.expiryDate.includes('/')) return setError('פורמט תוקף צריך להיות MM/YY');
    if (formData.cvv.length !== 3) return setError('CVV צריך להכיל 3 ספרות');

    setLoading(true);
    try {
      // record a simple payment on the server so it can be shown in the dashboard
      await paymentApi.createSimple(formData.plan, selectedPlan.price);
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 2500);
    } catch (err: any) {
      console.error(err);
      setError('שגיאה בתשלום. נסה שוב');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate('/dashboard')} className="text-cyan-600 hover:text-purple-600">← חזרה לאזור האישי</button>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent">עמוד תשלום</h1>
        </div>

        {success ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-purple-700 mb-2">התשלום בוצע בהצלחה</h2>
            <p className="text-gray-600">ברוכים הבאים לתוכנית {selectedPlan.name}</p>
            <p className="mt-4 text-sm text-gray-500">מועבר לאזור האישי בעוד שניות...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white rounded-lg shadow p-8 space-y-6">
              <h2 className="text-xl font-bold text-gray-800">בחרו תוכנית</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {Object.entries(planPrices).map(([key, plan]) => (
                  <label key={key} className={`block p-4 rounded border ${formData.plan === key ? 'ring-2 ring-amber-400 border-amber-200 bg-amber-50' : 'border-gray-200 hover:border-cyan-300'}`}>
                    <input type="radio" name="plan" value={key} checked={formData.plan === key} onChange={(e) => setFormData((p) => ({ ...p, plan: e.target.value }))} className="mb-2" />
                    <div className="font-bold text-gray-800">{plan.name}</div>
                    <div className="text-2xl font-extrabold text-purple-600">₪{plan.price}</div>
                    <div className="text-xs text-gray-600">/חודש</div>
                  </label>
                ))}
              </div>

              <div className="pt-4 border-t">
                <h3 className="text-lg font-bold text-gray-800 mb-3">פרטי כרטיס</h3>
                {error && <div className="text-sm text-red-600 mb-2">{error}</div>}

                <div>
                  <label className="block text-sm text-gray-700 mb-1">שם בעל הכרטיס</label>
                  <input name="cardName" value={formData.cardName} onChange={handleChange} className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-cyan-500 outline-none" />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1 mt-4">מספר כרטיס</label>
                  <input name="cardNumber" value={formData.cardNumber} onChange={handleChange} placeholder="1234 5678 9012 3456" className="w-full px-3 py-2 border rounded text-lg tracking-wider focus:ring-2 focus:ring-cyan-500 outline-none" />
                  <div className="text-xs text-gray-500 mt-1">16 ספרות</div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">תוקף (MM/YY)</label>
                    <input name="expiryDate" value={formData.expiryDate} onChange={handleChange} placeholder="MM/YY" maxLength={5} className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-cyan-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">CVV</label>
                    <input name="cvv" value={formData.cvv} onChange={handleChange} placeholder="123" maxLength={3} className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-cyan-500 outline-none" />
                  </div>
                </div>

                <div className="mt-6">
                  <button type="submit" disabled={loading} className="w-full px-4 py-3 bg-gradient-to-r from-cyan-600 to-purple-600 text-white rounded font-bold hover:from-cyan-700 hover:to-purple-700 transition">
                    {loading ? 'מעבד תשלום…' : `💳 שלם ₪${selectedPlan.price}`}
                  </button>
                </div>
              </div>
            </form>

            <aside className="bg-white rounded-lg shadow p-6 sticky top-8">
              <h3 className="text-lg font-bold text-gray-800 mb-4">סיכום הזמנה</h3>
              <div className="mb-4">
                <div className="text-sm text-gray-600">תוכנית</div>
                <div className="font-bold text-purple-700 text-xl">{selectedPlan.name}</div>
              </div>
              <ul className="space-y-2 mb-4 text-sm text-gray-700">
                {selectedPlan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="text-amber-400">✓</span>{f}</li>
                ))}
              </ul>
              <div className="border-t pt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2"><span>מחיר חודשי</span><span>₪{selectedPlan.price}.00</span></div>
                <div className="flex justify-between text-sm text-gray-600 mb-2"><span>מס</span><span>₪0.00</span></div>
                <div className="flex justify-between font-bold text-purple-700 text-lg"><span>סה"כ</span><span>₪{selectedPlan.price}.00</span></div>
              </div>
              <div className="text-xs text-gray-500 mt-4">💳 תשלום הראשון בלבד — ניתן לבטל בכל עת</div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
};
