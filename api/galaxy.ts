import { collection, doc, setDoc, getDocs, query, orderBy, deleteDoc } from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../firebase';

export interface GalaxySeed {
  id: string;
  name: string;
  seed: number;
  config: {
    starCount: number;
    galaxyRadius: number;
    spiralArms: number;
  };
  authorId: string;
  authorName?: string;
  createdAt: string;
}

const GALAXY_COLLECTION = 'galaxies';

export const saveGalaxySeed = async (galaxy: Omit<GalaxySeed, 'id' | 'authorId' | 'authorName' | 'createdAt'>) => {
  if (!auth.currentUser) throw new Error('Must be logged in to save a galaxy');
  
  const newRef = doc(collection(db, GALAXY_COLLECTION));
  const now = new Date().toISOString();
  
  const newGalaxy: Omit<GalaxySeed, 'id'> = {
    ...galaxy,
    authorId: auth.currentUser.uid,
    authorName: auth.currentUser.displayName || auth.currentUser.email || 'Unknown User',
    createdAt: now,
  };

  try {
    await setDoc(newRef, newGalaxy);
    return newRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${GALAXY_COLLECTION}/${newRef.id}`);
  }
};

export const getGalaxySeeds = async (): Promise<GalaxySeed[]> => {
  const q = query(collection(db, GALAXY_COLLECTION), orderBy('createdAt', 'desc'));
  try {
    const snapshot = await getDocs(q);
    const galaxies: GalaxySeed[] = [];
    snapshot.forEach((doc) => {
      galaxies.push({ id: doc.id, ...doc.data() } as GalaxySeed);
    });
    return galaxies;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, GALAXY_COLLECTION);
    return [];
  }
};

export const deleteGalaxySeed = async (id: string) => {
  if (!auth.currentUser) throw new Error('Must be logged in to delete a galaxy');
  
  const ref = doc(db, GALAXY_COLLECTION, id);

  try {
    await deleteDoc(ref);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${GALAXY_COLLECTION}/${id}`);
  }
};
