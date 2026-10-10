import React, { useState } from 'react';
import {
  GraduationCap,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Layers,
  Code,
  Briefcase,
  Copy,
  Check,
  TrendingUp,
  ArrowRight,
  BookMarked,
  Award,
  Zap,
  FolderGit2,
  ExternalLink,
  Target
} from 'lucide-react';
import { CareerAnalysisResult } from '../types';
import { TRAINING_PRESETS, TrainingPreset } from '../data/presets';

interface CareerCoachAndRoadmapProps {
  onAnalyzeSuccess: (data: CareerAnalysisResult, trainingText: string) => void;
  analysisResult: CareerAnalysisResult | null;
  setAnalysisResult: (res: CareerAnalysisResult | null) => void;
  sharedTrainingContent: string;
  setSharedTrainingContent: (text: string) => void;
  onGoToInterviewGenerator: () => void;
}

export const CareerCoachAndRoadmap: React.FC<CareerCoachAndRoadmapProps> = ({
  onAnalyzeSuccess,
  analysisResult,
  setAnalysisResult,
  sharedTrainingContent,
  setSharedTrainingContent,
  onGoToInterviewGenerator,
}) => {
  const [trainingContent, setTrainingContent] = useState(sharedTrainingContent || '');
  const [targetRole, setTargetRole] = useState('');
  const [currentRole, setCurrentRole] = useState('');
  const [careerGoals, setCareerGoals] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleApplyPreset = (preset: TrainingPreset) => {
    setTrainingContent(preset.trainingContent);
    setTargetRole(preset.targetRole);
    setCurrentRole(preset.currentRole);
    setCareerGoals(preset.careerGoals);
    setSharedTrainingContent(preset.trainingContent);
  };

  const handleAnalyze = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!trainingContent.trim() || !targetRole.trim()) {
      setError('Lütfen katıldığınız eğitim içeriğini ve hedeflediğiniz pozisyonu belirtin.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze-career', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trainingContent: trainingContent.trim(),
          targetRole: targetRole.trim(),
          currentRole: currentRole.trim(),
          careerGoals: careerGoals.trim(),
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Analiz yapılamadı.');
      }

      const data: CareerAnalysisResult = await response.json();
      setAnalysisResult(data);
      setSharedTrainingContent(trainingContent.trim());
      onAnalyzeSuccess(data, trainingContent.trim());
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Kariyer analizi sırasında bir hata meydana geldi.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Intro Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-violet-950 to-slate-900 rounded-2xl p-6 sm:p-8 border border-violet-500/20 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 text-xs font-semibold uppercase tracking-wider mb-3 border border-violet-500/30">
            <GraduationCap className="w-3.5 h-3.5" /> Eğitim Envanteri & Kariyer Yol Haritası
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Eğitim İçeriklerini Değerlendir & "Sonraki Adımda Ne Yapmalısın?"
          </h1>
          <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed">
            Katıldığınız kursların, bootcamplerin veya sertifika programlarının müfredatını yapıştırın. Yapay zeka kazandığınız becerileri haritalandırsın, hedef pozisyonunuza göre <strong>eksikliklerinizi (Gap Analysis)</strong> çıkarsın ve önünüzdeki <strong>14-30-90 günlük eylem planınızı</strong> tasarlasın.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="mt-6 pt-5 border-t border-slate-800 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Örnek Eğitim Müfredatları:</span>
          {TRAINING_PRESETS.map(preset => (
            <button
              key={preset.id}
              onClick={() => handleApplyPreset(preset)}
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-violet-500/50 transition-all cursor-pointer"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <div className="bg-slate-900/80 rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-lg">
        <form onSubmit={handleAnalyze} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Target Role */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">
                Hedeflediğiniz Pozisyon / Kariyer Hedefi <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={targetRole}
                onChange={e => setTargetRole(e.target.value)}
                placeholder="Örn: Senior Frontend Developer, Data Scientist, Cloud Architect"
                className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm"
                required
              />
            </div>

            {/* Current Role */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">
                Şu Anki Durumunuz / Mevcut Unvanınız
              </label>
              <input
                type="text"
                value={currentRole}
                onChange={e => setCurrentRole(e.target.value)}
                placeholder="Örn: Junior Yazılımcı, Üniversite Mezunu, Kariyer Değiştiren"
                className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* Training Content Textarea */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-slate-200">
                Katıldığınız Eğitimlerin İçeriği, Modülleri veya Müfredatı <span className="text-rose-400">*</span>
              </label>
              <span className="text-xs text-slate-400">
                Kurs başlıkları, modüller, sertifikalar veya kazanılan konular
              </span>
            </div>
            <textarea
              rows={6}
              value={trainingContent}
              onChange={e => {
                setTrainingContent(e.target.value);
                setSharedTrainingContent(e.target.value);
              }}
              placeholder={`Örnek:
Modül 1: Modern JavaScript & TypeScript ile tip güvenliği
Modül 2: React 19, Custom Hooks, Performance Optimization
Modül 3: Node.js & Express REST API'ler, JWT kimlik doğrulama
Modül 4: PostgreSQL veritabanı modelleme ve Docker entegrasyonu...`}
              className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm font-mono leading-relaxed"
              required
            />
          </div>

          {/* Career Goals / Aspirations */}
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-2">
              Özel Hedefleriniz veya Odaklanmak İstediğiniz Alanlar <span className="text-xs text-slate-400 font-normal">(İsteğe Bağlı)</span>
            </label>
            <input
              type="text"
              value={careerGoals}
              onChange={e => setCareerGoals(e.target.value)}
              placeholder="Örn: Global uzaktan (remote) iş bulmak, yüksek ölçekli sistemlerde tecrübe kazanmak..."
              className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm"
            />
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold shadow-lg shadow-violet-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Eğitim İçeriği & Yetkinlikler Analiz Ediliyor...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Eğitimleri Değerlendir & Sonraki Adımları Çıkar</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Analysis Results */}
      {analysisResult && (
        <div className="space-y-8 animate-fadeIn">
          {/* Executive Overview & Match Score */}
          <div className="bg-slate-900 rounded-2xl border border-violet-500/30 p-6 sm:p-8 shadow-2xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
              <div className="flex items-start sm:items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center flex-shrink-0 shadow-lg shadow-violet-500/30">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-violet-400 uppercase tracking-wider">
                    Yetkinlik & Uyum Analizi
                  </div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">
                    {targetRole} Hedefi İçin Eğitim Karnesi
                  </h2>
                  <p className="text-sm text-slate-400 mt-0.5">
                    Mevcut Eğitimlerin Hedef Rolü Karşılama Oranı
                  </p>
                </div>
              </div>

              {/* Match Score Badge */}
              <div className="flex items-center gap-4 bg-slate-800/80 px-5 py-3 rounded-2xl border border-slate-700">
                <div className="text-right">
                  <div className="text-xs font-semibold text-slate-400">Yetkinlik Uyumu</div>
                  <div className="text-2xl font-extrabold text-violet-400">
                    %{analysisResult.competencyMatchScore || 75}
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full border-4 border-violet-500/30 border-t-violet-400 flex items-center justify-center font-bold text-xs text-white">
                  ✓
                </div>
              </div>
            </div>

            <p className="mt-6 text-sm sm:text-base text-slate-300 leading-relaxed bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
              {analysisResult.analysisOverview}
            </p>

            {/* Quick Action Link to Interview Generator */}
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-indigo-300">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Bu eğitim kazanımlarını mülakatta sana sorulabilecek sorulara bağlamak ister misin?</span>
              </div>
              <button
                onClick={onGoToInterviewGenerator}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span>Mülakat Soruları Sekmesine Aktar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Acquired Skills vs Gap Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Acquired Skills */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-lg">
                <CheckCircle2 className="w-5 h-5" />
                Kazanılan Beceriler Envanteri
              </div>
              <p className="text-xs text-slate-400">
                Eğitimlerinizden doğrudan elde ettiğiniz doğrulanmış yetkinlikler
              </p>

              <div>
                <span className="text-xs font-semibold text-slate-300 block mb-2">
                  🛠️ Teknik & Hard Skills:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {analysisResult.acquiredSkills.hardSkills.map((s, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-medium"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-300 block mb-2">
                  ⚙️ Araçlar & Kütüphaneler:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {analysisResult.acquiredSkills.toolsAndTech.map((t, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-medium"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-300 block mb-2">
                  🧠 Metodoloji & Soft Skills:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {analysisResult.acquiredSkills.softSkills.map((sf, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2.5 py-1 rounded-md bg-violet-500/10 text-violet-300 border border-violet-500/20 font-medium"
                    >
                      {sf}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Gap Analysis */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-lg">
                <AlertCircle className="w-5 h-5" />
                Eksiklik Analizi (Gap Analysis)
              </div>
              <p className="text-xs text-slate-400">
                {targetRole} pozisyonuna kabul edilmek için tamamlamanız gereken kritik halkalar
              </p>

              <div>
                <span className="text-xs font-semibold text-rose-300 block mb-2">
                  ⚠️ Mutlaka Kapatılması Gereken Kritik Beceriler:
                </span>
                <ul className="space-y-1.5">
                  {analysisResult.gapAnalysis.missingCrucialSkills.map((gap, idx) => (
                    <li key={idx} className="text-xs sm:text-sm text-slate-300 flex items-start gap-2 bg-rose-500/5 p-2 rounded-lg border border-rose-500/10">
                      <span className="text-rose-400 font-bold">•</span>
                      <span>{gap}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2">
                <span className="text-xs font-semibold text-amber-300 block mb-1">
                  💡 Sektörün Gerçek Beklentisi:
                </span>
                <p className="text-xs text-slate-300 leading-relaxed bg-amber-500/10 p-3 rounded-lg border border-amber-500/20">
                  {analysisResult.gapAnalysis.industryExpectations}
                </p>
              </div>
            </div>
          </div>

          {/* The Big One: "Sonraki Adımda Ne Yapmalısın?" Action Roadmap */}
          <div className="bg-slate-900 rounded-2xl border border-indigo-500/30 p-6 sm:p-8 shadow-2xl">
            <div className="max-w-3xl mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-2 border border-indigo-500/30">
                <Zap className="w-3.5 h-3.5" /> Eylem Planı
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                Sonraki Adımda Ne Yapmalısın? (14 - 30 - 90 Günlük Eylem Yol Haritası)
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Eğitimleri sadece izlemiş olmak yetmez; aşağıdaki adımlarla bu bilgileri doğrudan iş teklifine dönüştürün.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Immediate (14 Days) */}
              <div className="bg-slate-800/60 rounded-2xl p-5 border border-indigo-500/30 relative">
                <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm mb-3">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-xs font-bold text-indigo-200">
                    1
                  </div>
                  <span>İlk 14 Gün (Acil Somut Adımlar)</span>
                </div>
                <ul className="space-y-3">
                  {analysisResult.nextActionRoadmap.immediateActions.map((act, i) => (
                    <li key={i} className="text-xs sm:text-sm text-slate-300 flex items-start gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-700/50">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 flex-shrink-0" />
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Short Term (30 Days) */}
              <div className="bg-slate-800/60 rounded-2xl p-5 border border-violet-500/30 relative">
                <div className="flex items-center gap-2 text-violet-300 font-bold text-sm mb-3">
                  <div className="w-7 h-7 rounded-lg bg-violet-600/30 border border-violet-500/40 flex items-center justify-center text-xs font-bold text-violet-200">
                    2
                  </div>
                  <span>30 Gün (Kritik Kilometre Taşları)</span>
                </div>
                <ul className="space-y-3">
                  {analysisResult.nextActionRoadmap.shortTerm30Days.map((act, i) => (
                    <li key={i} className="text-xs sm:text-sm text-slate-300 flex items-start gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-700/50">
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-2 flex-shrink-0" />
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Mid Term (90 Days) */}
              <div className="bg-slate-800/60 rounded-2xl p-5 border border-emerald-500/30 relative">
                <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm mb-3">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-xs font-bold text-emerald-200">
                    3
                  </div>
                  <span>90 Gün (Kariyer Zirvesi & Mülakat)</span>
                </div>
                <ul className="space-y-3">
                  {analysisResult.nextActionRoadmap.midTerm90Days.map((act, i) => (
                    <li key={i} className="text-xs sm:text-sm text-slate-300 flex items-start gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-700/50">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Portfolio & GitHub Projects */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-xl">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-2 border border-emerald-500/30">
                  <FolderGit2 className="w-3.5 h-3.5" /> Kanıt Üretme
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  Eğitim Becerilerini Kanıtlayacak Bitirme & Portföy Projeleri
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Mülakatta "Ben sadece eğitim almadım, işte bunu ürettim" diyebilmeniz için tasarlanmış gerçekçi proje senaryoları.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {analysisResult.portfolioProjectIdeas.map((proj, idx) => (
                <div
                  key={idx}
                  className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700/60 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-base font-bold text-white leading-snug">
                        {proj.title}
                      </h4>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30 flex-shrink-0">
                        Proje #{idx + 1}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {proj.description}
                    </p>

                    <div>
                      <span className="text-xs font-semibold text-slate-400 block mb-1.5">
                        Uygulanan Eğitim Konuları:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {proj.appliedSkillsFromTrainings.map((ask, i) => (
                          <span
                            key={i}
                            className="text-[11px] px-2 py-0.5 rounded bg-slate-700 text-slate-300"
                          >
                            {ask}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
                      <strong className="text-amber-300">İşverenin Gözündeki Değer:</strong> {proj.businessValue}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-700/50">
                    <span className="text-[11px] font-semibold text-indigo-400 block mb-1">
                      GitHub / Portföy Sunum Cümlesi:
                    </span>
                    <p className="text-xs text-slate-400 italic">
                      "{proj.githubPortfolioPitch}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Next Topics / Certifications */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-xl">
            <div className="flex items-center gap-2 text-violet-400 font-bold text-lg mb-2">
              <BookMarked className="w-5 h-5" />
              Sıradaki Önerilen İleri Düzey Konular & Sertifikalar
            </div>
            <p className="text-xs text-slate-400 mb-6">
              Mevcut eğitimlerin üzerine bir sonraki basamağa tırmanmak için öğrenmeniz tavsiye edilen konular
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {analysisResult.recommendedNextTrainings.map((tr, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        tr.priority === 'Yüksek'
                          ? 'bg-rose-500/20 text-rose-300'
                          : tr.priority === 'İleri Seviye'
                          ? 'bg-purple-500/20 text-purple-300'
                          : 'bg-indigo-500/20 text-indigo-300'
                      }`}
                    >
                      {tr.priority} Öncelik
                    </span>
                  </div>
                  <h5 className="text-sm font-bold text-white">{tr.topic}</h5>
                  <p className="text-xs text-slate-400">{tr.whyRecommended}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
