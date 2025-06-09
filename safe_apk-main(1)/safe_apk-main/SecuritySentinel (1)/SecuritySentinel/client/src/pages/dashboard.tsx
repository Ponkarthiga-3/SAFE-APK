import { useQuery } from '@tanstack/react-query';
import { AnalysisCard } from '@/components/analysis-card';
import { ThreatChart } from '@/components/threat-chart';
import type { ApkAnalysis } from '@shared/schema';

export default function Dashboard() {
  const { data: analyses, isLoading } = useQuery<ApkAnalysis[]>({
    queryKey: ['/api/analyses']
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Security Analysis Dashboard</h1>
      
      <div className="mb-8">
        <ThreatChart analyses={analyses || []} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {analyses?.map((analysis) => (
          <AnalysisCard key={analysis.id} analysis={analysis} />
        ))}
      </div>
    </div>
  );
}
