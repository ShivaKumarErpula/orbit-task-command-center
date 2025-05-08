
import React from 'react';
import { useTasks, TaskFilters, TaskStatus } from '@/contexts/TaskContext';
import { useAuth } from '@/contexts/AuthContext';
import AppLayout from '@/components/AppLayout';
import TaskCard from '@/components/TaskCard';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { getFilteredTasks } = useTasks();

  const assignedToMe: TaskFilters = {
    assignedTo: user?.id
  };

  const createdByMe: TaskFilters = {
    createdBy: user?.id
  };

  const overdueFilter: TaskFilters = {
    assignedTo: user?.id,
  };

  const assignedTasks = getFilteredTasks(assignedToMe);
  const createdTasks = getFilteredTasks(createdByMe);
  
  const overdueTasks = getFilteredTasks(overdueFilter).filter(
    task => new Date(task.dueDate) < new Date() && task.status !== 'done'
  );

  const todoTasks = assignedTasks.filter(task => task.status === 'todo');
  const inProgressTasks = assignedTasks.filter(task => task.status === 'in-progress');
  const doneTasks = assignedTasks.filter(task => task.status === 'done');

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name}!</h1>
          <p className="text-gray-500">Here's an overview of your tasks</p>
        </div>

        {/* Task summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-brand to-brand-dark text-white">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Total Tasks</p>
                <h3 className="text-2xl font-bold">{assignedTasks.length}</h3>
              </div>
              <span className="p-2 bg-white bg-opacity-20 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20V10" />
                  <path d="M18 20V4" />
                  <path d="M6 20v-6" />
                </svg>
              </span>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-amber-400 to-orange-500 text-white">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">In Progress</p>
                <h3 className="text-2xl font-bold">{inProgressTasks.length}</h3>
              </div>
              <span className="p-2 bg-white bg-opacity-20 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20" />
                  <path d="m17 5-5-3-5 3" />
                  <path d="m17 19-5 3-5-3" />
                  <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                </svg>
              </span>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-400 to-emerald-600 text-white">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Completed</p>
                <h3 className="text-2xl font-bold">{doneTasks.length}</h3>
              </div>
              <span className="p-2 bg-white bg-opacity-20 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </span>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-red-400 to-rose-600 text-white">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Overdue</p>
                <h3 className="text-2xl font-bold">{overdueTasks.length}</h3>
              </div>
              <span className="p-2 bg-white bg-opacity-20 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 8v4l2 2" />
                  <circle cx="12" cy="12" r="10" />
                </svg>
              </span>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different task views */}
        <Tabs defaultValue="assigned">
          <TabsList className="mb-4">
            <TabsTrigger value="assigned">Assigned to Me</TabsTrigger>
            <TabsTrigger value="created">Created by Me</TabsTrigger>
            <TabsTrigger value="overdue">Overdue</TabsTrigger>
          </TabsList>
          
          <TabsContent value="assigned" className="animate-slide-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {assignedTasks.length > 0 ? (
                assignedTasks.map(task => <TaskCard key={task.id} task={task} />)
              ) : (
                <p className="col-span-full text-center py-8 text-gray-500">
                  No tasks assigned to you
                </p>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="created" className="animate-slide-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {createdTasks.length > 0 ? (
                createdTasks.map(task => <TaskCard key={task.id} task={task} />)
              ) : (
                <p className="col-span-full text-center py-8 text-gray-500">
                  You haven't created any tasks yet
                </p>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="overdue" className="animate-slide-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {overdueTasks.length > 0 ? (
                overdueTasks.map(task => <TaskCard key={task.id} task={task} />)
              ) : (
                <p className="col-span-full text-center py-8 text-gray-500">
                  No overdue tasks!
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
