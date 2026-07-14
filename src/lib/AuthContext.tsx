import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
  type User,
} from "./firebase";

interface AuthContextType {
  firebaseUser: User | null;
  isLoading: boolean;
  register: (
    email: string,
    password: string,
    fullName?: string
  ) => Promise<{ success: boolean; message: string }>;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; message: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const register = useCallback(
    async (email: string, password: string, fullName?: string) => {
      try {
        const cred = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        if (fullName) {
          await updateProfile(cred.user, { displayName: fullName });
        }
        return { success: true, message: "Account created successfully" };
      } catch (err: any) {
        const message =
          err.code === "auth/email-already-in-use"
            ? "Email already registered"
            : err.code === "auth/weak-password"
            ? "Password must be at least 6 characters"
            : err.message;
        return { success: false, message };
      }
    },
    []
  );

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        return { success: true, message: "Logged in successfully" };
      } catch (err: any) {
        const message =
          err.code === "auth/user-not-found"
            ? "No account found with this email"
            : err.code === "auth/wrong-password"
            ? "Incorrect password"
            : err.code === "auth/invalid-credential"
            ? "Invalid email or password"
            : err.message;
        return { success: false, message };
      }
    },
    []
  );

  const loginWithGoogle = useCallback(async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      return { success: true, message: "Signed in with Google" };
    } catch (err: any) {
      const message =
        err.code === "auth/popup-closed-by-user"
          ? "Sign-in popup was closed"
          : err.message;
      return { success: false, message };
    }
  }, []);

  const logout = useCallback(async () => {
    await signOut(auth);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        isLoading,
        register,
        login,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
