
import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useTasks } from '@/contexts/TaskContext';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const TeamPage: React.FC = () => {
  const { users } = useAuth();
  const { tasks } = useTasks();

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold mb-2">Team Members</h1>
          <p className="text-gray-500">View your team and their task progress</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map(user => {
            // Filter tasks for this user
            const userTasks = tasks.filter(task => task.assignedTo === user.id);
            const totalTasks = userTasks.length;
            const completedTasks = userTasks.filter(task => task.status === 'done').length;
            const inProgressTasks = userTasks.filter(task => task.status === 'in-progress').length;
            const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
            const overdueTasks = userTasks.filter(
              task => new Date(task.dueDate) < new Date() && task.status !== 'done'
            ).length;

            return (
              <Card key={user.id} className="overflow-hidden">
                <CardHeader className="p-4 bg-gradient-to-r from-brand/10 to-brand/5">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12 border-2 border-white">
                      <AvatarFallback className="bg-brand text-white">
                        {user.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                      <div className="mt-1">
                        <Badge variant={user.role === 'admin' ? 'default' : 'outline'}>
                          {user.role}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  {/* Task stats */}
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="bg-gray-50 p-2 rounded-md">
                      <div className="text-xl font-semibold">{totalTasks}</div>
                      <div className="text-xs text-gray-500">Total Tasks</div>
                    </div>
                    <div className="bg-gray-50 p-2 rounded-md">
                      <div className="text-xl font-semibold">{completedTasks}</div>
                      <div className="text-xs text-gray-500">Completed</div>
                    </div>
                    <div className="bg-gray-50 p-2 rounded-md">
                      <div className="text-xl font-semibold">{inProgressTasks}</div>
                      <div className="text-xs text-gray-500">In Progress</div>
                    </div>
                    <div className="bg-gray-50 p-2 rounded-md">
                      <div className={`text-xl font-semibold ${overdueTasks > 0 ? 'text-red-500' : ''}`}>
                        {overdueTasks}
                      </div>
                      <div className="text-xs text-gray-500">Overdue</div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Task Completion</span>
                      <span>{Math.round(completionRate)}%</span>
                    </div>
                    <Progress value={completionRate} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
};

export default TeamPage;
