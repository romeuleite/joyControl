import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Waypoint from './Pages/segundatela';

const TOPIC = '/robot/cmd_vel';
const WAY_POINT_TOPIC = '/set_waypoint';
const ODOM = '/odom'; 

const MAX_LINEAR_VEL = 0.1;
const MAX_ANGULAR_VEL = 0.5;

const Stack = createStackNavigator();

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={App} />
        <Stack.Screen name="Waypoint" component={Waypoint} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;


class App extends React.Component {

    constructor() {
        super();

        this.state = {
            connected: false,
            activated: false,
            ip_address: "",
            linear_vel: 0.1,
            angular_vel: 0.1,
        };

        this.odom = "nao salvou nada";
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

    sub_odom = () => {
        if (this.state.connected) {
            this.socket.send(JSON.stringify({
                op: 'subscribe',
                topic: ODOM,
            }));
        }
    };
    

    pub_waypoint = (waypoint) => {
        if (this.state.connected) {
            this.socket.send(JSON.stringify({
                op: 'publish',
                topic: WAY_POINT_TOPIC,
                msg: {
                    data: waypoint
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

    handleSaveWaypointButton = () => {
        // Se inscreve no tópico '/odom'
        this.sub_odom();
        console.log("OIII");
        // Define o manipulador de mensagens para pegar a posição do robô
        this.socket.onmessage = (event) => {
            let msg = JSON.parse(event.data);
            if (msg.topic ===  ODOM) {
                // Salva a posição do robôd
                let robotPosition = msg.msg;
                this.setState({odom:robotPosition});
                console.log("Posição do robô: x = " + robotPosition.pose.pose.position.x + ", y = " + robotPosition.pose.pose.position.y + ", z = " + robotPosition.pose.pose.position.z);


                // Faz algo com a posição do robô (por exemplo, salva em um estado ou banco de dados)
                
                // Cancela a inscrição do tópico '/odom' após receber a posição do robô
                this.socket.send(JSON.stringify({
                    op: 'unsubscribe',
                    topic: ODOM
                }));
            }
        };
    };
    


    render() {
        return (
            <View style={styles.container}>
                <View style={{ width: '35%' }} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} gap={10} paddingLeft={'10%'}>
                    <View flexDirection={'row'} gap={10}>
                        <TouchableOpacity style={styles.buttonBox} onPress={() => this.emit(this.state.linear_vel, this.state.angular_vel)}><Feather name="arrow-up-left" size={40} color="#fff" /></TouchableOpacity>
                        <TouchableOpacity style={styles.buttonBox} onPress={() => this.emit(this.state.linear_vel, 0)}><Feather name="arrow-up" size={48} color="#fff" /></TouchableOpacity>
                        <TouchableOpacity style={styles.buttonBox} onPress={() => this.emit(this.state.linear_vel, -this.state.angular_vel)}><Feather name="arrow-up-right" size={40} color="#fff" /></TouchableOpacity>
                    </View>
                    <View flexDirection={'row'} gap={10}>
                        <TouchableOpacity style={styles.buttonBox} onPress={() => this.emit(0, this.state.angular_vel)}><Feather name="arrow-left" size={48} color="#fff" /></TouchableOpacity>
                        <TouchableOpacity style={styles.buttonBox} onPress={() => this.emit(0, 0)}><Feather name="circle" size={48} color="#fff" /></TouchableOpacity>
                        <TouchableOpacity style={styles.buttonBox} onPress={() => this.emit(0, -this.state.angular_vel)}><Feather name="arrow-right" size={48} color="#fff" /></TouchableOpacity>
                    </View>
                    <View flexDirection={'row'} gap={10}>
                        <TouchableOpacity style={styles.buttonBox} onPress={() => this.emit(-this.state.linear_vel, -this.state.angular_vel)}><Feather name="arrow-down-left" size={40} color="#fff" /></TouchableOpacity>
                        <TouchableOpacity style={styles.buttonBox} onPress={() => this.emit(-this.state.linear_vel, 0)}><Feather name="arrow-down" size={48} color="#fff" /></TouchableOpacity>
                        <TouchableOpacity style={styles.buttonBox} onPress={() => this.emit(-this.state.linear_vel, this.state.angular_vel)}><Feather name="arrow-down-right" size={40} color="#fff" /></TouchableOpacity>
                    </View>
                </View>
                <View style={{ width: '30%', flexDirection: 'column-reverse', paddingLeft: '5%' }}>
                    <View style={{ height: '70%' }} alignItems={'center'}>
                        <View style={{ paddingBottom: 20, width: "80%" }}
                        >
                            <TextInput
                                multiline={false}
                                onChangeText={(ip_address) => this.setState({ ip_address })}
                                placeholder='IP ADDRESS'
                                defaultValue='172.20.10.2'
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

                        <TouchableOpacity style={styles.waypointButton} onPress={() => this.props.navigation.navigate('Waypoint')}>
                            <Text style={styles.buttonText}>Waypoint</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.waypointButton} onPress={() => this.handleSaveWaypointButton()}>
                                <Text style={styles.buttonText}>{this.odom}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ width: '30%'}}>
                    <Text style={styles.velText}>Linear Vel:  {(this.state.linear_vel).toFixed(1)}</Text>
                    <View flexDirection={'row'} gap={5} justifyContent={'center'}>
                        <TouchableOpacity style={styles.buttonBox} onPress={() => this.setState({ linear_vel: (this.state.linear_vel + 0.1) })}><Feather name="arrow-up" size={48} color="#fff" /></TouchableOpacity>
                        <TouchableOpacity style={styles.buttonBox} onPress={() => this.setState({ linear_vel: (this.state.linear_vel - 0.1) })}><Feather name="arrow-down" size={48} color="#fff" /></TouchableOpacity>
                    </View>

                    <Text style={styles.velText}>Angular Vel:  {(this.state.angular_vel).toFixed(1)}</Text>
                    <View flexDirection={'row'} gap={5} justifyContent={'center'}>
                        <TouchableOpacity style={styles.buttonBox} onPress={() => this.setState({ angular_vel: (this.state.angular_vel + 0.1) })}><Feather name="arrow-up" size={48} color="#fff" /></TouchableOpacity>
                        <TouchableOpacity style={styles.buttonBox} onPress={() => this.setState({ angular_vel: (this.state.angular_vel - 0.1) })}><Feather name="arrow-down" size={48} color="#fff" /></TouchableOpacity>
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
        width: 150,
        padding: 30,
        backgroundColor: '#195AA5',
        marginBottom: 10
    },
    waypointButton: {
        borderRadius: 60,
        width: 150,
        padding: 30,
        backgroundColor: '#195AA5',
    },
    buttonText: {
        color: '#fff',
        fontSize: 20,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    velText: {
        fontSize: 20,
        textAlign: 'center',
        fontWeight: 'bold'
    },
});