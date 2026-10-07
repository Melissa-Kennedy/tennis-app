import React from 'react';
import { Link } from 'react-router-dom';
import { Address } from '../../types/Address';
import { PassportProfile, Visit } from '../../types/Passport';
import { Achievement, RegionVisa } from '../../utils/achievements';
import { stampDateParts } from '../../utils/dates';
import Stamp, { stampStyle } from '../Stamp/Stamp';

const Crest: React.FC = () => (
  <svg className="crest" viewBox="0 0 100 100" aria-hidden="true">
    <circle cx="50" cy="50" r="47" fill="none" stroke="currentColor" strokeWidth="1.5" />
    {Array.from({ length: 36 }, (_, i) => {
      const angle = (i / 36) * Math.PI * 2;
      return <circle key={i} cx={50 + Math.cos(angle) * 42} cy={50 + Math.sin(angle) * 42} r="1.3" fill="currentColor" />;
    })}
    <circle cx="50" cy="50" r="36" fill="none" stroke="currentColor" strokeWidth="1" />
    <circle cx="50" cy="50" r="22" fill="none" stroke="currentColor" strokeWidth="2.5" />
    <path d="M33,36 Q47,50 33,64" fill="none" stroke="currentColor" strokeWidth="2.5" />
    <path d="M67,36 Q53,50 67,64" fill="none" stroke="currentColor" strokeWidth="2.5" />
  </svg>
);

export const CoverPage: React.FC<{ onOpen: () => void }> = ({ onOpen }) => (
  <button className="cover" onClick={onOpen} aria-label="Open passport">
    <span className="cover-top">City of Toronto</span>
    <Crest />
    <span className="cover-title">Court<br />Passport</span>
    <span className="cover-sub">Public Tennis Courts</span>
    <span className="cover-chip" aria-hidden="true" />
    <span className="cover-open">Tap to open</span>
  </button>
);

export const HolderPage: React.FC<{ profile: PassportProfile; onNameChange: (name: string) => void }> = ({ profile, onNameChange }) => (
  <div className="pp holder-page">
    <p className="pp-kicker">This passport belongs to</p>
    <input
      className="holder-input"
      value={profile.holderName}
      onChange={(e) => onNameChange(e.target.value)}
      placeholder="Write your name"
      maxLength={40}
      aria-label="Passport holder name"
    />
    <h3 className="pp-title">How it works</h3>
    <ol className="how-list">
      <li><strong>Find a court</strong> on the map. There are 104 public courts across the city.</li>
      <li><strong>Play, then stamp it</strong> with a date, a star rating, a review and a photo.</li>
      <li><strong>Collect visas</strong> for each district and earn badges as your passport fills up.</li>
    </ol>
    <Link to="/" className="pp-link">Find a court →</Link>
  </div>
);

function mrzLine(text: string): string {
  return text.toUpperCase().replace(/[^A-Z0-9<]/g, '<').padEnd(44, '<').slice(0, 44);
}

interface IdentityPageProps {
  profile: PassportProfile;
  stamped: Visit[];
  total: number;
  districts: number;
  favourite?: Address;
}

export const IdentityPage: React.FC<IdentityPageProps> = ({ profile, stamped, total, districts, favourite }) => {
  const rated = stamped.filter((visit) => visit.rating > 0);
  const average = rated.length ? (rated.reduce((sum, visit) => sum + visit.rating, 0) / rated.length).toFixed(1) : '—';
  const name = profile.holderName.trim() || 'Tennis Player';
  const initials = name.split(/\s+/).map((part) => part[0]).slice(0, 2).join('').toUpperCase();
  const issued = stampDateParts(profile.issuedAt);
  const issuedCode = `${issued.year.slice(2)}${issued.month}${issued.day}`;

  return (
    <div className="pp id-page">
      <div className="id-header">
        <span>Passport · Passeport</span>
        <span>Type P · TOR</span>
      </div>
      <div className="id-body">
        <div className="id-photo" aria-hidden="true">{initials}</div>
        <dl className="id-fields">
          <div className="id-field id-field-wide"><dt>Holder</dt><dd>{name}</dd></div>
          <div className="id-field"><dt>Issued</dt><dd>{`${issued.day} ${issued.month} ${issued.year}`}</dd></div>
          <div className="id-field"><dt>Authority</dt><dd>Toronto Courts</dd></div>
        </dl>
      </div>
      <dl className="id-stats">
        <div><dt>Stamped</dt><dd>{stamped.length}<small>/{total}</small></dd></div>
        <div><dt>Districts</dt><dd>{districts}<small>/6</small></dd></div>
        <div><dt>Avg rating</dt><dd>{average}{rated.length > 0 && <small>★</small>}</dd></div>
        <div><dt>Photos</dt><dd>{stamped.filter((visit) => visit.photoId).length}</dd></div>
      </dl>
      <dl className="id-favourite">
        <dt>Favourite court</dt>
        <dd>{favourite ? <Link to={`/court/${favourite.id}`}>{favourite.name}</Link> : 'Rate a court to pick one'}</dd>
      </dl>
      <div className="mrz" aria-hidden="true">
        <div>{mrzLine(`P<TOR${name.replace(/\s+/g, '<')}`)}</div>
        <div>{mrzLine(`${String(stamped.length).padStart(3, '0')}<${total}<TENNIS<<${issuedCode}<<${districts}`)}</div>
      </div>
    </div>
  );
};

