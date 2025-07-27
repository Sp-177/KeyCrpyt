import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { auth, storage } from '../auth/firebaseConfig';
import { updateProfile } from 'firebase/auth';

export const uploadProfilePicture = async (file) => {
  if (!auth.currentUser) throw new Error("User not logged in");

  const fileRef = ref(storage, `profilePictures/${auth.currentUser.uid}`);
  await uploadBytes(fileRef, file);
  const url = await getDownloadURL(fileRef);

  await updateProfile(auth.currentUser, { photoURL: url });

  return url;
};