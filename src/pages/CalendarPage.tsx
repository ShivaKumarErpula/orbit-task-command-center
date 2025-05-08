import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useTasks, Task } from '@/contexts/TaskContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useNavigate } from 'react-router-dom';

const CalendarPage: React.FC = () => {
  const { tasks } = useTasks();
  const { user, users } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const navigate = useNavigate();

  if (!user) return null;

  // Group tasks by date
  const tasksByDate: { [key: string]: Task[] } = {};
  tasks.forEach(task => {
    if (!tasksByDate[task.dueDate]) {
      tasksByDate[task.dueDate] = [];
    }
    tasksByDate[task.dueDate].push(task);
  });

  // Get tasks for selected date
  const selectedDateStr = selectedDate ? selectedDate.toISOString().split('T')[0] : '';
  const tasksForSelectedDate = tasksByDate[selectedDateStr] || [];

  // Function to highlight dates with tasks
  const getDayClassNames = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const hasTasks = tasksByDate[dateStr] && tasksByDate[dateStr].length > 0;
    
    if (hasTasks) {
      // Check if there are high priority tasks
      const hasHighPriorityTasks = tasksByDate[dateStr].some(task => task.priority === 'high');
      if (hasHighPriorityTasks) {
        return 'bg-red-100 text-red-800 font-bold';
      }
      
      // Check if there are medium priority tasks
      const hasMediumPriorityTasks = tasksByDate[dateStr].some(task => task.priority === 'medium');
      if (hasMediumPriorityTasks) {
        return 'bg-orange-100 text-orange-800 font-bold';
      }
      
      // Otherwise, it's low priority
      return 'bg-blue-100 text-blue-800 font-bold';
    }
    
    return '';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'medium':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'low':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo':
        return 'bg-gray-100 text-gray-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'done':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold mb-2">Task Calendar</h1>
          <p className="text-gray-500">View and manage your tasks by due date</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="col-span-1 lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
            <Calendar 
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md"
              modifiersClassNames={{
                selected: 'bg-brand text-white',
              }}
              modifiers={{
                // Custom modifier to highlight dates with tasks
                hasTask: (date) => {
                  const dateStr = date.toISOString().split('T')[0];
                  return !!tasksByDate[dateStr];
                },
              }}
              // Apply custom styles to days with tasks
              styles={{
                day: (date) => ({
                  className: getDayClassNames(date),
                })
              }}
            />

            <div className="mt-6 flex items-center justify-center space-x-6 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                <span>High Priority</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
                <span>Medium Priority</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                <span>Low Priority</span>
              </div>
            </div>
          </div>

          {/* Tasks for selected date */}
          <div className="col-span-1 bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">
                {selectedDate ? (
                  `Tasks for ${selectedDate.toLocaleDateString()}`
                ) : (
                  'Select a date'
                )}
              </h2>
              <Button 
                size="sm" 
                onClick={() => navigate('/create-task')}
              >
                Add Task
              </Button>
            </div>

            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {tasksForSelectedDate.length > 0 ? (
                tasksForSelectedDate.map(task => {
                  const assignedUser = users.find(u => u.id === task.assignedTo);
                  
                  return (
                    <Dialog key={task.id}>
                      <DialogTrigger asChild>
                        <div 
                          className={`p-3 rounded-md border cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-${task.priority === 'high' ? 'task-high' : task.priority === 'medium' ? 'task-medium' : 'task-low'}`}
                          onClick={() => setSelectedTask(task)}
                        >
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium">{task.title}</h3>
                            <Badge className={getStatusColor(task.status)}>
                              {task.status === 'todo' ? 'To Do' : task.status === 'in-progress' ? 'In Progress' : 'Done'}
                            </Badge>
                          </div>
                          {assignedUser && (
                            <p className="text-xs text-gray-500 mt-1">
                              Assigned to: {assignedUser.name}
                            </p>
                          )}
                        </div>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{task.title}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium mb-1">Description</h4>
                            <p className="text-sm text-gray-600">{task.description}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-sm font-medium mb-1">Due Date</h4>
                              <p className="text-sm text-gray-600">{new Date(task.dueDate).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium mb-1">Priority</h4>
                              <Badge className={getPriorityColor(task.priority)}>
                                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                              </Badge>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium mb-1">Status</h4>
                              <Badge className={getStatusColor(task.status)}>
                                {task.status === 'todo' ? 'To Do' : task.status === 'in-progress' ? 'In Progress' : 'Done'}
                              </Badge>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium mb-1">Assigned To</h4>
                              <p className="text-sm text-gray-600">{assignedUser ? assignedUser.name : 'Unassigned'}</p>
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <Button onClick={() => navigate(`/edit-task/${task.id}`)}>
                              Edit Task
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  );
                })
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {selectedDate ? 'No tasks for this date' : 'Select a date to view tasks'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default CalendarPage;