export const VisasPage: React.FC<{ visas: RegionVisa[] }> = ({ visas }) => (
  <div className="pp">
    <h3 className="pp-title">Visas</h3>
    <p className="pp-sub">Your first court in each district earns its entry visa.</p>
    <div className="visa-grid">
      {visas.map((visa) => {
        const { ink, rotation } = stampStyle(`visa-${visa.region}`);
        const date = visa.firstVisit ? stampDateParts(visa.firstVisit) : null;
        return (
          <div
            key={visa.region}
            className={date ? 'visa is-granted' : 'visa'}
            style={date ? ({ color: ink, '--visa-rotation': `${rotation / 2}deg` } as React.CSSProperties) : undefined}
          >
            <span className="visa-label">{date ? 'Entry granted' : 'No entry yet'}</span>
            <span className="visa-region">{visa.region}</span>
            <span className="visa-date">{date ? `${date.day} ${date.month} ${date.year}` : '— — —'}</span>
            <span className="visa-count">{visa.visited}/{visa.total} courts</span>
          </div>
        );
      })}
    </div>
  </div>
);

export const BadgesPage: React.FC<{ achievements: Achievement[] }> = ({ achievements }) => (
  <div className="pp">
    <h3 className="pp-title">Badges</h3>
    <p className="pp-sub">{achievements.filter((a) => a.current >= a.goal).length} of {achievements.length} earned</p>
    <ul className="badge-grid">
      {achievements.map((achievement) => {
        const earned = achievement.current >= achievement.goal;
        return (
          <li key={achievement.id} className={earned ? 'badge is-earned' : 'badge'} title={achievement.description}>
            <span className="badge-medal" aria-hidden="true">{achievement.glyph}</span>
            <span className="badge-title">{achievement.title}</span>
            <span className="badge-progress">
              {earned ? 'Earned' : `${Math.min(achievement.current, achievement.goal)}/${achievement.goal}`}
            </span>
          </li>
        );
      })}
    </ul>
  </div>
);

interface StampsPageProps {
  slots: (Visit | null)[];
  firstNumber: number;
  courtsById: Map<string, Address>;
  highlightId?: string | null;
  onSelect: (visit: Visit) => void;
}

export const StampsPage: React.FC<StampsPageProps> = ({ slots, firstNumber, courtsById, highlightId, onSelect }) => (
  <div className="pp">
    <h3 className="pp-title pp-title-small">Entries</h3>
    <div className="stamp-grid">
      {slots.map((visit, index) => {
        const court = visit && courtsById.get(visit.courtId);
        const number = firstNumber + index;
        return court && visit ? (
          <button
            key={visit.courtId}
            className={visit.courtId === highlightId ? 'stamp-slot is-highlighted' : 'stamp-slot'}
            onClick={() => onSelect(visit)}
            aria-label={`${court.name}, open stamp details`}
          >
            <Stamp court={court} date={visit.date} />
          </button>
        ) : (
          <div key={`empty-${number}`} className="stamp-slot is-empty" aria-hidden="true">
            <span>No. {number}</span>
          </div>
        );
      })}
    </div>
  </div>
);

export const ToVisitPage: React.FC<{ suggestions: Address[]; remaining: number }> = ({ suggestions, remaining }) => (
  <div className="pp">
    <h3 className="pp-title">Next serves</h3>
    <p className="pp-sub">
      {remaining === 0 ? 'Every court stamped. Grand Slam!' : `${remaining} courts left to stamp. A few to try:`}
    </p>
    <ul className="to-visit-list">
      {suggestions.map((court) => (
        <li key={court.id}>
          <Link to={`/court/${court.id}`}>
            <span>{court.name}</span>
            <small>{court.lights === 'Yes' ? 'Lights' : 'No lights'} · {court.courts} court{court.courts === '1' ? '' : 's'}</small>
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export const BackCover: React.FC<{ holderName: string }> = ({ holderName }) => (
  <div className="back-cover">
    <p>
      This passport is the property of <strong>{holderName.trim() || 'its holder'}</strong>.
      <br />
      If found, return to the nearest public tennis court.
    </p>
    <div className="barcode" aria-hidden="true" />
  </div>
);
