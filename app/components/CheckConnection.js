import React, { useEffect } from "react";
import { useNetInfo } from "@react-native-community/netinfo";
import { Text } from "react-native";
import { useDispatch } from "react-redux";

const CheckConnection = () => {
  const netInfo = useNetInfo();
  const dispatch = useDispatch();
  useEffect(() => {
    netInfo.isConnected &&
      dispatch({
        type: "SET_CONNECTION_STATUS",
        payload: netInfo.isConnected,
      });
  }, [netInfo]);

  return <Text>{}</Text>;
};

export default CheckConnection;
