
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth, User } from './AuthContext';
import { toast } from "@/components/ui/sonner";

export type TaskPriority = 'high' | 'medium' | 'low';
export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  createdBy: string;
  assignedTo: string | null;
  createdAt: string;
  updatedAt: string;
}

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  assignTask: (taskId: string, userId: string) => void;
  getFilteredTasks: (filters: TaskFilters) => Task[];
  notifications: Notification[];
  clearNotification: (id: string) => void;
}

interface Notification {
  id: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  taskId: string;
}

export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  search?: string;
  assignedTo?: string;
  createdBy?: string;
  dueDate?: string;
}

// Mock tasks for demo purposes
const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Create project plan',
    description: 'Develop a comprehensive project plan for the new feature.',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
    priority: 'high',
    status: 'todo',
    createdBy: '1', // John Doe
    assignedTo: '2', // Jane Smith
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Design user interface mockups',
    description: 'Create wireframes and mockups for the new dashboard.',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days from now
    priority: 'medium',
    status: 'in-progress',
    createdBy: '1', // John Doe
    assignedTo: '3', // Bob Johnson
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Implement authentication flow',
    description: 'Build the login, registration, and password recovery components.',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 5 days from now
    priority: 'high',
    status: 'todo',
    createdBy: '2', // Jane Smith
    assignedTo: '4', // Alice Brown
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '4',
    title: 'Write documentation',
    description: 'Create user and technical documentation for the application.',
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 days ago (overdue)
    priority: 'low',
    status: 'todo',
    createdBy: '3', // Bob Johnson
    assignedTo: '1', // John Doe
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '5',
    title: 'Test application functionality',
    description: 'Perform thorough testing of all features and fix bugs.',
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 10 days from now
    priority: 'medium',
    status: 'todo',
    createdBy: '4', // Alice Brown
    assignedTo: '2', // Jane Smith
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
];

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Load tasks from localStorage if available
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      try {
        setTasks(JSON.parse(storedTasks));
      } catch (error) {
        console.error('Failed to parse stored tasks', error);
      }
    }

    // Load notifications from localStorage if available
    const storedNotifications = localStorage.getItem('notifications');
    if (storedNotifications) {
      try {
        setNotifications(JSON.parse(storedNotifications));
      } catch (error) {
        console.error('Failed to parse stored notifications', error);
      }
    }
  }, []);

  useEffect(() => {
    // Save tasks to localStorage whenever they change
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    // Save notifications to localStorage whenever they change
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  const addTask = (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;

    const newTask: Task = {
      ...task,
      id: Math.random().toString(36).substring(2, 11),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setTasks(prev => [...prev, newTask]);
    toast.success('Task created successfully!');

    if (newTask.assignedTo) {
      createNotification(`You have been assigned a new task: ${newTask.title}`, newTask.id);
    }
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => {
      if (task.id === id) {
        const originalAssignee = task.assignedTo;
        const updatedTask = {
          ...task,
          ...updates,
          updatedAt: new Date().toISOString()
        };
        
        // If the assignee has changed, create a notification
        if (updates.assignedTo && updates.assignedTo !== originalAssignee) {
          createNotification(`You have been assigned a task: ${task.title}`, task.id);
        }
        
        return updatedTask;
      }
      return task;
    }));
    toast.success('Task updated successfully!');
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
    toast.success('Task deleted successfully!');
  };

  const assignTask = (taskId: string, userId: string) => {
    updateTask(taskId, { assignedTo: userId });
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      createNotification(`You have been assigned a task: ${task.title}`, taskId);
    }
  };

  const createNotification = (message: string, taskId: string) => {
    const newNotification: Notification = {
      id: Math.random().toString(36).substring(2, 11),
      message,
      isRead: false,
      createdAt: new Date().toISOString(),
      taskId
    };
    setNotifications(prev => [...prev, newNotification]);
  };

  const clearNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const getFilteredTasks = (filters: TaskFilters): Task[] => {
    return tasks.filter(task => {
      // Filter by status
      if (filters.status && task.status !== filters.status) return false;
      
      // Filter by priority
      if (filters.priority && task.priority !== filters.priority) return false;
      
      // Filter by assigned to
      if (filters.assignedTo && task.assignedTo !== filters.assignedTo) return false;
      
      // Filter by created by
      if (filters.createdBy && task.createdBy !== filters.createdBy) return false;
      
      // Filter by due date
      if (filters.dueDate && task.dueDate !== filters.dueDate) return false;
      
      // Search in title and description
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        return (
          task.title.toLowerCase().includes(searchTerm) ||
          task.description.toLowerCase().includes(searchTerm)
        );
      }
      
      return true;
    });
  };

  return (
    <TaskContext.Provider value={{ 
      tasks, 
      addTask, 
      updateTask, 
      deleteTask, 
      assignTask, 
      getFilteredTasks,
      notifications,
      clearNotification
    }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
