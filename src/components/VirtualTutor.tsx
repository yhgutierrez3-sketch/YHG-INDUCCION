import React, { useState } from 'react';
import { 
  HelpCircle, 
  Search, 
  Send, 
  Bot, 
  User, 
  BookOpen, 
  Sparkles, 
  Lightbulb, 
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { FAQ_ITEMS } from '../data/defaultData';
import { REGULATION_ARTICLES } from '../data/regulationsData';

export const VirtualTutor: React.FC = () => {
  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'user' | 'bot'; text: string; reference?: string }>>([
    {
      sender: 'bot',
      text: '¡Hola, aprendiz! Soy tu orientador virtual del Reglamento SENA (Acuerdo 0009 de 2024). ¿Tienes dudas sobre tus derechos, deberes, cómo radicar una incapacidad o trámites de aplazamiento? Selecciona una pregunta frecuente o escríbeme directamente.',
      reference: 'Acuerdo 0009 de 2024'
    }
  ]);

  const handleAskQuestion = (questionText: string) => {
    if (!questionText.trim()) return;

    const userMsg = { sender: 'user' as const, text: questionText };
    setChatHistory(prev => [...prev, userMsg]);
    setQuery('');

    // Process answer based on FAQ or Regulation knowledge base
    setTimeout(() => {
      const lower = questionText.toLowerCase();

      // Check direct FAQ match
      const faqMatch = FAQ_ITEMS.find(f => 
        lower.includes('acuerdo') && f.q.toLowerCase().includes('acuerdo') ||
        lower.includes('incapacidad') && f.q.toLowerCase().includes('incapacidad') ||
        lower.includes('falto') && f.q.toLowerCase().includes('falto') ||
        lower.includes('deserción') && f.q.toLowerCase().includes('falto') ||
        lower.includes('ia') && f.q.toLowerCase().includes('chatgpt') ||
        lower.includes('comité') && f.q.toLowerCase().includes('comité') ||
        lower.includes('certificado') && f.q.toLowerCase().includes('certificado')
      );

      // Check Regulation articles
      const articleMatch = REGULATION_ARTICLES.find(a => 
        lower.includes(a.title.toLowerCase()) || 
        a.details.some(d => lower.split(' ').some(w => w.length > 4 && d.toLowerCase().includes(w)))
      );

      let botResponse = '';
      let ref = 'Acuerdo 0009 de 2024';

      if (faqMatch) {
        botResponse = faqMatch.a;
        ref = 'Preguntas Frecuentes de Inducción SENA';
      } else if (articleMatch) {
        botResponse = `${articleMatch.summary} ${articleMatch.practicalTip}`;
        ref = `${articleMatch.chapter} - ${articleMatch.title}`;
      } else if (lower.includes('etapa productiva') || lower.includes('contrato')) {
        botResponse = 'Para la Etapa Productiva, el SENA ofrece alternativas como: Contrato de Aprendizaje, Vínculo Laboral, Pasantía (incluye apoyo a entidades públicas o PyMEs), Proyecto Productivo (Fondo Emprender), y Monitorías. Debes registrar y concertar tu plan de trabajo con el instructor de seguimiento.';
        ref = 'Capítulo V - Etapa Productiva';
      } else if (lower.includes('uniforme') || lower.includes('carné') || lower.includes('carne')) {
        botResponse = 'El porte del carné es obligatorio y debe permanecer visible en el pecho en todas las sedes del país. La vestimenta debe ser pulcra y acorde al área técnica (overol, bata, botas de seguridad según aplique).';
        ref = 'Capítulo III - Deberes del Aprendiz';
      } else {
        botResponse = `Conforme al nuevo Reglamento del Aprendiz SENA (Acuerdo 0009 de 2024), todas las decisiones formativas se basan en el debido proceso, la formación integral y la ética. Para este tema en particular, te recomiendo consultar con tu instructor vocero de ficha o radicar la inquietud formal ante la Coordinación Académica de tu Centro.`;
      }

      setChatHistory(prev => [...prev, { sender: 'bot', text: botResponse, reference: ref }]);
    }, 400);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Intro Header */}
      <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs backdrop-blur-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00324d] to-[#00517d] text-white flex items-center justify-center shadow-xs">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Tutor Sofia • Asesor Virtual del Reglamento
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              Resuelve dudas frecuentes sobre tus derechos, deberes, inasistencias y trámites del Acuerdo 0009 de 2024.
            </p>
          </div>
        </div>
      </div>

      {/* Suggested Quick Questions */}
      <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3 backdrop-blur-xs">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          <span>Consultas Frecuentes de Aprendices:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {FAQ_ITEMS.map((faq, idx) => (
            <button
              key={idx}
              onClick={() => handleAskQuestion(faq.q)}
              className="text-left text-xs bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 hover:text-emerald-900 dark:hover:text-emerald-300 hover:border-emerald-300 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-xl transition-all shadow-2xs group flex items-center gap-1.5"
            >
              <span className="font-medium text-slate-700 dark:text-slate-200 group-hover:text-emerald-900 dark:group-hover:text-emerald-300">{faq.q}</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400" />
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xs space-y-4 backdrop-blur-xs">
        <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2 scrollbar-thin">
          {chatHistory.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'bot' && (
                <div className="w-8 h-8 rounded-xl bg-[#39A900] text-white flex items-center justify-center flex-shrink-0 text-xs font-bold shadow-2xs">
                  S
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed space-y-1.5 shadow-2xs ${
                  msg.sender === 'user'
                    ? 'bg-[#00324d] dark:bg-[#39A900] text-white rounded-br-xs'
                    : 'bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-bl-xs'
                }`}
              >
                <p>{msg.text}</p>
                {msg.reference && (
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200/60 dark:border-slate-700 font-semibold flex items-center gap-1">
                    <BookOpen className="w-3 h-3 text-[#39A900]" />
                    <span>Fuente: {msg.reference}</span>
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center flex-shrink-0 text-xs font-bold">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAskQuestion(query);
            }}
            placeholder="Escribe tu pregunta sobre el reglamento SENA..."
            className="flex-1 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#39A900]/30 focus:border-[#39A900] transition-all"
          />
          <button
            onClick={() => handleAskQuestion(query)}
            disabled={!query.trim()}
            className={`p-2.5 rounded-xl font-bold transition-all ${
              query.trim()
                ? 'bg-[#39A900] hover:bg-[#329400] text-white shadow-xs'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
