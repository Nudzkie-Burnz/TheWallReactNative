import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

import { Link, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

/* FIREBASE IMPORTS */
import { getAuth, signOut, } from "firebase/auth";

/* CUSTOM IMPORTS */
import Buttons from './Buttons';
import colors from '../config/colors';
import ItemSeparator from './ItemSeparator';

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
        <View style={{flexDirection: "column", alignItems: "flex-start"}}>
            {
                (route) && 
                <Link href={route} style={{flexDirection: "row", height: 40}}>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
                        <MaterialCommunityIcons name="keyboard-backspace" size={24} color="black" />
                        <Text style={{marginLeft: 5}}>Back</Text>
                    </View>
                </Link>
            }
            <View style={styles.container}>
                {
                    (profile) && <Text style={{fontFamily: "InterBold", fontSize: 18}}>Hello, {user_name ? user_name : "User"}</Text>
                }
                {
                    (!route) &&
                        <Pressable onPress={()=> onLogout()}>
                            <View style={{flexDirection: "row", alignItems: "center"}}>
                                <Text style={{fontFamily: "InterBold", marginRight: 5}}>Logout</Text>
                                <MaterialCommunityIcons name="logout" size={24} color="black" />
                            </View>
                        </Pressable> 
                }
            </View>
            <ItemSeparator/>
            {
                (title) && <Text style={{fontSize: 16, fontWeight: "bold", marginBottom: 10, marginTop: 20}}>{title}</Text>
            }
        </View>
    ); 
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
    }
})

export default Header;