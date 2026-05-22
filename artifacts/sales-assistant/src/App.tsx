import React from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/layout/app-layout";
import NotFound from "@/pages/not-found";

import Dashboard from "@/pages/dashboard";
import Prospects from "@/pages/prospects";
import NewProspect from "@/pages/prospect-new";
import ProspectDetail from "@/pages/prospect-detail";
import Campaigns from "@/pages/campaigns";
import NewCampaign from "@/pages/campaign-new";
import CampaignDetail from "@/pages/campaign-detail";
import Emails from "@/pages/emails";
import AiAssistant from "@/pages/ai-assistant";
import Contact from "@/pages/contact";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function Router() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/prospects/new" component={NewProspect} />
        <Route path="/prospects/:id" component={ProspectDetail} />
        <Route path="/prospects" component={Prospects} />
        
        <Route path="/campaigns/new" component={NewCampaign} />
        <Route path="/campaigns/:id" component={CampaignDetail} />
        <Route path="/campaigns" component={Campaigns} />
        
        <Route path="/emails" component={Emails} />
        
        <Route path="/ai-assistant" component={AiAssistant} />
        <Route path="/contact" component={Contact} />
        
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
