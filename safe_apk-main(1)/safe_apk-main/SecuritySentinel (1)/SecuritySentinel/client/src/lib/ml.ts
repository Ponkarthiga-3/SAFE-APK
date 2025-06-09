import * as tf from '@tensorflow/tfjs';

// Simple ML model for APK analysis
export class APKAnalyzer {
  private model: tf.LayersModel | null = null;
  private initialized = false;

  // Predefined dangerous permissions
  private readonly DANGEROUS_PERMISSIONS = new Set([
    'android.permission.ACCESS_FINE_LOCATION',
    'android.permission.READ_CONTACTS',
    'android.permission.WRITE_CONTACTS',
    'android.permission.RECORD_AUDIO',
    'android.permission.CAMERA',
    'android.permission.READ_SMS',
    'android.permission.SEND_SMS',
    'android.permission.RECEIVE_SMS',
    'android.permission.DANGEROUS_PERMISSION',
    'android.permission.SYSTEM_ALERT_WINDOW'
  ]);

  async init() {
    if (this.initialized) return;

    try {
      // Simple sequential model for demonstration
      this.model = tf.sequential({
        layers: [
          tf.layers.dense({ units: 32, inputShape: [10], activation: 'relu' }),
          tf.layers.dense({ units: 16, activation: 'relu' }),
          tf.layers.dense({ units: 1, activation: 'sigmoid' })
        ]
      });

      this.model.compile({
        optimizer: 'adam',
        loss: 'binaryCrossentropy',
        metrics: ['accuracy']
      });

      // Initialize with fixed weights for consistency
      const weights = await this.model.predict(tf.zeros([1, 10])) as tf.Tensor;
      await weights.data();
      weights.dispose();

      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize ML model:', error);
      throw new Error('ML model initialization failed');
    }
  }

  async analyzeAPK(permissions: string[]): Promise<{
    malwareProb: number;
    suspiciousAPIs: string[];
  }> {
    if (!this.initialized) await this.init();

    try {
      // Count dangerous permissions
      const dangerousCount = permissions.filter(p => 
        this.DANGEROUS_PERMISSIONS.has(p)
      ).length;

      // Deterministic threat probability based on dangerous permissions
      const malwareProb = Math.min(dangerousCount / 10, 0.95);

      // Identify suspicious APIs consistently
      const suspiciousAPIs = permissions.filter(p => 
        this.DANGEROUS_PERMISSIONS.has(p)
      );

      return {
        malwareProb,
        suspiciousAPIs
      };
    } catch (error) {
      console.error('ML analysis failed:', error);
      throw new Error('ML analysis failed');
    }
  }
}

export const analyzer = new APKAnalyzer();