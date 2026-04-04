import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.monosolution.daligotaksong',
  appName: '달리고 탁송',
  webDir: 'dist',
  server: {
    url: 'https://daligo.kr',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      backgroundColor: "#ffffff",
      androidScaleType: "CENTER_CROP",
      showSpinner: true,
      androidSpinnerStyle: "large",
      spinnerColor: "#2563eb",
      splashFullScreen: true,
      splashImmersive: true,
    },
  },
};

export default config;
