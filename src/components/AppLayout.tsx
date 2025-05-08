
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar, 
  CheckSquare, 
  Clock, 
  List, 
  Plus, 
  Search, 
  User, 
  Users 
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTasks } from "@/contexts/TaskContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const { notifications, clearNotification } = useTasks();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="w-full max-w-md p-6 space-y-6 bg-white rounded-lg shadow-lg animate-fade-in">
          <div className="flex justify-center">
            <div className="text-3xl font-bold text-brand">Orbit Tasks</div>
          </div>
          <div className="space-y-4">
            <Button 
              className="w-full" 
              variant="default" 
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
            <Button 
              className="w-full" 
              variant="outline" 
              onClick={() => navigate("/register")}
            >
              Register
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const unreadNotifications = notifications.filter(n => !n.isRead);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile navigation toggle */}
      {isMobile && (
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="fixed top-4 left-4 z-40 p-2 bg-white rounded-md shadow-sm"
        >
          <List size={20} />
        </button>
      )}

      {/* Sidebar */}
      <div 
        className={`${
          isMobile 
            ? `fixed inset-y-0 left-0 z-30 transform ${isMenuOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out` 
            : "relative"
        } w-64 bg-white border-r border-gray-200 overflow-y-auto`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 border-b">
            <h1 className="text-xl font-bold text-brand">Orbit Tasks</h1>
          </div>

          {/* Navigation links */}
          <nav className="flex-1 p-4 space-y-1">
            <Link 
              to="/" 
              className="flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100"
              onClick={() => isMobile && setIsMenuOpen(false)}
            >
              <CheckSquare size={18} className="mr-3 text-brand" />
              <span>Dashboard</span>
            </Link>
            <Link 
              to="/my-tasks" 
              className="flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100"
              onClick={() => isMobile && setIsMenuOpen(false)}
            >
              <List size={18} className="mr-3 text-brand" />
              <span>My Tasks</span>
            </Link>
            <Link 
              to="/calendar" 
              className="flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100"
              onClick={() => isMobile && setIsMenuOpen(false)}
            >
              <Calendar size={18} className="mr-3 text-brand" />
              <span>Calendar</span>
            </Link>
            <Link 
              to="/team" 
              className="flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100"
              onClick={() => isMobile && setIsMenuOpen(false)}
            >
              <Users size={18} className="mr-3 text-brand" />
              <span>Team</span>
            </Link>

            <Separator className="my-4" />

            <Button 
              variant="outline" 
              className="w-full justify-start" 
              onClick={() => {
                navigate('/create-task');
                isMobile && setIsMenuOpen(false);
              }}
            >
              <Plus size={18} className="mr-2 text-brand" /> New Task
            </Button>
          </nav>

          {/* User profile */}
          <div className="p-4 border-t">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarFallback className="bg-brand text-white">
                  {user.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{user.name}</div>
                <div className="text-xs text-gray-500">{user.email}</div>
              </div>
              <Button variant="ghost" size="icon" onClick={logout}>
                <span className="sr-only">Logout</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 z-10">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center flex-1">
              {!isMobile && (
                <div className="max-w-sm w-full relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <Input
                    placeholder="Search..."
                    className="pl-10 pr-4 py-2"
                  />
                </div>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="relative">
                    <span className="sr-only">Notifications</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    {unreadNotifications.length > 0 && (
                      <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {notifications.length > 0 ? (
                    notifications.map(notification => (
                      <DropdownMenuItem 
                        key={notification.id}
                        className="flex items-start p-3"
                        onSelect={() => clearNotification(notification.id)}
                      >
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(notification.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6"
                          onClick={() => clearNotification(notification.id)}
                        >
                          <span className="sr-only">Dismiss</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </Button>
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      No notifications
                    </div>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
