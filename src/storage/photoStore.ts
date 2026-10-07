import { useEffect, useState } from 'react';

// Photos are kept in IndexedDB rather than localStorage, which caps out at ~5MB.
const DB_NAME = 'court-passport';
const STORE = 'photos';

let dbPromise: Promise<IDBDatabase> | null = null;

function openDb(): Promise<IDBDatabase> {
  if (typeof indexedDB === 'undefined') {
    return Promise.reject(new Error('Photo storage is not available in this browser.'));
  }
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = () => request.result.createObjectStore(STORE);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => {
        dbPromise = null;
        reject(request.error);
      };
    });
  }
  return dbPromise;
}

async function run<T>(mode: IDBTransactionMode, action: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE, mode);
    const request = action(transaction.objectStore(STORE));
    transaction.oncomplete = () => resolve(request.result);
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error);
  });
}

export async function putPhoto(id: string, blob: Blob): Promise<void> {
  await run('readwrite', (store) => store.put(blob, id));
}

export function getPhoto(id: string): Promise<Blob | undefined> {
  return run<Blob | undefined>('readonly', (store) => store.get(id));
}

export async function deletePhoto(id: string): Promise<void> {
  await run('readwrite', (store) => store.delete(id));
}

/** Resolves a stored photo to an object URL for <img src>, revoking it when no longer needed. */
export function usePhotoUrl(photoId?: string): string | null {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    setUrl(null);
    if (!photoId) return;

    let cancelled = false;
    let objectUrl: string | null = null;
    getPhoto(photoId)
      .then((blob) => {
        if (cancelled || !blob) return;
        objectUrl = URL.createObjectURL(blob);
        setUrl(objectUrl);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [photoId]);

  return url;
}
