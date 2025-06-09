import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Shield, ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';
import type { ApkAnalysis } from '@shared/schema';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AnalysisCardProps {
  analysis: ApkAnalysis;
}

export function AnalysisCard({ analysis }: AnalysisCardProps) {
  const isDangerous = (analysis.threatScore ?? 0) > 70 || analysis.status === 'dangerous';

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'analyzing':
        return <Badge variant="secondary">Analyzing</Badge>;
      case 'scanning':
        return <Badge variant="secondary">Scanning</Badge>;
      case 'safe':
        return <Badge variant="default">Safe</Badge>;
      case 'dangerous':
        return <Badge variant="destructive">Dangerous</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getThreatIcon = (score: number) => {
    if (score < 30) return <ShieldCheck className="h-6 w-6 text-green-500" />;
    if (score < 70) return <Shield className="h-6 w-6 text-yellow-500" />;
    return <ShieldAlert className="h-6 w-6 text-red-500" />;
  };

  const canInstall = analysis.blockchainVerified && 
                     analysis.status === 'safe' && 
                     !isDangerous;

  const handleInstall = () => {
    if (!canInstall) {
      alert("This APK cannot be installed due to security concerns.");
      return;
    }
    alert("Installation started for verified safe APK.");
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">{analysis.filename}</CardTitle>
        {getStatusBadge(analysis.status)}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isDangerous && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Security Warning</AlertTitle>
              <AlertDescription>
                This APK has been identified as potentially harmful. Installation has been blocked for your safety.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex items-center gap-4">
            {getThreatIcon(analysis.threatScore || 0)}
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <span className="text-sm">Threat Score</span>
                <span className="text-sm font-medium">
                  {analysis.threatScore || 0}%
                </span>
              </div>
              <Progress 
                value={analysis.threatScore || 0} 
                className={cn(
                  "h-2",
                  isDangerous ? "bg-red-100" : "bg-green-100"
                )}
              />
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Required Permissions</h4>
            <div className="flex flex-wrap gap-2">
              {analysis.permissions?.map((perm, i) => (
                <Badge 
                  key={i} 
                  variant={perm.toLowerCase().includes('dangerous') ? "destructive" : "secondary"}
                >
                  {perm}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm">Blockchain Verification</span>
            <Badge variant={analysis.blockchainVerified ? "default" : "destructive"}>
              {analysis.blockchainVerified ? "Verified" : "Unverified"}
            </Badge>
          </div>

          {analysis.mlAnalysis?.suspiciousAPIs.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Suspicious APIs Detected</h4>
              <div className="flex flex-wrap gap-2">
                {analysis.mlAnalysis.suspiciousAPIs.map((api, i) => (
                  <Badge key={i} variant="destructive">{api}</Badge>
                ))}
              </div>
            </div>
          )}

          <Button 
            className="w-full mt-4" 
            variant={isDangerous ? "destructive" : "default"}
            disabled={!canInstall}
            onClick={handleInstall}
          >
            {isDangerous ? "Installation Blocked" : canInstall ? "Install APK" : "Cannot Install"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}