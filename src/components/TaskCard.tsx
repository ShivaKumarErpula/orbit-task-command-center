
import React from 'react';
import { Task, TaskPriority, TaskStatus, useTasks } from '@/contexts/TaskContext';
import { useAuth } from '@/contexts/AuthContext';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CalendarCheck, Clock, Edit, List, Trash, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TaskCardProps {
  task: Task;
}

const getPriorityColor = (priority: TaskPriority): string => {
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

const getStatusColor = (status: TaskStatus): string => {
  switch (status) {
    case 'todo':
      return 'status-todo';
    case 'in-progress':
      return 'status-in-progress';
    case 'done':
      return 'status-done';
    default:
      return 'status-todo';
  }
};

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { updateTask, deleteTask } = useTasks();
  const { users } = useAuth();
  const navigate = useNavigate();

  const assignedUser = users.find(u => u.id === task.assignedTo);
  const createdByUser = users.find(u => u.id === task.createdBy);

  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'done';

  const handleStatusChange = (newStatus: TaskStatus) => {
    updateTask(task.id, { status: newStatus });
  };

  const handleEdit = () => {
    navigate(`/edit-task/${task.id}`);
  };

  const handleDelete = () => {
    deleteTask(task.id);
  };

  return (
    <Card className={`task-card priority-${task.priority}`}>
      <CardHeader className="p-4 pb-2 space-y-2">
        <div className="flex items-center justify-between">
          <div className="font-medium line-clamp-1">{task.title}</div>
          <div className="flex items-center space-x-2">
            <Badge className={getPriorityColor(task.priority)}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </Badge>
            <Badge className={getStatusColor(task.status)}>
              {task.status === 'todo' ? 'To Do' : 
               task.status === 'in-progress' ? 'In Progress' : 'Done'}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>
        <div className="mt-3 flex flex-col space-y-2 text-xs text-gray-500">
          {assignedUser && (
            <div className="flex items-center">
              <User className="w-3 h-3 mr-1" />
              <span>Assigned to: {assignedUser.name}</span>
            </div>
          )}
          {createdByUser && (
            <div className="flex items-center">
              <Edit className="w-3 h-3 mr-1" />
              <span>Created by: {createdByUser.name}</span>
            </div>
          )}
          <div className={`flex items-center ${isOverdue ? 'text-red-500' : ''}`}>
            <CalendarCheck className={`w-3 h-3 mr-1 ${isOverdue ? 'text-red-500' : ''}`} />
            <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-2 flex justify-between">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">Status</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleStatusChange('todo')}>
              To Do
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange('in-progress')}>
              In Progress
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange('done')}>
              Done
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handleEdit}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleDelete}>
            <Trash className="w-4 h-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
