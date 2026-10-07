import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { courtsById } from '../../data/courts';
import { usePassport } from '../../context/PassportContext';
import { usePhotoUrl } from '../../storage/photoStore';
import { formatLongDate } from '../../utils/dates';
import { getRegion } from '../../utils/region';
import Stamp from '../Stamp/Stamp';
import StarRating from '../StarRating/StarRating';
import VisitForm from '../VisitForm/VisitForm';

const CourtPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { visits, removeVisit } = usePassport();
  const [editing, setEditing] = useState(false);
  const [justStamped, setJustStamped] = useState(false);

  const court = id ? courtsById.get(id) : undefined;
  const visit = court ? visits[court.id] : undefined;
  const photoUrl = usePhotoUrl(visit?.photoId);

  if (!court) {
    return (
      <main className="page court-page">
        <h1>Court not found</h1>
        <Link to="/" className="button button-primary">Back to the map</Link>
      </main>
    );
  }

  const handleRemove = async () => {
    if (window.confirm(`Remove the ${court.name} stamp from your passport? Your review and photo will be deleted.`)) {
      await removeVisit(court.id);
      setEditing(false);
    }
  };

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${court.latitude},${court.longitude}`;

  return (
    <main className="page court-page">
      <Link to="/" className="back-link">← All courts</Link>

      <header className="court-header">
        <span className="eyebrow">{getRegion(court)}</span>
        <h1>{court.name}</h1>
        <p className="court-address">{court.address}</p>
        <a className="text-link" href={directionsUrl} target="_blank" rel="noreferrer">Get directions ↗</a>
      </header>

      <dl className="court-facts">
        <div>
          <dt>Courts</dt>
          <dd>{court.courts || '—'}</dd>
        </div>
        <div>
          <dt>Lights</dt>
          <dd>{court.lights || '—'}</dd>
        </div>
        <div>
          <dt>Winter play</dt>
          <dd>{court.winterplay || '—'}</dd>
        </div>
      </dl>

      <section className="card passport-entry" aria-labelledby="passport-entry-title">
        {visit && !editing ? (
          <>
            <div className="passport-entry-head">
              <h2 id="passport-entry-title">In your passport</h2>
              <div className="passport-entry-actions">
                <button className="button button-ghost" onClick={() => setEditing(true)}>Edit</button>
                <button className="button button-danger-ghost" onClick={handleRemove}>Remove stamp</button>
              </div>
            </div>
            <div className="passport-entry-body">
              <div className="passport-entry-stamp">
                <Stamp court={court} date={visit.date} animate={justStamped} />
              </div>
              <div className="passport-entry-details">
                <p className="visit-date">Played {formatLongDate(visit.date)}</p>
                {visit.rating > 0 ? <StarRating value={visit.rating} size="lg" /> : <p className="muted">No rating yet</p>}
                {visit.review ? <blockquote className="visit-review">{visit.review}</blockquote> : <p className="muted">No review yet.</p>}
                <Link to={`/passport?court=${court.id}`} className="text-link">See it in your passport →</Link>
              </div>
            </div>
            {photoUrl && <img className="visit-photo" src={photoUrl} alt={`Your visit to ${court.name}`} />}
          </>
        ) : (
          <>
            <h2 id="passport-entry-title">{visit ? 'Edit your visit' : 'Played here? Stamp your passport'}</h2>
            <VisitForm
              key={visit?.updatedAt ?? 'new'}
              court={court}
              existing={visit}
              onSaved={() => {
                setJustStamped(!visit);
                setEditing(false);
              }}
              onCancel={visit ? () => setEditing(false) : undefined}
            />
          </>
        )}
      </section>
    </main>
  );
};

export default CourtPage;
