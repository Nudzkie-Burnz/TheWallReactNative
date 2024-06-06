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
                    <MaterialCommunityIcons name="keyboard-backspace" size={24} color={colors.white} />
                    <Text style={{fontFamily: "InterBold", marginLeft: 10, color:colors.white}}>Back</Text>
                </View>
            </Link>
            <KeyboardAvoidingView>
                <Text style={{fontFamily: "InterBold", fontSize: 18, marginBottom: 10, paddingTop: 20, color: colors.white, borderTopColor: colors.white, borderTopWidth: 1}}>Register</Text>
                <View style={styles.container}>
                    <AppTextInput 
                        autoCapitalize="words"
                        onChangeText={(text) => setName(text)}
                        placeholder="Firstname"
                        placeholderTextColor={colors.white}
                        value={name}
                    />
                    <AppTextInput 
                        autoCapitalize="none"
                        onChangeText={(text) => setEmail(text)}
                        placeholder="Email"
                        placeholderTextColor={colors.white}
                        value={email}
                    />
                    <AppTextInput 
                        autoCapitalize="none"
                        onChangeText={(text) => setPassword(text)}
                        placeholder="Password"
                        placeholderTextColor={colors.white}
                        secureTextEntry={true} 
                        value={password}
                    />
                    <View style={{width:"100%"}}>
                        <Buttons 
                            borderRadius={30}
                            color={colors.primary} 
                            marginTop={10}
                            onPress={()=> signUp()} 
                            backgroundColor={(name && email && password) ? colors.white : colors.disabled} 
                            buttonHeight={60}
                            buttonWidth={"100%"}
                            fontFamily="InterBold"
                            disabled={(name && email && password) ? false : true}
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