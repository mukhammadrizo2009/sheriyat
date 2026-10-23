import React from 'react';
import { Feather, Heart, Send, ShieldCheck } from 'lucide-react';

export default function Footer({ poetProfile, openAdminModal, openContact }) {
  return (
    <footer style={{ 
      borderTop: '1px solid var(--border-color)', 
      background: 'var(--bg-secondary)', 
      padding: '50px 0 30px 0',
      marginTop: '60px'
    }}>
      <div className="container">
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '36px',
          marginBottom: '40px'
        }}>
          {/* Col 1: Brand & Quote */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'var(--accent-gold-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-gold)'
              }}>
                <Feather size={18} />
              </div>
              <h4 style={{ fontSize: '1.35rem', margin: 0 }}>She'riyat</h4>
            </div>
            <p style={{ 
              fontFamily: 'var(--font-serif)', 
              fontSize: '1.05rem', 
              color: 'var(--text-secondary)',
              fontStyle: 'italic',
              lineHeight: 1.6
            }}>
              «{poetProfile?.quote || "Har bir satr — yurakning bitta urishi..."}»
            </p>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h5 style={{ fontSize: '0.92rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '14px', color: 'var(--text-muted)' }}>
              Sahifalar
            </h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem' }}>
              <li>
                <a href="#hero" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Bosh sahifa</a>
              </li>
              <li>
                <a href="#poems-feed" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>She'rlar va G'oyalar</a>
              </li>
              <li>
                <span onClick={openContact} style={{ color: 'var(--text-secondary)', cursor: 'pointer' }}>Shoir bilan bog'lanish</span>
              </li>
              <li>
                <span onClick={openAdminModal} style={{ color: 'var(--accent-gold)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <ShieldCheck size={14} /> Shoir Kabineti
                </span>
              </li>
            </ul>
          </div>

          {/* Col 3: Social & Telegram Bot */}
          <div>
            <h5 style={{ fontSize: '0.92rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '14px', color: 'var(--text-muted)' }}>
              Aloqa & Telegram Bot
            </h5>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
              Rasmiy xabarnoma boti:
            </p>
            <a 
              href="https://t.me/sheriyat_shahridanmiz_bot" 
              target="_blank" 
              rel="noreferrer"
              className="btn btn-secondary"
              style={{ fontSize: '0.85rem', padding: '8px 16px', display: 'inline-flex', marginBottom: '12px' }}
            >
              <Send size={14} color="#0088cc" /> @sheriyat_shahridanmiz_bot
            </a>
            {poetProfile?.telegram_channel && (
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Kanal: <span style={{ color: 'var(--text-primary)' }}>{poetProfile.telegram_channel}</span>
              </p>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          paddingTop: '24px', 
          borderTop: '1px solid var(--border-subtle)',
          fontSize: '0.82rem',
          color: 'var(--text-muted)'
        }}>
          <span>
            © {new Date().getFullYear()} She'riyat — Barcha huquqlar himoyalangan.
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            Shoir do'stimiz ijodi uchun mehr bilan yaratildi <Heart size={14} color="var(--accent-rose)" fill="var(--accent-rose)" />
          </span>
        </div>
      </div>
    </footer>
  );
}
