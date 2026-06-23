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
import { LocaleProvider } from "./contexts/LocaleContext";
import LocaleSEO from "./components/LocaleSEO";

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
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy.tsx"));
const ICPLandingPage = lazy(() => import("./pages/ICPLandingPage.tsx"));
const ContentPlaybook = lazy(() => import("./pages/ContentPlaybook.tsx"));
const Careers = lazy(() => import("./pages/Careers.tsx"));
const Contact = lazy(() => import("./pages/Contact.tsx"));
const PricingTiers = lazy(() => import("./pages/PricingTiers.tsx"));
const PricingRenewals = lazy(() => import("./pages/PricingRenewals.tsx"));
const ThankYou = lazy(() => import("./pages/ThankYou.tsx"));
const Awards = lazy(() => import("./pages/Awards.tsx"));
const GuestBooking = lazy(() => import("./pages/GuestBooking.tsx"));
const Lp = lazy(() => import("./pages/Lp.tsx"));

const queryClient = new QueryClient();

/**
 * Renders the public-page route tree. Mounted twice in <AnimatedRoutes/>:
 * once at "/" (UK) and once at "/us" (US). Admin / form-action routes are
 * mounted separately and stay UK-only.
 */
const PublicRoutes = () => (
  <>
    <Route index element={<PageTransition><Index /></PageTransition>} />
    <Route path="about-earworm" element={<PageTransition><OurStory /></PageTransition>} />
    <Route path="case-study/:slug" element={<PageTransition><CaseStudy /></PageTransition>} />
    <Route path="cookies" element={<PageTransition><CookiesPolicy /></PageTransition>} />
    <Route path="book-a-call" element={<PageTransition><BookACall /></PageTransition>} />
    <Route path="blogs" element={<PageTransition><Blogs /></PageTransition>} />
    <Route path="blog/:slug" element={<PageTransition><BlogPostPage /></PageTransition>} />
    <Route path="case-studies" element={<PageTransition><CaseStudiesPage /></PageTransition>} />
    <Route path="privacy-policy" element={<PageTransition><PrivacyPolicy /></PageTransition>} />
    <Route path="content-marketing/:slug" element={<PageTransition><ICPLandingPage /></PageTransition>} />
    <Route path="content-playbook" element={<PageTransition><ContentPlaybook /></PageTransition>} />
    <Route path="careers" element={<PageTransition><Careers /></PageTransition>} />
    <Route path="contact" element={<PageTransition><Contact /></PageTransition>} />
    <Route path="pricing" element={<PageTransition><PricingTiers /></PageTransition>} />
    <Route path="pricing/renewals" element={<PageTransition><PricingRenewals /></PageTransition>} />
    <Route path="awards" element={<PageTransition><Awards /></PageTransition>} />
    <Route path="guest-booking" element={<PageTransition><GuestBooking /></PageTransition>} />
  </>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<div className="min-h-screen bg-background" />}>
        <Routes location={location} key={location.pathname}>
          {/* UK (default) */}
          <Route path="/">{PublicRoutes()}</Route>

          {/* US mirror — same component tree, /us prefix */}
          <Route path="/us">{PublicRoutes()}</Route>

          {/* UK-only routes (admin, form action, sandbox) */}
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/sandbox" element={<PageTransition><Sandbox /></PageTransition>} />
          <Route path="/thank-you" element={<PageTransition><ThankYou /></PageTransition>} />
          <Route path="/lp" element={<Lp />} />

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
        <LocaleProvider>
          <LocaleSEO />
          <AnimatedRoutes />
          <RedirectHandler />
          <PageViewTracker />
          <ConditionalWidgets />
        </LocaleProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
