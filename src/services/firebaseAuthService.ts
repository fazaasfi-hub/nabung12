import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  User
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

export interface UserCloudProfile {
  uid: string;
  email: string;
  displayName: string;
  pin?: string;
  isBiometricsEnabled?: boolean;
  avatarUrl?: string;
  createdAt: string;
  emailVerified: boolean;
}

export const registerUserWithEmail = async (
  email: string,
  pass: string,
  fullName: string
): Promise<UserCloudProfile> => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
  const user = userCredential.user;

  // Update Auth Profile
  await updateProfile(user, { displayName: fullName });

  // Send Email Verification
  try {
    await sendEmailVerification(user);
  } catch (e) {
    console.warn('Could not send verification email immediately:', e);
  }

  // Create Firestore User Document
  const profileData: UserCloudProfile = {
    uid: user.uid,
    email: user.email || email,
    displayName: fullName,
    avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80`,
    createdAt: new Date().toISOString(),
    emailVerified: user.emailVerified
  };

  await setDoc(doc(db, 'users', user.uid), profileData);
  return profileData;
};

export const loginUserWithEmail = async (
  email: string,
  pass: string
): Promise<UserCloudProfile> => {
  const userCredential = await signInWithEmailAndPassword(auth, email, pass);
  const user = userCredential.user;

  // Fetch or create profile doc
  const userDocRef = doc(db, 'users', user.uid);
  const userDoc = await getDoc(userDocRef);

  if (userDoc.exists()) {
    const data = userDoc.data() as UserCloudProfile;
    // Update verification state if changed
    if (data.emailVerified !== user.emailVerified) {
      await updateDoc(userDocRef, { emailVerified: user.emailVerified });
      data.emailVerified = user.emailVerified;
    }
    return data;
  } else {
    // Initial profile if missing in Firestore
    const newProfile: UserCloudProfile = {
      uid: user.uid,
      email: user.email || email,
      displayName: user.displayName || 'Pengguna FZ',
      avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80`,
      createdAt: new Date().toISOString(),
      emailVerified: user.emailVerified
    };
    await setDoc(userDocRef, newProfile);
    return newProfile;
  }
};

export const logoutUser = async (): Promise<void> => {
  await signOut(auth);
  // Clear local session storage security tokens
  localStorage.removeItem('fz_auth_session_active');
  localStorage.removeItem('fz_remember_email');
};

export const sendResetPasswordEmail = async (email: string): Promise<void> => {
  await sendPasswordResetEmail(auth, email);
};

export const resendEmailVerificationLink = async (): Promise<void> => {
  if (auth.currentUser) {
    await sendEmailVerification(auth.currentUser);
  } else {
    throw new Error('Tidak ada pengguna yang terotentikasi.');
  }
};

export const checkEmailVerificationStatus = async (): Promise<boolean> => {
  if (auth.currentUser) {
    await auth.currentUser.reload();
    return auth.currentUser.emailVerified;
  }
  return false;
};

export const saveUserPinToCloud = async (uid: string, pin: string): Promise<void> => {
  const userDocRef = doc(db, 'users', uid);
  await updateDoc(userDocRef, { pin });
};
