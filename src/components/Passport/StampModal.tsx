import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Address } from '../../types/Address';
import { Visit } from '../../types/Passport';
import { usePhotoUrl } from '../../storage/photoStore';
import { formatLongDate } from '../../utils/dates';
import { getRegion } from '../../utils/region';
import Stamp from '../Stamp/Stamp';
import StarRating from '../StarRating/StarRating';

interface StampModalProps {
  court: Address;
  visit: Visit;
  onClose: () => void;
}

const StampModal: React.FC<StampModalProps> = ({ court, visit, onClose }) => {
  const photoUrl = usePhotoUrl(visit.photoId);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="stamp-modal-title" onClick={(e) => e.stopPropagation()}>
        <button ref={closeRef} className="modal-close" onClick={onClose} aria-label="Close">×</button>
        <div className="modal-stamp">
          <Stamp court={court} date={visit.date} animate />
        </div>
        <span className="eyebrow">{getRegion(court)}</span>
        <h2 id="stamp-modal-title">{court.name}</h2>
        <p className="visit-date">Played {formatLongDate(visit.date)}</p>
        {visit.rating > 0 && <StarRating value={visit.rating} size="lg" />}
        {visit.review && <blockquote className="visit-review">{visit.review}</blockquote>}
        {photoUrl && <img className="visit-photo" src={photoUrl} alt={`Your visit to ${court.name}`} />}
        <Link to={`/court/${court.id}`} className="button button-primary">Open court page</Link>
      </div>
    </div>
  );
};

export default StampModal;
