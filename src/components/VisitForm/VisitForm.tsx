import React, { useEffect, useState } from 'react';
import { Address } from '../../types/Address';
import { Visit } from '../../types/Passport';
import { usePassport } from '../../context/PassportContext';
import { usePhotoUrl } from '../../storage/photoStore';
import { compressImage } from '../../utils/image';
import { todayIso } from '../../utils/dates';
import StarRating from '../StarRating/StarRating';

interface VisitFormProps {
  court: Address;
  existing?: Visit;
  onSaved: () => void;
  onCancel?: () => void;
}

type PhotoChange = { kind: 'keep' } | { kind: 'new'; blob: Blob; previewUrl: string } | { kind: 'remove' };

const REVIEW_LIMIT = 1000;

const VisitForm: React.FC<VisitFormProps> = ({ court, existing, onSaved, onCancel }) => {
  const { saveVisit } = usePassport();
  const [date, setDate] = useState(existing?.date ?? todayIso());
  const [rating, setRating] = useState(existing?.rating ?? 0);
  const [review, setReview] = useState(existing?.review ?? '');
  const [photo, setPhoto] = useState<PhotoChange>({ kind: 'keep' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const existingPhotoUrl = usePhotoUrl(existing?.photoId);

  const newPreviewUrl = photo.kind === 'new' ? photo.previewUrl : null;
  useEffect(() => {
    return () => {
      if (newPreviewUrl) URL.revokeObjectURL(newPreviewUrl);
    };
  }, [newPreviewUrl]);

  const previewUrl = photo.kind === 'new' ? photo.previewUrl : photo.kind === 'keep' ? existingPhotoUrl : null;

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setError(null);
    try {
      const blob = await compressImage(file);
      setPhoto({ kind: 'new', blob, previewUrl: URL.createObjectURL(blob) });
    } catch (err) {
      setError(err instanceof Error ? err.message : "That photo couldn't be added.");
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await saveVisit({
        courtId: court.id,
        date,
        rating,
        review,
        photo: photo.kind === 'new' ? photo.blob : photo.kind === 'remove' ? null : undefined,
      });
      onSaved();
    } catch {
      setError("Your stamp couldn't be saved. Check that this browser allows site storage and try again.");
      setBusy(false);
    }
  };

  return (
    <form className="visit-form" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="visit-date">Date played</label>
        <input id="visit-date" type="date" value={date} max={todayIso()} required onChange={(e) => setDate(e.target.value)} />
      </div>

      <div className="field">
        <span className="field-label">Your rating</span>
        <StarRating value={rating} onChange={setRating} size="lg" />
      </div>

      <div className="field">
        <label htmlFor="visit-review">Review</label>
        <textarea
          id="visit-review"
          rows={4}
          maxLength={REVIEW_LIMIT}
          placeholder="Court surface, nets, crowds, how long you waited…"
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />
        <span className="field-hint">{review.length}/{REVIEW_LIMIT}</span>
      </div>

      <div className="field">
        <span className="field-label">Photo</span>
        {previewUrl ? (
          <div className="photo-preview">
            <img src={previewUrl} alt={`Your visit to ${court.name}`} />
            <div className="photo-preview-actions">
              <label className="button button-ghost">
                Replace
                <input type="file" accept="image/*" onChange={handleFile} hidden />
              </label>
              <button type="button" className="button button-ghost" onClick={() => setPhoto({ kind: 'remove' })}>
                Remove
              </button>
            </div>
          </div>
        ) : (
          <label className="photo-drop">
            <span className="photo-drop-icon" aria-hidden="true">＋</span>
            <span>Add a photo from your visit</span>
            <input type="file" accept="image/*" onChange={handleFile} hidden />
          </label>
        )}
      </div>

      {error && <p className="form-error" role="alert">{error}</p>}

      <div className="form-actions">
        {onCancel && (
          <button type="button" className="button button-ghost" onClick={onCancel} disabled={busy}>
            Cancel
          </button>
        )}
        <button type="submit" className="button button-primary" disabled={busy}>
          {busy ? 'Saving…' : existing ? 'Save changes' : 'Stamp my passport'}
        </button>
      </div>
    </form>
  );
};

export default VisitForm;
