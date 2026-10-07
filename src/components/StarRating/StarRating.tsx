import React, { useState } from 'react';

interface StarRatingProps {
  value: number;
  /** When provided the stars become an interactive input */
  onChange?: (value: number) => void;
  size?: 'sm' | 'md' | 'lg';
}

const LABELS = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'];

const StarRating: React.FC<StarRatingProps> = ({ value, onChange, size = 'md' }) => {
  const [hover, setHover] = useState(0);
  const shown = hover || value;

  if (!onChange) {
    return (
      <span className={`stars stars-${size}`} aria-label={value ? `${value} out of 5 stars` : 'Not rated'}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={star <= value ? 'star is-on' : 'star'} aria-hidden="true">★</span>
        ))}
      </span>
    );
  }

  return (
    <div className={`stars stars-${size} stars-input`} role="radiogroup" aria-label="Star rating" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={value === star}
          aria-label={`${star} star${star > 1 ? 's' : ''}`}
          className={star <= shown ? 'star is-on' : 'star'}
          onMouseEnter={() => setHover(star)}
          onClick={() => onChange(value === star ? 0 : star)}
        >
          ★
        </button>
      ))}
      <span className="stars-label">{LABELS[shown] || 'Tap to rate'}</span>
    </div>
  );
};

export default StarRating;
