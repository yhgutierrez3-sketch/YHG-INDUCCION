import React from 'react';
import { 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  BookOpenCheck, 
  Scale, 
  Award, 
  Download, 
  Clock, 
  Users, 
  Target,
  FileText,
  BadgeAlert,
  Compass
} from 'lucide-react';
import { INDUCTION_MODULES_PLAN, SENA_VALUES } from '../data/regulationsData';
import { ApprenticeInfo } from '../types';

interface StructuredPlanProps {
  onNavigate: (tab: string) => void;
  apprentice: ApprenticeInfo;
  completedSections: string[];
  quizPassed: boolean;
  xp: number;
}

export const StructuredPlan: React.FC<StructuredPlanProps> = ({
  onNavigate,
  apprentice,
  completedSections,
  quizPassed,
  xp
}) => {
  const iconMap: Record<string, React.ReactNode> = {
    Sparkles: <Sparkles className="w-5 h-5 text-amber-500" />,
    ShieldCheck: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
    BookOpenCheck: <BookOpenCheck className="w-5 h-5 text-blue-600" />,
    Scale: <Scale className="w-5 h-5 text-indigo-600" />,
    Award: <Award className="w-5 h-5 text-yellow-600" />
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#00324d] via-[#00476e] to-[#00273c] text-white p-6 sm:p-8 shadow-md">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-80 h-80 fill-white">
            <circle cx="50" cy="22" r="10" />
            <path d="M50 38 L32 58 L42 58 L42 85 L58 85 L58 58 L68 58 Z" />
          </svg>
        </div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#39A900]/25 text-[#79dc45] text-xs font-semibold mb-4 border border-[#39A900]/40">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Plan Didáctico Institucional • Inducción Integral</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
            ¡Bienvenido(a) a la Gran Familia SENA, {apprentice.fullName.split(' ')[0]}!
          </h1>
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed mb-6">
            Este plan de inducción gamificado está diseñado para que conozcas de manera dinámica el{' '}
            <strong className="text-emerald-300 font-semibold">Acuerdo 0009 de noviembre de 2024</strong> (nuevo Reglamento del Aprendiz), 
            apropies tus <span className="underline decoration-emerald-400 font-medium">derechos</span> y <span className="underline decoration-emerald-400 font-medium">deberes</span>, 
            resuelvas dilemas del mundo real y certifiques oficialmente tu proceso de inducción.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('reglamento')}
              className="inline-flex items-center gap-2 bg-[#39A900] hover:bg-[#329400] text-white font-bold px-5 py-2.5 rounded-xl shadow-sm transition-all transform active:scale-95 text-sm"
            >
              <span>Explorar Reglamento 2024</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('casos')}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-2.5 rounded-xl border border-white/20 transition-all text-sm backdrop-blur-xs"
            >
              <Target className="w-4 h-4 text-amber-300" />
              <span>Simulador de Casos</span>
            </button>
            {quizPassed && (
              <button
                onClick={() => onNavigate('certificado')}
                className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold px-4 py-2.5 rounded-xl transition-all text-sm shadow-sm"
              >
                <Award className="w-4 h-4 text-slate-900" />
                <span>Ver Mi Certificado Oficial</span>
              </button>
            )}
          </div>
        </div>

        {/* Current Apprentice Meta Ribbon */}
        <div className="mt-6 pt-5 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Programa:</span>
            <span className="font-semibold text-white truncate block">{apprentice.programName}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Ficha de Formación:</span>
            <span className="font-semibold text-white">{apprentice.fichaNumber}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Regional:</span>
            <span className="font-semibold text-white truncate block">{apprentice.regional}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Estado de Inducción:</span>
            <span className={`font-semibold inline-flex items-center gap-1 ${quizPassed ? 'text-emerald-300' : 'text-amber-300'}`}>
              {quizPassed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
              {quizPassed ? 'Aprobada (Certificada)' : 'En Progreso (Fase Activa)'}
            </span>
          </div>
        </div>
      </div>

      {/* Structured Roadmap Timeline */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-[#39A900]" />
              Ruta Estructurada de Inducción (5 Pasos Clave)
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              Sigue la secuencia metodológica diseñada por el SENA para garantizar tu éxito en las etapas lectiva y productiva.
            </p>
          </div>
          <div className="text-right hidden sm:block">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Progreso Total:</span>
            <div className="text-base font-extrabold text-[#39A900]">
              {quizPassed ? '100% Completado' : `${Math.min(90, Math.round((xp / 350) * 100))}%`}
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          {INDUCTION_MODULES_PLAN.map((mod, index) => {
            const isCompleted = index === 0 || (index === 4 ? quizPassed : completedSections.includes(String(index)));
            return (
              <div 
                key={mod.step}
                className="bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 rounded-xl p-5 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-2xs hover:shadow-xs group backdrop-blur-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                      {iconMap[mod.icon] || <FileText className="w-5 h-5 text-slate-600 dark:text-slate-300" />}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-[#39A900] uppercase tracking-wider">
                          Paso {mod.step}
                        </span>
                        <span className="text-slate-300 dark:text-slate-600">•</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{mod.duration}</span>
                        {isCompleted && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                            Completado
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-[#00324d] dark:group-hover:text-[#6ee236] transition-colors">
                        {mod.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {mod.description}
                      </p>

                      <div className="pt-2">
                        <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Resultados Clave del Paso:</div>
                        <ul className="grid sm:grid-cols-2 gap-1 text-xs text-slate-600 dark:text-slate-400">
                          {mod.keyObjectives.map((obj, i) => (
                            <li key={i} className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#39A900]"></span>
                              <span>{obj}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="sm:self-center flex-shrink-0">
                    <button
                      onClick={() => {
                        if (mod.step === 1 || mod.step === 2 || mod.step === 3 || mod.step === 4) {
                          onNavigate('reglamento');
                        } else if (mod.step === 5) {
                          onNavigate('quiz');
                        }
                      }}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 text-xs font-bold px-4 py-2 rounded-lg bg-slate-100 hover:bg-[#39A900] text-slate-700 hover:text-white dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-[#39A900] dark:hover:text-white transition-all"
                    >
                      <span>{mod.step === 5 ? 'Presentar Reto' : 'Estudiar Paso'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Institutional Values & SENA Ethos */}
      <section className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 backdrop-blur-xs">
        <div className="max-w-2xl mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#39A900]">Identidad & Principios</span>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Pilares Éticos del Aprendiz SENA</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Valores universales consagrados en el Acuerdo 0009 de 2024 para la formación de ciudadanos integrales y solidarios.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {SENA_VALUES.map((v, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-800/80 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
              <div className="w-6 h-6 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-[#39A900] dark:text-[#6ee236] flex items-center justify-center font-bold text-xs mb-2">
                0{idx + 1}
              </div>
              <h4 className="font-bold text-xs text-slate-900 dark:text-white mb-1">{v.title}</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">{v.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Regulation Updates 2024 Highlight Card */}
      <section className="bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 rounded-2xl p-5 sm:p-6 backdrop-blur-xs">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
            <BadgeAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-amber-950 dark:text-amber-200 text-base">
              ¿Qué cambió con el reciente Acuerdo 0009 de 2024?
            </h3>
            <p className="text-xs sm:text-sm text-amber-900/90 dark:text-amber-300/90 mt-1 leading-relaxed">
              El Consejo Directivo Nacional modernizó el reglamento histórico (Acuerdo 007 de 2012) para responder a los desafíos contemporáneos:
            </p>
            <div className="grid sm:grid-cols-3 gap-3 mt-3 text-xs">
              <div className="bg-white/80 dark:bg-slate-900/80 p-2.5 rounded-lg border border-amber-200/80 dark:border-amber-800/40">
                <strong className="block text-slate-900 dark:text-white mb-0.5">🌐 Transformación Digital & IA</strong>
                <span className="text-slate-600 dark:text-slate-300">Regula expresamente el uso de Inteligencia Artificial y herramientas virtuales con rigor ético y citación.</span>
              </div>
              <div className="bg-white/80 dark:bg-slate-900/80 p-2.5 rounded-lg border border-amber-200/80 dark:border-amber-800/40">
                <strong className="block text-slate-900 dark:text-white mb-0.5">⚖️ Debido Proceso y Plazos</strong>
                <span className="text-slate-600 dark:text-slate-300">Reitera con firmeza los 3 días hábiles para justificar inasistencias y 8 días hábiles para evaluar evidencias.</span>
              </div>
              <div className="bg-white/80 dark:bg-slate-900/80 p-2.5 rounded-lg border border-amber-200/80 dark:border-amber-800/40">
                <strong className="block text-slate-900 dark:text-white mb-0.5">🤝 Convivencia y Diversidad</strong>
                <span className="text-slate-600 dark:text-slate-300">Mecanismos reforzados de prevención contra ciberacoso, no discriminación y enfoque integral de género.</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
