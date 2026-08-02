import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.fzsavings.app',
  appName: 'FZ Savings',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
