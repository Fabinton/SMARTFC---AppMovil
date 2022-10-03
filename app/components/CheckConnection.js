import React, { useEffect } from "react";
import NetInfo from "@react-native-community/netinfo";
import { Text } from "react-native";
import { useDispatch } from "react-redux";

const CheckConnection = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    NetInfo.addEventListener((networkState) => {
      dispatch({
        type: "SET_CONNECTION_STATUS",
        payload: networkState.isConnected,
      });
    });
  }, [NetInfo]);

  return <Text style={{ height: 0.01 }}>{}</Text>;
};

export default CheckConnection;
