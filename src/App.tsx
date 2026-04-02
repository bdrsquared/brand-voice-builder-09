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
import PageViewTracker from "./components/PageViewTracker";
import RedirectHandler from "./components/RedirectHandler";

const ConditionalWidgets = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  if (isAdmin) return null;
  return (
    <>
      <CookieConsent />
      <ChatWidget />
    </>
  );
};
const Index = lazy(() => import("./pages/Index.tsx"));
const OurStory = lazy(() => import("./pages/OurStory.tsx"));
const CaseStudy = lazy(() => import("./pages/CaseStudy.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const CookiesPolicy = lazy(() => import("./pages/CookiesPolicy.tsx"));
const BookACall = lazy(() => import("./pages/BookACall.tsx"));
const Blogs = lazy(() => import("./pages/Blogs.tsx"));
const BlogPostPage = lazy(() => import("./pages/BlogPost.tsx"));
const Admin = lazy(() => import("./pages/Admin.tsx"));
const AdminLogin = lazy(() => import("./pages/AdminLogin.tsx"));
const Sandbox = lazy(() => import("./pages/Sandbox.tsx"));
const CaseStudiesPage = lazy(() => import("./pages/CaseStudies.tsx"));

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
          <Route path="/blogs" element={<PageTransition><Blogs /></PageTransition>} />
          <Route path="/blog/:slug" element={<PageTransition><BlogPostPage /></PageTransition>} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/sandbox" element={<PageTransition><Sandbox /></PageTransition>} />
          <Route path="/case-studies" element={<PageTransition><CaseStudiesPage /></PageTransition>} />
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
        <RedirectHandler />
        <PageViewTracker />
        <ConditionalWidgets />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
