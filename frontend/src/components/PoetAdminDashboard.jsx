import React, { useState, useEffect } from 'react';
import { 
  X, LayoutDashboard, BookOpen, MessageSquare, Send, Settings, 
  Plus, Trash2, Edit3, Check, Eye, Heart, ShieldCheck, LogOut, 
  RotateCw, AlertCircle, Sparkles, Feather, Calendar, Phone, CheckCircle2, Clock
} from 'lucide-react';
import { api } from '../api';

export default function PoetAdminDashboard({ isOpen, onClose, onDataChanged }) {
  const [token, setToken] = useState(() => localStorage.getItem('sheriyat_poet_token') || '');
  const [activeTab, setActiveTab] = useState('overview'); // overview, poems, comments, messages, profile
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  // Login form state
  const [loginUsername, setLoginUsername] = useState('shoir');
  const [loginPassword, setLoginPassword] = useState('shoir123');

  // Dashboard Data
  const [dashboardData, setDashboardData] = useState(null);
  const [adminPoems, setAdminPoems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [adminComments, setAdminComments] = useState([]);
  const [adminMessages, setAdminMessages] = useState([]);
  const [profileData, setProfileData] = useState({
    pen_name: '',
    bio: '',
    quote: '',
    telegram_channel: '',
    instagram: ''
  });

  // Poem Edit/Create Modal
  const [editingPoem, setEditingPoem] = useState(null);
  const [isPoemModalOpen, setIsPoemModalOpen] = useState(false);
  const [poemForm, setPoemForm] = useState({
    title: '',
    post_type: 'poem',
    category: '',
    content: '',
    written_date: '',
    is_published: true,
    is_featured: false
  });

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  // Load dashboard data when token is available
  const loadDashboard = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [dash, pms, cats, comms, msgs, prof] = await Promise.all([
        api.getDashboardStats(token).catch(() => null),
        api.getAdminPoems(token).catch(() => []),
        api.getCategories().catch(() => []),
        api.getAdminComments(token).catch(() => []),
        api.getAdminMessages(token).catch(() => []),
        api.getPoetProfile().catch(() => null)
      ]);

      if (dash) setDashboardData(dash);
      if (pms) setAdminPoems(pms);
      if (cats) setCategories(cats);
      if (comms) setAdminComments(comms);
      if (msgs) setAdminMessages(msgs);
      if (prof) setProfileData(prof);
    } catch (err) {
      console.error("Dashboard yuklashda xatolik:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && token) {
      loadDashboard();
    }
  }, [isOpen, token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await api.login(loginUsername, loginPassword);
      setToken(res.token);
      localStorage.setItem('sheriyat_poet_token', res.token);
      showToast(res.message || "Muvaffaqiyatli kirdingiz!");
    } catch (err) {
      setErrorMsg(err.message || "Login yoki parol xato kiritildi.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('sheriyat_poet_token');
    showToast("Tizimdan chiqildi.");
  };

  // Poem Actions
  const handleOpenPoemModal = (poemToEdit = null) => {
    if (poemToEdit) {
      setEditingPoem(poemToEdit);
      setPoemForm({
        title: poemToEdit.title,
        post_type: poemToEdit.post_type || 'poem',
        category: poemToEdit.category || '',
        content: poemToEdit.content || '',
        written_date: poemToEdit.written_date || '',
        is_published: poemToEdit.is_published,
        is_featured: poemToEdit.is_featured
      });
    } else {
      setEditingPoem(null);
      setPoemForm({
        title: '',
        post_type: 'poem',
        category: categories[0]?.id || '',
        content: '',
        written_date: new Date().getFullYear() + "-yil",
        is_published: true,
        is_featured: false
      });
    }
    setIsPoemModalOpen(true);
  };

  const handleSavePoem = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...poemForm,
        category: poemForm.category ? parseInt(poemForm.category) : null
      };

      if (editingPoem) {
        await api.updatePoem(token, editingPoem.id, payload);
        showToast("She'r yangilandi!");
      } else {
        await api.createPoem(token, payload);
        showToast("Yangi she'r kiritildi!");
      }
      setIsPoemModalOpen(false);
      loadDashboard();
      if (onDataChanged) onDataChanged();
    } catch (err) {
      console.error("She'rni saqlash xatosi:", err);
      showToast("Xatolik yuz berdi.");
    }
  };

  const handleDeletePoem = async (id, title) => {
    if (!window.confirm(`«${title}» asarini rostdan ham o'chirmoqchimisiz?`)) return;
    try {
      await api.deletePoem(token, id);
      showToast("Asar o'chirildi.");
      loadDashboard();
      if (onDataChanged) onDataChanged();
    } catch (err) {
      console.error("O'chirish xatosi:", err);
    }
  };

  // Comment Actions
  const handleToggleComment = async (id, currentStatus) => {
    try {
      await api.toggleCommentApproval(token, id, !currentStatus);
      setAdminComments(adminComments.map(c => c.id === id ? { ...c, is_approved: !currentStatus } : c));
      showToast("Izoh holati o'zgartirildi.");
      if (onDataChanged) onDataChanged();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteComment = async (id) => {
    if (!window.confirm("Ushbu izohni o'chirmoqchimisiz?")) return;
    try {
      await api.deleteComment(token, id);
      setAdminComments(adminComments.filter(c => c.id !== id));
      showToast("Izoh o'chirildi.");
      if (onDataChanged) onDataChanged();
    } catch (err) {
      console.error(err);
    }
  };

  // Message Actions
  const handleToggleMessageRead = async (id, currentStatus) => {
    try {
      await api.markMessageRead(token, id, !currentStatus);
      setAdminMessages(adminMessages.map(m => m.id === id ? { ...m, is_read: !currentStatus } : m));
    } catch (err) {
      console.error(err);
    }
  };

  const handleResendTelegram = async (id) => {
    try {
      const res = await api.resendTelegramMessage(token, id);
      showToast(res.success ? "Telegramga yuborildi!" : `Xato: ${res.message}`);
      loadDashboard();
    } catch (err) {
      console.error(err);
      showToast("Telegramga yuborishda xatolik.");
    }
  };

  const handleDeleteMessage = async (id) => {
    if (!window.confirm("Xabarni o'chirmoqchimisiz?")) return;
    try {
      await api.deleteMessage(token, id);
      setAdminMessages(adminMessages.filter(m => m.id !== id));
      showToast("Xabar o'chirildi.");
    } catch (err) {
      console.error(err);
    }
  };

  // Profile Save
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      await api.updatePoetProfile(token, profileData);
      showToast("Shoir ma'lumotlari yangilandi!");
      if (onDataChanged) onDataChanged();
    } catch (err) {
      console.error(err);
      showToast("Profilni saqlashda xatolik.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ 
          maxWidth: '960px', 
          width: '100%',
          minHeight: '620px', 
          padding: '0', 
          display: 'flex', 
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* Toast inside Dashboard */}
        {toastMsg && (
          <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            left: '20px',
            maxWidth: '380px',
            margin: '0 auto',
            background: 'var(--text-primary)',
            color: 'var(--bg-primary)',
            padding: '12px 20px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.88rem',
            textAlign: 'center',
            zIndex: 250,
            boxShadow: 'var(--shadow-lg)'
          }}>
            {toastMsg}
          </div>
        )}

        {/* Dashboard Top Header (Mobile & Desktop) */}
        <div style={{ 
          padding: '14px 20px', 
          borderBottom: '1px solid var(--border-color)',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          background: 'var(--bg-secondary)',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ 
              width: '36px', 
              height: '36px', 
              borderRadius: '10px', 
              background: 'var(--accent-gold-light)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: 'var(--accent-gold)',
              flexShrink: 0
            }}>
              <ShieldCheck size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', lineHeight: 1.2, margin: 0 }}>Shoir Kabineti</h2>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                {token ? (profileData.pen_name || "Boshqaruv paneli") : "Tizimga kirish"}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {token && (
              <button 
                className="btn btn-ghost" 
                onClick={handleLogout}
                style={{ fontSize: '0.8rem', padding: '6px 10px', color: 'var(--accent-rose)' }}
                title="Tizimdan chiqish"
              >
                <LogOut size={16} /> <span className="desktop-nav-links">Chiqish</span>
              </button>
            )}
            <button 
              className="btn btn-ghost btn-icon" 
              onClick={onClose}
              aria-label="Yopish"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Not Logged In: Sleek Minimalist Login Screen */}
        {!token ? (
          <div style={{ padding: '40px 20px', maxWidth: '400px', margin: 'auto', width: '100%' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <span className="badge badge-gold" style={{ marginBottom: '10px' }}>
                <Feather size={13} /> Shoir Kirish
              </span>
              <h3 style={{ fontSize: '1.6rem', marginBottom: '8px' }}>Xush kelibsiz</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                Ijodingizni boshqarish uchun hisobingizga kiring.
              </p>
            </div>

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '6px' }}>
                  Login
                </label>
                <input 
                  type="text" 
                  className="input" 
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  placeholder="shoir"
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '6px' }}>
                  Parol
                </label>
                <input 
                  type="password" 
                  className="input" 
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="shoir123"
                  required
                />
              </div>

              {errorMsg && (
                <div style={{ 
                  padding: '10px 14px', 
                  borderRadius: 'var(--radius-sm)', 
                  background: 'rgba(230, 82, 101, 0.1)', 
                  border: '1px solid var(--accent-rose)',
                  color: 'var(--accent-rose)',
                  fontSize: '0.84rem'
                }}>
                  {errorMsg}
                </div>
              )}

              {/* Quick Demo Hint */}
              <div style={{ 
                padding: '10px 14px', 
                background: 'var(--bg-secondary)', 
                borderRadius: 'var(--radius-sm)', 
                fontSize: '0.78rem', 
                color: 'var(--text-muted)',
                border: '1px solid var(--border-subtle)'
              }}>
                🔑 <strong>Standart kalit:</strong> Login: <code>shoir</code> | Parol: <code>shoir123</code>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
                style={{ padding: '12px', marginTop: '6px' }}
              >
                {loading ? "Tekshirilmoqda..." : "Kabinetga kirish"}
              </button>
            </form>
          </div>
        ) : (
          /* Logged In Dashboard with Mobile Touch Friendly Tabs */
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}>
            
            {/* Top Responsive Swipeable Horizontal Tabs */}
            <div className="category-scroll-container" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              padding: '10px 16px',
              borderBottom: '1px solid var(--border-color)',
              background: 'var(--bg-secondary)',
              gap: '6px',
              flexShrink: 0,
              overflowX: 'auto',
              whiteSpace: 'nowrap'
            }}>
              <button 
                className={`btn ${activeTab === 'overview' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setActiveTab('overview')}
                style={{ fontSize: '0.82rem', padding: '6px 14px', flexShrink: 0 }}
              >
                <LayoutDashboard size={15} /> Asosiy
              </button>

              <button 
                className={`btn ${activeTab === 'poems' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setActiveTab('poems')}
                style={{ fontSize: '0.82rem', padding: '6px 14px', flexShrink: 0 }}
              >
                <BookOpen size={15} /> Asarlar ({adminPoems.length})
              </button>

              <button 
                className={`btn ${activeTab === 'comments' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setActiveTab('comments')}
                style={{ fontSize: '0.82rem', padding: '6px 14px', flexShrink: 0 }}
              >
                <MessageSquare size={15} /> Izohlar ({adminComments.length})
              </button>

              <button 
                className={`btn ${activeTab === 'messages' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setActiveTab('messages')}
                style={{ fontSize: '0.82rem', padding: '6px 14px', flexShrink: 0 }}
              >
                <Send size={15} /> Xabarlar ({adminMessages.length})
              </button>

              <button 
                className={`btn ${activeTab === 'profile' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setActiveTab('profile')}
                style={{ fontSize: '0.82rem', padding: '6px 14px', flexShrink: 0 }}
              >
                <Settings size={15} /> Profil
              </button>
            </div>

            {/* Main Content Area */}
            <main style={{ flex: 1, padding: '18px 16px', overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
              
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Ko'rsatkichlar</h3>
                    <button className="btn btn-secondary" onClick={loadDashboard} style={{ fontSize: '0.78rem', padding: '4px 10px', height: 'auto' }}>
                      <RotateCw size={13} /> Yangilash
                    </button>
                  </div>

                  {/* 4 Stat Cards in 2x2 grid on mobile */}
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', 
                    gap: '12px', 
                    marginBottom: '20px' 
                  }}>
                    <div className="card" style={{ padding: '14px', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>She'rlar</span>
                      <p style={{ fontSize: '1.6rem', fontWeight: 700, marginTop: '2px', color: 'var(--text-primary)' }}>
                        {dashboardData?.stats?.total_poems || 0}
                      </p>
                    </div>
                    <div className="card" style={{ padding: '14px', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>G'oyalar</span>
                      <p style={{ fontSize: '1.6rem', fontWeight: 700, marginTop: '2px', color: 'var(--text-primary)' }}>
                        {dashboardData?.stats?.total_thoughts || 0}
                      </p>
                    </div>
                    <div className="card" style={{ padding: '14px', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>O'qilishlar</span>
                      <p style={{ fontSize: '1.6rem', fontWeight: 700, marginTop: '2px', color: 'var(--accent-gold)' }}>
                        {dashboardData?.stats?.total_views || 0}
                      </p>
                    </div>
                    <div className="card" style={{ padding: '14px', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Likelar</span>
                      <p style={{ fontSize: '1.6rem', fontWeight: 700, marginTop: '2px', color: 'var(--accent-rose)' }}>
                        {dashboardData?.stats?.total_likes || 0}
                      </p>
                    </div>
                  </div>

                  {/* Quick Action Button for Mobile */}
                  <button 
                    className="btn btn-primary" 
                    onClick={() => handleOpenPoemModal()} 
                    style={{ width: '100%', marginBottom: '20px', padding: '12px', fontSize: '0.92rem' }}
                  >
                    <Plus size={18} /> Yangi she'r yoki g'oya kiritish
                  </button>

                  {/* Recent Messages Widget */}
                  <div className="card" style={{ padding: '16px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <h4 style={{ fontSize: '1rem', margin: 0 }}>Kelgan so'nggi xabarlar</h4>
                      <button className="btn btn-ghost" onClick={() => setActiveTab('messages')} style={{ fontSize: '0.78rem', padding: '2px 6px' }}>
                        Barchasi →
                      </button>
                    </div>
                    {adminMessages.slice(0, 3).map((m) => (
                      <div key={m.id} style={{ padding: '8px 0', borderBottom: '1px solid var(--border-subtle)', fontSize: '0.85rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <strong>{m.name}</strong>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{m.contact}</span>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>
                          {m.message?.substring(0, 60)}...
                        </p>
                      </div>
                    ))}
                    {adminMessages.length === 0 && (
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>Hali xabar kelmagan.</p>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: POEMS & THOUGHTS */}
              {activeTab === 'poems' && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Asarlar ro'yxati</h3>
                    <button className="btn btn-primary" onClick={() => handleOpenPoemModal()} style={{ fontSize: '0.82rem', padding: '6px 14px' }}>
                      <Plus size={16} /> Yangi
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {adminPoems.map((p) => (
                      <div 
                        key={p.id} 
                        style={{ 
                          padding: '14px',
                          background: 'var(--bg-card)',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border-color)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '10px'
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', flexWrap: 'wrap' }}>
                            <strong style={{ fontSize: '1.05rem', color: 'var(--text-primary)' }}>{p.title}</strong>
                            <span className="badge" style={{ fontSize: '0.7rem' }}>
                              {p.post_type === 'thought' ? "G'oya" : "She'r"}
                            </span>
                            <span style={{ fontSize: '0.74rem', color: p.is_published ? '#10b981' : 'var(--text-muted)' }}>
                              ● {p.is_published ? "Nashr" : "Qoralama"}
                            </span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            <span>{p.category_name || "Janrsiz"}</span>
                            <span>Ko'rildi: {p.views_count}</span>
                            <span>Like: {p.likes_count}</span>
                          </div>
                        </div>

                        {/* Action buttons touch friendly */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
                          <button 
                            className="btn btn-secondary"
                            onClick={() => handleOpenPoemModal(p)}
                            style={{ flex: 1, padding: '8px', fontSize: '0.82rem' }}
                          >
                            <Edit3 size={14} /> Tahrirlash
                          </button>
                          <button 
                            className="btn btn-ghost"
                            onClick={() => handleDeletePoem(p.id, p.title)}
                            style={{ padding: '8px 12px', fontSize: '0.82rem', color: 'var(--accent-rose)' }}
                            title="O'chirish"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: COMMENTS */}
              {activeTab === 'comments' && (
                <div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Kitobxonlar Izohlari</h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {adminComments.map((comm) => (
                      <div 
                        key={comm.id} 
                        style={{ 
                          padding: '14px', 
                          background: 'var(--bg-card)', 
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border-color)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <strong>{comm.author_name}</strong>
                          <span style={{ 
                            fontSize: '0.72rem', 
                            padding: '2px 8px', 
                            borderRadius: 'var(--radius-full)', 
                            background: comm.is_approved ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                            color: comm.is_approved ? '#10b981' : '#f59e0b'
                          }}>
                            {comm.is_approved ? 'Ko\'rinadi' : 'Yashirilgan'}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                          {comm.text}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderTop: '1px solid var(--border-subtle)', paddingTop: '8px' }}>
                          <button 
                            className={`btn ${comm.is_approved ? 'btn-secondary' : 'btn-primary'}`}
                            onClick={() => handleToggleComment(comm.id, comm.is_approved)}
                            style={{ flex: 1, padding: '6px', fontSize: '0.8rem' }}
                          >
                            {comm.is_approved ? "Yashirish" : "Tasdiqlash"}
                          </button>
                          <button 
                            className="btn btn-ghost"
                            onClick={() => handleDeleteComment(comm.id)}
                            style={{ padding: '6px 12px', color: 'var(--accent-rose)' }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                    {adminComments.length === 0 && (
                      <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '24px 0', fontSize: '0.88rem' }}>
                        Hali birorta izoh qoldirilmagan.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: MESSAGES (TELEGRAM INBOX) */}
              {activeTab === 'messages' && (
                <div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '6px' }}>Kelgan xabarlar</h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                    Sayt orqali yuborilgan barcha xabarlar:
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {adminMessages.map((msg) => (
                      <div 
                        key={msg.id}
                        style={{
                          padding: '16px',
                          background: 'var(--bg-card)',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border-color)',
                          borderLeft: msg.is_read ? '1px solid var(--border-color)' : '4px solid var(--accent-gold)'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
                          <strong style={{ fontSize: '1rem' }}>{msg.name}</strong>
                          
                          {/* Direct Mobile Call / Telegram Link */}
                          <a 
                            href={`tel:${msg.contact}`} 
                            style={{ 
                              display: 'inline-flex', 
                              alignItems: 'center', 
                              gap: '4px', 
                              fontSize: '0.84rem', 
                              color: 'var(--accent-blue)', 
                              background: 'var(--bg-secondary)', 
                              padding: '4px 10px', 
                              borderRadius: '4px',
                              textDecoration: 'none'
                            }}
                          >
                            <Phone size={13} /> {msg.contact}
                          </a>
                        </div>

                        {msg.subject && (
                          <p style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                            Mavzu: {msg.subject}
                          </p>
                        )}

                        <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                          {msg.message}
                        </p>

                        {/* Telegram Status & Resend */}
                        <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
                          <span style={{ 
                            fontSize: '0.74rem', 
                            padding: '2px 8px', 
                            borderRadius: 'var(--radius-full)',
                            background: msg.sent_to_telegram ? 'rgba(16, 185, 129, 0.15)' : 'rgba(230, 82, 101, 0.15)',
                            color: msg.sent_to_telegram ? '#10b981' : 'var(--accent-rose)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            {msg.sent_to_telegram ? "✈️ Telegramga yetkazilgan" : "⚠️ Bormagan"}
                          </span>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {!msg.sent_to_telegram && (
                              <button 
                                className="btn btn-secondary" 
                                onClick={() => handleResendTelegram(msg.id)}
                                style={{ padding: '4px 10px', fontSize: '0.76rem', height: 'auto' }}
                              >
                                Qayta yuborish
                              </button>
                            )}
                            <button 
                              className="btn btn-ghost" 
                              onClick={() => handleToggleMessageRead(msg.id, msg.is_read)}
                              style={{ padding: '4px 8px', fontSize: '0.76rem', height: 'auto' }}
                            >
                              {msg.is_read ? "O'qilmagan" : "O'qildi"}
                            </button>
                            <button 
                              className="btn btn-ghost" 
                              onClick={() => handleDeleteMessage(msg.id)}
                              style={{ padding: '4px 8px', color: 'var(--accent-rose)' }}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {adminMessages.length === 0 && (
                      <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '24px 0', fontSize: '0.88rem' }}>
                        Hozircha birorta ham xabar kelmagan.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 5: PROFILE */}
              {activeTab === 'profile' && (
                <div style={{ maxWidth: '600px' }}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Shoir Profili Sozlamalari</h3>
                  
                  <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '6px' }}>
                        Taxallus / Ism
                      </label>
                      <input 
                        type="text" 
                        className="input"
                        value={profileData.pen_name || ''}
                        onChange={(e) => setProfileData({ ...profileData, pen_name: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '6px' }}>
                        Bosh ijodiy shior / Iqtibos
                      </label>
                      <input 
                        type="text" 
                        className="input"
                        value={profileData.quote || ''}
                        onChange={(e) => setProfileData({ ...profileData, quote: e.target.value })}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '6px' }}>
                        Shoir haqida bio
                      </label>
                      <textarea 
                        className="textarea"
                        rows="3"
                        value={profileData.bio || ''}
                        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '6px' }}>
                        Telegram kanal / profil
                      </label>
                      <input 
                        type="text" 
                        className="input"
                        placeholder="@kanal_nomi"
                        value={profileData.telegram_channel || ''}
                        onChange={(e) => setProfileData({ ...profileData, telegram_channel: e.target.value })}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '6px' }}>
                        Instagram profil
                      </label>
                      <input 
                        type="text" 
                        className="input"
                        placeholder="@profil_nomi"
                        value={profileData.instagram || ''}
                        onChange={(e) => setProfileData({ ...profileData, instagram: e.target.value })}
                      />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ padding: '12px', marginTop: '6px' }}>
                      Sozlamalarni saqlash
                    </button>
                  </form>
                </div>
              )}

            </main>
          </div>
        )}

        {/* POEM CREATE / EDIT FULLSCREEN MODAL (Optimized for Mobile Phone typing) */}
        {isPoemModalOpen && (
          <div className="modal-overlay" style={{ zIndex: 120 }}>
            <div className="modal-content" style={{ 
              maxWidth: '680px', 
              padding: '24px 20px', 
              display: 'flex', 
              flexDirection: 'column',
              height: '100dvh'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.25rem', margin: 0 }}>
                  {editingPoem ? "Asarni tahrirlash" : "Yangi asar kiritish"}
                </h3>
                <button className="btn btn-ghost btn-icon" onClick={() => setIsPoemModalOpen(false)}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSavePoem} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto' }}>
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '4px' }}>
                    Sarlavha <span style={{ color: 'var(--accent-rose)' }}>*</span>
                  </label>
                  <input 
                    type="text" 
                    className="input"
                    value={poemForm.title}
                    onChange={(e) => setPoemForm({ ...poemForm, title: e.target.value })}
                    placeholder="She'r sarlavhasi..."
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', marginBottom: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '4px' }}>
                      Turi
                    </label>
                    <select 
                      className="select"
                      value={poemForm.post_type}
                      onChange={(e) => setPoemForm({ ...poemForm, post_type: e.target.value })}
                    >
                      <option value="poem">She'r</option>
                      <option value="thought">G'oya / Mushohada</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '4px' }}>
                      Janr
                    </label>
                    <select 
                      className="select"
                      value={poemForm.category}
                      onChange={(e) => setPoemForm({ ...poemForm, category: e.target.value })}
                    >
                      <option value="">Janrsiz</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '4px' }}>
                      Yozilgan vaqti
                    </label>
                    <input 
                      type="text" 
                      className="input"
                      placeholder="2026-yil"
                      value={poemForm.written_date}
                      onChange={(e) => setPoemForm({ ...poemForm, written_date: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '14px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '4px' }}>
                    She'r satrlari <span style={{ color: 'var(--accent-rose)' }}>*</span>
                  </label>
                  <textarea 
                    className="textarea"
                    rows="10"
                    placeholder="She'r satrlarini yoki fikrlaringizni shu yerga yozing..."
                    value={poemForm.content}
                    onChange={(e) => setPoemForm({ ...poemForm, content: e.target.value })}
                    required
                    style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', lineHeight: 1.8, flex: 1, minHeight: '180px' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.88rem' }}>
                    <input 
                      type="checkbox"
                      checked={poemForm.is_published}
                      onChange={(e) => setPoemForm({ ...poemForm, is_published: e.target.checked })}
                    />
                    <span>Saytda ko'rinsin (Nashr qilish)</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.88rem' }}>
                    <input 
                      type="checkbox"
                      checked={poemForm.is_featured}
                      onChange={(e) => setPoemForm({ ...poemForm, is_featured: e.target.checked })}
                    />
                    <span>Sara asar sifatida belgilash</span>
                  </label>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setIsPoemModalOpen(false)} style={{ flex: 1 }}>
                    Bekor qilish
                  </button>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                    Saqlash
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
