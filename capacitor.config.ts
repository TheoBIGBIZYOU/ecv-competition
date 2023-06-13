import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'ecv.competition',
  appName: 'ecv-competition',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
