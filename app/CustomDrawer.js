import { View, Text, TouchableOpacity, BackHandler } from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
const CustomDrawer = (props) => {
  const dispatch = useDispatch();
  return (
    <View style={{ flex: 1, backgroundColor: "#272D34" }}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ backgroundColor: "#272D34" }}
      >
        <View style={{ flex: 1, backgroundColor: "#272D34", paddingTop: 10 }}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      <View style={{ padding: 20, borderTopWidth: 1, borderTopColor: "#ccc" }}>
        <TouchableOpacity
          onPress={() => {
            dispatch({
              type: "SET_USER_LOGGED_IN",
              payload: { loggedIn: false },
            });
            BackHandler.exitApp();
          }}
          style={{ paddingVertical: 15 }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="exit" size={24} color="white" />
            <Text style={{ marginLeft: 10, color: "gray" }}>Cerrar sesión</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CustomDrawer;
