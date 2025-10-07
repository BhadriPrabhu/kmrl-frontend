import { useState } from 'react';
import { AuthProvider } from './hooks/useAuth';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Layout/Navbar';
import Sidebar from './components/Layout/Sidebar';
import Dashboard from './components/pages/Dashboard';
import DocumentUpload from './components/pages/DocumentUpload';
import AISummaries from './components/pages/AISummaries';
import SearchFilter from './components/pages/SearchFilter';
import ComplianceTracker from './components/pages/ComplianceTracker';
import KnowledgeRepository from './components/pages/KnowledgeRepository';
import Collaboration from './components/pages/Collaboration';
import UserManagement from './components/pages/UserManagement';
// import RoleSelector from './components/RoleSelector';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'upload':
        return <DocumentUpload />;
      case 'summaries':
        return <AISummaries />;
      case 'search':
        return <SearchFilter />;
      case 'compliance':
        return <ComplianceTracker />;
      case 'knowledge':
        return <KnowledgeRepository />;
      case 'collaboration':
        return <Collaboration />;
      case 'users':
        return <UserManagement />;
      case 'analytics':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Analytics Dashboard</h2>
            <p className="text-gray-600">Advanced analytics and reporting features coming soon...</p>
          </div>
        );
      case 'settings':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">System Settings</h2>
            <p className="text-gray-600">System configuration and preferences panel...</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <AuthProvider>
      <LanguageProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="flex">
            <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
            <main className="flex-1 p-6">
              <div className="max-w-7xl mx-auto">
                {renderContent()}
              </div>
            </main>
          </div>
        </div>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;