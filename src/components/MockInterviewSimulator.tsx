import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Play,
  RotateCcw,
  Sparkles,
  Award,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  MessageSquare,
  HelpCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  UserCheck
} from 'lucide-react';
import { AnswerEvaluationResult } from '../types';

interface MockInterviewSimulatorProps {
  initialQuestion?: string;
  initialInterviewerTitle?: string;
  initialTargetRole?: string;
  sharedTrainingContent?: string;
}

export const MockInterviewSimulator: React.FC<MockInterviewSimulatorProps> = ({
  initialQuestion = '',
  initialInterviewerTitle = '',
  initialTargetRole = '',
  sharedTrainingContent = '',
}) => {
  const [question, setQuestion] = useState(
    initialQuestion || 'Kendinizi tanıtır mısınız ve bu pozisyonda en çok hangi teknik yetkinliğinize güveniyorsunuz?'
  );
  const [interviewerTitle, setInterviewerTitle] = useState(
    initialInterviewerTitle || 'Engineering Manager'
  );
  const [targetRole, setTargetRole] = useState(
    initialTargetRole || 'Yazılım Mühendisi'
  );
  const [candidateAnswer, setCandidateAnswer] = useState('');

  // Voice recording & Speech recognition state
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  // Timer state
  const [seconds, setSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // API evaluation
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [evaluation, setEvaluation] = useState<AnswerEvaluationResult | null>(null);

  // Sync props if changed
  useEffect(() => {
    if (initialQuestion) setQuestion(initialQuestion);
    if (initialInterviewerTitle) setInterviewerTitle(initialInterviewerTitle);
    if (initialTargetRole) setTargetRole(initialTargetRole);
  }, [initialQuestion, initialInterviewerTitle, initialTargetRole]);

  // Timer interval
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Speech Recognition setup
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'tr-TR';

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setCandidateAnswer(prev => {
          if (prev.endsWith(' ') || prev === '') {
            return prev + transcript;
          }
          return prev + ' ' + transcript;
        });
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } catch (e) {
      console.warn('Speech recognition init failed', e);
      setSpeechSupported(false);
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        if (!isTimerRunning) setIsTimerRunning(true);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleEvaluate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!candidateAnswer.trim()) {
      setError('Lütfen bir cevap yazın veya mikrofonla konuşun.');
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    setIsTimerRunning(false);

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/evaluate-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          interviewerTitle,
          targetRole,
          question,
          candidateAnswer: candidateAnswer.trim(),
          userTrainingsSummary: sharedTrainingContent,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Değerlendirme alınamadı.');
      }

      const data: AnswerEvaluationResult = await response.json();
      setEvaluation(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Cevap değerlendirilirken hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleUseFollowUp = (followUp: string) => {
    setQuestion(followUp);
    setCandidateAnswer('');
    setEvaluation(null);
    setSeconds(0);
    setIsTimerRunning(true);
  };

  const resetSession = () => {
    setCandidateAnswer('');
    setEvaluation(null);
    setSeconds(0);
    setIsTimerRunning(false);
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Intro Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 rounded-2xl p-6 sm:p-8 border border-emerald-500/20 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-3 border border-emerald-500/30">
            <Mic className="w-3.5 h-3.5" /> Canlı Simülatör & Koçluk
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            İnteraktif Mock Mülakat Simülatörü
          </h1>
          <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed">
            Mülakatçının karşısındaymış gibi soruyu cevaplayın (sesli veya yazılı). Yapay zeka bu unvanın gözünden cevabınızı puanlasın, <strong>STAR uyumunu</strong> incelesin ve cevabınızı çok daha ikna edici hale getirecek <strong>revize edilmiş ideal modeli</strong> sunsun.
          </p>
        </div>
      </div>

      {/* Simulator Workspace */}
      <div className="bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
        {/* Role & Persona Headers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-6 border-b border-slate-800">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Mülakatçının Unvanı
            </label>
            <input
              type="text"
              value={interviewerTitle}
              onChange={e => setInterviewerTitle(e.target.value)}
              placeholder="Örn: Engineering Manager, HR BP"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Hedef Rol
            </label>
            <input
              type="text"
              value={targetRole}
              onChange={e => setTargetRole(e.target.value)}
              placeholder="Örn: Senior Full-Stack Mühendis"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Current Question Box */}
        <div className="bg-slate-950/70 rounded-2xl p-5 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
              <UserCheck className="w-4 h-4" /> {interviewerTitle} Soruyor:
            </span>
            <span className="text-xs text-slate-500">Soruyu düzenleyebilirsiniz</span>
          </div>
          <textarea
            rows={2}
            value={question}
            onChange={e => setQuestion(e.target.value)}
            className="w-full bg-transparent text-white font-bold text-base sm:text-lg resize-none focus:outline-none border-b border-transparent focus:border-emerald-500/50"
          />
        </div>

        {/* Answer Controls & Timer */}
        <div className="flex items-center justify-between flex-wrap gap-4 pt-2">
          {/* Timer Display */}
          <div className="flex items-center gap-3 bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span className="font-mono text-sm font-bold text-white tracking-wider">
              {formatTime(seconds)}
            </span>
            <button
              type="button"
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="text-xs text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-700 cursor-pointer"
            >
              {isTimerRunning ? 'Durdur' : 'Başlat'}
            </button>
            <button
              type="button"
              onClick={() => {
                setSeconds(0);
                setIsTimerRunning(false);
              }}
              className="text-slate-400 hover:text-white"
              title="Sıfırla"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Voice Input Button */}
          {speechSupported && (
            <button
              type="button"
              onClick={toggleListening}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                isListening
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30 animate-pulse'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              {isListening ? (
                <>
                  <MicOff className="w-4 h-4" />
                  <span>Dinleniyor... (Durdur)</span>
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4 text-emerald-400" />
                  <span>Sesle Yanıtla (Mikrofon)</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Candidate Answer Textarea */}
        <div className="relative">
          <textarea
            rows={7}
            value={candidateAnswer}
            onChange={e => setCandidateAnswer(e.target.value)}
            placeholder="Cevabınızı buraya yazın veya yukarıdaki mikrofon tuşuna basarak sesli konuşun (STAR modeliyle: Durum, Görev, Eylemleriniz ve Ulaştığınız Sonuç)..."
            className="w-full px-4 py-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm leading-relaxed"
          />
          <div className="absolute bottom-3 right-4 text-xs text-slate-500">
            {candidateAnswer.split(/\s+/).filter(Boolean).length} Kelime
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={resetSession}
            className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white text-xs font-medium bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Temizle & Yeni Oturum
          </button>

          <button
            type="button"
            onClick={() => handleEvaluate()}
            disabled={loading || !candidateAnswer.trim()}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Mülakatçı Cevabınızı İnceliyor...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Cevabımı Değerlendir & Koçluk Al</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Evaluation Results Feedback Card */}
      {evaluation && (
        <div className="bg-slate-900 rounded-2xl border border-emerald-500/30 p-6 sm:p-8 shadow-2xl space-y-6 animate-fadeIn">
          {/* Score Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                Mülakatçı Değerlendirme Raporu
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                {interviewerTitle} Gözünden Cevap Notu
              </h3>
            </div>

            <div className="flex items-center gap-4">
              <span
                className={`text-sm font-bold px-3 py-1.5 rounded-xl border ${
                  evaluation.verdict === 'Mükemmel'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : evaluation.verdict === 'Güçlü'
                    ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                    : evaluation.verdict === 'Geliştirilmeli'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                }`}
              >
                {evaluation.verdict}
              </span>

              <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-2xl border border-slate-700">
                <span className="text-xs text-slate-400">Puan:</span>
                <span className="text-2xl font-black text-emerald-400">
                  {evaluation.score}
                </span>
                <span className="text-xs text-slate-500">/ 10</span>
              </div>
            </div>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-800/40 rounded-xl p-5 border border-emerald-500/20 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                Mülakatçının Beğendiği Güçlü Yönler
              </div>
              <ul className="space-y-2">
                {evaluation.strengths.map((str, idx) => (
                  <li key={idx} className="text-xs sm:text-sm text-slate-300 flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-800/40 rounded-xl p-5 border border-rose-500/20 space-y-3">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                <AlertTriangle className="w-4 h-4" />
                Geliştirilmesi Gereken Zayıf Noktalar
              </div>
              <ul className="space-y-2">
                {evaluation.weaknesses.map((w, idx) => (
                  <li key={idx} className="text-xs sm:text-sm text-slate-300 flex items-start gap-2">
                    <span className="text-rose-400 font-bold">!</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* STAR Assessment */}
          <div className="bg-slate-950/60 rounded-xl p-5 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-violet-400 uppercase tracking-wider block">
              📊 STAR Modeline Uyum Analizi:
            </span>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {evaluation.starComplianceAssessment}
            </p>
          </div>

          {/* AI Master Answer Revision */}
          <div className="bg-gradient-to-br from-indigo-950/40 to-slate-900 rounded-2xl p-6 border border-indigo-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm">
                <MessageSquare className="w-4 h-4 text-indigo-400" />
                Yapay Zeka Koçunun Revize Ettiği "İdeal Model Cevap"
              </div>
              <span className="text-[11px] text-indigo-400/80">Sizin ifadenizin profesyonelleştirilmiş hali</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic bg-slate-900/60 p-4 rounded-xl border border-indigo-500/20">
              "{evaluation.improvedAnswerSuggestion}"
            </p>
          </div>

          {/* Pro Coach Tip */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                {interviewerTitle} İçin 1 Altın Koçluk Tavsiyesi:
              </span>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                {evaluation.coachTip}
              </p>
            </div>
          </div>

          {/* Follow-up Question CTA */}
          {evaluation.followUpQuestion && (
            <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                  ⚠️ Mülakatçının Olası Takip / Sıkıştırma Sorusu (Follow-Up):
                </span>
                <p className="text-sm font-semibold text-white">
                  "{evaluation.followUpQuestion}"
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleUseFollowUp(evaluation.followUpQuestion)}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md flex items-center gap-1.5 transition-all flex-shrink-0 cursor-pointer"
              >
                <span>Bu Soruyu Yanıtla</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
