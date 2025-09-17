import React, { useState } from 'react';
import { Brain, FileText, Clock, Filter } from 'lucide-react';
import { mockDocuments } from '../../data/mockData';

const AISummaries: React.FC = () => {
  const [selectedDocument, setSelectedDocument] = useState<string>('');
  const [summaryFilter, setSummaryFilter] = useState('all');

  const documentsWithSummaries = mockDocuments.filter(doc => doc.summary);

  const mockInsights = [
    {
      type: 'Key Points',
      items: [
        'Emergency evacuation procedures updated for stations 1-5',
        'New safety equipment requirements effective January 2025',
        'Monthly safety drills mandatory for all departments',
        'Compliance reporting deadline extended to December 31st'
      ]
    },
    {
      type: 'Action Items',
      items: [
        'Update station signage with new safety protocols',
        'Train staff on new emergency procedures',
        'Procure additional safety equipment',
        'Schedule compliance audit by December 25th'
      ]
    },
    {
      type: 'Risk Assessment',
      items: [
        'Low risk: Equipment installation delays',
        'Medium risk: Staff training completion timeline',
        'High risk: Non-compliance with regulatory deadlines'
      ]
    }
  ];

  const getInsightIcon = (type: string) => {
    switch(type) {
      case 'Key Points': return '🔑';
      case 'Action Items': return '✅';
      case 'Risk Assessment': return '⚠️';
      default: return '📝';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AI-Generated Summaries</h1>
        <p className="mt-1 text-sm text-gray-600">
          Intelligent document insights with contextual analysis and traceability
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Filter className="h-5 w-5 text-gray-400 mr-2" />
              <select
                value={summaryFilter}
                onChange={(e) => setSummaryFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Summaries</option>
                <option value="recent">Recent (Last 7 days)</option>
                <option value="critical">Critical Priority</option>
                <option value="compliance">Compliance Related</option>
              </select>
            </div>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Brain className="h-4 w-4 mr-1" />
            AI Confidence: 94%
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Document List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Documents with AI Summaries</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {documentsWithSummaries.map((doc) => (
              <button
                key={doc.id}
                onClick={() => setSelectedDocument(doc.id)}
                className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                  selectedDocument === doc.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{doc.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{doc.department}</p>
                    <div className="flex items-center mt-2">
                      <Clock className="h-3 w-3 text-gray-400 mr-1" />
                      <span className="text-xs text-gray-500">{doc.uploadedAt}</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Summary Details */}
        <div className="lg:col-span-2 space-y-6">
          {selectedDocument ? (
            <>
              {/* Summary Card */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">AI Summary</h3>
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                      <Brain className="h-3 w-3 mr-1" />
                      High Confidence
                    </span>
                  </div>
                </div>
                
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-700 leading-relaxed">
                    {documentsWithSummaries.find(d => d.id === selectedDocument)?.summary}
                  </p>
                </div>

                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <FileText className="h-4 w-4 mr-1" />
                  <span>Generated from: {documentsWithSummaries.find(d => d.id === selectedDocument)?.title}</span>
                </div>
              </div>

              {/* AI Insights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {mockInsights.map((insight) => (
                  <div key={insight.type} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                      <span className="text-lg mr-2">{getInsightIcon(insight.type)}</span>
                      {insight.type}
                    </h4>
                    <ul className="space-y-2">
                      {insight.items.map((item, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start">
                          <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Traceability */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Document Traceability</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>• Source Document: Original safety protocol document</p>
                  <p>• Pages Referenced: 1-3, 7-9, 15-16</p>
                  <p>• Last Updated: {new Date().toLocaleDateString()}</p>
                  <p>• AI Model: GPT-4 with domain-specific training</p>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <Brain className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Select a document to view its AI-generated summary and insights</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AISummaries;