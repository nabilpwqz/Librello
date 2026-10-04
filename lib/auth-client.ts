"use client";

import { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  signInWithPopup,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db, googleProvider } from "./firebase";
import { User, UserRole } from "@/types";

interface SessionData {
  user: User | null;
}

interface FetchOptions<T = any> {
  onSuccess?: (ctx?: { data?: T }) => void;
  onError?: (ctx: { error: { message: string } }) => void;
}

// Global cached session state across client components
let globalSessionUser: User | null = null;
let globalIsPending = true;
const listeners = new Set<() => void>();

const notifyListeners = () => {
  listeners.forEach((l) => l());
};

const syncSessionCookie = async (user: User | null, token?: string) => {
  try {
    if (user) {
      await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, token }),
      });
    } else {
      await fetch("/api/auth/session", {
        method: "DELETE",
      });
    }
  } catch (err) {
    console.error("Failed to sync session cookie:", err);
  }
};

const fastRace = <T>(promise: Promise<T>, ms = 600): Promise<T> =>
  Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("Firestore latency timeout")), ms)
    ),
  ]);

const fetchOrCreateFirestoreUser = async (
  fbUser: FirebaseUser,
  fallbackRole: UserRole = "user"
): Promise<User> => {
  const fallbackUser: User = {
    id: fbUser.uid,
    _id: fbUser.uid,
    uid: fbUser.uid,
    name: fbUser.displayName || fbUser.email?.split("@")[0] || "Reader",
    email: fbUser.email || "",
    image: fbUser.photoURL || "",
    role: fallbackRole,
    createdAt: new Date().toISOString(),
  };

  try {
    const userRef = doc(db, "users", fbUser.uid);
    const userSnap = await fastRace(getDoc(userRef), 600);

    if (userSnap.exists()) {
      const data = userSnap.data();
      return {
        ...fallbackUser,
        name: data.name || fallbackUser.name,
        email: data.email || fallbackUser.email,
        image: data.image || fallbackUser.image,
        role: (data.role as UserRole) || fallbackRole,
        createdAt: data.createdAt || fallbackUser.createdAt,
      };
    }

    // Attempt non-blocking setDoc
    fastRace(setDoc(userRef, fallbackUser), 500).catch(() => {});
    return fallbackUser;
  } catch (err) {
    return fallbackUser;
  }
};

// Initialize auth state listener
if (typeof window !== "undefined") {
  onAuthStateChanged(auth, async (fbUser) => {
    if (fbUser) {
      try {
        const token = await fbUser.getIdToken();
        const user = await fetchOrCreateFirestoreUser(fbUser);
        globalSessionUser = user;
        globalIsPending = false;
        notifyListeners();
        await syncSessionCookie(user, token);
      } catch (e) {
        console.error("Error setting up user session:", e);
        globalSessionUser = null;
        globalIsPending = false;
        notifyListeners();
      }
    } else {
      globalSessionUser = null;
      globalIsPending = false;
      notifyListeners();
      await syncSessionCookie(null);
    }
  });
}

