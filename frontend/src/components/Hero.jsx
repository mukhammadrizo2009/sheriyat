import React from 'react';
import { Search, Sparkles, Feather, BookOpen, Heart, Eye } from 'lucide-react';

export default function Hero({ 
  poetProfile, 
  searchTerm, 
  setSearchTerm, 
  categories, 
  selectedCategory, 
  setSelectedCategory,
  stats
}) {
  return (
    <section style={{ 
      padding: '50px 0 35px 0', 
      borderBottom: '1px solid var(--border-color)',
      background: 'radial-gradient(ellipse at top, var(--bg-secondary) 0%, var(--bg-primary) 70%)'
    }}>
      <div className="container" style={{ textAlign: 'center' }}>
        
        {/* Poet Quote & Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <span className="badge badge-gold">
            <Feather size={13} /> {poetProfile?.pen_name || "Shoir Ijodxonasi"}
          </span>
        </div>

        {/* Hero Title */}
        <h1 style={{ 
          fontSize: 'clamp(2.1rem, 4.2vw, 3.4rem)', 
          fontWeight: 700, 
          lineHeight: 1.18, 
          marginBottom: '16px',
          color: 'var(--text-primary)'
        }}>
          «Ko'ngil mulkining so'z bilan chizilgan manzarasi»
        </h1>

        {/* Poet Bio Quote */}
        <p style={{ 
          fontFamily: 'var(--font-serif)', 
          fontSize: '1.25rem', 
          fontStyle: 'italic',
          color: 'var(--text-secondary)',
          maxWidth: '680px',
          margin: '0 auto 32px auto',
          lineHeight: 1.6
        }}>
          {poetProfile?.bio || "So'z — qalbning ko'zgusi, she'r esa ruhning ohangi. Ushbu sahifada hayot, muhabbat va falsafiy mushohadalar jamlangan."}
        </p>

        {/* Search Bar */}
        <div style={{ 
          maxWidth: '540px', 
          margin: '0 auto 32px auto', 
          position: 'relative' 
        }}>
          <Search 
            size={18} 
            color="var(--text-muted)" 
            style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} 
          />
          <input 
            type="text"
            className="input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="She'r nomi, satr yoki mavzu bo'yicha qidirish..."
            style={{ 
              paddingLeft: '46px', 
              paddingRight: '16px',
              height: '48px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--bg-card)',
              boxShadow: 'var(--shadow-sm)'
            }}
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              style={{
                position: 'absolute',
                right: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Categories Pills (Swipeable on Mobile) */}
        <div className="category-scroll-container" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          flexWrap: 'wrap', 
          gap: '8px' 
        }}>
          <button 
            className={`btn ${selectedCategory === null ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSelectedCategory(null)}
            style={{ fontSize: '0.82rem', padding: '6px 16px', flexShrink: 0 }}
          >
            Barcha janrlar
          </button>
          {categories.map((cat) => (
            <button 
              key={cat.id}
              className={`btn ${selectedCategory === cat.slug ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setSelectedCategory(selectedCategory === cat.slug ? null : cat.slug)}
              style={{ fontSize: '0.82rem', padding: '6px 16px', flexShrink: 0 }}
            >
              {cat.name} {cat.poems_count ? `(${cat.poems_count})` : ''}
            </button>
          ))}
        </div>

      </div>
    </section>
  );
}
