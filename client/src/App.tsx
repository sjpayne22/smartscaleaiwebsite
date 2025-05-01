import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Chatbot } from "@/components/ui/chatbot";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Blog from "@/pages/blog";
import { useEffect } from "react";

function Router() {
  // Get the base path for GitHub Pages
  const getBasePath = () => {
    // When deploying to GitHub Pages at username.github.io/repo-name
    // we need to use the repo name as the base path
    // For local development, this will be an empty string
    return window.location.hostname === 'sjpayne22.github.io' ? '/smartscaaleai-website' : '';
  };

  useEffect(() => {
    // Smooth scrolling for anchor links
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]');
      
      if (anchor) {
        e.preventDefault();
        const targetId = anchor.getAttribute('href');
        
        if (targetId) {
          const targetElement = document.querySelector(targetId);
          
          if (targetElement) {
            window.scrollTo({
              top: (targetElement as HTMLElement).offsetTop - 80,
              behavior: 'smooth'
            });
          }
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    
    return () => {
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  // Use the base path in your routes
  const basePath = getBasePath();

  return (
    <Switch base={basePath}>
      <Route path="/" component={Home} />
      <Route path="/blog" component={Blog} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Chatbot />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
