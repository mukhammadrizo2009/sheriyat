import React, { useState } from 'react';
import { Send, CheckCircle2, MessageCircle, Sparkles, Feather, HelpCircle } from 'lucide-react';
import { api } from '../api';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.contact.trim() || !formData.message.trim()) {
      setErrorMsg("Iltimos, ismingiz, aloqa ma'lumoti va xabar matnini to'ldiring.");
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      await api.sendFeedback(formData);
      setSuccess(true);
      setFormData({ name: '', contact: '', subject: '', message: '' });
      setTimeout(() => setSuccess(false), 8000);
    } catch (err) {
      console.error("Xabar yuborishda xatolik:", err);
      setErrorMsg("Xabar yuborishda xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact-section" style={{ 
      padding: '70px 0', 
      borderTop: '1px solid var(--border-color)',
      background: 'var(--bg-secondary)'
    }}>
      <div className="container" style={{ maxWidth: '780px' }}>
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span className="badge badge-gold" style={{ marginBottom: '12px' }}>
            <MessageCircle size={13} /> Aloqa va Fikr-mulohaza
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.7rem)', marginBottom: '14px' }}>
            Shoir bilan bog'lanish
          </h2>
          <p style={{ 
            fontFamily: 'var(--font-serif)', 
            fontSize: '1.2rem', 
            color: 'var(--text-secondary)',
            fontStyle: 'italic',
            maxWidth: '560px',
            margin: '0 auto'
          }}>
            Ijod bo'yicha fikr-mulohazangiz, taklifingiz yoki qalb so'zlaringiz bormi? Xabaringiz to'g'ridan-to'g'ri Telegram bot orqali shoirga yetkaziladi.
          </p>
        </div>

        {/* Success Card */}
        {success ? (
          <div className="card" style={{ 
            textAlign: 'center', 
            padding: '48px 24px', 
            background: 'var(--bg-card)',
            borderColor: 'var(--accent-gold)'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'var(--accent-gold-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px auto',
              color: 'var(--accent-gold)'
            }}>
              <CheckCircle2 size={36} />
            </div>
            <h3 style={{ fontSize: '1.6rem', marginBottom: '10px' }}>
              Xabaringiz shoirga yetkazildi!
            </h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '440px', margin: '0 auto 24px auto', fontSize: '0.98rem' }}>
              Xabaringiz Telegram orqali muallifga yo'llandi. E'tiboringiz va iliq munosabatingiz uchun samimiy minnatdorchilik bildiramiz.
            </p>
            <button 
              className="btn btn-secondary" 
              onClick={() => setSuccess(false)}
            >
              Yana xabar yozish
            </button>
          </div>
        ) : (
          /* Form Card */
          <div className="card" style={{ padding: '36px' }}>
            
            {/* Telegram Bot Indicator Banner */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              padding: '12px 18px', 
              background: 'var(--accent-gold-light)', 
              borderRadius: 'var(--radius-sm)',
              marginBottom: '28px',
              border: '1px solid rgba(194, 136, 41, 0.25)',
              fontSize: '0.88rem',
              color: 'var(--text-primary)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.2rem' }}>✈️</span>
                <span>
                  Xabar avtomatik <strong>@sheriyat_shahridanmiz_bot</strong> orqali yetkaziladi
                </span>
              </div>
              <a 
                href="https://t.me/sheriyat_shahridanmiz_bot" 
                target="_blank" 
                rel="noreferrer"
                style={{ 
                  color: 'var(--accent-gold)', 
                  fontWeight: 600, 
                  textDecoration: 'none',
                  fontSize: '0.84rem'
                }}
              >
                Botni ochish →
              </a>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, marginBottom: '6px' }}>
                    Ismingiz <span style={{ color: 'var(--accent-rose)' }}>*</span>
                  </label>
                  <input 
                    type="text" 
                    name="name" 
                    className="input" 
                    placeholder="Masalan: Sardor Komilov" 
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, marginBottom: '6px' }}>
                    Aloqa vositasi <span style={{ color: 'var(--accent-rose)' }}>*</span>
                  </label>
                  <input 
                    type="text" 
                    name="contact" 
                    className="input" 
                    placeholder="Telefon raqam yoki @telegram" 
                    value={formData.contact}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, marginBottom: '6px' }}>
                  Xabar mavzusi (ixtiyoriy)
                </label>
                <input 
                  type="text" 
                  name="subject" 
                  className="input" 
                  placeholder="Masalan: She'riyat kechasiga taklif / Taassurot" 
                  value={formData.subject}
                  onChange={handleChange}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, marginBottom: '6px' }}>
                  Xabar matni <span style={{ color: 'var(--accent-rose)' }}>*</span>
                </label>
                <textarea 
                  name="message" 
                  className="textarea" 
                  rows="4" 
                  placeholder="Shoirga aytmoqchi bo'lgan so'zlaringizni shu yerga yozing..." 
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>

              {errorMsg && (
                <div style={{ 
                  padding: '12px 16px', 
                  borderRadius: 'var(--radius-sm)', 
                  background: 'rgba(230, 82, 101, 0.1)', 
                  border: '1px solid var(--accent-rose)',
                  color: 'var(--accent-rose)',
                  fontSize: '0.88rem',
                  marginBottom: '18px'
                }}>
                  {errorMsg}
                </div>
              )}

              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={submitting}
                style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
              >
                <Send size={18} />
                {submitting ? "Telegram orqali yuborilmoqda..." : "Shoirga xabar yuborish"}
              </button>
            </form>

          </div>
        )}

      </div>
    </section>
  );
}
