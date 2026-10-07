import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { PassportProfile, Visit, VisitDraft } from '../types/Passport';
import { deletePhoto, putPhoto } from '../storage/photoStore';
import { courtsById } from '../data/courts';

const VISITS_KEY = 'courtPassport.visits';
const PROFILE_KEY = 'courtPassport.profile';

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or blocked (e.g. private browsing); the in-memory state still works this session.
  }
}

interface PassportContextValue {
  visits: Record<string, Visit>;
  /** Visits for courts that exist in the dataset, oldest first */
  stampedVisits: Visit[];
  profile: PassportProfile;
  saveVisit: (draft: VisitDraft) => Promise<void>;
  removeVisit: (courtId: string) => Promise<void>;
  updateProfile: (changes: Partial<PassportProfile>) => void;
}

const PassportContext = createContext<PassportContextValue | null>(null);

export const PassportProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [visits, setVisits] = useState<Record<string, Visit>>(() => readJson(VISITS_KEY, {}));
  const [profile, setProfile] = useState<PassportProfile>(() =>
    readJson(PROFILE_KEY, { holderName: '', issuedAt: new Date().toISOString() })
  );

  const visitsRef = useRef(visits);
  visitsRef.current = visits;

  useEffect(() => writeJson(VISITS_KEY, visits), [visits]);
  useEffect(() => writeJson(PROFILE_KEY, profile), [profile]);

  const saveVisit = useCallback(async ({ courtId, date, rating, review, photo }: VisitDraft) => {
    const existing = visitsRef.current[courtId];
    let photoId = existing?.photoId;

    if (photo) {
      const newPhotoId = `${courtId}-${Date.now()}`;
      await putPhoto(newPhotoId, photo);
      if (photoId) deletePhoto(photoId).catch(() => {});
      photoId = newPhotoId;
    } else if (photo === null && photoId) {
      deletePhoto(photoId).catch(() => {});
      photoId = undefined;
    }

    const now = new Date().toISOString();
    const visit: Visit = {
      courtId,
      date,
      rating,
      review: review.trim(),
      photoId,
      stampedAt: existing?.stampedAt ?? now,
      updatedAt: now,
    };
    setVisits((prev) => ({ ...prev, [courtId]: visit }));
  }, []);

  const removeVisit = useCallback(async (courtId: string) => {
    const photoId = visitsRef.current[courtId]?.photoId;
    if (photoId) deletePhoto(photoId).catch(() => {});
    setVisits((prev) => {
      const { [courtId]: _removed, ...rest } = prev;
      return rest;
    });
  }, []);

  const updateProfile = useCallback((changes: Partial<PassportProfile>) => {
    setProfile((prev) => ({ ...prev, ...changes }));
  }, []);

  const stampedVisits = useMemo(
    () =>
      Object.values(visits)
        .filter((visit) => courtsById.has(visit.courtId))
        .sort((a, b) => a.date.localeCompare(b.date) || a.stampedAt.localeCompare(b.stampedAt)),
    [visits]
  );

  const value = useMemo(
    () => ({ visits, stampedVisits, profile, saveVisit, removeVisit, updateProfile }),
    [visits, stampedVisits, profile, saveVisit, removeVisit, updateProfile]
  );

  return <PassportContext.Provider value={value}>{children}</PassportContext.Provider>;
};

export function usePassport(): PassportContextValue {
  const context = useContext(PassportContext);
  if (!context) throw new Error('usePassport must be used inside <PassportProvider>');
  return context;
}
