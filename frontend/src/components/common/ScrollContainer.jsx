import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Aurora from "./Aurora";
import HomeContent from "./pageContents/HomeContent";
import FeaturesContent from "./pageContents/FeaturesContent";
import AboutContent from "./pageContents/AboutContent";
import ContactContent from "./pageContents/ContactContent";
import Footer from "./Footer";
import Navbar from "../info/Navbar";

const PAGES = [
  { path: "/home", component: HomeContent, id: "home" },
  { path: "/features", component: FeaturesContent, id: "features" },
  { path: "/about", component: AboutContent, id: "about" },
  { path: "/contact", component: ContactContent, id: "contact" },
];

export default function ScrollContainer() {
  const containerRef = useRef(null);
  const pageRefs = useRef({});
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef(null);
  const isUserScrollRef = useRef(true);
  const hasInitializedRef = useRef(false);

  // Initialize scroll position on mount
  useEffect(() => {
    if (hasInitializedRef.current) return;
    
    const initializeScroll = () => {
      const currentPath = location.pathname;
      const pageIndex = PAGES.findIndex((p) => p.path === currentPath);
      
      if (pageIndex !== -1 && containerRef.current) {
        const targetPage = pageRefs.current[PAGES[pageIndex].id];
        if (targetPage) {
          isUserScrollRef.current = false;
          targetPage.scrollIntoView({ behavior: "auto", block: "start" });
          setTimeout(() => {
            isUserScrollRef.current = true;
            hasInitializedRef.current = true;
          }, 100);
          return;
        }
      }
      hasInitializedRef.current = true;
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(initializeScroll, 100);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update URL based on visible page using Intersection Observer
  useEffect(() => {
    const observerOptions = {
      root: containerRef.current,
      rootMargin: "-40% 0px -40% 0px",
      threshold: [0, 0.5, 1],
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
          const pageId = entry.target.dataset.pageId;
          const page = PAGES.find((p) => p.id === pageId);
          if (page && location.pathname !== page.path && isUserScrollRef.current) {
            // Set flag to prevent navigation effect from scrolling
            isUserScrollRef.current = false;
            // Use navigate with replace to update React Router location
            navigate(page.path, { replace: true });
            // Reset flag after a short delay
            setTimeout(() => {
              isUserScrollRef.current = true;
            }, 100);
          }
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    // Observe all page sections
    PAGES.forEach((page) => {
      const element = pageRefs.current[page.id];
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [location.pathname, navigate]);

  // Handle navigation from URL changes (e.g., clicking navbar links)
  useEffect(() => {
    // Skip if not initialized yet (initial scroll will handle it)
    if (!hasInitializedRef.current) return;
    
    // Skip if navigation was triggered by scroll (isUserScrollRef is false)
    if (!isUserScrollRef.current) return;
    
    const currentPath = location.pathname;
    const pageIndex = PAGES.findIndex((p) => p.path === currentPath);
    
    if (pageIndex !== -1) {
      const targetPage = pageRefs.current[PAGES[pageIndex].id];
      if (targetPage && containerRef.current) {
        // Check if target page is already in view
        const rect = targetPage.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();
        const isInView = rect.top >= containerRect.top && rect.top < containerRect.bottom;
        
        // Only scroll if not already in view
        if (!isInView) {
          isUserScrollRef.current = false;
          setIsScrolling(true);
          
          // Use requestAnimationFrame to ensure DOM is ready
          requestAnimationFrame(() => {
            targetPage.scrollIntoView({ behavior: "smooth", block: "start" });
          });
          
          // Reset flags after animation
          if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
          }
          scrollTimeoutRef.current = setTimeout(() => {
            setIsScrolling(false);
            isUserScrollRef.current = true;
          }, 1000);
        }
      }
    }
  }, [location.pathname]);

  // Handle manual scroll events
  const handleScroll = () => {
    if (!isUserScrollRef.current) return;
    
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    scrollTimeoutRef.current = setTimeout(() => {
      const container = containerRef.current;
      if (!container) return;

      const viewportHeight = window.innerHeight;
      const scrollTop = container.scrollTop;
      
      // Find which page is most centered in viewport
      let activePage = null;
      let minDistance = Infinity;

      PAGES.forEach((page) => {
        const element = pageRefs.current[page.id];
        if (element) {
          const rect = element.getBoundingClientRect();
          const elementTop = rect.top + scrollTop;
          const elementCenter = elementTop + rect.height / 2;
          const viewportCenter = scrollTop + viewportHeight / 2;
          const distance = Math.abs(viewportCenter - elementCenter);

          if (distance < minDistance && rect.top < viewportHeight && rect.bottom > 0) {
            minDistance = distance;
            activePage = page;
          }
        }
      });

      if (activePage && location.pathname !== activePage.path) {
        // Set flag to prevent navigation effect from scrolling
        isUserScrollRef.current = false;
        // Use navigate with replace to update React Router location
        navigate(activePage.path, { replace: true });
        // Reset flag after a short delay
        setTimeout(() => {
          isUserScrollRef.current = true;
        }, 100);
      }
    }, 150);
  };

  return (
    <div className="flex flex-col h-screen bg-black overflow-hidden relative">
      {/* Fixed Aurora Background - stays consistent across all pages */}
      <div className="fixed inset-0 z-0">
        <Aurora
          colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
          blend={0.5}
          amplitude={0.6}
          speed={2}
        />
      </div>

      <Navbar />
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto snap-y snap-mandatory relative z-10 scrollbar-hide"
        style={{
          scrollBehavior: "smooth",
          WebkitOverflowScrolling: "touch",
          scrollSnapType: "y mandatory",
        }}
      >
        {PAGES.map((page, index) => {
          const PageComponent = page.component;
          return (
            <section
              key={page.id}
              ref={(el) => (pageRefs.current[page.id] = el)}
              data-page-id={page.id}
              className="snap-start snap-always min-h-screen w-full relative animate-fade-in"
              style={{ 
                scrollSnapAlign: "start",
                animationDelay: `${index * 0.1}s`
              }}
            >
              <PageComponent />
            </section>
          );
        })}
        
        {/* Footer at the end */}
        <section 
          className="snap-start snap-always w-full relative flex items-end justify-center"
          style={{ scrollSnapAlign: "start", minHeight: "auto" }}
        >
          <div className="w-full py-8">
            <Footer />
          </div>
        </section>
      </div>
    </div>
  );
}
