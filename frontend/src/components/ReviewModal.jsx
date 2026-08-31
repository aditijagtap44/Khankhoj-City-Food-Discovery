import React, { useState } from 'react';
import { Star, X, Send, Image, Trash2, Tag, ThumbsUp } from 'lucide-react';
import confetti from 'canvas-confetti';
import { placeService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const REVIEW_TAGS = [
  '🏆 Iconic Taste',
  '🔥 Super Spicy',
  '⚡ Quick Service',
  '💰 Great Value',
  '🌿 Pure Veg Bliss',
  '👨‍👩‍👧 Family Friendly',
  '🌟 Must Visit',
  '☕ Cozy Ambience',
  '🚗 Easy Parking',
];

const ReviewModal = ({ placeId, placeName, isOpen, onClose, onReviewAdded }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [mustTryDish, setMustTryDish] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleTagToggle = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image file size must be under 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!comment.trim()) {
      setError('Please write a short review sharing your experience.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      // Build formatted comment with tags if selected
      let finalComment = comment.trim();
      if (selectedTags.length > 0) {
        finalComment = `${selectedTags.join(' • ')}\n\n${finalComment}`;
      }

      const res = await placeService.addReview(placeId, {
        rating,
        comment: finalComment,
        must_try_dish: mustTryDish.trim(),
      });

      // Trigger celebration confetti
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
      });

      if (onReviewAdded) onReviewAdded(res.data);
      onClose();
    } catch (err) {
      console.error('Failed to submit review', err);
      setError(err.response?.data?.detail || 'Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
    >
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-bright)',
          borderRadius: 'var(--radius-lg)',
          width: '100%',
          maxWidth: '560px',
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Write a Food Review</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              For <strong style={{ color: 'var(--primary)' }}>{placeName}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body (Scrollable) */}
        <form
          onSubmit={handleSubmit}
          style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}
        >
          {error && (
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#EF4444',
                padding: '0.65rem 0.9rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem',
                marginBottom: '1rem',
              }}
            >
              {error}
            </div>
          )}

          {/* Star Rating Picker */}
          <div className="form-group" style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
            <label className="form-label" style={{ marginBottom: '0.5rem' }}>
              Your Overall Rating
            </label>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    transform: (hoverRating || rating) >= star ? 'scale(1.2)' : 'scale(1)',
                    transition: 'transform 0.15s',
                  }}
                >
                  <Star
                    size={32}
                    color="#FFB300"
                    fill={(hoverRating || rating) >= star ? '#FFB300' : 'none'}
                  />
                </button>
              ))}
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-gold)', marginTop: '0.4rem' }}>
              {rating === 5 ? '⭐⭐⭐⭐⭐ Legendary / Must-Visit!' : rating === 4 ? '⭐⭐⭐⭐ Very Good!' : rating === 3 ? '⭐⭐⭐ Average' : 'Needs Improvement'}
            </div>
          </div>

          {/* Quick Experience Tags */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Tag size={15} color="var(--primary)" />
              <span>What stood out? (Select tags)</span>
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {REVIEW_TAGS.map((tag) => (
                <button
                  type="button"
                  key={tag}
                  onClick={() => handleTagToggle(tag)}
                  className={`tag-chip ${selectedTags.includes(tag) ? 'selected' : ''}`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Must Try Dish Recommendation */}
          <div className="form-group">
            <label className="form-label">Top Dish You Recommend (Optional)</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Special Kat Misal, Bun Maska Chai..."
              value={mustTryDish}
              onChange={(e) => setMustTryDish(e.target.value)}
            />
          </div>

          {/* Review text */}
          <div className="form-group">
            <label className="form-label">Your Experience & Taste Notes *</label>
            <textarea
              required
              className="form-control"
              rows={3}
              placeholder="Tell other foodies what made the taste special, portion size, spice level, waiting time..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          {/* Photo Attachment (Optional) */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Image size={15} color="var(--primary)" />
              <span>Attach Food Photo (Optional)</span>
            </label>

            {!previewImage ? (
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem',
                  border: '1px dashed var(--border-bright)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  background: 'var(--bg-surface)',
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)',
                }}
              >
                <Image size={16} />
                <span>Upload Dish Photo</span>
                <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
              </label>
            ) : (
              <div style={{ position: 'relative', width: '120px', height: '90px' }}>
                <img
                  src={previewImage}
                  alt="Preview"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-md)' }}
                />
                <button
                  type="button"
                  onClick={() => setPreviewImage(null)}
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-6px',
                    background: '#EF4444',
                    color: '#FFF',
                    border: 'none',
                    borderRadius: '50%',
                    width: '22px',
                    height: '22px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Trash2 size={12} />
                </button>
              </div>
            )}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn btn-primary">
              <Send size={15} />
              <span>{submitting ? 'Publishing...' : 'Publish Review'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
