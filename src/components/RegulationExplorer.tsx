import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  ShieldCheck, 
  BookOpenCheck, 
  AlertTriangle, 
  Scale, 
  FileText, 
  CheckCircle, 
  Sparkles,
  Info,
  ChevronDown,
  ChevronUp,
  Award
} from 'lucide-react';
import { REGULATION_ARTICLES } from '../data/regulationsData';
import { RegulationArticle } from '../types';

interface RegulationExplorerProps {
  onArticleRead: (id: string) => void;
  readArticles: string[];
}

export const RegulationExplorer: React.FC<RegulationExplorerProps> = ({
  onArticleRead,
  readArticles
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showOnly2024, setShowOnly2024] = useState<boolean>(false);
  const [expandedArticleId, setExpandedArticleId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'Todos los Artículos', icon: FileText },
    { id: 'derecho', label: 'Derechos (Cap. II)', icon: ShieldCheck, color: 'text-emerald-700 bg-emerald-50' },
    { id: 'deber', label: 'Deberes (Cap. III)', icon: BookOpenCheck, color: 'text-blue-700 bg-blue-50' },
    { id: 'prohibicion', label: 'Prohibiciones', icon: AlertTriangle, color: 'text-amber-700 bg-amber-50' },
    { id: 'falta_sancion', label: 'Medidas & Sanciones', icon: Scale, color: 'text-rose-700 bg-rose-50' },
    { id: 'novedad', label: 'Novedades & Trámites', icon: Info, color: 'text-indigo-700 bg-indigo-50' }
  ];

  const filteredArticles = useMemo(() => {
    return REGULATION_ARTICLES.filter((item) => {
      const matchesSearch = 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.details.some(d => d.toLowerCase().includes(searchTerm.toLowerCase())) ||
        item.practicalTip.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
      const matches2024 = !showOnly2024 || item.isRecent2024Highlight;

      return matchesSearch && matchesCat && matches2024;
    });
  }, [searchTerm, selectedCategory, showOnly2024]);

  const toggleExpand = (id: string) => {
    setExpandedArticleId(expandedArticleId === id ? null : id);
    if (!readArticles.includes(id)) {
      onArticleRead(id);
    }
  };

  const getCategoryBadge = (cat: RegulationArticle['category']) => {
    switch (cat) {
      case 'derecho':
        return { label: 'Derecho del Aprendiz', bg: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
      case 'deber':
        return { label: 'Deber del Aprendiz', bg: 'bg-blue-100 text-blue-800 border-blue-300' };
      case 'prohibicion':
        return { label: 'Prohibición Expresa', bg: 'bg-amber-100 text-amber-900 border-amber-300' };
      case 'falta_sancion':
        return { label: 'Régimen Sancionatorio', bg: 'bg-rose-100 text-rose-800 border-rose-300' };
      case 'novedad':
        return { label: 'Novedad Formativa', bg: 'bg-indigo-100 text-indigo-800 border-indigo-300' };
      default:
        return { label: 'Reglamento', bg: 'bg-slate-100 text-slate-800 border-slate-300' };
    }
  };

  const readCount = readArticles.length;
  const totalCount = REGULATION_ARTICLES.length;
  const percentRead = Math.round((readCount / totalCount) * 100);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Title Header */}
      <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs backdrop-blur-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-[#39A900] uppercase tracking-wider">
                Base Normativa Oficial
              </span>
              <span className="text-xs bg-[#39A900]/10 text-[#2e8500] dark:text-[#6ee236] font-semibold px-2 py-0.5 rounded-full border border-[#39A900]/20">
                Acuerdo 0009 de 2024
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Explorador del Reglamento del Aprendiz SENA
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
              Consulta en lenguaje claro los derechos, deberes y protocolos que regirán tu etapa lectiva y práctica. Haz clic en cada tema para estudiarlo y ganar experiencia (XP).
            </p>
          </div>

          {/* Progress Tracker */}
          <div className="flex-shrink-0 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 p-3 rounded-xl min-w-[200px]">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Artículos Apropiados:</span>
              <span className="font-extrabold text-[#39A900]">{readCount} de {totalCount}</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-[#39A900] h-full rounded-full transition-all duration-300"
                style={{ width: `${percentRead}%` }}
              ></div>
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 text-right">
              {percentRead}% estudiado (+15 XP por tema)
            </div>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por palabra clave (ej. IA, inasistencia, EPP, aplazamiento, carné)..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-[#39A900]/30 focus:border-[#39A900] transition-all"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
            <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-amber-200 select-none bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 px-3 py-2 rounded-xl">
              <input
                type="checkbox"
                checked={showOnly2024}
                onChange={(e) => setShowOnly2024(e.target.checked)}
                className="rounded-sm border-slate-300 text-[#39A900] focus:ring-[#39A900]"
              />
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Novedades Acuerdo 2024</span>
            </label>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex gap-1.5 overflow-x-auto pt-3 pb-1 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-[#00324d] dark:bg-[#39A900] text-white shadow-2xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Articles Cards Grid */}
      <div className="space-y-3.5">
        {filteredArticles.length === 0 ? (
          <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-10 text-center text-slate-500 dark:text-slate-400">
            <Search className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
            <p className="font-semibold text-slate-700 dark:text-slate-200">No encontramos artículos con esa búsqueda.</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Intenta con términos más generales o limpia los filtros.</p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedCategory('all'); setShowOnly2024(false); }}
              className="mt-3 text-xs text-[#39A900] font-bold underline hover:text-[#2e8500]"
            >
              Restablecer filtros
            </button>
          </div>
        ) : (
          filteredArticles.map((article) => {
            const isRead = readArticles.includes(article.id);
            const isExpanded = expandedArticleId === article.id;
            const badgeMeta = getCategoryBadge(article.category);

            return (
              <div
                key={article.id}
                className={`bg-white dark:bg-slate-900/80 border rounded-xl transition-all shadow-2xs overflow-hidden backdrop-blur-xs ${
                  isExpanded ? 'border-[#39A900] ring-1 ring-[#39A900]/20' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {/* Header Row */}
                <div
                  onClick={() => toggleExpand(article.id)}
                  className="p-4 sm:p-5 cursor-pointer flex items-start justify-between gap-3 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors select-none"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${badgeMeta.bg} dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700`}>
                        {badgeMeta.label}
                      </span>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                        {article.chapter}
                      </span>
                      {article.isRecent2024Highlight && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800">
                          <Sparkles className="w-2.5 h-2.5 text-amber-600 dark:text-amber-400" />
                          Novedad 2024
                        </span>
                      )}
                      {isRead && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800/60">
                          <CheckCircle className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          Apropiado (+15 XP)
                        </span>
                      )}
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                      {article.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {article.summary}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <button 
                      type="button"
                      aria-label="Expandir detalles"
                      className="p-1.5 text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details Body */}
                {isExpanded && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/40 space-y-4">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                        Puntos Clave y Disposiciones Normativas:
                      </h4>
                      <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                        {article.details.map((detail, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#39A900] mt-2 flex-shrink-0"></span>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Practical Tip for Apprentice */}
                    <div className="bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/90 dark:border-emerald-800/60 rounded-xl p-3.5 flex items-start gap-3">
                      <div className="w-6 h-6 rounded-md bg-[#39A900] text-white flex items-center justify-center flex-shrink-0 font-bold text-xs">
                        💡
                      </div>
                      <div className="text-xs text-emerald-950 dark:text-emerald-200">
                        <strong className="font-bold text-emerald-900 dark:text-emerald-300 block mb-0.5">
                          Consejo Práctico en el Centro de Formación:
                        </strong>
                        <p className="text-emerald-800 dark:text-emerald-200 leading-relaxed">{article.practicalTip}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
