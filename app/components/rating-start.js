import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Modal, Button, Alert, Image } from 'react-native';
import API from '../../utils/api';
import { Rating } from 'react-native-ratings';
import { connect } from 'react-redux';
import { TextInput } from 'react-native';
import { Stack, Flex, Spacer } from "@react-native-material/core";

class RatingStart extends Component {
    constructor(props, ipconfig) {

        super(props);
        //console.log('datito ', props);
    }
    state = {
        isVisible: false,
        ipconfig: null,
        comment:null,
        validar:null
    }
    data = [
        {
            id_qalify: 1,
            Default_Rating: 0,
            description: 'Contenido'
        },
        {
            id_qalify: 2,
            Default_Rating: 0,
            description: 'Calidad'
        },
        {
            id_qalify: 3,
            Default_Rating: 0,
            description: 'Diseño'
        },
        {
            id_qalify: 4,
            Default_Rating: 0,
            description: 'Motivación'
        },
        {
            id_qalify: 5,
            Default_Rating: 0,
            description: 'Audio'
        },
    ];
    reviewSend = {
        "id_CREA": 0,
        "id_estudiante": 0,
        "contenido": 0,
        "calidad": 0,
        "diseño": 0,
        "motivacion": 0,
        "sonido": 0
    }
    commentSend = {
        "id_estudiante":null,
        "id_CREA":null,
        "comentarios":null
    }
    dataValidar ={
        id_CREA:null,
        id_estudiante:null
    }
    UpdateRating(rating, id) {
        this.data[id - 1].defaultRating = rating;
        for (let i = 0; i < this.data.length; i++) {
            switch (id) {
                case 1:
                    this.reviewSend.contenido = rating;
                    break;
                case 2:
                    this.reviewSend.calidad = rating;
                    break;
                case 3:
                    this.reviewSend.diseño = rating;
                    break;
                case 4:
                    this.reviewSend.motivacion = rating;
                    break;
                case 5:
                    this.reviewSend.sonido = rating;
                    break;
                default:
            }
        }
        this.reviewSend.id_CREA = this.props.activity.id_contenidoREA;
        this.reviewSend.id_estudiante = this.props.student.id_estudiante;
        //console.log(JSON.stringify(this.reviewSend))
    }
    async sendReview() {
        if (this.validateSelectedRating()) {
            if(this.state.comment != null){
                this.commentSend.id_CREA = this.props.activity.id_contenidoREA;
                this.commentSend.id_estudiante = this.props.student.id_estudiante;
                this.commentSend.comentario= this.state.comment;
                const sendcomments = await API.createComentarios(this.props.ipconfig, this.commentSend);
            }
            const sendReview = await API.createNivelSatisfaccion(this.props.ipconfig, this.reviewSend);
            // alert('Reseña exitosa');
            Alert.alert('Mensaje', 'Reseña exitosa', [
                {text: 'Aceptar', onPress: () => console.log('OK Pressed')},
            ]);
            this.setState({ isVisible: !this.state.isVisible });
        } else {
            Alert.alert(
                'Mensaje',
                'Para reseñar un video necesitas seleccionar una calificación',
                [
                    { text: 'OK', onPress: () => console.log('OK Pressed') },
                ],
                { cancelable: false }
            );
        }
    }
    validateSelectedRating() {
        let cont = 0;
        for (let i = 0; i < this.data.length; i++) {
            if (this.data[i].defaultRating > 0) {
                cont++;
            }
        }

        if (cont > 0) {
            return true;
        }
        return false;
    }
    async mostrarBotonCalificar(){
        const validarCalificar = await API.getNivelSatisfaccion(this.props.ipconfig, this.props.activity.id_contenidoREA,this.props.student.id_estudiante);
        //console.log(validarCalificar.message);
        if(validarCalificar.message != 'No existe null'){
            Alert.alert('Mensaje','Solo es permitido dar una opinión sobre el contenido');
            this.setState({ isVisible: false });
        }
        else{
            this.setState({ isVisible: true })
        }
    }
    render() {
        this.state.ipconfig = this.props.ipconfig;
        return (
            <View style={styles.contentBtnReview}>
                <TouchableOpacity
                    style={styles.touchableButtonSignIn}
                    onPress={() => { this.mostrarBotonCalificar() }}
                >
                    <Text style={styles.buttonText}>Reseñar video</Text>
                </TouchableOpacity>
                <Modal
                    animationType={"fade"}
                    transparent={false}
                    visible={this.state.isVisible}
                    onRequestClose={() => { console.log("Modal has been closed.") }}>
                    {/*All views of Modal*/}
                    <View style={styles.modal}>
                        {/* <Text style={styles.text}>¿Como evaluaría su satisfacción respecto al video?</Text> */}
                        <Flex inline center>
                            <Text style={styles.textSelected}>
                            ¿Como evaluaría {"\n"} su satisfacción {"\n"} respecto al {"\n"} video?
                            </Text>
                            <Image
                            style={{
                                width: 200,
                                height: 250,
                            }}
                            source={require("../../assets/images/saludo.png")}
                            />
                        </Flex>
                        <View style={styles.container}>
                            <View style={styles.item}>
                                {this.data.map((item) => (
                                    <Text style={styles.textCont} key={item.id_qalify}>{item.description}</Text>
                                ))}
                            </View>
                            <View style={styles.item}>
                                {this.data.map((data) => (
                                    <Rating type='custom'
                                        ratingColor='#FFC300'
                                        ratingBackgroundColor='#E2E3E3'
                                        ratingCount={5}
                                        imageSize={33}
                                        onFinishRating={(rating) => { this.UpdateRating(rating, data.id_qalify) }}
                                        key={data.id_qalify}
                                        startingValue={0}
                                    />
                                ))}
                            </View>
                            <View style={styles.textAreaContainer}>
                                <TextInput
                                    style={styles.textArea}
                                    underlineColorAndroid="transparent"
                                    placeholder="Escribe tu comentario"
                                    placeholderTextColor="grey"
                                    numberOfLines={10}
                                    multiline={true} 
                                    onChangeText={(text) => this.setState({ comment: text })}/>
                            </View>
                            
                            <TouchableOpacity
                                style={styles.item2}
                                onPress={() => {
                                    this.setState({ isVisible: !this.state.isVisible });
                                }}
                                >
                                <Text style={styles.buttonText}>Cancelar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.item2}
                                onPress={() => this.sendReview()}
                                >
                                <Text style={styles.buttonText}>Calificar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#fff'
    },
    touchableButtonSignIn: {
        alignSelf: "center",
        justifyContent: "center",
        marginTop: 15,
        backgroundColor: "#70C2E5",
        height: 50,
        width: 255,
        borderRadius: 15,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    buttonText: {
        color: "#FFFFFF",
        textAlign: "center",
        fontSize: 20,
        fontWeight: "bold",
        fontFamily: "Roboto",
    },
    btnreview: {
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        borderColor: '#fff'
    },
    contentBtnReview: {
        marginTop: 8
    },
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
    },
    item: {
        marginTop: 15,
        padding: 2,
        width: '50%',
    },
    item2: {
        alignSelf: "center",
        justifyContent: "center",
        marginTop: 25,
        backgroundColor: "#70C2E5",
        height: '12%',
        width: '30%',
        marginLeft: '13%',
        borderRadius: 15,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    textSelected: {
        marginLeft: 50,
        fontSize: 25,
        fontWeight: "bold",
        color: "#2C2C2C",
        textAlign: "center",
    },
    textCont: {
        textAlign: "center",
        fontWeight: "bold", 
        color: "#333", 
        fontSize: 20, 
        marginBottom: 8,
    },
    textAreaContainer: {
        marginTop: 8,
        borderColor: '#A9A9A9',
        borderWidth: 2,
        padding: 5
    },
    textArea: {
        height: 100,
        width: 400,
        justifyContent: "flex-start",
        fontSize: 18,
    }
});

function mapStateToProps(state) {
    return {
        ipconfig: state.videos.selectedIPConfig,
        student: state.videos.selectedStudent,
        activity: state.videos.selectedActivity,
    }
}
export default connect(mapStateToProps)(RatingStart);
