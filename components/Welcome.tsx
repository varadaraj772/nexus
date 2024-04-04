import {
    FAB, Text,
} from 'react-native-paper';
import React from 'react'
import { SafeAreaView, StyleSheet, View } from 'react-native';


export default function Welcome({ navigation }) {
    return (
        <SafeAreaView>
            <View>
                <View>
                    <Text variant="displayLarge">WELCOME TO NEXUS</Text>
                </View>
                <View>
                    <FAB
                        label='SIGN IN'
                        onPress={() => navigation.navigate('LOGIN')} />
                    <FAB
                        label='SIGN UP'
                        onPress={() => navigation.navigate('CREATE ACCOUNT')} 
                        style={styles.button}/>
                </View>
            </View>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    input: {
        marginTop: 10,
        width: '50%',
    },
    button: {
        marginTop: 20,
    },
});