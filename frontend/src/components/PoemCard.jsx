import React, { useState } from 'react';
import { Heart, MessageSquare, Eye, Calendar, Sparkles, Feather, ArrowUpRight } from 'lucide-react';
import { api } from '../api';

export default function PoemCard({ poem, onSelectPoem, onLikeSuccess }) {
  const [likesCount, setLikesCount] = useState(poem.likes_count || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async (e) => {
    e.stopPropagation();
    if (isLiking) return;
    setIsLiking(true);

    try {
      const res = await api.toggleLike(poem.slug);
      setLikesCount(res.likes_count);
      setIsLiked(res.liked);
      if (onLikeSuccess) onLikeSuccess(poem.slug, res.likes_count);
    } catch (err) {
      console.error("Like xatosi:", err);
    } finally {
      setIsLiking(false);
    }
  };

  const isThought = poem.post_type === 'thought';

  return (
    <article 
      className="card card-clickable" 
      onClick={() => onSelectPoem(poem)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        position: 'relative',
        background: isThought 
          ? 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-secondary) 100%)' 
          : 'var(--bg-card)'
      }}
    >
      <div>
        {/* Card Header: Category & Type */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className={`badge ${isThought ? 'badge-gold' : ''}`}>
              {isThought ? <Sparkles size={12} /> : <Feather size={12} />}
              {poem.category_name || (isThought ? "Mushohada" : "She'r")}
            </span>
            {poem.is_featured && (
              <span className="badge badge-gold" title="Sara asar">
                ★ Sara
              </span>
            )}
          </div>

          {poem.written_date && (
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={13} /> {poem.written_date}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 style={{ 
          fontSize: '1.35rem', 
          lineHeight: 1.3, 
          marginBottom: '12px',
          color: 'var(--text-primary)',
          fontWeight: 700
        }}>
          {poem.title}
        </h3>

        {/* Excerpt / Verse snippet */}
        <p style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '1.05rem',
          lineHeight: 1.75,
          color: 'var(--text-secondary)',
          fontStyle: isThought ? 'italic' : 'normal',
          marginBottom: '20px',
          display: '-webkit-box',
          WebkitLineClamp: isThought ? 4 : 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          «{poem.excerpt || poem.content?.substring(0, 140)}»
        </p>
      </div>

      {/* Card Footer: Stats & Actions */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        paddingTop: '16px',
        borderTop: '1px solid var(--border-subtle)',
        marginTop: '12px'
      }}>
        {/* Left: Views & Comments count */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }} title="O'qishlar soni">
            <Eye size={14} /> {poem.views_count || 0}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }} title="Izohlar soni">
            <MessageSquare size={14} /> {poem.comments_count || 0}
          </span>
        </div>

        {/* Right: Like Button with Animation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button 
            type="button"
            className={`btn btn-ghost ${isLiked ? 'animate-heart' : ''}`}
            onClick={handleLike}
            style={{ 
              padding: '6px 12px', 
              fontSize: '0.86rem',
              color: isLiked ? 'var(--accent-rose)' : 'var(--text-secondary)'
            }}
            title="She'rga mehr bildirish (Like)"
          >
            <Heart 
              size={16} 
              fill={isLiked ? 'var(--accent-rose)' : 'none'} 
              color={isLiked ? 'var(--accent-rose)' : 'currentColor'} 
            />
            <span>{likesCount}</span>
          </button>

          <span 
            style={{ color: 'var(--accent-gold)', display: 'flex', alignItems: 'center' }}
            title="To'liq o'qish"
          >
            <ArrowUpRight size={18} />
          </span>
        </div>

      </div>
    </article>
  );
}
