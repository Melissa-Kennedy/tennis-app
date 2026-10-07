import React, { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { usePassport } from '../../context/PassportContext';
import { courts, courtsById } from '../../data/courts';
import { Visit } from '../../types/Passport';
import { getAchievements, getRegionVisas } from '../../utils/achievements';
import { useMediaQuery } from '../../utils/useMediaQuery';
import PassportBook, { PageSpec } from './PassportBook';
import { BackCover, BadgesPage, CoverPage, HolderPage, IdentityPage, StampsPage, ToVisitPage, VisasPage } from './PassportPages';
import StampModal from './StampModal';
import './Passport.css';

const STAMPS_PER_PAGE = 6;
const STAMP_PAGES_START = 5;

const PassportPage: React.FC = () => {
  const { stampedVisits, profile, updateProfile } = usePassport();
  const single = useMediaQuery('(max-width: 760px)');
  const [searchParams] = useSearchParams();
  const highlightId = searchParams.get('court');
  const [selected, setSelected] = useState<Visit | null>(null);

  const [page, setPage] = useState(() => {
    const index = stampedVisits.findIndex((visit) => visit.courtId === highlightId);
    return index >= 0 ? STAMP_PAGES_START + Math.floor(index / STAMPS_PER_PAGE) : 0;
  });

  const closeModal = useCallback(() => setSelected(null), []);

  const pages = useMemo<PageSpec[]>(() => {
    const visas = getRegionVisas(stampedVisits, courts, courtsById);
    const achievements = getAchievements(stampedVisits, courtsById);
    const favouriteVisit = [...stampedVisits].sort((a, b) => b.rating - a.rating || b.date.localeCompare(a.date))[0];
    const favourite = favouriteVisit?.rating ? courtsById.get(favouriteVisit.courtId) : undefined;
    const unvisited = courts.filter((court) => !stampedVisits.some((visit) => visit.courtId === court.id));
    // Rotate the suggestions as the passport fills so the list doesn't always start at "A".
    const offset = unvisited.length ? (stampedVisits.length * 7) % unvisited.length : 0;
    const suggestions = [...unvisited.slice(offset), ...unvisited.slice(0, offset)].slice(0, 7);

    // Always leave room for the next stamp, and keep the page count even so the book has whole leaves.
    let stampPageCount = Math.max(2, Math.ceil((stampedVisits.length + 1) / STAMPS_PER_PAGE));
    if ((STAMP_PAGES_START + stampPageCount + 2) % 2 === 1) stampPageCount += 1;

    const stampPages: PageSpec[] = Array.from({ length: stampPageCount }, (_, i) => {
      const slots = Array.from({ length: STAMPS_PER_PAGE }, (_, j) => stampedVisits[i * STAMPS_PER_PAGE + j] ?? null);
      return {
        key: `stamps-${i}`,
        kind: 'paper',
        label: i === 0 ? 'Stamps' : undefined,
        number: STAMP_PAGES_START + i,
        content: (
          <StampsPage
            slots={slots}
            firstNumber={i * STAMPS_PER_PAGE + 1}
            courtsById={courtsById}
            highlightId={highlightId}
            onSelect={setSelected}
          />
        ),
      };
    });

    return [
      { key: 'cover', kind: 'cover', label: 'Cover', content: <CoverPage onOpen={() => setPage(1)} /> },
      {
        key: 'holder',
        kind: 'paper',
        number: 1,
        content: <HolderPage profile={profile} onNameChange={(holderName) => updateProfile({ holderName })} />,
      },
      {
        key: 'id',
        kind: 'paper',
        label: 'ID',
        number: 2,
        content: (
          <IdentityPage
            profile={profile}
            stamped={stampedVisits}
            total={courts.length}
            districts={visas.filter((visa) => visa.visited > 0).length}
            favourite={favourite}
          />
        ),
      },
      { key: 'visas', kind: 'paper', label: 'Visas', number: 3, content: <VisasPage visas={visas} /> },
      { key: 'badges', kind: 'paper', label: 'Badges', number: 4, content: <BadgesPage achievements={achievements} /> },
      ...stampPages,
      {
        key: 'to-visit',
        kind: 'paper',
        label: 'To visit',
        number: STAMP_PAGES_START + stampPageCount,
        content: <ToVisitPage suggestions={suggestions} remaining={unvisited.length} />,
      },
      { key: 'back-cover', kind: 'back-cover', content: <BackCover holderName={profile.holderName} /> },
    ];
  }, [stampedVisits, profile, updateProfile, highlightId]);

  const safePage = Math.min(page, pages.length - 1);
  const selectedCourt = selected ? courtsById.get(selected.courtId) : undefined;

  return (
    <main className="passport-page">
      <PassportBook pages={pages} page={safePage} onPageChange={setPage} single={single} keyboardEnabled={!selected} />
      {selected && selectedCourt && <StampModal court={selectedCourt} visit={selected} onClose={closeModal} />}
    </main>
  );
};

export default PassportPage;
