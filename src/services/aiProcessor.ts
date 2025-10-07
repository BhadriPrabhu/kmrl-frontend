import Tesseract from 'tesseract.js';

export interface AIAnalysisResult {
  departments: string[];
  isCritical: boolean;
  criticalityReason?: string;
  summary: string;
  keyPoints: string[];
  entities: {
    names: string[];
    departments: string[];
    dates: string[];
    amounts: string[];
  };
}

const DEPARTMENT_KEYWORDS: Record<string, string[]> = {
  'Operations': ['station', 'operation', 'control', 'passenger', 'service', 'schedule'],
  'Engineering': ['maintenance', 'repair', 'technical', 'equipment', 'track', 'infrastructure'],
  'Finance': ['budget', 'finance', 'payment', 'cost', 'revenue', 'expense', 'invoice'],
  'Human Resources': ['employee', 'recruitment', 'hr', 'staff', 'personnel', 'leave', 'salary'],
  'IT': ['system', 'software', 'network', 'technology', 'database', 'application'],
  'Procurement': ['purchase', 'procurement', 'vendor', 'supply', 'contract', 'tender'],
  'Safety': ['safety', 'emergency', 'security', 'hazard', 'accident', 'compliance', 'risk']
};

const CRITICAL_KEYWORDS = [
  'urgent', 'emergency', 'critical', 'immediate', 'asap', 'priority',
  'accident', 'failure', 'risk', 'danger', 'severe', 'crisis'
];

export const aiProcessor = {
  async extractTextFromImage(file: File): Promise<string> {
    try {
      const result = await Tesseract.recognize(file, 'eng', {
        logger: m => console.log(m)
      });
      return result.data.text;
    } catch (error) {
      console.error('OCR Error:', error);
      return '';
    }
  },

  async extractTextFromPDF(file: File): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const text = e.target?.result as string;
          resolve(text);
        } catch (error) {
          console.error('PDF extraction error:', error);
          resolve('');
        }
      };
      reader.readAsText(file);
    });
  },

  async processDocument(file: File, metadata: any): Promise<{ text: string; analysis: AIAnalysisResult }> {
    let extractedText = '';

    if (file.type.startsWith('image/')) {
      extractedText = await this.extractTextFromImage(file);
    } else if (file.type === 'application/pdf') {
      extractedText = await this.extractTextFromPDF(file);
    } else if (file.type === 'text/plain') {
      extractedText = await file.text();
    }

    const analysis = this.analyzeText(extractedText, metadata);

    return { text: extractedText, analysis };
  },

  analyzeText(text: string, metadata: any): AIAnalysisResult {
    const lowerText = text.toLowerCase();

    const detectedDepartments = this.detectDepartments(lowerText);
    const isCritical = this.assessCriticality(lowerText);
    const entities = this.extractEntities(text);
    const keyPoints = this.extractKeyPoints(text);
    const summary = this.generateSummary(text, metadata);

    return {
      departments: detectedDepartments.length > 0 ? detectedDepartments : [metadata.department],
      isCritical,
      criticalityReason: isCritical ? 'Document contains critical keywords requiring immediate attention' : undefined,
      summary,
      keyPoints,
      entities
    };
  },

  detectDepartments(text: string): string[] {
    const detected: string[] = [];

    for (const [dept, keywords] of Object.entries(DEPARTMENT_KEYWORDS)) {
      const matches = keywords.filter(keyword => text.includes(keyword.toLowerCase()));
      if (matches.length >= 2) {
        detected.push(dept);
      }
    }

    return detected;
  },

  assessCriticality(text: string): boolean {
    return CRITICAL_KEYWORDS.some(keyword => text.includes(keyword.toLowerCase()));
  },

  extractEntities(text: string): AIAnalysisResult['entities'] {
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const dateRegex = /\b\d{1,2}[-/]\d{1,2}[-/]\d{2,4}\b/g;
    const amountRegex = /(?:Rs\.?|₹)\s*[\d,]+(?:\.\d{2})?/gi;

    const names: string[] = [];
    const lines = text.split('\n');
    lines.forEach(line => {
      const nameMatch = line.match(/name[:\s]+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i);
      if (nameMatch && nameMatch[1]) {
        names.push(nameMatch[1]);
      }
    });

    return {
      names: [...new Set(names)],
      departments: Object.keys(DEPARTMENT_KEYWORDS).filter(dept =>
        text.toLowerCase().includes(dept.toLowerCase())
      ),
      dates: [...new Set(text.match(dateRegex) || [])],
      amounts: [...new Set(text.match(amountRegex) || [])]
    };
  },

  extractKeyPoints(text: string): string[] {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
    const importantSentences = sentences.filter(s => {
      const lower = s.toLowerCase();
      return lower.includes('important') ||
             lower.includes('require') ||
             lower.includes('must') ||
             lower.includes('critical') ||
             lower.includes('ensure');
    });

    return importantSentences.slice(0, 5).map(s => s.trim());
  },

  generateSummary(text: string, metadata: any): string {
    const words = text.split(/\s+/).length;
    const lines = text.split('\n').filter(l => l.trim()).length;

    return `${metadata.title || 'Document'} - ${metadata.type || 'Document'} for ${metadata.department || 'General'} department. Contains ${words} words across ${lines} lines. Document requires review and approval as per departmental protocols.`;
  },

  isWorkingHours(): boolean {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay();

    const isWeekday = day >= 1 && day <= 5;
    const isWorkHours = hour >= 9 && hour < 18;

    return isWeekday && isWorkHours;
  }
};
