import React, { useState } from 'react';
import {
  HelpCircle,
  Sparkles,
  UserCheck,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle2,
  Key,
  Copy,
  Check,
  PlayCircle,
  BookOpen,
  ArrowRight,
  ShieldAlert,
  Target,
  Layers,
  MessageSquare,
  FileText
} from 'lucide-react';
import { QuestionGenerationResult, InterviewQuestion } from '../types';
import { INTERVIEW_PRESETS, InterviewPreset } from '../data/presets';

interface InterviewerQuestionGeneratorProps {
  onStartSimulation: (question: string, interviewerTitle: string, targetRole: string) => void;
  sharedTrainingContent: string;
  result: QuestionGenerationResult | null;
  setResult: (res: QuestionGenerationResult | null) => void;
}

export const InterviewerQuestionGenerator: React.FC<InterviewerQuestionGeneratorProps> = ({
  onStartSimulation,
  sharedTrainingContent,
  result,
  setResult,
}) => {
  const [interviewerTitle, setInterviewerTitle] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [companyIndustry, setCompanyIndustry] = useState('Teknoloji & Yazılım');
  const [seniorityLevel, setSeniorityLevel] = useState('Mid / Senior');
  const [interviewFormat, setInterviewFormat] = useState('Birebir Teknik & Yetkinlik Mülakatı');
  const [jobDescription, setJobDescription] = useState('');
  const [includeTrainings, setIncludeTrainings] = useState(true);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('Tümü');
  const [expandedQuestions, setExpandedQuestions] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleApplyPreset = (preset: InterviewPreset) => {
    setInterviewerTitle(preset.interviewerTitle);
    setTargetRole(preset.targetRole);
    setCompanyIndustry(preset.companyIndustry);
    setSeniorityLevel(preset.seniorityLevel);
    setInterviewFormat(preset.interviewFormat);
    setJobDescription(preset.jobDescription);
  };

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!interviewerTitle.trim() || !targetRole.trim()) {
      setError('Lütfen en azından mülakatçının unvanını ve hedeflediğiniz pozisyonu belirtin.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          interviewerTitle: interviewerTitle.trim(),
          targetRole: targetRole.trim(),
          companyIndustry: companyIndustry.trim(),
          seniorityLevel,
          interviewFormat,
          jobDescription: jobDescription.trim(),
          userTrainingsSummary: includeTrainings ? sharedTrainingContent.trim() : '',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Sorular üretilemedi.');
      }

      const data: QuestionGenerationResult = await response.json();
      setResult(data);
      // Auto expand first two questions
      if (data.questions && data.questions.length > 0) {
        setExpandedQuestions({
          [data.questions[0].id || 'q0']: true,
          [data.questions[1]?.id || 'q1']: true,
        });
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Bir sunucu hatası oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedQuestions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const categories = ['Tümü', ...new Set(result?.questions?.map(q => q.category) || [])];

  const filteredQuestions = result?.questions?.filter(q => {
    if (activeCategoryFilter === 'Tümü') return true;
    return q.category === activeCategoryFilter;
  }) || [];

  return (
    <div className="space-y-8">
      {/* Intro Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 border border-indigo-500/20 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-3 border border-indigo-500/30">
            <Target className="w-3.5 h-3.5" /> Mülakatçı Psikolojisi & Soru Motoru
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Mülakatçının Unvanına Özel Potansiyel Soru & Strateji Üretici
          </h1>
          <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed">
            Karşınıza oturacak kişinin unvanını (örneğin <strong>Engineering Manager</strong>, <strong>Senior HR Business Partner</strong> veya <strong>VP of Product</strong>) girin. Yapay zeka o kişinin gizli ajandasını, nelere dikkat edeceğini ve soracağı en muhtemel soruları STAR cevap modelleriyle çıkarsın.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="mt-6 pt-5 border-t border-slate-800 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Hızlı Senaryolar:</span>
          {INTERVIEW_PRESETS.map(preset => (
            <button
              key={preset.id}
              onClick={() => handleApplyPreset(preset)}
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-indigo-500/50 transition-all cursor-pointer"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <div className="bg-slate-900/80 rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-lg">
        <form onSubmit={handleGenerate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Interviewer Title */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">
                Mülakatı Yapacak Kişinin Unvanı (Title) <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={interviewerTitle}
                onChange={e => setInterviewerTitle(e.target.value)}
                placeholder="Örn: Engineering Manager, Senior HR BP, Lead Data Scientist, VP of Product"
                className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                required
              />
              <div className="mt-2 flex flex-wrap gap-1.5">
                {[
                  'Engineering Manager',
                  'Senior HR Business Partner',
                  'VP of Product',
                  'Chief Software Architect',
                  'Head of Data Science',
                  'Scrum Master / Agile Coach',
                ].map(quickTitle => (
                  <button
                    key={quickTitle}
                    type="button"
                    onClick={() => setInterviewerTitle(quickTitle)}
                    className="text-[11px] px-2 py-0.5 rounded bg-slate-800 hover:bg-indigo-950 text-slate-400 hover:text-indigo-300 border border-slate-700 hover:border-indigo-500/40 transition-colors"
                  >
                    + {quickTitle}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Role */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">
                Başvurduğunuz / Hedef Rol <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={targetRole}
                onChange={e => setTargetRole(e.target.value)}
                placeholder="Örn: Senior Full-Stack Developer, Product Manager, Veri Analisti"
                className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                required
              />
              <p className="mt-1 text-xs text-slate-400">
                Mülakata girdiğiniz spesifik pozisyon unvanı.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Seniority Level */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">
                Kıdem Seviyesi
              </label>
              <select
                value={seniorityLevel}
                onChange={e => setSeniorityLevel(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              >
                <option value="Junior / Yeni Mezun">Junior / Yeni Mezun (0-2 Yıl)</option>
                <option value="Mid / Uzman">Mid-Level / Uzman (2-5 Yıl)</option>
                <option value="Senior / Kıdemli">Senior / Kıdemli (5-8 Yıl)</option>
                <option value="Lead / Principal">Lead / Principal (8+ Yıl)</option>
                <option value="Manager / Yönetici">Yönetici / Director Seviyesi</option>
              </select>
            </div>

            {/* Interview Format */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">
                Mülakat Formatı
              </label>
              <select
                value={interviewFormat}
                onChange={e => setInterviewFormat(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              >
                <option value="Birebir Teknik & Yetkinlik">Birebir Teknik & Yetkinlik</option>
                <option value="İK & Kültür Uyumu (Behavioral)">İK & Kültür Uyumu (Behavioral / STAR)</option>
                <option value="Sistem Mimarisi / Derin Teknik">Sistem Mimarisi & Kod Tasarımı</option>
                <option value="Vaka Çalışması (Case Study) / Sunum">Vaka Çalışması & Problem Çözme</option>
                <option value="Liderlik & Ekip Yönetimi">Liderlik & Yönetici Mülakatı</option>
                <option value="Panel / Çoklu Katılımcı Mülakat">Panel / Çoklu Katılımcı</option>
              </select>
            </div>

            {/* Industry */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">
                Şirket / Sektör
              </label>
              <input
                type="text"
                value={companyIndustry}
                onChange={e => setCompanyIndustry(e.target.value)}
                placeholder="Örn: Finans & B2B SaaS, E-ticaret, Oyun"
                className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* Job Description (Optional) */}
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-2">
              İş İlanı Detayı / Pozisyon Açıklaması <span className="text-xs text-slate-400 font-normal">(İsteğe Bağlı)</span>
            </label>
            <textarea
              rows={2}
              value={jobDescription}
              onChange={e => setJobDescription(e.target.value)}
              placeholder="İlandaki kilit sorumluluklar veya teknolojiler..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            />
          </div>

          {/* Shared Training Content Option */}
          {sharedTrainingContent && (
            <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-xl p-4 flex items-start gap-3">
              <input
                type="checkbox"
                id="includeTrainings"
                checked={includeTrainings}
                onChange={e => setIncludeTrainings(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-indigo-400 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
              <label htmlFor="includeTrainings" className="text-sm text-slate-300 cursor-pointer">
                <span className="font-semibold text-indigo-300">
                  Katıldığım Eğitimlerin İçeriğini Soru Üretimine Entegre Et
                </span>
                <p className="text-xs text-slate-400 mt-0.5">
                  Mülakatçı sorularının içine eğitimlerinizdeki kilit konuları ve bunları nasıl bir koz/avantaj olarak anlatabileceğinize dair özel taktikler eklenir.
                </p>
              </label>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Mülakatçı Profili & Sorular Çıkarılıyor...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Potansiyel Mülakat Sorularını & Stratejiyi Üret</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Results Section */}
      {result && (
        <div className="space-y-8 animate-fadeIn">
          {/* Persona Card */}
          <div className="bg-slate-900 rounded-2xl border border-indigo-500/30 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
              <div className="flex items-start sm:items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-700 flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/30">
                  <UserCheck className="w-7 h-7 text-white" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                    Mülakatçı Profil Analizi
                  </div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">
                    {result.interviewerPersona.title}
                  </h2>
                  <p className="text-sm text-slate-400 mt-0.5">
                    İşe Alım Sürecindeki Etkisi: <span className="text-slate-200 font-medium">{result.interviewerPersona.decisionPower}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    const fullText = JSON.stringify(result, null, 2);
                    copyToClipboard(fullText, 'full-report');
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 flex items-center gap-2 transition-all cursor-pointer"
                >
                  {copiedId === 'full-report' ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Rapor Kopyalandı</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Tümünü Kopyala</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Persona Details Grid */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Focus Areas */}
              <div className="bg-slate-800/60 rounded-xl p-5 border border-slate-700/60">
                <div className="flex items-center gap-2 text-indigo-300 font-semibold text-sm mb-3">
                  <Target className="w-4 h-4" />
                  Neye Bakar? (Odak Alanları)
                </div>
                <ul className="space-y-2">
                  {result.interviewerPersona.focusAreas.map((item, idx) => (
                    <li key={idx} className="text-xs sm:text-sm text-slate-300 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Hidden Agenda */}
              <div className="bg-amber-500/10 rounded-xl p-5 border border-amber-500/20">
                <div className="flex items-center gap-2 text-amber-300 font-semibold text-sm mb-2">
                  <ShieldAlert className="w-4 h-4" />
                  Gizli Ajanda & Asıl Kaygısı
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {result.interviewerPersona.hiddenAgenda}
                </p>
                <div className="mt-3 text-[11px] text-amber-400 font-medium">
                  💡 Bu kaygıyı boşa çıkaran aday mülakatı kazanır.
                </div>
              </div>

              {/* Key Success Factors */}
              <div className="bg-slate-800/60 rounded-xl p-5 border border-slate-700/60">
                <div className="flex items-center gap-2 text-emerald-300 font-semibold text-sm mb-3">
                  <CheckCircle2 className="w-4 h-4" />
                  Bu Kişiyi Etkileyecek 3 Altın Kural
                </div>
                <ul className="space-y-2">
                  {result.interviewerPersona.keySuccessFactors.map((item, idx) => (
                    <li key={idx} className="text-xs sm:text-sm text-slate-300 flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs flex items-center justify-center flex-shrink-0 font-bold">
                        {idx + 1}
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Questions Header & Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-indigo-400" />
                Potansiyel Mülakat Soruları ({filteredQuestions.length})
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Mülakatçının zihnini ve beklentilerini yansıtan yüksek olasılıklı sorular
              </p>
            </div>

            {/* Category Filter Badges */}
            <div className="flex flex-wrap gap-1.5">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategoryFilter(cat)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                    activeCategoryFilter === cat
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Question Cards */}
          <div className="space-y-4">
            {filteredQuestions.map((q, index) => {
              const isExpanded = !!expandedQuestions[q.id || `q${index}`];
              const qId = q.id || `q${index}`;

              return (
                <div
                  key={qId}
                  className="bg-slate-900/90 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all shadow-md overflow-hidden"
                >
                  {/* Question Title Bar */}
                  <div className="p-5 sm:p-6">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          {q.category}
                        </span>
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
                            q.difficulty === 'Kritik'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : q.difficulty === 'Zor'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}
                        >
                          {q.difficulty} Seviye
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Live Practice CTA */}
                        <button
                          onClick={() => onStartSimulation(q.question, result.interviewerPersona.title, targetRole)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-xs font-medium border border-emerald-500/30 flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <PlayCircle className="w-3.5 h-3.5" />
                          <span>Simülatörde Yanıtla</span>
                        </button>

                        <button
                          onClick={() => toggleExpand(qId)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                          title="Detayları Aç / Kapa"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <h4 className="text-base sm:text-lg font-bold text-white leading-snug">
                      "{q.question}"
                    </h4>

                    {/* Interviewer Intent */}
                    <div className="mt-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-start gap-2.5">
                      <Target className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="text-xs font-semibold text-slate-300">
                          Mülakatçının Gizli Amacı (Neden Soruyor?):
                        </span>
                        <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                          {q.interviewerIntent}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Answer Architecture */}
                  {isExpanded && (
                    <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-slate-800 space-y-5 bg-slate-900/50">
                      {/* STAR Framework Breakdown */}
                      {q.idealStarAnswerStructure && (
                        <div className="bg-slate-950/70 rounded-xl p-4 sm:p-5 border border-slate-800">
                          <div className="flex items-center gap-2 text-sm font-bold text-white mb-3">
                            <Layers className="w-4 h-4 text-violet-400" />
                            İdeal STAR Modeliyle Cevap Kurgusu
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                              <span className="text-xs font-bold text-indigo-400 block mb-1">
                                [S] Durum (Situation)
                              </span>
                              <p className="text-xs text-slate-300">
                                {q.idealStarAnswerStructure.situation}
                              </p>
                            </div>
                            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                              <span className="text-xs font-bold text-violet-400 block mb-1">
                                [T] Görev (Task)
                              </span>
                              <p className="text-xs text-slate-300">
                                {q.idealStarAnswerStructure.task}
                              </p>
                            </div>
                            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                              <span className="text-xs font-bold text-amber-400 block mb-1">
                                [A] Eylem (Action)
                              </span>
                              <p className="text-xs text-slate-300">
                                {q.idealStarAnswerStructure.action}
                              </p>
                            </div>
                            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                              <span className="text-xs font-bold text-emerald-400 block mb-1">
                                [R] Sonuç (Result)
                              </span>
                              <p className="text-xs text-slate-300">
                                {q.idealStarAnswerStructure.result}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Keywords & Red Flags */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/40">
                          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-2">
                            <Key className="w-3.5 h-3.5" />
                            Cevabınızda Geçmesi Gereken Anahtar Terimler
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {q.keyKeywords.map((kw, i) => (
                              <span
                                key={i}
                                className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-medium"
                              >
                                {kw}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/40">
                          <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 mb-2">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            Kaçınılması Gereken Kırmızı Bayraklar (Tuzaklar)
                          </div>
                          <ul className="space-y-1">
                            {q.redFlagsToAvoid.map((flag, i) => (
                              <li key={i} className="text-xs text-slate-300 flex items-start gap-1.5">
                                <span className="text-rose-400 font-bold">•</span>
                                <span>{flag}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Model Answer Snippet */}
                      <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/30">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-300">
                            <MessageSquare className="w-3.5 h-3.5" />
                            Örnek Güçlü Cevap Taslağı
                          </div>
                          <button
                            onClick={() => copyToClipboard(q.modelAnswerSnippet, `model-${qId}`)}
                            className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                          >
                            {copiedId === `model-${qId}` ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                            Kopyala
                          </button>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-300 italic leading-relaxed">
                          "{q.modelAnswerSnippet}"
                        </p>
                      </div>

                      {/* Training Connection Hint */}
                      {q.trainingConnectionHint && (
                        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-slate-300 flex items-start gap-2.5">
                          <BookOpen className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="font-semibold text-amber-300">
                              🎓 Eğitimlerinizi Avantaja Çevirme Taktiği:
                            </span>{' '}
                            {q.trainingConnectionHint}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Candidate Reverse Questions */}
          {result.recommendedCandidateQuestions && result.recommendedCandidateQuestions.length > 0 && (
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-xl">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 text-xs font-semibold uppercase tracking-wider mb-2 border border-violet-500/30">
                  <ArrowRight className="w-3.5 h-3.5" /> Ters Soru Sorma Rehberi
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  Mülakat Sonunda Bu Unvana Sormanız Gereken Vizyoner Sorular
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Mülakatın sonunda "Bize sormak istediğiniz bir soru var mı?" dendiğinde bu soruları sorarak akılda kalıcı olun.
                </p>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.recommendedCandidateQuestions.map((cq, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 flex flex-col justify-between"
                  >
                    <div>
                      <h5 className="text-sm font-bold text-white mb-2 leading-snug">
                        "{cq.question}"
                      </h5>
                      <p className="text-xs text-slate-400 mb-2">
                        <strong className="text-slate-300">Neden Sorulmalı:</strong> {cq.whyAskThis}
                      </p>
                    </div>
                    <div className="text-[11px] font-medium text-violet-300 pt-2 border-t border-slate-700/40">
                      🎯 Etki: {cq.impact}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
