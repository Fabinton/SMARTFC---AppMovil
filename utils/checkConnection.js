import { useNetInfo } from "@react-native-community/netinfo";

export const verifyConnection = () => {
  const netInfo = useNetInfo();
  if (netInfo.isConnected) {
    return netInfo.isConnected;
  } else {
    return false;
  }
};
