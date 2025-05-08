
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Dashboard from './Dashboard';
import { AuthProvider } from '@/contexts/AuthContext';
import { TaskProvider } from '@/contexts/TaskContext';

const Index: React.FC = () => {
  return (
    <AuthProvider>
      <TaskProvider>
        <Dashboard />
      </TaskProvider>
    </AuthProvider>
  );
};

export default Index;
