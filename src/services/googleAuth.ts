import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  User, 
  signOut 
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Ensure Firebase is initialized only once
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

// Google Workspace Scopes
export const WORKSPACE_SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive.file'
];

const createGoogleProvider = (forceConsent = true) => {
  const provider = new GoogleAuthProvider();
  WORKSPACE_SCOPES.forEach(scope => provider.addScope(scope));
  provider.setCustomParameters({
    prompt: forceConsent ? 'select_account consent' : 'select_account',
    access_type: 'offline'
  });
  return provider;
};

// In-memory token cache (never stored in localStorage)
let cachedAccessToken: string | null = null;
let isSigningIn = false;

// Initialize auth state listener
export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const formatAuthErrorMessage = (error: any): { text: string; isUserCancellation: boolean } => {
  const code = error?.code || '';
  const message = error?.message || '';

  if (code === 'auth/popup-closed-by-user' || message.includes('popup-closed-by-user')) {
    return {
      text: 'La ventana de inicio de sesión de Google se cerró antes de completar la autorización. Haz clic en "Reintentar" para abrirla nuevamente.',
      isUserCancellation: true
    };
  }
  if (code === 'auth/popup-blocked' || message.includes('popup-blocked')) {
    return {
      text: 'Tu navegador bloqueó la ventana emergente de Google. Por favor autoriza los pop-ups para esta página en la barra de direcciones y reintenta.',
      isUserCancellation: false
    };
  }
  if (code === 'auth/cancelled-popup-request' || message.includes('cancelled-popup-request')) {
    return {
      text: 'Se canceló la solicitud anterior de Google. Puedes intentar conectar de nuevo.',
      isUserCancellation: true
    };
  }
  if (code === 'auth/network-request-failed' || message.includes('network-request-failed')) {
    return {
      text: 'Error de conexión de red al contactar los servidores de Google. Verifica tu conexión a internet.',
      isUserCancellation: false
    };
  }
  return {
    text: error?.message || 'Error al conectar con la cuenta de Google.',
    isUserCancellation: false
  };
};

// Sign in with Google Popup (forces consent by default to ensure all Workspace scopes are approved)
export const googleSignIn = async (forceConsent = true): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const provider = createGoogleProvider(forceConsent);
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('No se pudo obtener el token de acceso de Google con los permisos de Sheets.');
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Error al iniciar sesión con Google:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

// Re-authenticate Google account with forced consent to update scopes
export const reauthenticateGoogle = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    await signOut(auth);
  } catch (err) {
    console.warn('Error al desloguear antes de re-autenticar:', err);
  }
  cachedAccessToken = null;
  return await googleSignIn(true);
};

// Access token getter
export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

// Set token in memory (if obtained via direct credential)
export const setCachedAccessToken = (token: string | null) => {
  cachedAccessToken = token;
};

// Logout
export const logoutGoogle = async () => {
  try {
    await signOut(auth);
  } finally {
    cachedAccessToken = null;
  }
};
