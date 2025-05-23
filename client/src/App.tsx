import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { FormProvider } from "./lib/formContext";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import AssessmentForm from "@/pages/AssessmentForm";
import AssessmentComplete from "@/pages/AssessmentComplete";
import Admin from "@/pages/Admin";
import TestPage from "@/pages/TestPage";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/assessment" component={AssessmentForm} />
      <Route path="/assessment/complete" component={AssessmentComplete} />
      <Route path="/admin" component={Admin} />
      <Route path="/test" component={TestPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <FormProvider>
        <Router />
        <Toaster />
      </FormProvider>
    </QueryClientProvider>
  );
}

export default App;
