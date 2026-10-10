export interface InterviewerPersona {
  title: string;
  focusAreas: string[];
  hiddenAgenda: string;
  decisionPower: string;
  keySuccessFactors: string[];
}

export interface IdealStarAnswerStructure {
  situation: string;
  task: string;
  action: string;
  result: string;
}

export interface InterviewQuestion {
  id: string;
  category: string;
  difficulty: 'Orta' | 'Zor' | 'Kritik';
  question: string;
  interviewerIntent: string;
  idealStarAnswerStructure: IdealStarAnswerStructure;
  keyKeywords: string[];
  redFlagsToAvoid: string[];
  modelAnswerSnippet: string;
  trainingConnectionHint?: string;
}

export interface RecommendedCandidateQuestion {
  question: string;
  whyAskThis: string;
  impact: string;
}

export interface QuestionGenerationResult {
  interviewerPersona: InterviewerPersona;
  questions: InterviewQuestion[];
  recommendedCandidateQuestions: RecommendedCandidateQuestion[];
}

export interface AcquiredSkills {
  hardSkills: string[];
  softSkills: string[];
  toolsAndTech: string[];
}

export interface GapAnalysis {
  missingCrucialSkills: string[];
  niceToHaveSkills: string[];
  industryExpectations: string;
}

export interface NextActionRoadmap {
  immediateActions: string[];
  shortTerm30Days: string[];
  midTerm90Days: string[];
}

export interface PortfolioProjectIdea {
  title: string;
  description: string;
  appliedSkillsFromTrainings: string[];
  businessValue: string;
  githubPortfolioPitch: string;
}

export interface InterviewPitchStrategy {
  howToExplainTrainings: string;
  samplePitchElevator: string;
  cvBulletPoints: string[];
  linkedInHeadlineAndAboutSuggestion: string;
}

export interface RecommendedNextTraining {
  topic: string;
  whyRecommended: string;
  priority: 'Yüksek' | 'Orta' | 'İleri Seviye';
}

export interface CareerAnalysisResult {
  analysisOverview: string;
  competencyMatchScore: number;
  acquiredSkills: AcquiredSkills;
  gapAnalysis: GapAnalysis;
  nextActionRoadmap: NextActionRoadmap;
  portfolioProjectIdeas: PortfolioProjectIdea[];
  interviewPitchStrategy: InterviewPitchStrategy;
  recommendedNextTrainings: RecommendedNextTraining[];
}

export interface AnswerEvaluationResult {
  score: number;
  verdict: 'Mükemmel' | 'Güçlü' | 'Geliştirilmeli' | 'Yetersiz';
  strengths: string[];
  weaknesses: string[];
  starComplianceAssessment: string;
  improvedAnswerSuggestion: string;
  coachTip: string;
  followUpQuestion: string;
}
