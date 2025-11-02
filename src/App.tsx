import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import FlowPage from "./pages/FlowPage";
import NotFound from "./pages/NotFound";
import { useState, useEffect } from "react";
import { loadSession, createInitialSession, loadDemoData, saveSession } from "./lib/sessionStorage";
import { SessionData } from "./types/miras";

const queryClient = new QueryClient();

const App = () => {
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [isFlowActive, setIsFlowActive] = useState(false);

  useEffect(() => {
    const existing = loadSession();
    if (existing) {
      setSessionData(existing);
      setIsFlowActive(true);
    }
  }, []);

  const handleGetStarted = () => {
    const newSession = createInitialSession();
    setSessionData(newSession);
    saveSession(newSession);
    setIsFlowActive(true);
  };

  const handleUseDemoData = () => {
    const demoSession = loadDemoData();
    setSessionData(demoSession);
    saveSession(demoSession);
    setIsFlowActive(true);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route 
              path="/" 
              element={
                isFlowActive && sessionData ? (
                  <FlowPage initialData={sessionData} />
                ) : (
                  <Landing onGetStarted={handleGetStarted} onUseDemoData={handleUseDemoData} />
                )
              } 
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
