import { Document } from '../types';

const STORAGE_KEY = 'kmrl_documents';
const ALERTS_KEY = 'kmrl_alerts';
const COMPLIANCE_KEY = 'kmrl_compliance';

export interface StoredDocument extends Document {
  file?: {
    name: string;
    size: number;
    type: string;
    base64: string;
  };
  extractedText?: string;
  aiAnalysis?: {
    departments: string[];
    isCritical: boolean;
    criticalityReason?: string;
    summary: string;
    keyPoints: string[];
    entities: Record<string, any>;
  };
}

export const documentStorage = {
  getAllDocuments(): StoredDocument[] {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  saveDocument(doc: StoredDocument): void {
    const docs = this.getAllDocuments();
    docs.push(doc);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
  },

  updateDocument(id: string, updates: Partial<StoredDocument>): void {
    const docs = this.getAllDocuments();
    const index = docs.findIndex(d => d.id === id);
    if (index !== -1) {
      docs[index] = { ...docs[index], ...updates };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
    }
  },

  getDocumentById(id: string): StoredDocument | undefined {
    return this.getAllDocuments().find(d => d.id === id);
  },

  searchDocuments(query: string, language: string = 'english'): StoredDocument[] {
    const docs = this.getAllDocuments();
    const lowerQuery = query.toLowerCase();

    return docs.filter(doc => {
      const matchesTitle = doc.title.toLowerCase().includes(lowerQuery);
      const matchesTags = doc.tags.some(tag => tag.toLowerCase().includes(lowerQuery));
      const matchesText = doc.extractedText?.toLowerCase().includes(lowerQuery);
      const matchesSummary = doc.summary?.toLowerCase().includes(lowerQuery);

      return matchesTitle || matchesTags || matchesText || matchesSummary;
    });
  },

  createAlert(alert: any): void {
    const alerts = JSON.parse(localStorage.getItem(ALERTS_KEY) || '[]');
    alerts.unshift(alert);
    localStorage.setItem(ALERTS_KEY, JSON.stringify(alerts));
  },

  createComplianceItem(item: any): void {
    const items = JSON.parse(localStorage.getItem(COMPLIANCE_KEY) || '[]');
    items.unshift(item);
    localStorage.setItem(COMPLIANCE_KEY, JSON.stringify(items));
  }
};
