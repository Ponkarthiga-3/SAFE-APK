import { useState } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

export function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('apk', file);

      const res = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');

      toast({
        title: 'Upload Successful',
        description: 'APK analysis has started',
      });

      setFile(null);
    } catch (error) {
      toast({
        title: 'Upload Failed',
        description: 'Please try again',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Upload APK for Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="border-2 border-dashed rounded-lg p-6 text-center">
            <input
              type="file"
              accept=".apk"
              onChange={handleFileChange}
              className="hidden"
              id="apk-upload"
            />
            <label
              htmlFor="apk-upload"
              className="flex flex-col items-center gap-2 cursor-pointer"
            >
              <Upload className="h-8 w-8 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {file ? file.name : 'Click to upload APK'}
              </span>
            </label>
          </div>
          <Button
            onClick={handleUpload}
            disabled={!file}
            className="w-full"
          >
            Analyze APK
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
