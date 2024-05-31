import React, { useState } from 'react';
import { TouchableWithoutFeedback, StyleSheet, View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import colors from '../config/colors';

import { FIREBASE_DB } from '../firebaseconfig';
import { arrayRemove, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'expo-router';

function DeleteItemAction({
    onPress, 
    onCallLoadMessages, 
    messageItem,
    replyItem,
    isReply = false
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

            onCallLoadMessages();
        }else{
            await deleteDoc(message); /* Delete specific document via firebase delete execution using id */
        }
        
        (onCallLoadMessages == undefined) 
            ? router.push({pathname: "/messages"})  /* Route to messages if messages was deleted inside reply screen */
            : onCallLoadMessages();                 /* Load messages if message was deleted from message screen */
    }

    return (
        <>
            <TouchableWithoutFeedback onPress={()=> setShowConfirmation(true)}>
                <View style={styles.deleteContainer}>
                    <MaterialCommunityIcons name="delete" size={30} color={colors.white} />
                </View>
            </TouchableWithoutFeedback>
            <View style={[styles.confirmation, {display: showConfirmation ? "flex" : "none"}]}>
                <Text style={{marginRight: 10}}>Delete this message?</Text>
                <View style={[styles.button, {backgroundColor: colors.danger, marginRight: 10}]}>
                    <TouchableWithoutFeedback onPress={()=> handleDelete()}>
                        <Text style={[styles.text,{color: colors.white}]}>Delete</Text>
                    </TouchableWithoutFeedback>
                </View>
                <View style={styles.button}>
                    <TouchableWithoutFeedback onPress={()=> setShowConfirmation(false)}>
                        <Text style={[styles.text,{color: colors.primary}]}>Cancel</Text>
                    </TouchableWithoutFeedback>
                </View>
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
        backgroundColor: "#fff",
        flexDirection: "row",
        height: "100%",
        justifyContent: "center",
        paddingLeft: 10,
        paddingRight: 10,
        position: "absolute",
        right: 0,
        zIndex: 2
    },
    button: {
        alignItems: "center",
        height: 40,
        justifyContent: "center",
        padding: 10,
        backgroundColor: colors.separator,
        borderRadius: 20,
        width: 100,
    },
    text: {
        fontFamily: "InterBold",
    }
})

export default DeleteItemAction;