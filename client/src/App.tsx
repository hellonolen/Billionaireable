import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import Integrations from "./pages/Integrations";

import HealthGoals from "./pages/HealthGoals";
import Share from "./pages/Share";
import DataImport from "./pages/DataImport";
import CustomizeLayout from "./pages/CustomizeLayout";
import Insights from "./pages/Insights";
import Reports from "./pages/Reports";
import Achievements from "./pages/Achievements";
import Notifications from "./pages/Notifications";
import NotificationRules from "./pages/NotificationRules";
import Billing from "./pages/Billing";
import TeamManagement from "./pages/TeamManagement";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import AdminSettings from "./pages/AdminSettings";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Disclosures from "./pages/Disclosures";
import Preferences from "./pages/Preferences";
import Calendar from "./pages/Calendar";
import Markets from "./pages/Markets";
import System from "./pages/System";
import Checkout from "./pages/Checkout";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Dashboard} />
      <Route path={"/settings"} component={Settings} />
      <Route path={"/integrations"} component={Integrations} />

      <Route path="/health-goals" component={HealthGoals} />
      <Route path="/calendar" component={Calendar} />
      <Route path="/markets" component={Markets} />
      <Route path={"/system"} component={System} />
      <Route path={"/checkout"} component={Checkout} />
      <Route path={"/share"} component={Share} />
      <Route path={"/data-import"} component={DataImport} />
      <Route path={"/customize-layout"} component={CustomizeLayout} />
      <Route path={"/insights"} component={Insights} />
      <Route path={"/reports"} component={Reports} />
      <Route path={"/achievements"} component={Achievements} />
      <Route path={"/notifications"} component={Notifications} />
      <Route path={"/notification-rules"} component={NotificationRules} />
      <Route path={"/billing"} component={Billing} />
      <Route path={"/team"} component={TeamManagement} />
      <Route path={"/profile"} component={Profile} />
      <Route path={"/admin"} component={Admin} />
      <Route path={"/admin/settings"} component={AdminSettings} />
      <Route path={"/privacy"} component={Privacy} />
      <Route path={"/terms"} component={Terms} />
      <Route path={"/disclosures"} component={Disclosures} />
      <Route path={"/preferences"} component={Preferences} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