export const authClient = {
  useSession: () => {
    const [user, setUser] = useState<User | null>(globalSessionUser);
    const [isPending, setIsPending] = useState<boolean>(globalIsPending);

    useEffect(() => {
      const handler = () => {
        setUser(globalSessionUser);
        setIsPending(globalIsPending);
      };
      listeners.add(handler);
      handler();
      return () => {
        listeners.delete(handler);
      };
    }, []);

    return {
      data: user ? { user } : null,
      isPending,
    };
  },

  signIn: {
    email: async (
      credentials: { email: string; password: string; fetchOptions?: FetchOptions },
      options?: FetchOptions
    ) => {
      const fetchOpts = credentials.fetchOptions || options;
      try {
        const cred = await signInWithEmailAndPassword(
          auth,
          credentials.email,
          credentials.password
        );
        const token = await cred.user.getIdToken();
        const user = await fetchOrCreateFirestoreUser(cred.user);
        globalSessionUser = user;
        globalIsPending = false;
        notifyListeners();
        await syncSessionCookie(user, token);

        fetchOpts?.onSuccess?.({ data: { user, token } });
        return { data: { user, token } };
      } catch (err: any) {
        const message = err?.message || "Failed to sign in.";
        fetchOpts?.onError?.({ error: { message } });
        throw err;
      }
    },
    social: async ({ provider = "google", callbackURL = "/" }: { provider?: string; callbackURL?: string }) => {
      try {
        const cred = await signInWithPopup(auth, googleProvider);
        const token = await cred.user.getIdToken();
        const user = await fetchOrCreateFirestoreUser(cred.user);
        globalSessionUser = user;
        globalIsPending = false;
        notifyListeners();
        await syncSessionCookie(user, token);
        return { data: { user, token } };
      } catch (err: any) {
        console.error("Google sign in error:", err);
        throw err;
      }
    },
  },

  signUp: {
    email: async (
      payload: {
        email: string;
        password: string;
        name: string;
        image?: string;
        role?: string;
      },
      options?: FetchOptions
    ) => {
      try {
        const cred = await createUserWithEmailAndPassword(
          auth,
          payload.email,
          payload.password
        );

        if (payload.name || payload.image) {
          await updateProfile(cred.user, {
            displayName: payload.name,
            photoURL: payload.image || "",
          });
        }

        const newUser: User = {
          id: cred.user.uid,
          _id: cred.user.uid,
          uid: cred.user.uid,
          name: payload.name || "Anonymous Reader",
          email: payload.email,
          image: payload.image || "",
          role: (payload.role as UserRole) || "user",
          createdAt: new Date().toISOString(),
        };

        try {
          const userRef = doc(db, "users", cred.user.uid);
          await setDoc(userRef, newUser);
        } catch (fsErr) {
          console.warn("Firestore user sync failed or offline:", fsErr);
        }

        const token = await cred.user.getIdToken();
        globalSessionUser = newUser;
        globalIsPending = false;
        notifyListeners();
        await syncSessionCookie(newUser, token);

        options?.onSuccess?.({ data: { user: newUser, token } });
        return { data: { user: newUser, token } };
      } catch (err: any) {
        const message = err?.message || "Failed to create account.";
        options?.onError?.({ error: { message } });
        throw err;
      }
    },
  },

  signOut: async (options?: { fetchOptions?: FetchOptions }) => {
    const fetchOpts = options?.fetchOptions;
    try {
      await firebaseSignOut(auth);
      globalSessionUser = null;
      globalIsPending = false;
      notifyListeners();
      await syncSessionCookie(null);
      fetchOpts?.onSuccess?.();
      return { success: true };
    } catch (err: any) {
      const message = err?.message || "Failed to sign out.";
      fetchOpts?.onError?.({ error: { message } });
      throw err;
    }
  },

  updateUser: async (updateData: { name?: string; image?: string }) => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("No active user logged in.");

      await updateProfile(currentUser, {
        displayName: updateData.name || currentUser.displayName,
        photoURL: updateData.image || currentUser.photoURL,
      });

      try {
        const userRef = doc(db, "users", currentUser.uid);
        const patchData: Partial<User> = {};
        if (updateData.name) patchData.name = updateData.name;
        if (updateData.image) patchData.image = updateData.image;

        await updateDoc(userRef, patchData);
      } catch (fsErr) {
        console.warn("Firestore updateUser skipped or offline:", fsErr);
      }

      const updatedUser: User = {
        ...globalSessionUser!,
        name: updateData.name || globalSessionUser?.name || "",
        image: updateData.image || globalSessionUser?.image || "",
      };

      globalSessionUser = updatedUser;
      notifyListeners();
      await syncSessionCookie(updatedUser);

      return { data: updatedUser };
    } catch (err: any) {
      return { error: { message: err?.message || "Failed to update profile." } };
    }
  },
};

export const { signIn, signUp, useSession, signOut } = authClient;
