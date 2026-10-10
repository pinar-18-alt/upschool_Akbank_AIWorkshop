export interface InterviewPreset {
  id: string;
  name: string;
  interviewerTitle: string;
  targetRole: string;
  companyIndustry: string;
  seniorityLevel: string;
  interviewFormat: string;
  jobDescription: string;
  userTrainingsSummary: string;
}

export interface TrainingPreset {
  id: string;
  name: string;
  targetRole: string;
  currentRole: string;
  careerGoals: string;
  trainingContent: string;
}

export const INTERVIEW_PRESETS: InterviewPreset[] = [
  {
    id: 'em-fullstack',
    name: 'Engineering Manager ➔ Senior Full-Stack Mühendisi',
    interviewerTitle: 'Engineering Manager / Yazılım Mühendisliği Müdürü',
    targetRole: 'Senior Full-Stack Developer (React & Node.js / TypeScript)',
    companyIndustry: 'B2B SaaS / Finans Teknolojileri (Fintech)',
    seniorityLevel: 'Senior (5+ Yıl Deneyim)',
    interviewFormat: 'Teknik Değerlendirme & Mimari Kararlar Mülakatı',
    jobDescription: 'Yüksek trafikli ödeme sistemleri ve finansal analitik platformunun modernizasyonu, mikroservis mimarisine geçiş ve junior geliştiricilere mentorluk.',
    userTrainingsSummary: 'İleri Seviye Sistem Tasarımı ve Dağıtık Mimari Bootcampleri, AWS Solutions Architect hazırlık kursu, Modern Next.js 14 & NestJS Enterprise Mimarisi sertifikası.',
  },
  {
    id: 'hr-data',
    name: 'İK Direktörü ➔ Veri Analisti / Data Scientist',
    interviewerTitle: 'Kıdemli İK İş Ortağı (Senior HR Business Partner)',
    targetRole: 'Data Analyst & Business Intelligence Specialist',
    companyIndustry: 'E-ticaret ve Perakende Analitiği',
    seniorityLevel: 'Mid-Level (2-4 Yıl Deneyim)',
    interviewFormat: 'Yetkinlik & Kültür Uyumu (Behavioral / STAR Mülakatı)',
    jobDescription: 'Müşteri kayıp (churn) analizi, pazarlama kampanyası ROI modellemeleri, Power BI ve SQL ile yönetim dashboardları geliştirme.',
    userTrainingsSummary: 'Python ile İleri Seviye Veri Analizi ve Makine Öğrenimi Kursu, Power BI & DAX İleri Düzey Modelleme Sertifikası, Agile Scrum Uygulayıcı Eğitimi.',
  },
  {
    id: 'vp-product',
    name: 'VP of Product (Ürün Başkan Yrd.) ➔ Product Manager',
    interviewerTitle: 'VP of Product / Ürün Direktörü',
    targetRole: 'Senior Product Manager (B2C Mobil Ürünler)',
    companyIndustry: 'Mobil Oyun & Abonelik Tabanlı Dijital Hizmetler',
    seniorityLevel: 'Senior / Lead',
    interviewFormat: 'Strateji, Vaka (Case Study) & Ürün Vizyonu Mülakatı',
    jobDescription: 'Abonelik dönüşüm hunisini optimize etme, kullanıcı edinme maliyetlerini düşürme, çapraz fonksiyonlu tasarım ve mühendislik takımlarına ürün liderliği yapma.',
    userTrainingsSummary: 'Product School Ürün Yönetimi Sertifikası, Büyüme (Growth) & A/B Testleri Metodolojisi Eğitimi, SQL ile Ürün Metrikleri ve Kohort Analizi.',
  },
  {
    id: 'lead-arch',
    name: 'Baş Mimar (Chief Architect) ➔ Backend Go/Java Geliştirici',
    interviewerTitle: 'Chief Software Architect (Baş Yazılım Mimarı)',
    targetRole: 'Backend Developer (Go / Distributed Systems)',
    companyIndustry: 'Yüksek Frekanslı Veri İşleme & Lojistik Optimizasyonu',
    seniorityLevel: 'Senior / Specialist',
    interviewFormat: 'Derinlemesine Sistem Mimarisi & Kod Tasarımı',
    jobDescription: 'Event-driven mimari, Kafka ile asenkron kuyruk yönetimi, düşük gecikmeli (low-latency) API servisleri ve Redis önbellek stratejileri tasarlama.',
    userTrainingsSummary: 'Concurrency & Go internals derinlemesine eğitimi, Apache Kafka ve Event Sourcing Masterclass, Kubernetes ile Cloud-Native Uygulama Yönetimi.',
  },
];

