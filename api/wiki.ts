import { collection, doc, setDoc, updateDoc, deleteDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../firebase';

export interface WikiEntry {
  id: string;
  title: string;
  category: string;
  content: string;
  tags?: string[];
  authorId: string;
  authorName?: string;
  createdAt: string;
  updatedAt: string;
}

const WIKI_COLLECTION = 'wiki_entries';

export const subscribeToWikiEntries = (
  onUpdate: (entries: WikiEntry[]) => void,
  onError: (error: Error) => void
) => {
  const q = query(collection(db, WIKI_COLLECTION), orderBy('createdAt', 'desc'));
  
  return onSnapshot(
    q,
    (snapshot) => {
      const entries: WikiEntry[] = [];
      snapshot.forEach((doc) => {
        entries.push({ id: doc.id, ...doc.data() } as WikiEntry);
      });
      onUpdate(entries);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, WIKI_COLLECTION);
      } catch (e) {
        onError(e as Error);
      }
    }
  );
};

export const createWikiEntry = async (entry: Omit<WikiEntry, 'id' | 'authorId' | 'authorName' | 'createdAt' | 'updatedAt'>) => {
  if (!auth.currentUser) throw new Error('Must be logged in to create an entry');
  
  const newRef = doc(collection(db, WIKI_COLLECTION));
  const now = new Date().toISOString();
  
  const newEntry: Omit<WikiEntry, 'id'> = {
    ...entry,
    authorId: auth.currentUser.uid,
    authorName: auth.currentUser.displayName || auth.currentUser.email || 'Unknown User',
    createdAt: now,
    updatedAt: now,
  };

  try {
    await setDoc(newRef, newEntry);
    return newRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${WIKI_COLLECTION}/${newRef.id}`);
  }
};

export const updateWikiEntry = async (id: string, updates: Partial<Omit<WikiEntry, 'id' | 'authorId' | 'authorName' | 'createdAt' | 'updatedAt'>>) => {
  if (!auth.currentUser) throw new Error('Must be logged in to update an entry');
  
  const ref = doc(db, WIKI_COLLECTION, id);
  const now = new Date().toISOString();

  try {
    await updateDoc(ref, {
      ...updates,
      updatedAt: now,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${WIKI_COLLECTION}/${id}`);
  }
};

export const deleteWikiEntry = async (id: string) => {
  if (!auth.currentUser) throw new Error('Must be logged in to delete an entry');
  
  const ref = doc(db, WIKI_COLLECTION, id);

  try {
    await deleteDoc(ref);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${WIKI_COLLECTION}/${id}`);
  }
};
