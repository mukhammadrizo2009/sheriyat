import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PoemCard from './components/PoemCard';
import PoemDetailModal from './components/PoemDetailModal';
import ContactSection from './components/ContactSection';
import PoetAdminDashboard from './components/PoetAdminDashboard';
import Footer from './components/Footer';
import { api } from './api';
import { Sparkles, BookOpen, Feather, Search, Heart, RefreshCw } from 'lucide-react';

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('sheriyat_theme') || 'light');
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'poem', 'thought'
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Data states
  const [poetProfile, setPoetProfile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [poems, setPoems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [selectedPoemSlug, setSelectedPoemSlug] = useState(null);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isPoetLoggedIn, setIsPoetLoggedIn] = useState(() => !!localStorage.getItem('sheriyat_poet_token'));

  // Sync theme attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Check login state
  useEffect(() => {
    const checkAuth = () => {
      setIsPoetLoggedIn(!!localStorage.getItem('sheriyat_poet_token'));
    };
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  // Fetch initial data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [profileRes, catRes, poemsRes] = await Promise.all([
        api.getPoetProfile().catch(() => null),
        api.getCategories().catch(() => []),
        api.getPoems().catch(() => [])
      ]);

      if (profileRes) setPoetProfile(profileRes);
      if (catRes) setCategories(catRes);
      if (poemsRes) setPoems(poemsRes);
    } catch (err) {
      console.error("Ma'lumotlarni yuklashda xatolik:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter poems according to active filters
  const filteredPoems = useMemo(() => {
    return poems.filter((poem) => {
      // Filter by type
      if (activeTab === 'poem' && poem.post_type !== 'poem') return false;
      if (activeTab === 'thought' && poem.post_type !== 'thought') return false;

      // Filter by category
      if (selectedCategory) {
        const catObj = categories.find(c => c.slug === selectedCategory);
        if (catObj && poem.category !== catObj.id) return false;
      }

      // Filter by search query
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchesTitle = poem.title?.toLowerCase().includes(q);
        const matchesContent = poem.content?.toLowerCase().includes(q);
        const matchesExcerpt = poem.excerpt?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesContent && !matchesExcerpt) return false;
      }

      return true;
    });
  }, [poems, activeTab, selectedCategory, searchTerm, categories]);

  // Featured poems
  const featuredPoems = useMemo(() => {
    return poems.filter(p => p.is_featured);
  }, [poems]);

  const handleSelectPoem = (poem) => {
    setSelectedPoemSlug(poem.slug);
  };

  const handlePoemUpdated = (slug, updates) => {
    setPoems((prev) => prev.map(p => p.slug === slug ? { ...p, ...updates } : p));
  };

  const scrollToContact = () => {
    const el = document.getElementById('contact-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Navigation */}
      <Navbar 
        theme={theme}
        setTheme={setTheme}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openAdminModal={() => setIsAdminModalOpen(true)}
        isPoetLoggedIn={isPoetLoggedIn}
        openContact={scrollToContact}
      />

      {/* Hero Section */}
      <div id="hero">
        <Hero 
          poetProfile={poetProfile}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
      </div>

      {/* Main Content Feed */}
      <main className="container" id="poems-feed" style={{ flex: 1, padding: '40px 24px' }}>
        
        {/* Section Title & View Filter Tabs */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '32px'
        }}>
          <div>
            <h2 style={{ fontSize: '1.85rem', lineHeight: 1.2 }}>
              {activeTab === 'thought' ? "Mushohadalar va G'oyalar" : activeTab === 'poem' ? "She'rlar Majmuasi" : "Ijodiy Asarlar"}
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Jami {filteredPoems.length} ta ijod namunasi ko'rsatilmoqda
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button 
              className={`btn ${activeTab === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('all')}
              style={{ fontSize: '0.84rem', padding: '8px 16px' }}
            >
              Hammasi ({poems.length})
            </button>
            <button 
              className={`btn ${activeTab === 'poem' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('poem')}
              style={{ fontSize: '0.84rem', padding: '8px 16px' }}
            >
              She'rlar ({poems.filter(p => p.post_type === 'poem').length})
            </button>
            <button 
              className={`btn ${activeTab === 'thought' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('thought')}
              style={{ fontSize: '0.84rem', padding: '8px 16px' }}
            >
              G'oyalar ({poems.filter(p => p.post_type === 'thought').length})
            </button>
          </div>
        </div>

        {/* Loading state */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem' }}>
              <Feather size={20} className="animate-spin" /> Ijod namunalari yuklanmoqda...
            </div>
          </div>
        ) : filteredPoems.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '60px 24px', background: 'var(--bg-secondary)' }}>
            <Feather size={36} color="var(--accent-gold)" style={{ margin: '0 auto 16px auto', display: 'block' }} />
            <h3 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>Hech qanday she'r topilmadi</h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto 20px auto', fontSize: '0.92rem' }}>
              Qidiruv so'zini yoki tanlangan kategoriyani o'zgartirib ko'ring.
            </p>
            <button 
              className="btn btn-secondary"
              onClick={() => { setSearchTerm(''); setSelectedCategory(null); setActiveTab('all'); }}
            >
              Filtrlarni tozalash
            </button>
          </div>
        ) : (
          /* Cards Grid */
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
            gap: '24px' 
          }}>
            {filteredPoems.map((poem) => (
              <PoemCard 
                key={poem.id} 
                poem={poem}
                onSelectPoem={handleSelectPoem}
                onLikeSuccess={(slug, newLikes) => handlePoemUpdated(slug, { likes_count: newLikes })}
              />
            ))}
          </div>
        )}

      </main>

      {/* Shoir bilan bog'lanish (Telegram Bot integration) */}
      <ContactSection />

      {/* Footer */}
      <Footer 
        poetProfile={poetProfile}
        openAdminModal={() => setIsAdminModalOpen(true)}
        openContact={scrollToContact}
      />

      {/* Poem Detail Modal (Reader view, Likes, Comments, Audio player) */}
      {selectedPoemSlug && (
        <PoemDetailModal 
          poemSlug={selectedPoemSlug}
          onClose={() => setSelectedPoemSlug(null)}
          onPoemUpdated={handlePoemUpdated}
        />
      )}

      {/* Shoir Admin Panel Modal (Standalone Minimalistic Dashboard) */}
      <PoetAdminDashboard 
        isOpen={isAdminModalOpen}
        onClose={() => {
          setIsAdminModalOpen(false);
          setIsPoetLoggedIn(!!localStorage.getItem('sheriyat_poet_token'));
        }}
        onDataChanged={fetchData}
      />

    </div>
  );
}
