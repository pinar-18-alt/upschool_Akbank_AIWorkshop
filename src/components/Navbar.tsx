import React from 'react';
import { 
  Briefcase, 
  HelpCircle, 
  GraduationCap, 
  Mic, 
  Sparkles,
  Award
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'questions' | 'career' | 'simulator' | 'pitch';
  setActiveTab: (tab: 'questions' | 'career' | 'simulator' | 'pitch') => void;
  hasQuestions: boolean;
  hasCareerAnalysis: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  hasQuestions,
  hasCareerAnalysis,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-amber-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  Interview & Career Coach AI
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Agent
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Mülakatçı Unvanına Özel Sorular & Eğitim Tabanlı Kariyer Yol Haritası
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('questions')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'questions'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span className="hidden md:inline">Mülakatçı & Sorular</span>
              <span className="md:hidden">Sorular</span>
              {hasQuestions && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('career')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'career'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span className="hidden md:inline">Eğitim & Sonraki Adım</span>
              <span className="md:hidden">Kariyer</span>
              {hasCareerAnalysis && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('simulator')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'simulator'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Mic className="w-4 h-4" />
              <span className="hidden md:inline">Canlı Mock Simülatör</span>
              <span className="md:hidden">Simülatör</span>
            </button>

            <button
              onClick={() => setActiveTab('pitch')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'pitch'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Award className="w-4 h-4" />
              <span className="hidden md:inline">Pitch & CV Rehberi</span>
              <span className="md:hidden">Pitch</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
