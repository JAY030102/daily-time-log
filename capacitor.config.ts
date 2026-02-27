import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.dailytimelog.app',
  appName: 'Daily Time Log',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    sqlite: {
      iosDatabaseLocation: 'Library',
      iosEncryption: 'no',
      androidDatabaseLocation: 'default',
    },
  },
};

export default config;
