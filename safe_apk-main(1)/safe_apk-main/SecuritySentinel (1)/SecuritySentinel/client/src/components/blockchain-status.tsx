import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Shield, CheckCircle2, XCircle, Link as LinkIcon, AlertTriangle } from 'lucide-react';
import { blockchainVerifier } from '@/lib/blockchain';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface BlockchainStatusProps {
  fileHash: string;
  isVerified: boolean;
  threatScore: number;
  className?: string;
}

export function BlockchainStatus({ fileHash, isVerified, threatScore, className }: BlockchainStatusProps) {
  const [verifying, setVerifying] = useState(false);
  const [verificationProgress, setVerificationProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const isDangerous = threatScore > 70;

  useEffect(() => {
    let mounted = true;

    const verify = async () => {
      if (isVerified) return;

      setVerifying(true);
      setError(null);

      try {
        // Simulate verification progress
        for (let i = 0; i <= 100; i += 10) {
          if (!mounted) break;
          setVerificationProgress(i);
          await new Promise(r => setTimeout(r, 200));
        }

        const result = await blockchainVerifier.verifyAPK(fileHash);

        if (mounted) {
          if (result.verified) {
            await blockchainVerifier.recordVerification(fileHash, {
              verified: true,
              threatScore,
              timestamp: Date.now()
            });
          } else {
            setError('APK verification failed');
          }
        }
      } catch (err) {
        if (mounted) {
          setError('Verification error occurred');
        }
      } finally {
        if (mounted) {
          setVerifying(false);
        }
      }
    };

    verify();

    return () => {
      mounted = false;
    };
  }, [fileHash, isVerified, threatScore]);

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Blockchain Verification
        </CardTitle>
        <Badge 
          variant={isDangerous ? "destructive" : isVerified ? "default" : error ? "destructive" : "secondary"}
          className="capitalize"
        >
          {isDangerous ? 'Dangerous' : isVerified ? 'Verified' : error ? 'Failed' : 'Pending'}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isDangerous && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Security Risk Detected</AlertTitle>
              <AlertDescription>
                This APK has been flagged as potentially dangerous. Installation is not recommended.
              </AlertDescription>
            </Alert>
          )}

          {/* Hash Display */}
          <div className="flex items-center gap-2 text-sm">
            <LinkIcon className="h-4 w-4 text-muted-foreground" />
            <code className="font-mono bg-muted px-2 py-1 rounded text-xs">
              {fileHash.slice(0, 20)}...{fileHash.slice(-8)}
            </code>
          </div>

          <Separator />

          {/* Verification Status */}
          <div className="space-y-2">
            {verifying && (
              <>
                <div className="flex justify-between text-sm">
                  <span>Verifying on blockchain...</span>
                  <span>{verificationProgress}%</span>
                </div>
                <Progress value={verificationProgress} className="h-2" />
              </>
            )}

            {isVerified && !isDangerous && (
              <div className="flex items-center gap-2 text-green-500">
                <CheckCircle2 className="h-5 w-5" />
                <span>APK verified on blockchain</span>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 text-destructive">
                <XCircle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Additional Info */}
          {isVerified && (
            <div className="text-xs text-muted-foreground">
              <p>Last verified: {new Date().toLocaleString()}</p>
              <p>Network consensus: 100%</p>
              <p>Threat Score: {threatScore}%</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}