import { Search, Menu, Bell, ChevronDown, User, Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useNotifications } from "@/contexts/useNotifications";


interface HeaderProps {
  userName: string;
  onLogout: () => void;
}

export const Header = ({ userName, onLogout }: HeaderProps) => {

  const navigate = useNavigate();
  const { unreadCount } = useNotifications();

  return (
    <header className="h-16 border-b border-government-200 bg-white px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="lg:hidden" />
        
        <div className="relative flex-1 max-w-2xl">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-government-500 h-4 w-4" />
          <Input
            placeholder="Search business, license, location..."
            className="pl-10 h-11 border-government-200 focus:border-government-primary"
          />
          <Button 
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-9 px-4 bg-government-primary hover:bg-government-primary-light text-white"
            size="sm"
          >
            Search
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" className="relative" onClick={() => navigate('/notifications')}>
          <Bell className="h-5 w-5 text-government-600" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs" title={`${unreadCount} unread`} />
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 h-auto p-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="" alt="User" />
                <AvatarFallback className="bg-government-primary text-white text-sm">
                  {userName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="text-left hidden md:block">
                <p className="text-sm font-medium text-government-800">{userName}</p>
                <p className="text-xs text-government-600">Senior Inspector</p>
              </div>
              <ChevronDown className="h-4 w-4 text-government-600" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer">
              <User className="h-4 w-4 mr-2" />
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="h-4 w-4 mr-2" />
              Preferences
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-red-600" onClick={onLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
