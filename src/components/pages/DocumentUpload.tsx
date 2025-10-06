import React, { useState } from 'react';
import { Send, Tag, Globe, Building } from 'lucide-react';
import FileUpload from '../Upload/FileUpload';

const DocumentUpload: React.FC = () => {
  const [uploadForm, setUploadForm] = useState({
    title: '',
    type: '',
    department: '',
    language: 'english',
    tags: '',
    description: ''
  });
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]); // Store uploaded files

  // New states for demo features
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [extractedText, setExtractedText] = useState('');

  const handleFileUpload = (files: File[]) => {
    setUploadedFiles(files); // Store files
    console.log('Files uploaded:', files);
    // Here you would typically send files to your backend
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadedFiles.length === 0) {
      alert('Please upload a document first!');
      return;
    }
    console.log('Form submitted:', uploadForm);

    // Start loading and reset
    setIsLoading(true);
    setSuccessMessage('');
    setExtractedText('');

    // Fake delay for scanning + sending (simulates Tesseract without it)
    setTimeout(() => {
      setIsLoading(false);

      // Dummy extracted text after "scanning"
      const dummyExtractedText = `Sample Document Content (Fake OCR Result):
Date: October 06, 2025
Department: ${uploadForm.department || 'HR'}
Document Title: ${uploadForm.title || 'Sample Document'}
Applicant/Subject Name: John Doe
Position/Topic: Software Engineer / Safety Protocol Update
Experience/Details: 5 years in frontend dev / Emergency evacuation procedures updated for stations 1-5
Skills/Key Changes: React, JavaScript, GitHub / New safety equipment requirements effective January 2025
Concern Dept: IT Review Team
Additional Notes: Requires immediate attention for approval process.`;

      setExtractedText(dummyExtractedText);

      // Success message with concern dept
      setSuccessMessage(`Document "${uploadForm.title || 'Sample Document'}" was sent to concern dept (${uploadForm.department || 'IT Review Team'}).`);

      // Dummy summarized data based on form (static for demo)
      const dummySummary = {
        title: uploadForm.title || 'Sample Document',
        department: uploadForm.department || 'HR',
        keyPoints: [
          'Strong React experience highlighted',
          '5+ years in frontend development',
          'Proficient in GitHub and collaboration tools',
          `Department-specific: ${uploadForm.department || 'HR'} compliance ensured`
        ],
        entities: {
          name: 'John Doe',
          dept: uploadForm.department || 'HR',
          position: 'Software Engineer',
          concernDept: 'IT Review Team'
        },
        overallScore: '8.5/10',
        recommendation: 'Proceed to interview stage - High potential candidate',
        fullText: dummyExtractedText // Pass extracted text too
      };

      // Store dummy summary in localStorage for AISummaries (no router needed)
      localStorage.setItem('demoSummary', JSON.stringify(dummySummary));

      // Here you would process the form data
    }, 2500); // 2.5s for realistic loading
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
        <h1 className="text-2xl font-bold text-gray-900">Document Upload</h1>
        <p className="mt-1 text-sm text-gray-600">
          Upload documents for AI processing and multilingual summarization
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* File Upload Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Upload Files</h2>
          <FileUpload onFileUpload={handleFileUpload} />
          {uploadedFiles.length > 0 && (
            <p className="mt-2 text-sm text-gray-600">Selected: {uploadedFiles.map(f => f.name).join(', ')}</p>
          )}
        </div>

        {/* Metadata Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Document Details</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document Title *
              </label>
              <input
                type="text"
                value={uploadForm.title}
                onChange={(e) => setUploadForm({...uploadForm, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter document title"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Building className="inline h-4 w-4 mr-1" />
                  Department
                </label>
                <select
                  value={uploadForm.department}
                  onChange={(e) => setUploadForm({...uploadForm, department: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Type
                </label>
                <select
                  value={uploadForm.type}
                  onChange={(e) => setUploadForm({...uploadForm, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Type</option>
                  {documentTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Globe className="inline h-4 w-4 mr-1" />
                Primary Language
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
                Tags
              </label>
              <input
                type="text"
                value={uploadForm.tags}
                onChange={(e) => setUploadForm({...uploadForm, tags: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter tags separated by commas"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={uploadForm.description}
                onChange={(e) => setUploadForm({...uploadForm, description: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Optional description"
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
              {isLoading ? 'Processing Document...' : 'Process Document'}
            </button>
          </form>
        </div>
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">Loading... Scanning document with OCR and sending to concern department...</p>
          <div className="flex justify-center mt-2">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      )}

      {/* Display dummy extracted text after scanning */}
      {extractedText && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Scanned Document Text (Dummy OCR Result):</h3>
          <pre className="text-xs bg-white p-3 rounded border overflow-auto max-h-40">
            {extractedText}
          </pre>
        </div>
      )}

      {/* Success message for sending to dept */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm font-medium text-green-800">
            {successMessage} Switch to the "AI Summaries" tab to view the generated summary.
          </p>
        </div>
      )}

      {/* Processing Status */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900 mb-2">AI Processing Pipeline</h3>
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