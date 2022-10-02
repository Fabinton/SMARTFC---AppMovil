import React from "react";
import { View, Image, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Video } from "expo-av";
import { connect } from "react-redux";
function Subject(props) {
  var uristring = props.url_imagen;
  var ip = props.ipconfig;
  var uri = "http://" + ip + ":3000" + uristring.substr(28);

  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={styles.container}>
        <View style={styles.left}>
          <Image style={styles.cover} source={{ uri: uri }} />
        </View>
        <View style={styles.right}>
          <Text style={styles.title}>{props.nombre_materiaActiva}</Text>

          <Text style={styles.curso}>Grado: {props.id_grado}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#70C2E5",
    borderRadius: 5,
    height: 120,
    overflow: "hidden",
  },
  cover: {
    marginTop: 10,
    height: 100,
    width: 100,
    resizeMode: "cover",
    borderRadius: 5,
    overflow: "hidden",
  },
  left: {
    paddingLeft: 10,
  },
  right: {
    paddingLeft: 10,
    justifyContent: "space-between",
  },
  title: {
    marginTop: 10,
    fontSize: 18,
    color: "#44546b",
    fontWeight: "bold",
  },
  curso: {
    fontSize: 11,
    color: "white",
    fontWeight: "bold",
    marginBottom: 10,
  },
  teacher: {
    fontSize: 14,
    color: "#6b6b6b",
    fontWeight: "bold",
  },
});
function mapStateToProps(state) {
  return {
    ipconfig: state.videos.selectedIPConfig,
  };
}
export default connect(mapStateToProps)(Subject);
