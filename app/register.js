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
import { HANDLE_AUTH_ERROR, VALIDATE_EMAIL } from '../config/utils';

function register(props) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [handleError, setHandleError] = useState("");

    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const auth = FIREBASE_AUTH;
    const isPasswordConfirmed = (password.trim(" ") == confirmPassword.trim(" "));
    const isAllowed = (name && email && password && confirmPassword);

    /*
        DOCU: SIGNUP AUTHENTICATION USING FIREBASE AUTH USER
        SOURCE: https://firebase.google.com/docs/auth/web/password-auth
    */
    const signUp = async() => {
        setLoading(true);

        try{
            if (isPasswordConfirmed) {
                const response = await createUserWithEmailAndPassword(auth, email, password);
                
                console.log(response);
                updateProfile(auth.currentUser, {
                    displayName: name
                }).then(()=> {
                    /*If register success*/
                    router.push({pathname: "/messages"});
                    console.log(auth.currentUser)
                });
            }else {
                setHandleError(HANDLE_AUTH_ERROR("auth/confirm-password"));
            }
    
        } catch (error) {
            /* Call setHandleError and send parameter (error.code) to utils.js */
            setHandleError(HANDLE_AUTH_ERROR(error.code));

            console.log(error.code);
        } finally {
            setLoading(false);
        }
    }
    
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
                    <Text style={{fontFamily: "Inter-Bold", marginLeft: 10, color:colors.white}}>Back</Text>
                </View>
            </Link>
            <KeyboardAvoidingView>
                <Text style={{fontFamily: "Inter-Bold", fontSize: 18, marginBottom: 10, paddingTop: 20, color: colors.white, borderTopColor: colors.white, borderTopWidth: 1}}>Register</Text>
                <View style={styles.container}>
                    <AppTextInput 
                        autoCapitalize="words"
                        onChangeText={(text) => {setName(text), setHandleError("")}}
                        placeholder="Firstname"
                        placeholderTextColor={colors.white}
                        value={name}
                    />
                    <AppTextInput 
                        autoCapitalize="none"
                        onChangeText={(text) => {setEmail(text), setHandleError("")}}
                        placeholder="Email"
                        placeholderTextColor={colors.white}
                        value={email}
                    />
                    <Text style={{}}>Password</Text>
                    <AppTextInput 
                        autoCapitalize="none"
                        onChangeText={(text) => {setPassword(text), setHandleError("")}}
                        placeholder="Password"
                        placeholderTextColor={colors.white}
                        secureTextEntry={true} 
                        value={password}
                    />
                    <AppTextInput 
                        autoCapitalize="none"
                        onChangeText={(text) => {setConfirmPassword(text), setHandleError("")}}
                        placeholder="Confirm Password"
                        placeholderTextColor={colors.white}
                        secureTextEntry={true} 
                        value={confirmPassword}
                    />
                    <Text style={[styles.textError, {display: handleError.length ? "flex" : "none"}]}>{handleError}</Text>
                    <View style={{width:"100%"}}>
                        <Buttons 
                            borderRadius={30}
                            color={(isAllowed) ? colors.primary : colors.separator} 
                            marginTop={10}
                            onPress={()=> signUp()} 
                            backgroundColor={(isAllowed) ? colors.white : colors.disabled} 
                            buttonHeight={60}
                            buttonWidth={"100%"}
                            fontFamily="Inter-Bold"
                            disabled={(isAllowed) ? false : true}
                        >SignUp</Buttons>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Screen>
    );
}

const styles = StyleSheet.create({
    textError: {
        color: colors.danger,
        textAlign: "left",
        width: "100%",
        paddingLeft: 15,
        marginTop: 10
    },
    container: {
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
    }    
})

export default register;