import React, { useState } from 'react';

import { Link, useRouter } from 'expo-router';
import { View, Text, StyleSheet, KeyboardAvoidingView } from 'react-native';

import { FIREBASE_AUTH } from '../firebaseconfig';
import { signInWithEmailAndPassword } from "firebase/auth";

import Buttons from '../components/Buttons';
import colors from '../config/colors';
import Screen from '../components/Screen';
import AppTextInput from '../components/AppTextInput';

function LogInScreen(props) {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [signInError, setsignInError] = useState("");

    const auth = FIREBASE_AUTH;
    
    /*
        DOCU: SIGNIN AUTHENTICATION USING FIREBASE AUTH USER
        SOURCE: https://firebase.google.com/docs/auth/web/password-auth
    */
    const signIn = async() => {
        try{
            const response = await signInWithEmailAndPassword(auth, email, password);

            router.push({pathname: "/messages"});
            console.log(response);
        } catch(error) {
            console.log(error)
            setsignInError("Please check your email and password!")
        }
    };


    return (
        <Screen> 
            <View style={styles.container} testID="Login Dashboard">
                <Text style={styles.text}>The Wall</Text>
                <KeyboardAvoidingView>
                    <View>
                        <AppTextInput 
                            autoCapitalize="none"
                            onChangeText={(text) => {setEmail(text), setsignInError("")}}
                            placeholder="Email"
                            placeholderTextColor={colors.white}
                            value={email}
                        />
                        <AppTextInput 
                            autoCapitalize="none"
                            onChangeText={(text) => {setPassword(text), setsignInError("")}}
                            placeholder="Password"
                            placeholderTextColor={colors.white}
                            secureTextEntry={true} 
                            value={password}
                        />
                        {
                           signInError && <Text style={[styles.errorText, {display: signInError.length ? "flex" : "none"}]}>{signInError}</Text>
                        }
                        <Buttons 
                            backgroundColor={(password && email) ? colors.white : colors.disabled} 
                            borderRadius={30} 
                            buttonHeight={60}
                            buttonWidth={"100%"}
                            fontFamily="Inter-Bold"
                            color={(password && email) ? colors.primary : colors.separator}
                            marginTop={10}
                            onPress={()=> signIn()}
                            disabled={(password && email) ? false : true}
                            testID="Login Button"
                        >Login</Buttons>

                        <View style={{
                            alignItems: "center",
                            flexDirection: "row", 
                            justifyContent: "center",
                            width: "100%",
                            marginTop: 20
                        }}>
                            <Text style={styles.linkText}>
                                Not yet a member? <Link style={styles.link} href={"/register"}>Register</Link>
                            </Text>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    errorText: {
        color: colors.danger, 
        marginTop: 10 , 
        paddingLeft: 15 
    },
    linkText: {
        color: colors.white,
        fontFamily: "Inter-Regular",
        fontSize: 16,
    },
    container: {
        flex: 1,
        flexDirection: "column",
        height: "100%",
        justifyContent: "center"
    },
    text: {
        color: colors.white,
        fontFamily: "Inter-Black",
        fontSize: 32,
        textAlign: "center",
    },
    link: {
        color: colors.link,
        marginLeft: 5,
        fontSize: 16,
        fontFamily: "Inter-Bold",
        width: "auto",
    }
})

export default LogInScreen;