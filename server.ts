import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Server-side Gemini AI client initialization
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const PRIMARY_MODEL = 'gemini-2.5-flash';
const FALLBACK_MODEL = 'gemini-3.8-flash';

async function generateWithFallback(options: {
  systemPrompt: string;
  userPrompt: string;
}): Promise<string> {
  const modelsToTry = [PRIMARY_MODEL, FALLBACK_MODEL, 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
  let lastError: any = null;

  for (const model of modelsToTry) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: options.userPrompt,
          config: {
            systemInstruction: options.systemPrompt,
            temperature: 0.7,
            responseMimeType: 'application/json',
          },
        });
        if (response.text) {
          return response.text;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${model} attempt ${attempt} failed:`, err?.message || err);
        // Wait 800ms before retrying
        await new Promise(r => setTimeout(r, 800));
      }
    }
  }

  throw lastError || new Error('Model yanıt veremedi.');
}

// Helper to clean Markdown code block wrappers from Gemini JSON outputs
function cleanJsonOutput(text: string): string {
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.substring(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.substring(3);
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.substring(0, cleaned.length - 3);
  }
  return cleaned.trim();
}

// 1. Generate Interview Questions tailored to Interviewer Persona and Training context
app.post('/api/generate-questions', async (req, res) => {
  const start = Date.now();
  console.log('[API] /api/generate-questions started');
  try {
    const {
      interviewerTitle,
      targetRole,
      companyIndustry = 'Genel Teknoloji / Kurumsal',
      seniorityLevel = 'Mid / Senior',
      interviewFormat = 'Birebir Mülakat',
      jobDescription = '',
      userTrainingsSummary = '',
    } = req.body;

    if (!interviewerTitle || !targetRole) {
      return res.status(400).json({ error: 'Mülakatçı unvanı ve hedef pozisyon zorunludur.' });
    }

    console.log(`[API] Processing for "${interviewerTitle}" - "${targetRole}"`);

    const systemPrompt = `Sen dünyanın en deneyimli mülakat koçu, teknik işe alım direktörü ve kariyer mentörüsün.
Kullanıcının gireceği mülakatta karşısına oturacak kişinin unvanına göre (örneğin: Engineering Manager, HR BP, Lead Data Scientist, VP of Product, CTO vb.) psikolojik profilini, beklentilerini, gizli ajandasını çıkaracak ve bu kişinin soracağı en kritik soruları üreteceksin.

Eğer adayın aldığı eğitimlerin içeriği verilmişse, soruların içine ve cevap stratejilerine adayın bu eğitimleri nasıl bir koz olarak kullanacağını da entegre et.

Yanıtını YALNIZCA geçerli bir JSON formatında ver. Hiçbir Markdown formatlama etiketi (\`\`\`json) veya fazladan açıklama yazma.`;

    const userPrompt = `
MÜLAKAT BİLGİLERİ:
- Mülakatı Yapacak Kişinin Unvanı (Interviewer Title): "${interviewerTitle}"
- Adayın Başvurduğu / Hedef Pozisyon: "${targetRole}"
- Şirket & Sektör: "${companyIndustry}"
- Seviye: "${seniorityLevel}"
- Mülakat Formatı: "${interviewFormat}"
${jobDescription ? `- İş İlanı / Açıklaması: "${jobDescription}"` : ''}
${userTrainingsSummary ? `- Adayın Katıldığı Eğitimler & Sertifikalar: "${userTrainingsSummary}"` : ''}

Aşağıdaki şemaya BİREBİR uyan geçerli bir JSON nesnesi üret:
{
  "interviewerPersona": {
    "title": "${interviewerTitle}",
    "focusAreas": ["Bu unvandaki kişinin en çok aradığı 3-4 temel kriter"],
    "hiddenAgenda": "Bu unvandaki kişinin adayı elerken ya da seçerken aklındaki asıl gizli kaygısı/amacı nedir?",
    "decisionPower": "İşe alım sürecindeki etki alanı ve karar gücü",
    "keySuccessFactors": ["Bu kişiyi etkilemek için dikkat edilmesi gereken 3 altın kural"]
  },
  "questions": [
    {
      "id": "q1",
      "category": "Teknik / Rol Yetkinliği",
      "difficulty": "Kritik",
      "question": "Mülakatçının soracağı net soru",
      "interviewerIntent": "Mülakatçı bu soruda adayın hangi yönünü ölçmek istiyor?",
      "idealStarAnswerStructure": {
        "situation": "Durum için önerilen yaklaşım",
        "task": "Görev/hedef tanımı",
        "action": "Adayın atması gereken somut eylemler",
        "result": "Vurgulanması gereken ölçülebilir sonuç"
      },
      "keyKeywords": ["Cevapta geçmesi gereken vurucu anahtar kelimeler"],
      "redFlagsToAvoid": ["Adayın asla yapmaması gereken hata veya kırmızı bayraklar"],
      "modelAnswerSnippet": "Kısa, güçlü ve ikna edici örnek cevap taslağı",
      "trainingConnectionHint": "Adayın aldığı eğitimleri bu soruya nasıl avantaja çevirip referans verebileceği (eğer eğitim bilgisi varsa)"
    }
  ],
  "recommendedCandidateQuestions": [
    {
      "question": "Adayın mülakat sonunda '${interviewerTitle}' unvanına sorması gereken vizyoner ve etkileyici soru",
      "whyAskThis": "Neden bu soru sorulmalı?",
      "impact": "Mülakatçı üzerinde yaratacağı etki"
    }
  ]
}

En az 6-8 adet derinlemesine, unvanın psikolojisine ve hedefe tam oturan soru üret. Sorular klişe değil, gerçek hayatta o pozisyondaki yöneticilerin sorduğu yüksek kaliteli sorular olsun.`;

    const outputText = await generateWithFallback({
      systemPrompt,
      userPrompt,
    });

    const parsedData = JSON.parse(cleanJsonOutput(outputText));
    console.log(`[API] Generated in ${Date.now() - start}ms, questions: ${parsedData.questions?.length}`);
    res.json(parsedData);
  } catch (error: any) {
    console.error('Error generating questions:', error);
    res.status(500).json({
      error: 'Mülakat soruları üretilirken bir hata oluştu: ' + (error?.message || 'Bilinmeyen hata'),
    });
  }
});

