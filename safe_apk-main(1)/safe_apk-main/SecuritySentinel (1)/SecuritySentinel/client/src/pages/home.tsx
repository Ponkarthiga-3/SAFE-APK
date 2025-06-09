import { UploadForm } from '@/components/upload-form';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Secure APK Verification System
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Upload your APK for comprehensive security analysis including blockchain verification
            and ML-based threat detection
          </p>
        </div>
        
        <div className="flex justify-center">
          <UploadForm />
        </div>
      </div>
    </div>
  );
}
