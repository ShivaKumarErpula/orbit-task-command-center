
import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import TaskCard from '@/components/TaskCard';
import { useTasks, TaskFilters, TaskStatus, TaskPriority } from '@/contexts/TaskContext';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, Search } from 'lucide-react';

const MyTasks: React.FC = () => {
  const { user } = useAuth();
  const { getFilteredTasks } = useTasks();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | ''>('');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | ''>('');

  if (!user) return null;

  const filters: TaskFilters = {
    assignedTo: user.id,
    search: searchTerm,
    status: statusFilter as TaskStatus || undefined,
    priority: priorityFilter as TaskPriority || undefined,
  };

  const tasks = getFilteredTasks(filters);

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setPriorityFilter('');
  };

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold mb-2">My Tasks</h1>
          <p className="text-gray-500">Manage all your assigned tasks here</p>
        </div>

        {/* Search and filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <Input
                placeholder="Search tasks..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex space-x-2 md:w-auto">
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as TaskStatus | '')}>
                <SelectTrigger className="min-w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Statuses</SelectItem>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={priorityFilter} onValueChange={(value) => setPriorityFilter(value as TaskPriority | '')}>
                <SelectTrigger className="min-w-[150px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Priorities</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" onClick={clearFilters}>
                <Filter className="w-4 h-4 mr-2" /> Clear
              </Button>
            </div>
          </div>
        </div>

        {/* Tasks grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.length > 0 ? (
            tasks.map(task => <TaskCard key={task.id} task={task} />)
          ) : (
            <div className="col-span-full text-center py-12 bg-white rounded-lg border">
              <div className="space-y-3">
                <svg
                  className="w-12 h-12 text-gray-300 mx-auto"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <p className="text-gray-500">No tasks found</p>
                <p className="text-sm text-gray-400">
                  {searchTerm || statusFilter || priorityFilter
                    ? "Try changing your filters"
                    : "You haven't been assigned any tasks yet"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default MyTasks;
