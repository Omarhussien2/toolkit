import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import Dashboard from "@/pages/dashboard";
import NotFound from "@/pages/not-found";
import { useState } from "react";
import type { ToolsStats } from "@shared/schema";

function Router({ selectedCategory, onCategorySelect }: { selectedCategory: string | null; onCategorySelect: (category: string | null) => void }) {
  return (
    <Switch>
      <Route path="/">
        {() => <Dashboard selectedCategory={selectedCategory} onCategorySelect={onCategorySelect} />}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: stats } = useQuery<ToolsStats>({
    queryKey: ["/api/tools/stats"],
  });

  const style = {
    "--sidebar-width": "20rem",
    "--sidebar-width-icon": "4rem",
  };

  return (
    <TooltipProvider>
      <SidebarProvider style={style as React.CSSProperties}>
        <div className="flex h-screen w-full">
          <AppSidebar
            categoryStats={stats?.byCategory}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
          />
          <div className="flex flex-col flex-1">
            <header className="flex items-center justify-between p-4 border-b gap-4">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
              <ThemeToggle />
            </header>
            <main className="flex-1 overflow-hidden">
              <Router selectedCategory={selectedCategory} onCategorySelect={setSelectedCategory} />
            </main>
          </div>
        </div>
      </SidebarProvider>
      <Toaster />
    </TooltipProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;
