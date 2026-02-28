import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Overview } from "./pages/Overview";
import { LogEntry } from "./pages/LogEntry";
import { Notes } from "./pages/Notes";
import { DrSchedule } from "./pages/DrSchedule";
import { Privacy } from "./pages/Privacy";
import { Settings } from "./pages/Settings";
import { Onboarding } from "./pages/Onboarding";

export const router = createBrowserRouter([
  {
    path: "/onboarding",
    element: <Onboarding />,
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Overview /> },
      { path: "log-entry", element: <LogEntry /> },
      { path: "notes", element: <Notes /> },
      { path: "dr-schedule", element: <DrSchedule /> },
      { path: "privacy", element: <Privacy /> },
      { path: "settings", element: <Settings /> },
    ],
  },
]);