import { Search, Bell } from "lucide-react";
import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNotifications } from "@/contexts/useNotifications";


interface HeaderProps {
  userName: string;
  onLogout: () => void;
}

export const Header = ({ userName, onLogout }: HeaderProps) => {

  const navigate = useNavigate();
  const { unreadCount } = useNotifications();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="h-16 border-b border-government-200 bg-white px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="lg:hidden" />
        
        <form className="relative flex-1 max-w-2xl" onSubmit={(e: FormEvent) => { e.preventDefault(); if (searchQuery.trim()) navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`); }}>
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-government-500 h-4 w-4 pointer-events-none" />
          <Input
            aria-label="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search business, license, location..."
            className="pl-10 pr-32 h-11 border-government-200 focus:border-government-primary"
          />
          <Button 
            type="submit"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-9 px-6 min-w-[96px] bg-government-primary/75 hover:bg-government-primary-light/90 text-white"
            size="sm"
          >
            Search
          </Button>
        </form>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" className="relative" onClick={() => navigate('/notifications')}>
          <Bell className="h-5 w-5 text-government-600" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs" title={`${unreadCount} unread`} />
          )}
        </Button>

        <Button variant="ghost" className="flex items-center gap-2 h-auto p-2" onClick={() => navigate('/profile')}>
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
        </Button>
      </div>
    </header>
  );
}
