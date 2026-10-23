import React, { useState, useEffect } from 'react';
import { 
  X, Heart, Share2, MessageSquare, Send, Calendar, 
  Volume2, AlignCenter, AlignLeft, Check, Copy, Sparkles, Feather
} from 'lucide-react';
import { api, BASE_URL } from '../api';

export default function PoemDetailModal({ poemSlug, onClose, onPoemUpdated }) {
  const [poem, setPoem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fontSize, setFontSize] = useState(1.25); // rem
  const [textAlign, setTextAlign] = useState('center');
  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  
  // Comments state
  const [comments, setComments] = useState([]);
  const [authorName, setAuthorName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentMessage, setCommentMessage] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!poemSlug) return;
    setLoading(true);
    api.getPoemDetail(poemSlug)
      .then((data) => {
        setPoem(data);
        setLikesCount(data.likes_count || 0);
        setComments(data.comments || []);
      })
      .catch((err) => console.error("She'rni yuklashda xatolik:", err))
      .finally(() => setLoading(false));
  }, [poemSlug]);

  const handleLike = async () => {
    if (isLiking || !poem) return;
    setIsLiking(true);
    try {
      const res = await api.toggleLike(poem.slug);
      setLikesCount(res.likes_count);
      setIsLiked(res.liked);
      if (onPoemUpdated) onPoemUpdated(poem.slug, { likes_count: res.likes_count });
    } catch (err) {
      console.error("Like xatosi:", err);
    } finally {
      setIsLiking(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!authorName.trim() || !commentText.trim()) return;

    setSubmittingComment(true);
    setCommentMessage('');
    try {
      const newComment = await api.addComment(poem.slug, {
        author_name: authorName,
        text: commentText
      });
      setComments([newComment, ...comments]);
      setCommentText('');
      setCommentMessage("Izohingiz qo'shildi, tashakkur!");
      setTimeout(() => setCommentMessage(''), 4000);
      if (onPoemUpdated) onPoemUpdated(poem.slug, { comments_count: comments.length + 1 });
    } catch (err) {
      console.error("Izoh xatosi:", err);
      setCommentMessage("Izohni saqlashda xatolik yuz berdi.");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareTelegram = () => {
    const text = encodeURIComponent(`🕊 «${poem?.title}» — Shoir ijodidan go'zal satrlar:\n\n${poem?.excerpt || ''}\n\n`);
    const url = encodeURIComponent(window.location.href);
    window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank');
  };

  if (!poemSlug) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ padding: '36px' }}
      >
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-gold">
              {poem?.post_type === 'thought' ? <Sparkles size={13} /> : <Feather size={13} />}
              {poem?.category?.name || (poem?.post_type === 'thought' ? "Mushohada" : "She'r")}
            </span>
            {poem?.written_date && (
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={13} /> {poem.written_date}
              </span>
            )}
          </div>

          <button 
            className="btn btn-ghost btn-icon"
            onClick={onClose}
            aria-label="Yopish"
          >
            <X size={20} />
          </button>
        </div>

        {loading ? (
          <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
            She'r yuklanmoqda...
          </div>
        ) : poem ? (
          <>
            {/* Title */}
            <div style={{ textAlign: textAlign, marginBottom: '28px' }}>
              <h2 style={{ 
                fontSize: 'clamp(1.8rem, 3.2vw, 2.4rem)', 
                lineHeight: 1.25, 
                marginBottom: '10px',
                color: 'var(--text-primary)'
              }}>
                {poem.title}
              </h2>
              <div style={{ 
                width: '60px', 
                height: '2px', 
                background: 'var(--accent-gold)', 
                margin: textAlign === 'center' ? '0 auto' : '0' 
              }}></div>
            </div>

            {/* Audio Recitation (if available) */}
            {poem.audio && (
              <div style={{ 
                background: 'var(--bg-secondary)', 
                padding: '16px 20px', 
                borderRadius: 'var(--radius-md)', 
                marginBottom: '28px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                border: '1px solid var(--border-color)'
              }}>
                <div style={{ 
                  width: '38px', 
                  height: '38px', 
                  borderRadius: '50%', 
                  background: 'var(--accent-gold-light)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: 'var(--accent-gold)'
                }}>
                  <Volume2 size={20} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>
                    Shoir ovozida ifodali o'qish:
                  </p>
                  <audio 
                    controls 
                    src={poem.audio.startsWith('http') ? poem.audio : `${BASE_URL}${poem.audio}`} 
                    style={{ width: '100%', height: '36px' }}
                  />
                </div>
              </div>
            )}

            {/* Reading Controls Toolbar */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              padding: '10px 16px',
              background: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '28px',
              fontSize: '0.85rem',
              color: 'var(--text-secondary)'
            }}>
              {/* Font Size Adjusters */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Shrift:</span>
                <button 
                  className="btn btn-ghost"
                  onClick={() => setFontSize(Math.max(1.05, fontSize - 0.1))}
                  style={{ padding: '4px 10px', fontSize: '0.8rem', height: 'auto' }}
                  title="Shriftni kichiklashtirish"
                >
                  A-
                </button>
                <button 
                  className="btn btn-ghost"
                  onClick={() => setFontSize(Math.min(1.6, fontSize + 0.1))}
                  style={{ padding: '4px 10px', fontSize: '0.95rem', height: 'auto' }}
                  title="Shriftni kattalashtirish"
                >
                  A+
                </button>
              </div>

              {/* Text Alignment */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button 
                  className={`btn ${textAlign === 'center' ? 'btn-secondary' : 'btn-ghost'}`}
                  onClick={() => setTextAlign('center')}
                  style={{ padding: '4px 8px', height: 'auto' }}
                  title="O'rtaga joylash"
                >
                  <AlignCenter size={16} />
                </button>
                <button 
                  className={`btn ${textAlign === 'left' ? 'btn-secondary' : 'btn-ghost'}`}
                  onClick={() => setTextAlign('left')}
                  style={{ padding: '4px 8px', height: 'auto' }}
                  title="Chapga joylash"
                >
                  <AlignLeft size={16} />
                </button>
              </div>
            </div>

            {/* Poem / Verse Body */}
            <div style={{ 
              textAlign: textAlign, 
              marginBottom: '40px',
              padding: '0 10px'
            }}>
              <div 
                className="poem-stanza"
                style={{ fontSize: `${fontSize}rem` }}
              >
                {poem.content}
              </div>
            </div>

            {/* Action Bar: Like & Share */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              padding: '16px 0',
              borderTop: '1px solid var(--border-color)',
              borderBottom: '1px solid var(--border-color)',
              marginBottom: '32px'
            }}>
              {/* Like Button */}
              <button 
                className={`btn ${isLiked ? 'btn-primary' : 'btn-secondary'}`}
                onClick={handleLike}
                style={{ padding: '10px 24px', fontSize: '0.95rem' }}
              >
                <Heart 
                  size={18} 
                  fill={isLiked ? 'currentColor' : 'none'} 
                />
                <span>{isLiked ? "Mehr bildirildi" : "Mehr bildirish"} ({likesCount})</span>
              </button>

              {/* Social Share Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button 
                  className="btn btn-secondary"
                  onClick={handleShareTelegram}
                  style={{ padding: '8px 14px', fontSize: '0.85rem' }}
                  title="Telegramda ulashish"
                >
                  <Share2 size={15} /> Telegram
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={handleCopyLink}
                  style={{ padding: '8px 14px', fontSize: '0.85rem' }}
                  title="Havolani nusxalash"
                >
                  {copied ? <Check size={15} color="#10b981" /> : <Copy size={15} />}
                  {copied ? "Nusxalandi!" : "Nusxa"}
                </button>
              </div>
            </div>

            {/* Comments Section */}
            <section style={{ marginTop: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                <MessageSquare size={19} color="var(--accent-gold)" />
                <h3 style={{ fontSize: '1.25rem' }}>
                  Kitobxonlar izohlari ({comments.length})
                </h3>
              </div>

              {/* Add Comment Form */}
              <form 
                onSubmit={handleCommentSubmit} 
                style={{ 
                  background: 'var(--bg-secondary)', 
                  padding: '20px', 
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '24px',
                  border: '1px solid var(--border-color)'
                }}
              >
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                  Ushbu satrlar haqidagi samimiy fikr yoki taassurotingizni qoldiring:
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px', marginBottom: '12px' }}>
                  <input 
                    type="text" 
                    className="input" 
                    placeholder="Ismingiz..." 
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    required
                  />
                  <textarea 
                    className="textarea" 
                    rows="3" 
                    placeholder="Izohingiz matni..." 
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.85rem', color: '#10b981' }}>
                    {commentMessage}
                  </span>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={submittingComment}
                    style={{ padding: '8px 20px' }}
                  >
                    <Send size={15} /> {submittingComment ? "Yuborilmoqda..." : "Izoh qoldirish"}
                  </button>
                </div>
              </form>

              {/* Comments List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {comments.length === 0 ? (
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textAlign: 'center', padding: '20px 0' }}>
                    Hali izoh qoldirilmagan. Birinchi bo'lib fikringizni bildiring!
                  </p>
                ) : (
                  comments.map((comm) => (
                    <div 
                      key={comm.id} 
                      style={{ 
                        padding: '14px 18px', 
                        background: 'var(--bg-secondary)', 
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-subtle)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                          {comm.author_name}
                        </span>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          {comm.created_at_formatted || 'Yaqinda'}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                        {comm.text}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </section>
          </>
        ) : (
          <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
            She'r topilmadi.
          </div>
        )}
      </div>
    </div>
  );
}
