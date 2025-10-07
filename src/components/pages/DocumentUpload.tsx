import React, { useState } from 'react';
import { Send, Tag, Globe, Building, AlertCircle } from 'lucide-react';
import FileUpload from '../Upload/FileUpload';
import { aiProcessor } from '../../services/aiProcessor';
import { documentStorage, StoredDocument } from '../../services/documentStorage';
import { whatsappService } from '../../services/whatsappService';
import { useLanguage } from '../../context/LanguageContext';

const DocumentUpload: React.FC = () => {
  const [uploadForm, setUploadForm] = useState({
    title: '',
    type: '',
    department: '',
    language: 'english',
    tags: '',
    description: ''
  });
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [extractedText, setExtractedText] = useState('');
  const [routedDepartments, setRoutedDepartments] = useState<string[]>([]);
  const [whatsappSent, setWhatsappSent] = useState(false);
  const { t } = useLanguage();

  const handleFileUpload = (files: File[]) => {
    setUploadedFiles(files);
    console.log('Files uploaded:', files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadedFiles.length === 0) {
      alert(t('upload.selectFile') || 'Please upload a document first!');
      return;
    }

    setIsLoading(true);
    setSuccessMessage('');
    setExtractedText('');
    setRoutedDepartments([]);
    setWhatsappSent(false);

    try {
      const file = uploadedFiles[0];
      const { text, analysis } = await aiProcessor.processDocument(file, uploadForm);

      setExtractedText(text);

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;

        const document: StoredDocument = {
          id: Date.now().toString(),
          title: uploadForm.title,
          type: uploadForm.type,
          department: uploadForm.department,
          uploadedBy: 'Current User',
          uploadedAt: new Date().toISOString().split('T')[0],
          fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
          language: uploadForm.language as any,
          status: 'ready',
          tags: uploadForm.tags.split(',').map(t => t.trim()).filter(Boolean),
          summary: analysis.summary,
          extractedText: text,
          file: {
            name: file.name,
            size: file.size,
            type: file.type,
            base64: base64.split(',')[1] || base64
          },
          aiAnalysis: analysis
        };

        documentStorage.saveDocument(document);

        setRoutedDepartments(analysis.departments);

        analysis.departments.forEach(dept => {
          documentStorage.createAlert({
            id: `alert-${Date.now()}-${dept}`,
            type: 'new_document',
            title: `New Document for ${dept}`,
            message: `${uploadForm.title} requires review`,
            priority: analysis.isCritical ? 'critical' : 'medium',
            createdAt: new Date().toISOString(),
            isRead: false,
            department: dept
          });

          documentStorage.createComplianceItem({
            id: `comp-${Date.now()}-${dept}`,
            title: `Review: ${uploadForm.title}`,
            description: analysis.summary,
            deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: 'pending',
            assignedTo: `${dept} Team`,
            department: dept,
            documentId: document.id,
            priority: analysis.isCritical ? 'critical' : 'medium'
          });
        });

        if (analysis.isCritical && !aiProcessor.isWorkingHours()) {
          whatsappService.sendCriticalAlert({
            to: '+919876543210',
            summary: analysis.summary,
            dashboardLink: `${window.location.origin}/dashboard`,
            documentTitle: uploadForm.title,
            department: analysis.departments.join(', '),
            priority: 'CRITICAL'
          });
          setWhatsappSent(true);
        }

        setSuccessMessage(`Document "${uploadForm.title}" processed successfully and routed to: ${analysis.departments.join(', ')}`);
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Processing error:', error);
      setSuccessMessage('Error processing document. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const departments = [
    'Operations',
    'Engineering',
    'Finance',
    'Human Resources',
    'IT',
    'Procurement',
    'Safety'
  ];

  const documentTypes = [
    'Policy Document',
    'Technical Manual',
    'Financial Report',
    'Safety Protocol',
    'Compliance Document',
    'Training Material',
    'Other'
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('upload.title')}</h1>
        <p className="mt-1 text-sm text-gray-600">
          {t('upload.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* File Upload Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">{t('upload.uploadFiles')}</h2>
          <FileUpload onFileUpload={handleFileUpload} />
          {uploadedFiles.length > 0 && (
            <p className="mt-2 text-sm text-gray-600">Selected: {uploadedFiles.map(f => f.name).join(', ')}</p>
          )}
        </div>

        {/* Metadata Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">{t('upload.documentDetails')}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('upload.documentTitle')} *
              </label>
              <input
                type="text"
                value={uploadForm.title}
                onChange={(e) => setUploadForm({...uploadForm, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={t('upload.enterTitle')}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Building className="inline h-4 w-4 mr-1" />
                  {t('upload.department')}
                </label>
                <select
                  value={uploadForm.department}
                  onChange={(e) => setUploadForm({...uploadForm, department: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">{t('upload.selectDepartment')}</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('upload.documentType')}
                </label>
                <select
                  value={uploadForm.type}
                  onChange={(e) => setUploadForm({...uploadForm, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">{t('upload.selectType')}</option>
                  {documentTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Globe className="inline h-4 w-4 mr-1" />
                {t('upload.primaryLanguage')}
              </label>
              <div className="flex space-x-4">
                {[
                  { value: 'english', label: 'English' },
                  { value: 'malayalam', label: 'Malayalam' },
                  { value: 'both', label: 'Both' }
                ].map(lang => (
                  <label key={lang.value} className="flex items-center">
                    <input
                      type="radio"
                      name="language"
                      value={lang.value}
                      checked={uploadForm.language === lang.value}
                      onChange={(e) => setUploadForm({...uploadForm, language: e.target.value})}
                      className="mr-2"
                    />
                    {lang.label}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Tag className="inline h-4 w-4 mr-1" />
                {t('upload.tags')}
              </label>
              <input
                type="text"
                value={uploadForm.tags}
                onChange={(e) => setUploadForm({...uploadForm, tags: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={t('upload.enterTags')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('upload.description')}
              </label>
              <textarea
                value={uploadForm.description}
                onChange={(e) => setUploadForm({...uploadForm, description: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={t('upload.optionalDescription')}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || uploadedFiles.length === 0} // Disable during load or no file
              className={`w-full flex items-center justify-center px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
                isLoading || uploadedFiles.length === 0
                  ? 'bg-gray-400 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              <Send className="h-4 w-4 mr-2" />
              {isLoading ? t('upload.processing') : t('upload.processDocument')}
            </button>
          </form>
        </div>
      </div>

      {isLoading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">Processing document with AI and OCR...</p>
          <div className="flex justify-center mt-2">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      )}

      {extractedText && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Extracted Text (OCR Result):</h3>
          <pre className="text-xs bg-white p-3 rounded border overflow-auto max-h-40">
            {extractedText}
          </pre>
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm font-medium text-green-800">
            {successMessage}
          </p>
          {routedDepartments.length > 0 && (
            <div className="mt-2">
              <p className="text-xs text-green-700 font-medium">Routed to departments:</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {routedDepartments.map(dept => (
                  <span key={dept} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                    {dept}
                  </span>
                ))}
              </div>
            </div>
          )}
          {whatsappSent && (
            <div className="mt-2 flex items-center text-xs text-green-700">
              <AlertCircle className="h-4 w-4 mr-1" />
              Critical alert sent via WhatsApp (after work hours)
            </div>
          )}
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900 mb-2">{t('upload.aiProcessingPipeline')}</h3>
        <div className="space-y-2">
          <div className="flex items-center text-sm text-blue-800">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
            Document ingestion and format detection
          </div>
          <div className="flex items-center text-sm text-blue-800">
            <div className="w-2 h-2 bg-blue-300 rounded-full mr-2"></div>
            Multilingual text extraction and OCR
          </div>
          <div className="flex items-center text-sm text-blue-800">
            <div className="w-2 h-2 bg-blue-300 rounded-full mr-2"></div>
            AI-powered summarization and keyword extraction
          </div>
          <div className="flex items-center text-sm text-blue-800">
            <div className="w-2 h-2 bg-blue-300 rounded-full mr-2"></div>
            Compliance and regulatory analysis
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentUpload;