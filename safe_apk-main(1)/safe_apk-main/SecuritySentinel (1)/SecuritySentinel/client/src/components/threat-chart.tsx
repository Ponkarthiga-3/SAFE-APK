import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions
} from 'chart.js';
import type { ApkAnalysis } from '@shared/schema';

// Register all required Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ThreatChartProps {
  analyses: ApkAnalysis[];
}

export function ThreatChart({ analyses }: ThreatChartProps) {
  // Sort analyses by date
  const sortedAnalyses = [...analyses].sort(
    (a, b) => new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime()
  );

  const data = {
    labels: sortedAnalyses.map(a => new Date(a.createdAt!).toLocaleString()),
    datasets: [
      {
        label: 'Threat Score',
        data: sortedAnalyses.map(a => a.threatScore || 0),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.1,
        fill: false,
      }
    ]
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Threat Analysis Trend'
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Analysis Date'
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Threat Score'
        },
        min: 0,
        max: 100,
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Threat Analysis Trend</CardTitle>
      </CardHeader>
      <CardContent className="h-[400px]">
        <Line data={data} options={options} />
      </CardContent>
    </Card>
  );
}