export const TRAINING_PRESETS: TrainingPreset[] = [
  {
    id: 'fullstack-bootcamp',
    name: 'Modern Full-Stack Web Geliştirme Bootcamp (140 Saat)',
    targetRole: 'Full-Stack Developer (React, TypeScript, Node.js)',
    currentRole: 'Junior Frontend Geliştirici / Yeni Mezun',
    careerGoals: 'Fintech veya küresel bir teknoloji şirketinde uçtan uca modern web uygulamaları geliştiren kıdemli bir mühendis olmak.',
    trainingContent: `Modül 1: İleri Düzey JavaScript ES6+ & TypeScript Tip Güvenliği
Modül 2: React 19, Modern State Management (Zustand, TanStack Query), Custom Hooks, SSR & Performance
Modül 3: Node.js & Express / NestJS ile REST ve GraphQL API Mimarisi, JWT & OAuth Güvenlik Standartları
Modül 4: PostgreSQL, Prisma ORM, İlişkisel Veritabanı Modelleme ve İndeksleme
Modül 5: Docker ile Konteynerlaştırma, CI/CD GitHub Actions ve Buluta Dağıtım (Vercel & AWS EC2)
Modül 6: Test Otomasyonu (Jest, Vitest, Playwright ile E2E Testler)`,
  },
  {
    id: 'data-ai-bootcamp',
    name: 'Veri Bilimi, Büyük Veri & Üretken Yapay Zeka Uzmanlığı',
    targetRole: 'AI & Data Specialist / Makine Öğrenimi Mühendisi',
    currentRole: 'Veri Analisti / SQL Uzmanı',
    careerGoals: 'Geleneksel raporlamadan çıkıp LLM entegrasyonları, RAG mimarileri ve kestirimci modeller üreten AI departmanına liderlik etmek.',
    trainingContent: `Modül 1: İleri Python (NumPy, Pandas, Polars) ile Büyük Veri Manipülasyonu
Modül 2: İstatistiksel Modelleme, Hipotez Testleri ve A/B Deneyleri
Modül 3: Scikit-learn ile Makine Öğrenimi (Sınıflandırma, Regresyon, Kümeleme, XGBoost)
Modül 4: Derin Öğrenme Temelleri (PyTorch, CNN, RNN)
Modül 5: LLM Entegrasyonları, Prompt Engineering, LangChain & Vektör Veritabanları (Pinecone, ChromaDB)
Modül 6: Model Dağıtımı: FastAPI ile AI Servisleri ve Docker Containerization`,
  },
  {
    id: 'cloud-devops',
    name: 'AWS Cloud Solutions & DevOps Mühendisliği Eğitimi',
    targetRole: 'Cloud / DevOps Engineer',
    currentRole: 'Sistem Yöneticisi / Backend Developer',
    careerGoals: 'Bulut mimarilerini sıfırdan kurabilen, altyapıyı kod olarak (IaC) yöneten ve yüksek erişilebilirlik sağlayan bir Cloud Mühendisi olmak.',
    trainingContent: `Modül 1: AWS Çekirdek Servisleri (VPC, EC2, S3, IAM Güvenlik Politikaları, RDS)
Modül 2: Infrastructure as Code (Terraform ile AWS Altyapı Otomasyonu)
Modül 3: Konteyner Düzenleme: Docker & Kubernetes (EKS) Küme Yönetimi
Modül 4: CI/CD Pipeline Otomasyonu (GitLab CI, GitHub Actions, ArgoCD ile GitOps)
Modül 5: İzlenebilirlik ve Güvenlik: Prometheus, Grafana, AWS CloudWatch, Vault`,
  },
  {
    id: 'product-management',
    name: 'Dijital Ürün Yönetimi & Çevik Ürün Liderliği',
    targetRole: 'Product Owner / Ürün Müdürü (PM)',
    currentRole: 'İş Analisti / Proje Yöneticisi',
    careerGoals: 'Kullanıcı araştırmalarından veri odaklı ürün stratejisine kadar tüm ürün yaşam döngüsünü yönetebilmek.',
    trainingContent: `Modül 1: Kullanıcı Araştırmaları, Persona Çıkarma ve Problem Tanımlama (Design Thinking)
Modül 2: Ürün Yol Haritası (Roadmap) Hazırlama, Önceliklendirme Çerçeveleri (RICE, MoSCoW, Kano)
Modül 3: Ürün Metrikleri (North Star, CAC, LTV, Churn, Retention) ve Veri Odaklı Karar Alma
Modül 4: Çevik Yönetim (Scrum, Kanban, User Story Yazımı, Kabul Kriterleri)
Modül 5: Go-to-Market (GTM) Stratejisi ve Ürün Lansman Yönetimi`,
  },
];
