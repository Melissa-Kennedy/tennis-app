export interface Visit {
  courtId: string;
  /** Local calendar date of the visit, YYYY-MM-DD */
  date: string;
  /** 1-5, or 0 when the visit hasn't been rated */
  rating: number;
  review: string;
  /** Key of the photo blob in IndexedDB */
  photoId?: string;
  /** ISO timestamp of when the court was first stamped */
  stampedAt: string;
  updatedAt: string;
}

export interface VisitDraft {
  courtId: string;
  date: string;
  rating: number;
  review: string;
  /** A new photo to store, null to remove the existing one, undefined to keep it */
  photo?: Blob | null;
}

export interface PassportProfile {
  holderName: string;
  /** ISO timestamp of when this passport was first opened */
  issuedAt: string;
}
