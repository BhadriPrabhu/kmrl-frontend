import React, { useState, useEffect } from 'react';
import { Search, Globe } from 'lucide-react';
import SearchFilters from '../Search/SearchFilters';
import DocumentCard from '../Documents/DocumentCard';
import { mockDocuments } from '../../data/mockData';
import { Document } from '../../types';
import { documentStorage, StoredDocument } from '../../services/documentStorage';
import { useLanguage } from '../../context/LanguageContext';

const SearchFilter: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    department: 'All Departments',
    type: 'All Types',
    language: 'All Languages',
    dateRange: 'All Time',
    status: 'All Status'
  });
  const [allDocuments, setAllDocuments] = useState<Document[]>([]);
  const { t, language } = useLanguage();

  useEffect(() => {
    const stored = documentStorage.getAllDocuments();
    const combined = [...mockDocuments, ...stored];
    setAllDocuments(combined);
  }, []);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filteredDocuments = allDocuments.filter(doc => {
    const lowerQuery = searchQuery.toLowerCase();
    const storedDoc = doc as StoredDocument;

    const matchesTitle = doc.title.toLowerCase().includes(lowerQuery);
    const matchesTags = doc.tags.some(tag => tag.toLowerCase().includes(lowerQuery));
    const matchesSummary = doc.summary?.toLowerCase().includes(lowerQuery);
    const matchesExtractedText = storedDoc.extractedText?.toLowerCase().includes(lowerQuery);
    const matchesDeptInSearch = doc.department.toLowerCase().includes(lowerQuery);

    const matchesSearch = !searchQuery || matchesTitle || matchesTags || matchesSummary || matchesExtractedText || matchesDeptInSearch;

    const matchesDepartment = filters.department === 'All Departments' || doc.department === filters.department;
    const matchesType = filters.type === 'All Types' || doc.type === filters.type;
    const matchesLanguage = filters.language === 'All Languages' ||
                           doc.language.toLowerCase() === filters.language.toLowerCase();
    const matchesStatus = filters.status === 'All Status' ||
                         doc.status.toLowerCase() === filters.status.toLowerCase();

    return matchesSearch && matchesDepartment && matchesType && matchesLanguage && matchesStatus;
  });

  const handleDocumentView = (doc: Document) => {
    console.log('View document:', doc.title);
  };

  const handleDocumentDownload = (doc: Document) => {
    console.log('Download document:', doc.title);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('search.title')}</h1>
        <p className="mt-1 text-sm text-gray-600">
          {t('search.subtitle')}
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            placeholder={t('search.placeholder')}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Globe className="h-5 w-5 text-gray-400" />
          </div>
        </div>
        
        <div className="mt-4 flex items-center space-x-4 text-sm text-gray-600">
          <span>• {language === 'en' ? 'Search supports both English and Malayalam text' : 'ഇംഗ്ലീഷ്, മലയാളം എന്നീ ഭാഷകളിൽ തിരയൽ പിന്തുണയ്ക്കുന്നു'}</span>
          <span>• {language === 'en' ? 'Use keywords, tags, or document titles' : 'കീവേഡുകൾ, ടാഗുകൾ, അല്ലെങ്കിൽ ഡോക്യുമെന്റ് ശീർഷകങ്ങൾ ഉപയോഗിക്കുക'}</span>
          <span>• {language === 'en' ? 'Advanced AI-powered smart search' : 'വിപുലമായ AI-പവർഡ് സ്മാർട്ട് തിരയൽ'}</span>
        </div>
      </div>

      {/* Filters */}
      <SearchFilters filters={filters} onFilterChange={handleFilterChange} />

      {/* Search Results */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">
            {t('search.results')} ({filteredDocuments.length} {t('search.documents')})
          </h3>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span>{t('search.sortBy')}:</span>
            <select className="border border-gray-300 rounded px-2 py-1">
              <option>Relevance</option>
              <option>Date (Newest)</option>
              <option>Date (Oldest)</option>
              <option>Title A-Z</option>
            </select>
          </div>
        </div>

        {filteredDocuments.length === 0 ? (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">{t('search.noResults')}</p>
            <p className="text-gray-400 text-sm mt-2">{t('search.tryAdjusting')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map(doc => (
              <DocumentCard
                key={doc.id}
                document={doc}
                onView={handleDocumentView}
                onDownload={handleDocumentDownload}
              />
            ))}
          </div>
        )}
      </div>

      {/* Search Suggestions */}
      {searchQuery === '' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">{t('search.popularSearchTerms')}</h4>
          <div className="flex flex-wrap gap-2">
            {['safety protocol', 'budget report', 'maintenance', 'compliance', 'emergency procedures'].map(term => (
              <button
                key={term}
                onClick={() => setSearchQuery(term)}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilter;