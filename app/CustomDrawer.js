import {
  View,
  Text,
  TouchableOpacity,
  BackHandler,
  ImageBackground,
  Image,
} from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import blueBackground from "../assets/images/backgroundImage.png";
import userProfile from "../assets/images/user-profile.jpg";

const CustomDrawer = (props) => {
  const { selectedStudent } = useSelector((state) => state.videos);
  const dispatch = useDispatch();
  return (
    <View style={{ flex: 1, backgroundColor: "#272D34" }}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ backgroundColor: "#272D34" }}
      >
        <ImageBackground source={blueBackground} style={{ padding: 20 }}>
          <Image
            source={userProfile}
            style={{
              height: 80,
              width: 80,
              borderRadius: 40,
              marginBottom: 10,
            }}
          />
          <Text
            numberOfLines={1}
            style={{ fontFamily: "Roboto", fontSize: 15, color: "#333" }}
          >
            Usuario:{" "}
            {selectedStudent?.nombre_estudiante?.split(" ")[0] +
              " " +
              selectedStudent?.apellido_estudiante?.split(" ")[0]}
          </Text>
          <Text style={{ fontFamily: "Roboto", fontSize: 15, color: "#333" }}>
            Curso: {selectedStudent?.grado_estudiante}
          </Text>
          <Text
            numberOfLines={1}
            style={{ fontFamily: "Roboto", fontSize: 15, color: "#333" }}
          >
            Correo: {selectedStudent?.correo_electronico}
          </Text>
        </ImageBackground>
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
