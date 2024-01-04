import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';

const TOPIC = '/robot/cmd_vel';


export default class App extends React.Component {

    constructor() {
        super();

        this.state = {
            connected: false,
            activated: false,
            ip_address: ""
        };

        this.socket = null;

        this.emit = this.emit.bind(this);
        this.handleConnectButton = this.handleConnectButton.bind(this);
    }

    emit = (vel, ang) => {
        if (this.state.connected) {
            this.socket.send(JSON.stringify({
                op: 'publish',
                topic: TOPIC,
                msg: {
                    linear: { x: vel, y: 0, z: 0 },
                    angular: { x: 0, y: 0, z: ang }
                }
            }));
        }
    };


    handleConnectButton = () => {
        try {
            if (this.state.connected) {
                this.emit(0, 0);
                this.socket.close();
            }
            else {
                if (!this.socket || this.socket.readyState == WebSocket.CLOSED) {
                    this.socket = new WebSocket(`ws://${this.state.ip_address}:8080`);
                    this.socket.onopen = () => {
                        if (!this.state.connected) {
                            this.setState({
                                connected: true
                            });
                            Alert.alert('Connected!');
                        }
                    };
                    this.socket.onclose = () => {
                        if (this.state.connected) {
                            this.setState({
                                connected: false
                            });
                            Alert.alert('Disconnected!');
                        }
                    };
                }
            }
        }
        catch (err) {
            console.log(err);
        }
    };


    render() {
        return (
            <View style={styles.container}>
                <View style={{ width: '35%' }} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} gap={10} paddingLeft={'15%'}>
                    <View flexDirection={'row'} gap={10}>
                        <TouchableOpacity style={styles.buttonBox} onPress={() => this.emit(0, 1)}><Feather name="arrow-up-left" size={40} color="#fff" /></TouchableOpacity>
                        <TouchableOpacity style={styles.buttonBox} onPress={() => this.emit(1, 0)}><Feather name="arrow-up" size={48} color="#fff" /></TouchableOpacity>
                        <TouchableOpacity style={styles.buttonBox} onPress={() => this.emit(0, -1)}><Feather name="arrow-up-right" size={40} color="#fff" /></TouchableOpacity>
                    </View>
                    <View flexDirection={'row'} gap={10}>
                        <TouchableOpacity style={styles.buttonBox} onPress={() => this.emit(0, 0)}><Feather name="arrow-left" size={48} color="#fff" /></TouchableOpacity>
                        <TouchableOpacity style={styles.buttonBox} onPress={() => this.emit(0, 0)}><Feather name="circle" size={48} color="#fff" /></TouchableOpacity>
                        <TouchableOpacity style={styles.buttonBox} onPress={() => this.emit(0, 0)}><Feather name="arrow-right" size={48} color="#fff" /></TouchableOpacity>
                    </View>
                    <View flexDirection={'row'} gap={10}>
                        <TouchableOpacity style={styles.buttonBox} onPress={() => this.emit(0, 0)}><Feather name="arrow-down-left" size={40} color="#fff" /></TouchableOpacity>
                        <TouchableOpacity style={styles.buttonBox} onPress={() => this.emit(0, 0)}><Feather name="arrow-down" size={48} color="#fff" /></TouchableOpacity>
                        <TouchableOpacity style={styles.buttonBox} onPress={() => this.emit(0, 0)}><Feather name="arrow-down-right" size={40} color="#fff" /></TouchableOpacity>
                    </View>
                </View>
                <View style={{ width: '50%', flexDirection: 'column-reverse', paddingLeft: '25%' }}>
                    <View style={{ height: '50%' }} alignItems={'center'}>
                        <View style={{ paddingBottom: 40, width: "100%" }}
                        >
                            <TextInput
                                multiline={false}
                                onChangeText={(ip_address) => this.setState({ ip_address })}
                                placeholder='IP ADDRESS'
                                style={{
                                    fontSize: 30,
                                    borderBottomColor: '#000000',
                                    borderBottomWidth: 1
                                }}
                            />
                        </View>
                        <TouchableOpacity
                            onPress={this.state.ip_address !== '' ? this.handleConnectButton : () => Alert.alert('Please insert IP ADDRESS!')}
                            style={styles.connectButton}
                        >
                            <Text style={styles.buttonText}>{this.state.connected ? 'Disconnect' : 'Connect'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        flexDirection: 'row',
    },
    buttonBox: {
        width: 75,
        height: 75,
        backgroundColor: '#195AA5',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    connectButton: {
        borderRadius: 60,
        width: 170,
        padding: 30,
        backgroundColor: '#195AA5',
    },
    buttonText: {
        color: '#fff',
        fontSize: 20,
        textAlign: 'center',
        fontWeight: 'bold'
    },
});
