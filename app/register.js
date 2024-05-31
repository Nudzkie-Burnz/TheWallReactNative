import React, { useState } from 'react';

import { View, KeyboardAvoidingView, StyleSheet, Text } from 'react-native';
import { FIREBASE_AUTH } from '../firebaseconfig';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

import { Link, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import AppTextInput from '../components/AppTextInput';
import Screen from '../components/Screen';
import Buttons from '../components/Buttons';
import colors from '../config/colors';
import ItemSeparator from '../components/ItemSeparator';

function register(props) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const auth = FIREBASE_AUTH;

    /*
        DOCU: SIGNUP AUTHENTICATION USING FIREBASE AUTH USER
        SOURCE: https://firebase.google.com/docs/auth/web/password-auth
    */
    const signUp = async() => {
        setLoading(true);

        try{
            const response = await createUserWithEmailAndPassword(auth, email, password);

            updateProfile(auth.currentUser, {
                displayName: name
            }).then(()=> {
                /*If register success*/
                router.push({pathname: "/messages"});
                console.log(auth.currentUser)
            });
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <Screen>
            <Link href="/">
                <View style={{
                    alignItems: "center",
                    flexDirection: "row",
                    paddingBottom: 10,
                    width: 50
            }}>
                    <MaterialCommunityIcons name="keyboard-backspace" size={24} color="black" />
                    <Text style={{fontFamily: "InterBold", marginLeft: 10}}>Back</Text>
                </View>
            </Link>
            <KeyboardAvoidingView>
                <Text style={{fontFamily: "InterBold", fontSize: 18, marginBottom: 10, marginTop: 20}}>Register</Text>
                <View style={styles.container}>
                    <AppTextInput 
                        autoCapitalize="words"
                        onChangeText={(text) => setName(text)}
                        placeholder="Firstname"
                        value={name}
                    />
                    <AppTextInput 
                        autoCapitalize="none"
                        onChangeText={(text) => setEmail(text)}
                        placeholder="Email"
                        value={email}
                    />
                    <AppTextInput 
                        autoCapitalize="none"
                        onChangeText={(text) => setPassword(text)}
                        placeholder="Password"
                        secureTextEntry={true} 
                        value={password}
                    />
                    <View style={{width:"100%"}}>
                        <Buttons 
                            backgroundColor={colors.primary}
                            onPress={()=> signUp()} 
                            color={colors.white} 
                            borderRadius={30}
                            marginTop={10}
                            disabled={false}
                        >SignUp</Buttons>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
    }    
})

export default register;