import React from 'react';
import { View, Text, StyleSheet, Pressable, Button, TouchableWithoutFeedback } from 'react-native';

import { Link, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

/* FIREBASE IMPORTS */
import { getAuth, signOut, } from "firebase/auth";

/* CUSTOM IMPORTS */
import Buttons from './Buttons';
import colors from '../config/colors';
import ItemSeparator from './ItemSeparator';
import AppDropDown from './AppDropDown';

function Header({title, route, profile}) {
    const router = useRouter();
    const auth = getAuth();
    const user_name = auth.currentUser.displayName;

    /* 
        DOCU: FUNCTION LOGOUT ACCOUNT USING FIREBASE LOGOUT
        SOURCE: https://firebase.google.com/docs/auth/web/password-auth
    */
    const onLogout = async ()=> {
        signOut(auth).then(() => {
            router.replace("/");
            console.log("signout success")// Sign-out successful.
        }).catch((error) => {
            console.log("error") // An error happened.
        });
    } 

    return (
        <View style={styles.headerWrapper}>
            <View style={styles.container}>
                {
                    !profile &&  
                    <TouchableWithoutFeedback onPress={ ()=> router.back() } style={{flexDirection: "row"}}>
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
                            <MaterialCommunityIcons name="keyboard-backspace" size={24} color="white" />
                            <Text style={{marginLeft: 5, color: colors.white}}>Back to Messages</Text>
                        </View>
                    </TouchableWithoutFeedback>
                }

                { (profile) && <Text style={{fontFamily: "Inter-Bold", fontSize: 18, color: colors.white}}>Hello, {user_name ? user_name : "User"}</Text> }
                { (title) && <Text style={{color: colors.white, fontSize: 16, fontWeight: "bold", marginBottom: 10, marginTop: 10}}>{title}</Text> }
            </View>
            <AppDropDown getFunction={onLogout}/>
        </View>
    ); 
}

const styles = StyleSheet.create({
    headerWrapper: {
        alignItems: "center", 
        borderBottomColor: colors.white,
        borderBottomWidth: 1,
        flexDirection: "row", 
        justifyContent: "space-between",
        paddingBottom: 10,
        width: "100%",
    },
    container: {
        alignItems: "flex-start",
        flexDirection: "column",
        justifyContent: "flex-start",
    }
})

export default Header;