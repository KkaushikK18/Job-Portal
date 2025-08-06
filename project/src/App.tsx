import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { JobProvider } from './contexts/JobContext';
import { AuthForms } from './components/AuthForms';
import { Layout } from './components/Layout';
import { PageLoader } from './components/LoadingSpinner';

// Student Pages
import { JobsPage } from './components/student/JobsPage';
import { ApplicationsPage as StudentApplicationsPage } from './components/student/ApplicationsPage';

// Recruiter Pages
import { DashboardPage } from './components/recruiter/DashboardPage';
import { PostJobPage } from './components/recruiter/PostJobPage';
import { ApplicationsPage as RecruiterApplicationsPage } from './components/recruiter/ApplicationsPage';

// Shared Pages
import { ProfilePage } from './components/ProfilePage';

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState(
    user?.role === 'student' ? 'jobs' : 'dashboard'
  );

  if (isLoading) {
    return <PageLoader />;
  }

  if (!user) {
    return <AuthForms onSuccess={() => {}} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      // Student pages
      case 'jobs':
        return <JobsPage />;
      case 'applications':
        return user.role === 'student' ? <StudentApplicationsPage /> : <RecruiterApplicationsPage />;
      
      // Recruiter pages
      case 'dashboard':
        return <DashboardPage />;
      case 'post-job':
        return <PostJobPage />;
      
      // Shared pages
      case 'profile':
        return <ProfilePage />;
      
      default:
        return user.role === 'student' ? <JobsPage /> : <DashboardPage />;
    }
  };

  return (
    <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
};

function App() {
  return (
    <AuthProvider>
      <JobProvider>
        <AppContent />
      </JobProvider>
    </AuthProvider>
  );
}

export default App;