// 2. Analyze Course/Training Contents and Recommend Next Steps + Career Roadmap
app.post('/api/analyze-career', async (req, res) => {
  try {
    const {
      trainingContent,
      currentRole = '',
      targetRole,
      careerGoals = '',
    } = req.body;

    if (!trainingContent || !targetRole) {
      return res.status(400).json({ error: 'Eğitim içeriği ve hedef pozisyon zorunludur.' });
    }

    const systemPrompt = `Sen üst düzey bir Kariyer Koçu, Yetenek Geliştirme Danışmanı ve Kıdemli Mentor'sun.
Kullanıcının katıldığı veya tamamladığı eğitimlerin/kursların içeriklerini (müfredat, modüller, konular, kazanımlar) inceleyerek:
1. Bu eğitimlerin kişiye sağladığı hard & soft skill envanterini çıkar.
2. Hedeflediği pozisyona göre eksik kalan (Gap Analysis) kritik noktaları belirle.
3. "Sonraki Adımda Ne Yapmalısın?" sorusuna net, pratik ve takvimlendirilmiş bir eylem planı sun.
4. Bu eğitimleri mülakatlarda nasıl ezber değil de 'sahada uygulanmış yetkinlik' gibi satabileceğini (Pitch & Elevator Speech) göster.
5. Portföy/GitHub için eğitim kazanımlarını kanıtlayacak gerçekçi bitirme proje senaryoları tasarla.

Yanıtını YALNIZCA geçerli bir JSON formatında ver.`;

    const userPrompt = `
KULLANICI BİLGİLERİ VE EĞİTİM İÇERİĞİ:
- Katılınan Eğitimlerin İçeriği / Müfredatı:
"""
${trainingContent}
"""
- Mevcut Durum / Unvan: "${currentRole || 'Belirtilmedi'}"
- Hedeflenen Pozisyon / Kariyer Hedefi: "${targetRole}"
${careerGoals ? `- Özel Hedefler / İlgi Alanları: "${careerGoals}"` : ''}

Aşağıdaki şemaya BİREBİR uyan JSON üret:
{
  "analysisOverview": "Eğitimlerin hedef pozisyonla uyumunun genel değerlendirmesi ve profesyonel görüş özeti",
  "competencyMatchScore": 78,
  "acquiredSkills": {
    "hardSkills": ["Eğitimlerden kazanılan teknik beceriler"],
    "softSkills": ["Metodoloji, analitik düşünme, takım çalışması vb."],
    "toolsAndTech": ["Eğitimde öğrenilen araçlar, kütüphaneler, teknolojiler"]
  },
  "gapAnalysis": {
    "missingCrucialSkills": ["Hedef pozisyon için henüz eksik kalan ve piyasada en çok aranan 3-4 kritik yetkinlik"],
    "niceToHaveSkills": ["Fark yaratacak artı değer becerileri"],
    "industryExpectations": "Sektörün bu roldeki adaydan pratikte beklediği zihniyet ve deneyim çıtası"
  },
  "nextActionRoadmap": {
    "immediateActions": ["Bu hafta / ilk 14 gün içinde yapılması gereken 3 acil somut adım"],
    "shortTerm30Days": ["30 gün içinde tamamlanacak kilometre taşları"],
    "midTerm90Days": ["90 gün içinde hedefe tam ulaşmak için stratejik adımlar"]
  },
  "portfolioProjectIdeas": [
    {
      "title": "Proje Başlığı (Eğitimleri Kanıtlayan)",
      "description": "Projenin gerçek hayat iş problemi ve senaryosu",
      "appliedSkillsFromTrainings": ["Eğitimden hangi konular burada pratiğe dökülüyor?"],
      "businessValue": "İşverenin gözünde neden çok değerli bir proje?",
      "githubPortfolioPitch": "GitHub README veya portföyde nasıl anlatılmalı?"
    }
  ],
  "interviewPitchStrategy": {
    "howToExplainTrainings": "Mülakatçılara 'sadece kurs izlemiş biri' gibi değil, 'öğrendiğini üretime dönüştüren bir profesyonel' gibi nasıl anlatılır?",
    "samplePitchElevator": "Mülakatta kendini ve bu eğitim kazanımlarını özetleyen 60 saniyelik etkileyici konuşma metni",
    "cvBulletPoints": [
      "CV'ye doğrudan eklenebilecek eylem ve etki odaklı 3-4 madde örneği (Action Verb + Skill + Metric/Outcome)"
    ],
    "linkedInHeadlineAndAboutSuggestion": "LinkedIn başlığı ve Hakkında kısmı için öneri metni"
  },
  "recommendedNextTrainings": [
    {
      "topic": "Sıradaki öğrenilmesi gereken konu veya sertifika",
      "whyRecommended": "Neden tam olarak bu konu?",
      "priority": "Yüksek"
    }
  ]
}`;

    const outputText = await generateWithFallback({
      systemPrompt,
      userPrompt,
    });

    const parsedData = JSON.parse(cleanJsonOutput(outputText));
    res.json(parsedData);
  } catch (error: any) {
    console.error('Error analyzing career:', error);
    res.status(500).json({
      error: 'Kariyer ve eğitim analizi yapılırken bir hata oluştu: ' + (error?.message || 'Bilinmeyen hata'),
    });
  }
});

