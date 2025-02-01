import { ImpactMetrics } from "@/components/ImpactMetrics"
import { AddChallengeButton } from "@/components/AddChallengeButton"
import { RequestsSection } from "@/components/RequestsSection"

export default function Index() {
  return (
    <div className="container max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">
        Hi, Username <span className="wave">👋</span>
      </h1>
      
      <p className="text-muted-foreground mb-8 text-center">
        Participate in challenges that make a difference and visualise your impact
      </p>

      <ImpactMetrics goodDeeds={596} />
      
      <RequestsSection />
      
      <AddChallengeButton />
    </div>
  );
}