import { Card, CardHeader, CardTitle, CardDescription } from "./ui/card"

interface ImpactMetricsProps {
  goodDeeds: number
}

export function ImpactMetrics({ goodDeeds }: ImpactMetricsProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Your Impact So Far</CardTitle>
        <div className="flex items-baseline gap-3 mt-4">
          <span className="text-5xl font-bold bg-gradient-to-r from-teal-400 to-teal-600 bg-clip-text text-transparent">
            375
          </span>
          <CardDescription className="text-xl">
            chained good deeds
          </CardDescription>
        </div>
      </CardHeader>
    </Card>
  )
} 