import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useStore } from "@/store/useStore";
import { AnimatePresence } from "framer-motion";

import Landing from "./pages/Landing";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Quiz from "./pages/Quiz";
import Matches from "./pages/Matches";
import Dashboard from "./pages/Dashboard";
import NewItinerary from "./pages/NewItinerary";
import EditItinerary from "./pages/EditItinerary";
import ViewItinerary from "./pages/ViewItinerary";
import DayPreview from "./pages/DayPreview";
import ActivityDetail from "./pages/ActivityDetail";
import DiaryView from "./pages/DiaryView";
import NewDiaryEntry from "./pages/NewDiaryEntry";
import PublicDiary from "./pages/PublicDiary";
import Admin from "./pages/Admin";
import Settings from "./pages/Settings";
import Itineraries from "./pages/Itineraries";
import Diaries from "./pages/Diaries";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useStore(s => s.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AnimatePresence mode="wait">
          <Routes>
            {/* Public */}
            <Route path="/" element={<Landing />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/share/:token" element={<PublicDiary />} />

            {/* Protected */}
            <Route path="/quiz" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
            <Route path="/matches" element={<ProtectedRoute><Matches /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/itinerary/new" element={<ProtectedRoute><NewItinerary /></ProtectedRoute>} />
            <Route path="/itinerary/:id/edit" element={<ProtectedRoute><EditItinerary /></ProtectedRoute>} />
            <Route path="/itinerary/:id" element={<ProtectedRoute><ViewItinerary /></ProtectedRoute>} />
            <Route path="/itinerary/:id/day/:dayNumber" element={<ProtectedRoute><DayPreview /></ProtectedRoute>} />
            <Route path="/activity/:id" element={<ProtectedRoute><ActivityDetail /></ProtectedRoute>} />
            <Route path="/diary/:id" element={<ProtectedRoute><DiaryView /></ProtectedRoute>} />
            <Route path="/diary/:id/entry/new" element={<ProtectedRoute><NewDiaryEntry /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/itineraries" element={<ProtectedRoute><Itineraries /></ProtectedRoute>} />
            <Route path="/diaries" element={<ProtectedRoute><Diaries /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
