/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { InterviewerQuestionGenerator } from './components/InterviewerQuestionGenerator';
import { CareerCoachAndRoadmap } from './components/CareerCoachAndRoadmap';
import { MockInterviewSimulator } from './components/MockInterviewSimulator';
import { PitchAndStrategyView } from './components/PitchAndStrategyView';
import { QuestionGenerationResult, CareerAnalysisResult } from './types';
import { 
  HelpCircle, 
  GraduationCap, 
  Mic, 
  Award, 
  CheckCircle2, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'questions' | 'career' | 'simulator' | 'pitch'>('questions');

  // Shared state
  const [sharedTrainingContent, setSharedTrainingContent] = useState<string>(() => {
    return localStorage.getItem('coach_training_content') || '';
  });

  const [questionResult, setQuestionResult] = useState<QuestionGenerationResult | null>(() => {
    const saved = localStorage.getItem('coach_questions');
    return saved ? JSON.parse(saved) : null;
  });

  const [careerResult, setCareerResult] = useState<CareerAnalysisResult | null>(() => {
    const saved = localStorage.getItem('coach_career_analysis');
    return saved ? JSON.parse(saved) : null;
  });

  // Simulator target state
  const [simQuestion, setSimQuestion] = useState<string>('');
  const [simTitle, setSimTitle] = useState<string>('');
  const [simRole, setSimRole] = useState<string>('');

  // Persist state to localStorage
  useEffect(() => {
    if (sharedTrainingContent) {
      localStorage.setItem('coach_training_content', sharedTrainingContent);
    }
  }, [sharedTrainingContent]);

  useEffect(() => {
    if (questionResult) {
      localStorage.setItem('coach_questions', JSON.stringify(questionResult));
    }
  }, [questionResult]);

  useEffect(() => {
    if (careerResult) {
      localStorage.setItem('coach_career_analysis', JSON.stringify(careerResult));
    }
  }, [careerResult]);

  // Handler to jump to Mock Simulator with a specific question
  const handleStartSimulation = (question: string, interviewerTitle: string, targetRole: string) => {
    setSimQuestion(question);
    setSimTitle(interviewerTitle);
    setSimRole(targetRole);
    setActiveTab('simulator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCareerAnalyzeSuccess = (data: CareerAnalysisResult, text: string) => {
    setCareerResult(data);
    setSharedTrainingContent(text);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Navbar Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hasQuestions={!!questionResult}
        hasCareerAnalysis={!!careerResult}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Workflow Bar */}
        <div className="mb-8 p-3 sm:p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Adım Adım Koçluk Akışı:
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs flex-wrap">
            <button
              onClick={() => setActiveTab('career')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'career'
                  ? 'bg-violet-600/30 text-violet-300 border border-violet-500/40 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>1. Eğitim İçeriklerini Gir</span>
              {careerResult && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
            </button>

            <span className="text-slate-600 hidden sm:inline">➔</span>

            <button
              onClick={() => setActiveTab('questions')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'questions'
                  ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>2. Mülakatçı Unvanına Özel Sorular</span>
              {questionResult && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
            </button>

            <span className="text-slate-600 hidden sm:inline">➔</span>

            <button
              onClick={() => setActiveTab('simulator')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'simulator'
                  ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>3. Mock Simülatörde Canlı Cevapla</span>
            </button>

            <span className="text-slate-600 hidden sm:inline">➔</span>

            <button
              onClick={() => setActiveTab('pitch')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'pitch'
                  ? 'bg-amber-600/30 text-amber-300 border border-amber-500/40 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>4. CV & Asansör Konuşması (Pitch)</span>
            </button>
          </div>
        </div>

        {/* Tab Views */}
        {activeTab === 'questions' && (
          <InterviewerQuestionGenerator
            onStartSimulation={handleStartSimulation}
            sharedTrainingContent={sharedTrainingContent}
            result={questionResult}
            setResult={setQuestionResult}
          />
        )}

        {activeTab === 'career' && (
          <CareerCoachAndRoadmap
            onAnalyzeSuccess={handleCareerAnalyzeSuccess}
            analysisResult={careerResult}
            setAnalysisResult={setCareerResult}
            sharedTrainingContent={sharedTrainingContent}
            setSharedTrainingContent={setSharedTrainingContent}
            onGoToInterviewGenerator={() => setActiveTab('questions')}
          />
        )}

        {activeTab === 'simulator' && (
          <MockInterviewSimulator
            initialQuestion={simQuestion}
            initialInterviewerTitle={simTitle || questionResult?.interviewerPersona?.title}
            initialTargetRole={simRole}
            sharedTrainingContent={sharedTrainingContent}
          />
        )}

        {activeTab === 'pitch' && (
          <PitchAndStrategyView
            analysisResult={careerResult}
            onGoToCareerTab={() => setActiveTab('career')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">Interview & Career Coach AI Agent</span>
            <span>•</span>
            <span>STAR Modeli & Psikolojik Mülakat Stratejisi</span>
          </div>
          <p>© 2026 AI Studio. Mülakatçı profiline ve eğitim kazanımlarına göre optimize edilmiştir.</p>
        </div>
      </footer>
    </div>
  );
}
