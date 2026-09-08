import { Platform } from 'react-native';
import Constants from 'expo-constants';

/**
 * Dynamically resolves the API base URL for development and production.
 * - In Expo development, extracts the computer's LAN IP address from hostUri
 * - On Android Emulator: defaults to 10.0.2.2
 * - On Web / iOS Simulator: defaults to localhost
 */
const getDevHost = (): string => {
  // If running via Expo CLI, hostUri contains the IP of the dev machine (e.g. 192.168.1.50:8081)
  const hostUri = Constants.expoConfig?.hostUri || (Constants as any)?.manifest2?.extra?.expoGo?.debuggerHost;
  if (hostUri) {
    const ip = hostUri.split(':')[0];
    if (ip && ip !== 'localhost' && ip !== '127.0.0.1') {
      return ip;
    }
  }

  if (Platform.OS === 'android') {
    return '10.0.2.2';
  }

  return 'localhost';
};

export const API_BASE_URL = `http://${getDevHost()}:5000/api`;
