import RNPickerSelect from 'react-native-picker-select';
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';


const Waypoint = ({ navigation }) => {
  return (
    <View style={styles.container}>
        <View flex={'1'} justifyContent={'center'} alignItems={'center'}>
            <View style={styles.dropdownContainer}>
                <RNPickerSelect
                onValueChange={(value) => console.log(value)}
                items={[
                    { label: 'LE-1', value: 'le-1' },
                    { label: 'LE-2', value: 'le-2' },
                    { label: 'LE-3', value: 'le-3' },
                    { label: 'LE-4', value: 'le-4' },
                    { label: 'Espaço-Maker', value: 'espacomaker' },
                    { label: 'Auditorio', value: 'auditorio' },
                ]}
                placeholder={{ label: "Selecione uma opção", value: null }}

                style={{
                    ...pickerSelectStyles,
                    iconContainer: {
                      top: 10,
                      right: 12,
                    },
                  }}
                  useNativeAndroidPickerStyle={false} // Desativa o estilo nativo do Android para personalização
                  Icon={() => {
                    return <Feather name="chevron-down" size={24} color="gray" />;
                  }}
                />
            </View>
        </View>


    <View flex={'1'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
        <TouchableOpacity style={styles.button} onPress={() => {}}>
            <Text style={styles.buttonText}>Ir</Text>
        </TouchableOpacity>
        
  
        <TouchableOpacity style={styles.button} onPress={() => {}}>
            <Text style={styles.buttonText}>Salvar</Text>
        </TouchableOpacity>
    </View>

    </View>
  );
};




const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
      fontSize: 16,
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 4,
      color: 'black',
      paddingRight: 30, // para garantir que o texto não fique por baixo do ícone
      width: 200, // Define uma largura fixa para o dropdown
    },
    inputAndroid: {
      fontSize: 16,
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderWidth: 0.5,
      borderColor: 'gray',
      borderRadius: 8,
      color: 'black',
      paddingRight: 30, // para garantir que o texto não fique por baixo do ícone
      width: 200, // Define uma largura fixa para o dropdown
    },
  });

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dropdownContainer: {
      flex: 1, // Permite que o dropdown cresça
      justifyContent: 'center',
      alignItems: 'center',
    },

    buttonsContainer: {
      flexDirection: 'column', // Botões em coluna
    },
    button: {
      width: 150,
      padding: 30,
      marginBottom: 10,
      backgroundColor: '#195AA5', // Cor de fundo do botão
      borderColor: '#195AA5', // Cor da borda do botão
      borderWidth: 2, // Largura da borda
      borderRadius: 60, // Arredondamento da borda
      alignItems: 'center', // Centraliza o texto/icones no botão horizontalmente
    },
    buttonText: {
        color: '#fff',
        fontSize: 20,
        textAlign: 'center',
        fontWeight: 'bold'
    },
  });
  

export default Waypoint;
