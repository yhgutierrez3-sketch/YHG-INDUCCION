import React, { useState } from 'react';
import { ShieldCheck, Lock, X, LogIn, AlertCircle } from 'lucide-react';
import { googleSignIn } from '../services/googleAuth';
import { User } from 'firebase/auth';

interface InstructorAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user?: User | null) => void;
}

export const InstructorAuthModal: React.FC<InstructorAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  if (!isOpen) return null;

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const cleaned = pin.trim();
    if (cleaned === 'Sena1234' || cleaned.toLowerCase() === 'sena1234' || cleaned.toUpperCase() === 'SENA2024') {
      sessionStorage.setItem('sena_instructor_auth', 'true');
      onSuccess();
      onClose();
    } else {
      setError('Código de acceso incorrecto. Por favor verifica e intenta de nuevo.');
    }
  };

  const handleGoogleAuth = async () => {
    try {
      setIsGoogleLoading(true);
      setError(null);
      const result = await googleSignIn(true);
      if (result) {
        sessionStorage.setItem('sena_instructor_auth', 'true');
        onSuccess(result.user);
        onClose();
      }
    } catch (err: any) {
      if (!err.message?.includes('popup-closed-by-user')) {
        setError(err.message || 'Error al iniciar sesión con Google');
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-7 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#00324d] text-white flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-6 h-6 text-[#39A900]" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                Portal del Instructor
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Consola de Seguimiento y Gestión SENA
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 rounded-xl flex items-center gap-2.5 text-xs text-rose-800 dark:text-rose-300">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600 dark:text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* PIN Form */}
        <form onSubmit={handlePinSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Ingresa el PIN de Acceso Institucional
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Ingresa tu clave de acceso"
                autoFocus
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#39A900]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-[#00324d] hover:bg-[#00253a] text-white font-bold rounded-xl text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogIn className="w-4 h-4 text-[#39A900]" />
            <span>Ingresar con PIN Institucional</span>
          </button>
        </form>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-200 dark:border-slate-800 w-full"></div>
          <span className="bg-white dark:bg-slate-900 px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider absolute">
            O también
          </span>
        </div>

        {/* Google Login for Instructor */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={isGoogleLoading}
            className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 font-semibold border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
            </svg>
            <span>{isGoogleLoading ? 'Verificando...' : 'Acceder con Cuenta de Google'}</span>
          </button>
          <p className="text-[10px] text-center text-slate-400">
            Vincula tu cuenta para sincronizar automáticamente la hoja de Google Sheets en tu Drive.
          </p>
        </div>

      </div>
    </div>
  );
};
