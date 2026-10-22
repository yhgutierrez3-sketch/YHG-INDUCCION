/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { StructuredPlan } from './components/StructuredPlan';
import { RegulationExplorer } from './components/RegulationExplorer';
import { CaseSimulator } from './components/CaseSimulator';
import { GamifiedQuiz } from './components/GamifiedQuiz';
import { CertificateView } from './components/CertificateView';
import { VirtualTutor } from './components/VirtualTutor';
import { UserProfileModal } from './components/UserProfileModal';
import { GoogleDriveSyncModal } from './components/GoogleDriveSyncModal';
import { InstructorDashboard } from './components/InstructorDashboard';
import { InstructorAuthModal } from './components/InstructorAuthModal';
import { RoleSelectionLanding } from './components/RoleSelectionLanding';
import { INITIAL_APPRENTICE, INITIAL_BADGES } from './data/defaultData';
import { ApprenticeInfo, BadgeItem, UserRole } from './types';
import { initAuth } from './services/googleAuth';
import { saveApprenticeToRegistry } from './services/apprenticeRegistry';
import { User } from 'firebase/auth';
import confetti from 'canvas-confetti';

export default function App() {
  // Active Role in the prototype (null = show RoleSelectionLanding page)
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isInstructorAuthOpen, setIsInstructorAuthOpen] = useState(false);

  // Navigation
  const [activeTab, setActiveTab] = useState<string>('plan');

  // Apprentice Profile
  const [apprentice, setApprentice] = useState<ApprenticeInfo>(() => {
    const saved = localStorage.getItem('sena_apprentice_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_APPRENTICE;
  });

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isDriveModalOpen, setIsDriveModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Initialize Firebase Auth listener
  useEffect(() => {
    const unsubscribe = initAuth(
      (user) => {
        setCurrentUser(user);
      },
      () => {
        setCurrentUser(null);
      }
    );
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  // Check URL parameters for share links (?role=aprendiz&ficha=123456&programa=...)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const fichaParam = params.get('ficha');
      const programaParam = params.get('programa');

      if (fichaParam || programaParam) {
        setApprentice(prev => ({
          ...prev,
          fichaNumber: fichaParam || prev.fichaNumber,
          programName: programaParam || prev.programName
        }));
      }
    }
  }, []);

  // Gamification State
  const [xp, setXp] = useState<number>(() => {
    const saved = localStorage.getItem('sena_xp');
    return saved ? parseInt(saved, 10) : 50; // starts with initial 50 XP
  });

  const [readArticles, setReadArticles] = useState<string[]>(() => {
    const saved = localStorage.getItem('sena_read_articles');
    return saved ? JSON.parse(saved) : ['der-1'];
  });

  const [completedCases, setCompletedCases] = useState<string[]>(() => {
    const saved = localStorage.getItem('sena_completed_cases');
    return saved ? JSON.parse(saved) : [];
  });

  const [quizScore, setQuizScore] = useState<number>(() => {
    const saved = localStorage.getItem('sena_quiz_score');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [quizPassed, setQuizPassed] = useState<boolean>(() => {
    const saved = localStorage.getItem('sena_quiz_passed');
    return saved === 'true';
  });

  const [certificateCode, setCertificateCode] = useState<string>(() => {
    const saved = localStorage.getItem('sena_cert_code');
    if (saved) return saved;
    const randomHex = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `SENA-IND-2024-${randomHex}-REG`;
  });

  const [completionDate, setCompletionDate] = useState<string | null>(() => {
    return localStorage.getItem('sena_completion_date');
  });

  const [badges, setBadges] = useState<BadgeItem[]>(INITIAL_BADGES);

  // Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('sena_dark_mode');
    if (saved !== null) return saved === 'true';
    return typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [isScreenBlurActive, setIsScreenBlurActive] = useState<boolean>(false);

  // Toggle Dark Mode with Screen Blur Effect
  const toggleDarkMode = () => {
    const nextMode = !isDarkMode;
    setIsDarkMode(nextMode);
    localStorage.setItem('sena_dark_mode', nextMode.toString());

    // Trigger visual screen blur effect
    setIsScreenBlurActive(true);
    setTimeout(() => {
      setIsScreenBlurActive(false);
    }, 750);
  };

  // Sync dark class on <html>
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Compute Level
  const currentLevel = Math.max(1, Math.floor(xp / 100) + 1);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('sena_apprentice_profile', JSON.stringify(apprentice));
  }, [apprentice]);

  useEffect(() => {
    localStorage.setItem('sena_xp', xp.toString());
  }, [xp]);

  useEffect(() => {
    localStorage.setItem('sena_read_articles', JSON.stringify(readArticles));
  }, [readArticles]);

  useEffect(() => {
    localStorage.setItem('sena_completed_cases', JSON.stringify(completedCases));
  }, [completedCases]);

  useEffect(() => {
    localStorage.setItem('sena_quiz_score', quizScore.toString());
    localStorage.setItem('sena_quiz_passed', quizPassed ? 'true' : 'false');
    if (certificateCode) localStorage.setItem('sena_cert_code', certificateCode);
    if (completionDate) localStorage.setItem('sena_completion_date', completionDate);
  }, [quizScore, quizPassed, certificateCode, completionDate]);

  // Update unlocked badges dynamically
  useEffect(() => {
    setBadges(prev => prev.map(b => {
      if (b.id === 'badge-derechos' && readArticles.filter(id => id.startsWith('der-')).length >= 4) {
        return { ...b, unlocked: true };
      }
      if (b.id === 'badge-deberes' && readArticles.filter(id => id.startsWith('deb-')).length >= 3) {
        return { ...b, unlocked: true };
      }
      if (b.id === 'badge-casos' && completedCases.length >= 3) {
        return { ...b, unlocked: true };
      }
      if (b.id === 'badge-maestro' && quizPassed) {
        return { ...b, unlocked: true };
      }
      return b;
    }));
  }, [readArticles, completedCases, quizPassed]);

  // Article reading handler
  const handleArticleRead = (articleId: string) => {
    if (!readArticles.includes(articleId)) {
      setReadArticles(prev => [...prev, articleId]);
      setXp(prev => prev + 15);
    }
  };

  // Case completion handler
  const handleCaseCompleted = (caseId: string, earnedXp: number) => {
    if (!completedCases.includes(caseId)) {
      setCompletedCases(prev => [...prev, caseId]);
      setXp(prev => prev + earnedXp);
    }
  };

  // Quiz completion handler with AUTOMATIC BACKGROUND SYNC
  const handleQuizCompleted = (scorePercent: number, passed: boolean) => {
    setQuizScore(scorePercent);
    setQuizPassed(passed);
    if (passed) {
      setXp(prev => prev + 120);
      const today = new Date().toLocaleDateString('es-CO', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
      setCompletionDate(today);
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.4 }
      });

      // Automatic persistence in central apprentice registry & silent Google Sheets background sync
      saveApprenticeToRegistry(apprentice, scorePercent, passed, certificateCode, today);
    }
  };

  const unlockedCount = badges.filter(b => b.unlocked).length;

  // Show Institutional Role Selection Landing Page if no role selected
  if (!selectedRole) {
    return (
      <RoleSelectionLanding
        onSelectAprendiz={(apprenticeData) => {
          setApprentice(apprenticeData);
          setSelectedRole('aprendiz');
          setActiveTab('plan');
        }}
        onSelectInstructor={(googleUser) => {
          setSelectedRole('instructor');
          setActiveTab('instructor_dashboard');
          if (googleUser) setCurrentUser(googleUser);
        }}
        initialApprenticeData={apprentice}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#070e17] text-slate-800 dark:text-slate-100 transition-colors duration-300 relative selection:bg-[#39a900]/30 selection:text-white">
      {/* Full-Screen Blur Transition Flash Effect */}
      {isScreenBlurActive && (
        <div 
          className="fixed inset-0 z-50 pointer-events-none animate-screen-blur bg-slate-900/15 backdrop-blur-md"
          aria-hidden="true"
        />
      )}

      {/* Subtle Ambient Glows in Dark Mode */}
      <div className="hidden dark:block absolute top-0 left-1/4 w-96 h-96 bg-[#39A900]/8 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="hidden dark:block absolute top-1/3 right-10 w-96 h-96 bg-blue-600/8 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Header with Nav, Stats & Top-Right Dark Mode Toggle */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        apprentice={apprentice}
        xp={xp}
        level={currentLevel}
        quizPassed={quizPassed}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        unlockedBadgesCount={unlockedCount}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        currentUser={currentUser}
        onOpenDriveSync={() => setIsDriveModalOpen(true)}
        userRole={selectedRole}
        onOpenInstructorAuth={() => setIsInstructorAuthOpen(true)}
        onSwitchToAprendiz={() => {
          setSelectedRole('aprendiz');
          setActiveTab('plan');
        }}
        onReturnToLanding={() => setSelectedRole(null)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Instructor Dashboard View */}
        {activeTab === 'instructor_dashboard' && selectedRole === 'instructor' && (
          <InstructorDashboard
            onBackToApprenticeView={() => {
              setSelectedRole('aprendiz');
              setActiveTab('plan');
            }}
            currentUser={currentUser}
            onOpenDriveModal={() => setIsDriveModalOpen(true)}
            onReturnToLanding={() => setSelectedRole(null)}
          />
        )}

        {activeTab === 'plan' && (
          <StructuredPlan
            onNavigate={(tab) => setActiveTab(tab)}
            apprentice={apprentice}
            completedSections={['0', readArticles.length >= 5 ? '1' : '', completedCases.length >= 2 ? '2' : '']}
            quizPassed={quizPassed}
            xp={xp}
          />
        )}

        {activeTab === 'reglamento' && (
          <RegulationExplorer
            onArticleRead={handleArticleRead}
            readArticles={readArticles}
          />
        )}

        {activeTab === 'casos' && (
          <CaseSimulator
            onCaseCompleted={handleCaseCompleted}
            completedCases={completedCases}
          />
        )}

        {activeTab === 'quiz' && (
          <GamifiedQuiz
            onQuizCompleted={handleQuizCompleted}
            onNavigateToCertificate={() => setActiveTab('certificado')}
            bestScore={quizScore}
            quizPassed={quizPassed}
          />
        )}

        {activeTab === 'certificado' && (
          <CertificateView
            apprentice={apprentice}
            quizPassed={quizPassed}
            score={quizScore || 100}
            certificateCode={certificateCode}
            completionDate={completionDate}
            onOpenProfile={() => setIsProfileModalOpen(true)}
            onNavigateToQuiz={() => setActiveTab('quiz')}
            onOpenDriveSync={() => setIsDriveModalOpen(true)}
            isInstructorView={selectedRole === 'instructor'}
          />
        )}

        {activeTab === 'tutor' && (
          <VirtualTutor />
        )}
      </main>

      {/* Profile Config Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        apprentice={apprentice}
        onSave={(updated) => {
          setApprentice(updated);
          if (quizPassed) {
            saveApprenticeToRegistry(updated, quizScore, quizPassed, certificateCode, completionDate);
          }
        }}
      />

      {/* Google Drive & Google Sheets Cloud Storage Modal */}
      <GoogleDriveSyncModal
        isOpen={isDriveModalOpen}
        onClose={() => setIsDriveModalOpen(false)}
        apprentice={apprentice}
        quizScore={quizScore}
        quizPassed={quizPassed}
        certificateCode={certificateCode}
        completionDate={completionDate}
        currentUser={currentUser}
        onUserChange={(user) => setCurrentUser(user)}
      />

      {/* Instructor PIN / Google Auth Modal */}
      <InstructorAuthModal
        isOpen={isInstructorAuthOpen}
        onClose={() => setIsInstructorAuthOpen(false)}
        onSuccess={(googleUser) => {
          setSelectedRole('instructor');
          setActiveTab('instructor_dashboard');
          if (googleUser) setCurrentUser(googleUser);
        }}
      />

      {/* Footer */}
      <footer className="no-print bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6 mt-auto transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[#39A900]"></div>
            <span className="font-semibold text-slate-700 dark:text-slate-300">Servicio Nacional de Aprendizaje SENA</span>
            <span>•</span>
            <span>Reglamento del Aprendiz (Acuerdo 0009 de 2024)</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400 dark:text-slate-500">
            <span>Formación Profesional Integral</span>
            <span>•</span>
            <button
              onClick={() => setSelectedRole(null)}
              className="text-slate-500 hover:text-[#39A900] dark:text-slate-400 dark:hover:text-[#6ee236] transition-colors font-semibold cursor-pointer"
            >
              Cambiar de Rol (Inicio)
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
