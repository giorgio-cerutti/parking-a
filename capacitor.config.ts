import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.parking.app',
  appName: 'Parking App',
  webDir: 'dist/frontend',
  server: {
    androidScheme: 'https'
  }
};

export default config;
