import React from 'react';
import { Router, Switch, Route } from 'wouter';
import Dashboard from '@/pages/dashboard';
import NotFound from '@/pages/not-found';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { ThemeToggle } from '@/components/theme-toggle';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SidebarProvider>
          <div className="flex h-screen">
            <AppSidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b">
                <SidebarTrigger />
                <ThemeToggle />
              </div>
              <main className="flex-1 overflow-auto">
                <Router>
                  <Switch>
                    <Route path="/" component={Dashboard} />
                    <Route component={NotFound} />
                  </Switch>
                </Router>
              </main>
            </div>
          </div>
          <Toaster />
        </SidebarProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
