import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatePresence } from "framer-motion";
import PageTransition from "./components/PageTransition";
import CookieConsent from "./components/CookieConsent";
import ChatWidget from "./components/ChatWidget";

const Index = lazy(() => import("./pages/Index.tsx"));
const OurStory = lazy(() => import("./pages/OurStory.tsx"));
const CaseStudy = lazy(() => import("./pages/CaseStudy.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const CookiesPolicy = lazy(() => import("./pages/CookiesPolicy.tsx"));
const BookACall = lazy(() => import("./pages/BookACall.tsx"));
const Admin = lazy(() => import("./pages/Admin.tsx"));
const AdminLogin = lazy(() => import("./pages/AdminLogin.tsx"));

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<div className="min-h-screen bg-background" />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><Index /></PageTransition>} />
          <Route path="/our-story" element={<PageTransition><OurStory /></PageTransition>} />
          <Route path="/case-study/:slug" element={<PageTransition><CaseStudy /></PageTransition>} />
          <Route path="/cookies" element={<PageTransition><CookiesPolicy /></PageTransition>} />
          <Route path="/book-a-call" element={<PageTransition><BookACall /></PageTransition>} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AnimatedRoutes />
        <ConditionalWidgets />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
