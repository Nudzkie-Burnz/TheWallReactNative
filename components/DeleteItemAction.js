import React, { useState } from 'react';
import { TouchableWithoutFeedback, TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

/* FIREBASE EXPORTS */
import { FIREBASE_DB } from '../firebaseconfig';
import { arrayRemove, deleteDoc, doc, updateDoc } from 'firebase/firestore';

import { useRouter } from 'expo-router';

import { MaterialIcons } from '@expo/vector-icons';

/* CUSTOM IMPORTS */
import colors from '../config/colors';

function DeleteItemAction({
    isReply = false,
    messageItem,
    onCallLoadMessages, 
    replyItem,
}) {
    const [showConfirmation, setShowConfirmation] = useState(false);
    const router = useRouter();

    /*
        DOCU: THIS FUNCTION HANDLES THE DELETE MESSAGE FROM FIREBASE DATABASE
        SOURCE: https://firebase.google.com/docs/firestore/manage-data/delete-data
    */
    const handleDelete = async ()=> {
        const message = doc(FIREBASE_DB, "messages", messageItem.id); /* Select specific document via id */

        if(isReply){
            await updateDoc(message, { /* Delete specific reply selecting the specific document first*/
                replies: arrayRemove(replyItem)
            });
        }else{
            await deleteDoc(message); /* Delete specific document via firebase delete execution using id */
        }
        
        (onCallLoadMessages == undefined) 
            ? router.push({pathname: "/messages"})  /* Route to messages if messages was deleted inside reply screen */
            : onCallLoadMessages();                 /* Load messages if message was deleted from message screen */
    }

    const closeConfirmation = ()=> {
        setShowConfirmation(false);
    }

    return (
        <>
            <TouchableWithoutFeedback onPress={()=> setShowConfirmation(true)}>
                <View style={styles.deleteContainer} testID="Delete Button">
                    <MaterialCommunityIcons name="delete" size={30} color={colors.white} />
                </View>
            </TouchableWithoutFeedback>
            <View style={[styles.confirmation, {display: showConfirmation ? "flex" : "none"}]}>
                <TouchableOpacity onPress={()=> handleDelete()}>
                    <View style={styles.button}>
                        <Text testID="Confirm Delete" style={[styles.textStyle, {color: colors.danger, marginRight: 10}]}>Yes</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=> closeConfirmation()}>
                    <View style={styles.button}>
                        <Text testID="Cancel Delete" style={styles.textStyle}>Cancel</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    deleteContainer: {
        alignItems: "center",
        backgroundColor: colors.danger,
        height: "100%",
        justifyContent: "center",
        position: "relative",
        width: 100,
        zIndex: 1,
    },
    confirmation: {
        alignItems: "center",
        backgroundColor: "black",
        flexDirection: "row",
        height: "100%",
        justifyContent: "center",
        width: 200,
        position: "absolute",
        right: 0,
        top: 0,
        zIndex: 5,
    },
    icons: {
    },
    button: {
        alignItems: "center",
        height: "100%",
        top: 0,
        justifyContent: "center",
        borderColor: 1,
        borderColor: colors.white,
        zIndex: 1
    },
    textStyle: {
        borderColor: colors.separator, 
        borderRadius: 20, 
        borderWidth: 1, 
        color: colors.separator, 
        paddingBottom: 10,
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 10,
        textAlign: "center",
        width: 80,
    },
    text: {
        fontFamily: "Inter-Bold",
    }
})

export default DeleteItemAction;