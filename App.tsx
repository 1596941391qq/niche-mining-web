import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import ToolSelector from "./components/ToolSelector";
import HowItWorks from "./components/HowItWorks";
import Footer from "./components/Footer";
import Privacy from "./components/Privacy";
import Terms from "./components/Terms";
import AboutUs from "./components/AboutUs";
import Console from "./components/Console";
import PaymentSuccess from "./components/payment/PaymentSuccess";
import PaymentResult from "./components/payment/PaymentResult";
import APIDocs from "./components/APIDocs";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";

function App() {
  const [currentPage, setCurrentPage] = useState<string>("home");

  useEffect(() => {
    const handleRouteChange = () => {
      // 优先检查路径路由
      const path = window.location.pathname;
      if (path === "/docs") {
        setCurrentPage("docs");
        return;
      }
      
      // 然后检查hash路由
      const hash = window.location.hash.slice(1);
      if (
        hash === "privacy" ||
        hash === "terms" ||
        hash === "aboutus" ||
        hash === "console" ||
        hash === "docs" ||
        hash.startsWith("payment/") ||
        hash === "payresult"
      ) {
        setCurrentPage(hash);
      } else {
        setCurrentPage("home");
      }
    };

    // Check initial route
    handleRouteChange();

    // Listen for hash changes
    window.addEventListener("hashchange", handleRouteChange);
    
    // Listen for popstate (back/forward button)
    window.addEventListener("popstate", handleRouteChange);

    return () => {
      window.removeEventListener("hashchange", handleRouteChange);
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case "privacy":
        return <Privacy />;
      case "terms":
        return <Terms />;
      case "aboutus":
        return <AboutUs />;
      case "console":
        return <Console />;
      case "docs":
        return <APIDocs />;
      case "payment/success":
        return <PaymentSuccess />;
      case "payresult":
        return <PaymentResult />;
      default:
        return (
          <>
            <Hero />
            <Features />
            <ToolSelector />
            <HowItWorks />
          </>
        );
    }
  };

  return (
    <ThemeProvider isHomePage={currentPage === "home"}>
      <AuthProvider>
        <LanguageProvider>
          <div className="min-h-screen bg-background text-zinc-300 font-sans selection:bg-primary selection:text-black flex flex-col">
            {currentPage !== "console" && currentPage !== "docs" && <Navbar />}
            <main className="flex-grow flex flex-col">{renderPage()}</main>
            {currentPage !== "console" && currentPage !== "docs" && <Footer />}
          </div>
        </LanguageProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
