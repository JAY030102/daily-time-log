import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RecordPage from "./pages/RecordPage";
import HistoryPage from "./pages/HistoryPage";
import InstallPage from "./pages/InstallPage";
import BottomNav from "./components/BottomNav";
import NotFound from "./pages/NotFound";
import { FormProvider } from "./contexts/FormContext";
import { initializeDatabase } from "./lib/sqlite-db";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Initialize database on app mount
    initializeDatabase();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <FormProvider>
          <BrowserRouter>
            <BottomNav />
            <Routes>
              <Route path="/" element={<RecordPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/install" element={<InstallPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </FormProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
