import React, { useState } from 'react';
import {
  Award,
  Copy,
  Check,
  FileText,
  Linkedin,
  MessageSquare,
  Sparkles,
  Zap,
  CheckCircle2,
  Share2
} from 'lucide-react';
import { CareerAnalysisResult } from '../types';

interface PitchAndStrategyViewProps {
  analysisResult: CareerAnalysisResult | null;
  onGoToCareerTab: () => void;
}

export const PitchAndStrategyView: React.FC<PitchAndStrategyViewProps> = ({
  analysisResult,
  onGoToCareerTab,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!analysisResult) {
    return (
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8 sm:p-12 text-center max-w-xl mx-auto space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto border border-indigo-500/20">
          <Award className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-white">Henüz Eğitim Analizi Yapılmadı</h3>
        <p className="text-sm text-slate-400 leading-relaxed">
          Mülakatta kendinizi ve eğitimlerinizi en etkileyici şekilde anlatmak (Elevator Pitch), CV maddeleri ve LinkedIn optimizasyonunu görmek için lütfen önce <strong>Eğitim & Sonraki Adım</strong> sekmesinden eğitimlerinizi analiz edin.
        </p>
        <button
          onClick={onGoToCareerTab}
          className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
        >
          Eğitim & Sonraki Adım Sekmesine Git
        </button>
      </div>
    );
  }

  const { interviewPitchStrategy } = analysisResult;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Intro Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 border border-indigo-500/20 shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-3 border border-indigo-500/30">
          <Award className="w-3.5 h-3.5" /> Mülakat & CV Stratejisi
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Eğitimlerinizi Mülakatta & CV'de Pazarlama Stratejisi
        </h1>
        <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
          Eğitimleri sadece "kurs izledim" gibi anlatmak yerine, mülakatçıları ikna edecek 60 saniyelik asansör konuşması, CV kurşun noktaları ve LinkedIn konumlandırmanız.
        </p>
      </div>

      {/* Mindset: How to explain trainings */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-xl space-y-3">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-lg">
          <Zap className="w-5 h-5" />
          Kritik Zihniyet: Eğitimleri Mülakatçıya Nasıl Anlatmalısınız?
        </div>
        <p className="text-sm text-slate-300 leading-relaxed bg-slate-800/50 p-4 rounded-xl border border-slate-700/60">
          {interviewPitchStrategy.howToExplainTrainings}
        </p>
      </div>

      {/* 60s Elevator Pitch */}
      <div className="bg-slate-900 rounded-2xl border border-indigo-500/30 p-6 sm:p-8 shadow-xl space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-lg">
            <MessageSquare className="w-5 h-5" />
            60 Saniyelik Mülakat Asansör Konuşması (Elevator Pitch)
          </div>
          <button
            onClick={() => copyToClipboard(interviewPitchStrategy.samplePitchElevator, 'pitch')}
            className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 flex items-center gap-1.5 cursor-pointer"
          >
            {copiedId === 'pitch' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Kopyalandı</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Konuşmayı Kopyala</span>
              </>
            )}
          </button>
        </div>
        <div className="bg-indigo-950/30 p-5 rounded-xl border border-indigo-500/20 text-slate-200 text-sm sm:text-base leading-relaxed italic">
          "{interviewPitchStrategy.samplePitchElevator}"
        </div>
      </div>

      {/* CV Bullet Points */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-xl space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-lg">
            <FileText className="w-5 h-5" />
            CV'nize Doğrudan Ekleyebileceğiniz Eylem Odaklı Maddeler
          </div>
          <button
            onClick={() => copyToClipboard(interviewPitchStrategy.cvBulletPoints.join('\n'), 'cv')}
            className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 flex items-center gap-1.5 cursor-pointer"
          >
            {copiedId === 'cv' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Kopyalandı</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Tüm Maddeleri Kopyala</span>
              </>
            )}
          </button>
        </div>

        <div className="space-y-2.5">
          {interviewPitchStrategy.cvBulletPoints.map((bullet, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/50 flex items-start justify-between gap-3"
            >
              <div className="flex items-start gap-2.5 text-sm text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>{bullet}</span>
              </div>
              <button
                onClick={() => copyToClipboard(bullet, `cv-${idx}`)}
                className="text-slate-400 hover:text-white p-1 rounded flex-shrink-0"
                title="Kopyala"
              >
                {copiedId === `cv-${idx}` ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* LinkedIn Suggestion */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-xl space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-sky-400 font-bold text-lg">
            <Linkedin className="w-5 h-5" />
            LinkedIn Başlığı (Headline) & Hakkında (About) Önerisi
          </div>
          <button
            onClick={() =>
              copyToClipboard(interviewPitchStrategy.linkedInHeadlineAndAboutSuggestion, 'linkedin')
            }
            className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 flex items-center gap-1.5 cursor-pointer"
          >
            {copiedId === 'linkedin' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Kopyalandı</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Kopyala</span>
              </>
            )}
          </button>
        </div>
        <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 text-slate-300 text-sm whitespace-pre-line leading-relaxed">
          {interviewPitchStrategy.linkedInHeadlineAndAboutSuggestion}
        </div>
      </div>
    </div>
  );
};
