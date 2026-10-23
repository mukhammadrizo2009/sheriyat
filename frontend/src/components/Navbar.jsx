import React from 'react';
import { Feather, Sun, Moon, ShieldCheck, Heart, Sparkles, BookOpen } from 'lucide-react';

export default function Navbar({ 
  theme, 
  setTheme, 
  activeTab, 
  setActiveTab, 
  openAdminModal, 
  isPoetLoggedIn, 
  openContact 
}) {
  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('sheriyat_theme', nextTheme);
  };

  return (
    <nav className="glass-nav">
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
        
        {/* Logo */}
        <div 
          onClick={() => setActiveTab('all')} 
          style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
        >
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'var(--accent-gold-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-gold)',
            border: '1px solid rgba(194, 136, 41, 0.3)',
            flexShrink: 0
          }}>
            <Feather size={20} />
          </div>
          <div>
            <span style={{ 
              fontFamily: 'var(--font-serif)', 
              fontSize: '1.35rem', 
              fontWeight: 700, 
              letterSpacing: '-0.02em',
              display: 'block',
              lineHeight: 1.1
            }}>
              She'riyat
            </span>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Qalb sadosi
            </span>
          </div>
        </div>

        {/* Center Desktop Nav Links */}
        <div className="desktop-nav-links" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button 
            className={`btn ${activeTab === 'all' ? 'btn-secondary' : 'btn-ghost'}`}
            onClick={() => setActiveTab('all')}
            style={{ fontWeight: activeTab === 'all' ? 600 : 400 }}
          >
            <BookOpen size={16} /> Barchasi
          </button>
          
          <button 
            className={`btn ${activeTab === 'poem' ? 'btn-secondary' : 'btn-ghost'}`}
            onClick={() => setActiveTab('poem')}
            style={{ fontWeight: activeTab === 'poem' ? 600 : 400 }}
          >
            She'rlar
          </button>

          <button 
            className={`btn ${activeTab === 'thought' ? 'btn-secondary' : 'btn-ghost'}`}
            onClick={() => setActiveTab('thought')}
            style={{ fontWeight: activeTab === 'thought' ? 600 : 400 }}
          >
            <Sparkles size={16} /> G'oyalar
          </button>

          <button 
            className="btn btn-ghost"
            onClick={openContact}
          >
            Bog'lanish
          </button>
        </div>

        {/* Right Actions: Theme Toggle & Shoir Dashboard */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button 
            className="btn btn-ghost btn-icon" 
            onClick={toggleTheme}
            title={theme === 'dark' ? "Yorug' rejim" : "Tungi rejim"}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={19} color="#e2a63b" /> : <Moon size={19} />}
          </button>

          <button 
            className={`btn ${isPoetLoggedIn ? 'btn-primary' : 'btn-secondary'}`}
            onClick={openAdminModal}
            style={{ fontSize: '0.84rem', padding: '6px 14px' }}
          >
            <ShieldCheck size={16} />
            <span>{isPoetLoggedIn ? "Kabinet" : "Shoir"}</span>
          </button>
        </div>

      </div>
    </nav>
  );
}
