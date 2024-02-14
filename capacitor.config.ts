import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.parking.app',
  appName: 'parking-app',
  webDir: 'dist/frontend',
  server: {
    androidScheme: 'https'
  }
};

export default config;
