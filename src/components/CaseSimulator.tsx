import React, { useState } from 'react';
import { 
  Zap, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RotateCcw, 
  Award, 
  HelpCircle,
  Sparkles,
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SCENARIO_CASES } from '../data/scenariosData';

interface CaseSimulatorProps {
  onCaseCompleted: (caseId: string, earnedXp: number) => void;
  completedCases: string[];
}

export const CaseSimulator: React.FC<CaseSimulatorProps> = ({
  onCaseCompleted,
  completedCases
}) => {
  const [currentCaseIndex, setCurrentCaseIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);

  const activeCase = SCENARIO_CASES[currentCaseIndex];

  const handleSelectOption = (optionId: string) => {
    if (isAnswerSubmitted) return;
    setSelectedOptionId(optionId);
  };

  const handleSubmitAnswer = () => {
    if (!selectedOptionId || isAnswerSubmitted) return;

    setIsAnswerSubmitted(true);
    const chosen = activeCase.options.find(o => o.id === selectedOptionId);
    if (chosen && chosen.isCorrect) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
      onCaseCompleted(activeCase.id, chosen.points);
    } else if (chosen) {
      onCaseCompleted(activeCase.id, 10); // small participation XP
    }
  };

  const handleNextCase = () => {
    setSelectedOptionId(null);
    setIsAnswerSubmitted(false);
    if (currentCaseIndex < SCENARIO_CASES.length - 1) {
      setCurrentCaseIndex(currentCaseIndex + 1);
    }
  };

  const handleSelectDirectCase = (index: number) => {
    setCurrentCaseIndex(index);
    setSelectedOptionId(null);
    setIsAnswerSubmitted(false);
  };

  const selectedOption = activeCase.options.find(o => o.id === selectedOptionId);

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Intro Header */}
      <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs backdrop-blur-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-xs font-bold mb-2 border border-amber-200 dark:border-amber-900/60">
              <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>Dilemas Éticos & Situaciones Reales en el Ambiente SENA</span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Simulador de Decisiones del Aprendiz
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
              Pon a prueba cómo actuarías ante situaciones comunes en talleres, plataformas virtuales y comités evaluadores.
            </p>
          </div>

          <div className="flex-shrink-0 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 p-3 rounded-xl text-center min-w-[140px]">
            <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 uppercase block">Completados</span>
            <span className="text-xl font-extrabold text-[#39A900]">
              {completedCases.length} / {SCENARIO_CASES.length}
            </span>
            <span className="text-[10px] text-emerald-700 dark:text-emerald-400 block">+50 XP por acierto</span>
          </div>
        </div>

        {/* Stepper Tabs */}
        <div className="flex gap-2 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 overflow-x-auto pb-1 scrollbar-none">
          {SCENARIO_CASES.map((sc, idx) => {
            const isDone = completedCases.includes(sc.id);
            const isCurrent = idx === currentCaseIndex;
            return (
              <button
                key={sc.id}
                onClick={() => handleSelectDirectCase(idx)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isCurrent
                    ? 'bg-[#39A900] text-white shadow-2xs'
                    : isDone
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <span>Caso {idx + 1}</span>
                {isDone && <CheckCircle2 className={`w-3.5 h-3.5 ${isCurrent ? 'text-white' : 'text-emerald-600 dark:text-emerald-400'}`} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Dilemma Card */}
      <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6 backdrop-blur-xs">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span className="font-bold text-[#00324d] dark:text-[#6ee236] uppercase tracking-wider">
              Caso {currentCaseIndex + 1} de {SCENARIO_CASES.length}
            </span>
            <span className="capitalize px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-medium text-slate-700 dark:text-slate-300">
              Eje: {activeCase.category}
            </span>
          </div>

          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            {activeCase.title}
          </h3>

          <div className="bg-slate-50 dark:bg-slate-800/60 border-l-4 border-[#39A900] p-4 rounded-r-xl text-xs sm:text-sm text-slate-700 dark:text-slate-200 space-y-2">
            <p>
              <strong className="text-slate-900 dark:text-white">Contexto:</strong> {activeCase.context}
            </p>
            <p>
              <strong className="text-slate-900 dark:text-white">Dilema:</strong> {activeCase.problem}
            </p>
          </div>
        </div>

        {/* Options List */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            ¿Cómo debe actuar el aprendiz según el Reglamento (Acuerdo 0009 de 2024)?
          </h4>

          {activeCase.options.map((option) => {
            const isSelected = selectedOptionId === option.id;
            let optionStyles = 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 text-slate-800 dark:text-slate-200';

            if (isSelected && !isAnswerSubmitted) {
              optionStyles = 'border-[#39A900] ring-2 ring-[#39A900]/20 bg-emerald-50/40 dark:bg-emerald-950/40 text-slate-900 dark:text-white';
            } else if (isAnswerSubmitted) {
              if (option.isCorrect) {
                optionStyles = 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-200 font-medium';
              } else if (isSelected && !option.isCorrect) {
                optionStyles = 'border-rose-400 bg-rose-50 dark:bg-rose-950/60 text-rose-950 dark:text-rose-200';
              } else {
                optionStyles = 'opacity-50 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400';
              }
            }

            return (
              <div
                key={option.id}
                onClick={() => handleSelectOption(option.id)}
                className={`p-4 rounded-xl border text-xs sm:text-sm cursor-pointer transition-all flex items-start gap-3 ${optionStyles}`}
              >
                <div className="mt-0.5 flex-shrink-0">
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-[11px] font-bold ${
                    isSelected ? 'bg-[#39A900] text-white border-[#39A900]' : 'border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400'
                  }`}>
                    {option.id.split('-')[1].toUpperCase()}
                  </div>
                </div>
                <div className="flex-1 leading-relaxed">
                  {option.text}
                </div>
                {isAnswerSubmitted && option.isCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                )}
                {isAnswerSubmitted && isSelected && !option.isCorrect && (
                  <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0" />
                )}
              </div>
            );
          })}
        </div>

        {/* Explanation and Feedback Alert */}
        {isAnswerSubmitted && selectedOption && (
          <div className={`p-4 rounded-xl border transition-all text-xs sm:text-sm space-y-1.5 ${
            selectedOption.isCorrect 
              ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200' 
              : 'bg-rose-50 dark:bg-rose-950/50 border-rose-300 dark:border-rose-800 text-rose-950 dark:text-rose-200'
          }`}>
            <div className="flex items-center gap-2 font-bold text-sm">
              {selectedOption.isCorrect ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span>¡Excelente Decisión! (+{selectedOption.points} XP)</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                  <span>Respuesta no conforme al reglamento (+10 XP de participación)</span>
                </>
              )}
            </div>
            <p className="leading-relaxed pl-7">{selectedOption.explanation}</p>
          </div>
        )}

        {/* Action Controls */}
        <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {isAnswerSubmitted 
              ? 'Revisa la retroalimentación jurídica antes de avanzar.' 
              : 'Selecciona la opción más idónea y haz clic en Validar Decisión.'}
          </div>

          <div className="flex items-center gap-2">
            {!isAnswerSubmitted ? (
              <button
                disabled={!selectedOptionId}
                onClick={handleSubmitAnswer}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                  selectedOptionId
                    ? 'bg-[#39A900] hover:bg-[#329400] text-white shadow-xs'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                }`}
              >
                Validar Decisión
              </button>
            ) : (
              <button
                onClick={handleNextCase}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-[#00324d] hover:bg-[#00273c] dark:bg-[#39A900] dark:hover:bg-[#329400] text-white shadow-xs transition-all"
              >
                <span>{currentCaseIndex < SCENARIO_CASES.length - 1 ? 'Siguiente Caso' : 'Finalizar Simulador'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
