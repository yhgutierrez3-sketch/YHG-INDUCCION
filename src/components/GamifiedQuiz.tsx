import React, { useState } from 'react';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RotateCcw, 
  Sparkles, 
  AlertCircle,
  HelpCircle,
  FileCheck2,
  Trophy
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { QUIZ_QUESTIONS } from '../data/quizQuestions';

interface GamifiedQuizProps {
  onQuizCompleted: (scorePercent: number, passed: boolean) => void;
  onNavigateToCertificate: () => void;
  bestScore: number;
  quizPassed: boolean;
}

export const GamifiedQuiz: React.FC<GamifiedQuizProps> = ({
  onQuizCompleted,
  onNavigateToCertificate,
  bestScore,
  quizPassed
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: number }>({});
  const [quizFinished, setQuizFinished] = useState(false);

  const currentQ = QUIZ_QUESTIONS[currentIdx];

  const handleSelect = (idx: number) => {
    if (isSubmitted) return;
    setSelectedAnswer(idx);
  };

  const handleConfirmAnswer = () => {
    if (selectedAnswer === null || isSubmitted) return;
    setIsSubmitted(true);
    setUserAnswers(prev => ({ ...prev, [currentIdx]: selectedAnswer }));

    if (selectedAnswer === currentQ.correctIndex) {
      confetti({
        particleCount: 35,
        spread: 50,
        origin: { y: 0.6 }
      });
    }
  };

  const handleNextQuestion = () => {
    if (currentIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelectedAnswer(null);
      setIsSubmitted(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    // Calculate final score
    let correctCount = 0;
    QUIZ_QUESTIONS.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctIndex) {
        correctCount++;
      }
    });

    const scorePercentage = Math.round((correctCount / QUIZ_QUESTIONS.length) * 100);
    const passed = scorePercentage >= 80;

    setQuizFinished(true);
    onQuizCompleted(scorePercentage, passed);

    if (passed) {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 }
      });
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedAnswer(null);
    setIsSubmitted(false);
    setUserAnswers({});
    setQuizFinished(false);
  };

  // If Quiz is finished, show the summary and certificate unlock card
  if (quizFinished) {
    let correctCount = 0;
    QUIZ_QUESTIONS.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctIndex) {
        correctCount++;
      }
    });
    const finalScore = Math.round((correctCount / QUIZ_QUESTIONS.length) * 100);
    const passed = finalScore >= 80;

    return (
      <div className="max-w-2xl mx-auto py-6 space-y-6">
        <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center shadow-sm space-y-5 backdrop-blur-xs">
          <div className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center shadow-xs bg-gradient-to-br from-[#39A900] to-[#247000] text-white">
            {passed ? <Trophy className="w-10 h-10" /> : <AlertCircle className="w-10 h-10 text-amber-300" />}
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#39A900]">
              Resultado de Evaluación de Inducción
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              {passed ? '¡Felicitaciones! Has Aprobado la Inducción' : 'Casi lo logras, refuerza tus conocimientos'}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-md mx-auto">
              {passed
                ? 'Has demostrado dominio cabal del Reglamento del Aprendiz SENA (Acuerdo 0009 de 2024).'
                : 'Para obtener tu certificación oficial necesitas un puntaje mínimo del 80%. Revisa los temas y vuelve a intentarlo.'}
            </p>
          </div>

          {/* Score Badge */}
          <div className="inline-flex items-baseline gap-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 px-6 py-3 rounded-2xl">
            <span className="text-4xl font-black text-slate-900 dark:text-white">{finalScore}%</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              ({correctCount} de {QUIZ_QUESTIONS.length} preguntas correctas)
            </span>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            {passed ? (
              <button
                onClick={onNavigateToCertificate}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#39A900] hover:bg-[#329400] text-white font-bold px-6 py-3 rounded-xl shadow-sm transition-all"
              >
                <FileCheck2 className="w-5 h-5" />
                <span>Generar Certificado Oficial SENA</span>
              </button>
            ) : null}

            <button
              onClick={handleRestart}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold px-5 py-3 rounded-xl transition-all text-sm"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Presentar Nuevamente la Trivia</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isCurrentCorrect = selectedAnswer === currentQ.correctIndex;

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-12">
      {/* Header Info */}
      <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs backdrop-blur-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#39A900] uppercase tracking-wider">
                Evaluación Gamificada
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 font-medium text-slate-600 dark:text-slate-300">
                Mínimo aprobatorio: 80%
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
              Trivia de Apropiación: Reglamento SENA
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Pregunta:</span>
            <span className="text-base font-extrabold text-[#39A900]">
              {currentIdx + 1} de {QUIZ_QUESTIONS.length}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mt-4">
          <div
            className="bg-[#39A900] h-full transition-all duration-300"
            style={{ width: `${((currentIdx + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6 backdrop-blur-xs">
        <div>
          <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
            Categoría: {currentQ.category.toUpperCase()}
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-snug">
            {currentQ.question}
          </h3>
        </div>

        {/* Options */}
        <div className="space-y-2.5">
          {currentQ.options.map((option, idx) => {
            const isSelected = selectedAnswer === idx;
            let btnClass = 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-800 dark:text-slate-200';

            if (isSelected && !isSubmitted) {
              btnClass = 'border-[#39A900] ring-2 ring-[#39A900]/20 bg-emerald-50/40 dark:bg-emerald-950/40 text-slate-900 dark:text-white font-medium';
            } else if (isSubmitted) {
              if (idx === currentQ.correctIndex) {
                btnClass = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-200 font-bold';
              } else if (isSelected && idx !== currentQ.correctIndex) {
                btnClass = 'border-rose-400 bg-rose-50 dark:bg-rose-950/60 text-rose-950 dark:text-rose-200';
              } else {
                btnClass = 'opacity-40 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400';
              }
            }

            return (
              <div
                key={idx}
                onClick={() => handleSelect(idx)}
                className={`p-3.5 sm:p-4 rounded-xl border text-xs sm:text-sm cursor-pointer transition-all flex items-center justify-between gap-3 ${btnClass}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-lg border flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    isSelected ? 'bg-[#39A900] text-white border-[#39A900]' : 'border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span className="leading-snug">{option}</span>
                </div>

                {isSubmitted && idx === currentQ.correctIndex && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                )}
                {isSubmitted && isSelected && idx !== currentQ.correctIndex && (
                  <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0" />
                )}
              </div>
            );
          })}
        </div>

        {/* Feedback Section */}
        {isSubmitted && (
          <div className={`p-4 rounded-xl border text-xs sm:text-sm space-y-1.5 ${
            isCurrentCorrect 
              ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200' 
              : 'bg-rose-50 dark:bg-rose-950/50 border-rose-300 dark:border-rose-800 text-rose-950 dark:text-rose-200'
          }`}>
            <div className="flex items-center gap-2 font-bold">
              {isCurrentCorrect ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>¡Respuesta Correcta!</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  <span>Respuesta Incorrecta</span>
                </>
              )}
            </div>
            <p className="leading-relaxed pl-6">{currentQ.justification}</p>
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 pl-6 pt-1 flex items-center gap-1">
              <span>📖 Fundamento:</span>
              <span className="text-slate-700 dark:text-slate-300">{currentQ.acuerdoRef}</span>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs text-slate-400 dark:text-slate-500">
            {isSubmitted ? 'Avanza a la siguiente pregunta.' : 'Selecciona una respuesta y pulsa Confirmar.'}
          </span>

          <div>
            {!isSubmitted ? (
              <button
                disabled={selectedAnswer === null}
                onClick={handleConfirmAnswer}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                  selectedAnswer !== null
                    ? 'bg-[#39A900] hover:bg-[#329400] text-white shadow-xs'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                }`}
              >
                Confirmar Respuesta
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-[#00324d] hover:bg-[#00273c] dark:bg-[#39A900] dark:hover:bg-[#329400] text-white shadow-xs transition-all"
              >
                <span>{currentIdx < QUIZ_QUESTIONS.length - 1 ? 'Siguiente Pregunta' : 'Finalizar y Calificar'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
