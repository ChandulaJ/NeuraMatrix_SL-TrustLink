import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Header } from "./Header";

interface MainLayoutProps {
  children: React.ReactNode;
  userName: string;
}

export const MainLayout = ({ children, userName }: MainLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-government-50">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <Header userName={userName} />
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};