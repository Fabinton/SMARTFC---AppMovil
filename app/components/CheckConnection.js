import React, { useEffect } from "react";
import NetInfo from "@react-native-community/netinfo";
import { Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import api from "../../utils/api";

const CheckConnection = () => {
  const dispatch = useDispatch();
  const { selectedIPConfig } = useSelector((state) => state.videos);
  useEffect(() => {
    const response = api.checkIp(selectedIPConfig, dispatch);
  }, [NetInfo, selectedIPConfig]);

  return <Text style={{ height: 0.01 }}>{}</Text>;
};

export default CheckConnection;
