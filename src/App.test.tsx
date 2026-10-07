import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { PassportProvider } from './context/PassportContext';
import PassportPage from './components/Passport/PassportPage';
import { getRegion } from './utils/region';
import { getAchievements } from './utils/achievements';
import { courts, courtsById } from './data/courts';
import { Visit } from './types/Passport';

const visit = (courtId: string, date: string, extra: Partial<Visit> = {}): Visit => ({
  courtId,
  date,
  rating: 4,
  review: '',
  stampedAt: `${date}T12:00:00.000Z`,
  updatedAt: `${date}T12:00:00.000Z`,
  ...extra,
});

beforeEach(() => localStorage.clear());

test('reads the district from a court address', () => {
  expect(getRegion({ ...courts[0], address: '43 Ancaster Rd, North York, ON M3K 1K8' })).toBe('North York');
  expect(getRegion({ ...courts[0], address: 'Toronto, ON M6L 1B6' })).toBe('Toronto');
});

test('awards milestone badges by number of stamps', () => {
  const stamped = courts.slice(0, 5).map((court) => visit(court.id, '2026-06-01'));
  const earned = getAchievements(stamped, courtsById).filter((a) => a.current >= a.goal).map((a) => a.id);
  expect(earned).toEqual(expect.arrayContaining(['first-serve', 'rally']));
  expect(earned).not.toContain('double-digits');
});

test('passport shows saved stamps', () => {
  const court = courts[0];
  localStorage.setItem('courtPassport.visits', JSON.stringify({ [court.id]: visit(court.id, '2026-06-12') }));
  localStorage.setItem('courtPassport.profile', JSON.stringify({ holderName: 'Sam Rivera', issuedAt: '2026-06-01T00:00:00.000Z' }));

  render(
    <PassportProvider>
      <MemoryRouter initialEntries={['/passport']}>
        <PassportPage />
      </MemoryRouter>
    </PassportProvider>
  );

  expect(screen.getByRole('button', { name: `${court.name}, open stamp details` })).toBeInTheDocument();
  expect(screen.getByDisplayValue('Sam Rivera')).toBeInTheDocument();
  const tabs = screen.getByRole('tablist', { name: 'Passport sections' });
  expect(within(tabs).getByRole('tab', { name: 'Stamps' })).toBeInTheDocument();
});