// 3. Live Interactive Mock Interview Answer Evaluation
app.post('/api/evaluate-answer', async (req, res) => {
  try {
    const {
      interviewerTitle,
      targetRole,
      question,
      candidateAnswer,
      userTrainingsSummary = '',
    } = req.body;

    if (!question || !candidateAnswer) {
      return res.status(400).json({ error: 'Soru ve aday cevabı zorunludur.' });
    }

    const systemPrompt = `Sen '${interviewerTitle}' unvanına sahip zorlu ama adil bir mülakatçısın ve aynı zamanda üst düzey bir mülakat koçusun.
Adayın cevabını bu unvanın gözünden değerlendireceksin. 
Cevabın STAR yapısına (Situation, Task, Action, Result), netliğine, ikna ediciliğine ve teknik/rol derinliğine bakacaksın.

Yanıtını YALNIZCA geçerli bir JSON formatında ver.`;

    const userPrompt = `
MÜLAKAT ROLLERİ:
- Mülakatçı Unvanı: "${interviewerTitle || 'Kıdemli Mülakatçı'}"
- Adayın Hedef Rolü: "${targetRole || 'Aday'}"
${userTrainingsSummary ? `- Adayın Eğitim Geçmişi: "${userTrainingsSummary}"` : ''}

SORULAN SORU:
"${question}"

ADAYIN VERDİĞİ CEVAP:
"""
${candidateAnswer}
"""

Aşağıdaki şemaya göre JSON formatında değerlendirme sun:
{
  "score": 8,
  "verdict": "Güçlü",
  "strengths": ["Cevapta mülakatçının beğendiği 2-3 güçlü nokta"],
  "weaknesses": ["Eksik kalan, belirsiz ya da zayıf düşen noktalar"],
  "starComplianceAssessment": "STAR modeline uygunluk analizi ve nerede aksadığı",
  "improvedAnswerSuggestion": "Adayın söylediklerini koruyarak çok daha profesyonel, etkileyici ve sonuç odaklı hale getirilmiş örnek ideal cevap",
  "coachTip": "'${interviewerTitle}' unvanındaki kişiyi tam kalbinden vuracak 1 kritik tavsiye",
  "followUpQuestion": "Bu cevabın üzerine mülakatçının soracağı potansiyel sıkıştırıcı takip sorusu (Follow-up question)"
}`;

    const outputText = await generateWithFallback({
      systemPrompt,
      userPrompt,
    });

    const parsedData = JSON.parse(cleanJsonOutput(outputText));
    res.json(parsedData);
  } catch (error: any) {
    console.error('Error evaluating answer:', error);
    res.status(500).json({
      error: 'Cevap değerlendirilirken bir hata oluştu: ' + (error?.message || 'Bilinmeyen hata'),
    });
  }
});

// Vite middleware integration for dev / static for prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Interview & Career Coach Server is running on port ${PORT}`);
  });
}

startServer();
