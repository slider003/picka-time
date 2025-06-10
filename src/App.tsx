
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import AdminPanel from "./pages/AdminPanel";
import UserCalendar from "./pages/UserCalendar";
import Results from "./pages/Results";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  return React.createElement(
    QueryClientProvider,
    { client: queryClient },
    React.createElement(
      AuthProvider,
      null,
      React.createElement(
        TooltipProvider,
        null,
        React.createElement(Toaster),
        React.createElement(Sonner),
        React.createElement(
          HashRouter,
          null,
          React.createElement(
            Routes,
            null,
            React.createElement(Route, { path: "/", element: React.createElement(Index) }),
            React.createElement(Route, { path: "/admin", element: React.createElement(AdminPanel) }),
            React.createElement(Route, { path: "/calendar/:calendarId", element: React.createElement(UserCalendar) }),
            React.createElement(Route, { path: "/results/:calendarId", element: React.createElement(Results) }),
            React.createElement(Route, { path: "*", element: React.createElement(NotFound) })
          )
        )
      )
    )
  );
};

export default App;
