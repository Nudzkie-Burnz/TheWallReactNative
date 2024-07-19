import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, FlatList, Text, Keyboard } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

/* FIREBASE IMPORTS} */
import { FIREBASE_ADDOC, FIREBASE_COLLECTION, FIREBASE_DB } from '../firebaseconfig';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';

/* CUSTOM COMPONENT IMPORTS} */
import AppInputSubmit from '../components/AppInputSubmit';
import DeleteItemAction from '../components/DeleteItemAction';
import EditItemAction from '../components/EditItemAction';
import EmptyListNotification from '../components/EmptyListNotification';
import Header from '../components/Header';
import ItemSeparator from '../components/ItemSeparator';
import ListComponent from '../components/ListComponent';
import Loading from '../components/Loading';
import Screen from '../components/Screen';
import colors from '../config/colors';

/* Hooks */ 
import { updateMessage, getMessage, addReply } from '../hooks/useMessages';
import { getUser } from '../hooks/useAuth';

function RepliesScreen(props) {
    const selectedMessage = useLocalSearchParams(); /* Capture data pass from route */
    const { id } = useLocalSearchParams(); /* Capture data pass from route */

    const getMessages = doc(FIREBASE_DB, "messages", id);

    const inputRef = useRef();
    const userDetails = getUser();

    const [replies, setReplies] = useState([]);
    const [replyValue, setReplyValue] = useState();
    const [loadReplies, setLoadReplies] = useState(false);
    const [replyIndex, setReplyIndex] = useState("");
    const [editReply, setEditReply] = useState(false);
    const [refreshReplies, setRefreshReplies] = useState(false);

    const [inputPlaceHolder, setInputPlaceHolder] = useState("Enter Reply");
    const [isMessageEdit, setIsMessageEdit] = useState(false);
    const [closeSwipeable, setCloseSwipeable] = useState(null);

    // const repliesCount = replies.length;
////////=======================================
    const [specificMessages, setSpecificMessages] = useState([]);

    /* 
        DOC: FUNCTION TO FETCH MESSAGE DETAILS BY ID
    */
    const getMessageById = async()=> {
        const { result, status } = await getMessage(id);

        setSpecificMessages(result);
        setLoadReplies(!status); 
    };

    /* 
        DOC: FUNCTION FOR HANDLING DELETE REPLIES ARRAY
        SOURCE: https://firebase.google.com/docs/firestore/manage-data/add-data#update_elements_in_an_array
    */
    const addReplies = async() => {
        if (replyValue.length) {
            if(editReply){
                repliesArray = specificMessages.replies; /* Contain database to an array  */
                repliesArray[replyIndex].message = replyValue; /* Select data from array via index and set new data for message  */
                
                const { status } = await updateMessage(id, null, repliesArray); /* Update array replies on firebase database */

                if(status) {
                    setEditReply(false);
                    getReplies();
                };
            } else if (!editReply && isMessageEdit) { 
                const { status } = await updateMessage(id, replyValue, null); /* To edit main message  */

                if(status) {
                    specificMessages.message = replyValue;
                    closeSwipeable.close(); /* Close message swipeable options*/
                    setIsMessageEdit(false);
                    setInputPlaceHolder("Enter Reply");
                };
            } else {
                const { status } = await addReply(id, replyValue, userDetails);

                if(status) {
                    getReplies();
                }
            };

            Keyboard.dismiss();
            setReplyValue("");
        } else {
            console.log("Error field");
        }
    };

    /*
        DOC: FUNCTION TO EDIT USER REPLIES
    */
    const editReplies = (item, index)=> {
        setInputPlaceHolder("Enter Reply");
        setReplyIndex(index); 
        setEditReply(true);
        setReplyValue(item.message);
        handleFocus();
    };

    const editMessageItem = (editMessage)=> {
        setInputPlaceHolder("Enter Message");
        setIsMessageEdit(true);
        setReplyValue(editMessage.message);
        handleFocus();
    };

    /*
        DOC: FUNCTION FOR LOAD REPLIES FROM FIRESTRORE DATABASE
    */
    const getReplies = async ()=> {
        await setReplies(specificMessages.replies);
    };

    /*
        DOC: FUNCTION USED TO AUTO FOCUS INPUT TEXT
    */
    const handleFocus = ()=> {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    useEffect(()=>{
        setLoadReplies(true);
        getMessageById();
        getReplies(); 
    }, []);
    
    return (
        <Screen>
            <View style={{flex: 1}}>
                <Header profile={false} route="/messages" />
                <GestureHandlerRootView style={{marginTop: 10}}>
                    {
                        (specificMessages.message) &&
                            <ListComponent
                                id={specificMessages.id}
                                image={specificMessages.image}
                                message={specificMessages.message}
                                name={specificMessages.name}
                                onPress={()=> Keyboard.dismiss()}
                                style={styles.message}
                                seeMore={true}
                                isEdit={isMessageEdit}
                                setCloseSwipeable={setCloseSwipeable}
                                renderRightActions={()=> 
                                    (specificMessages.userId === userDetails.uid) &&
                                    <View style={{flexDirection: "row"}}>
                                        <EditItemAction onPress={() => editMessageItem(specificMessages)}/>
                                        <DeleteItemAction messageItem={selectedMessage}/>
                                    </View>
                                }
                            />
                    }

                    {
                        (loadReplies)
                        ? 
                            <Loading text="Loading Replies"/>
                        :
                            (specificMessages.message) 
                                ? 
                                    <View>
                                        <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                                            <Text style={styles.replyText}>({specificMessages.replies.length ? specificMessages.replies.length : ""}) {specificMessages.replies.length > 1 ? "Replies" : "Reply"}</Text>
                                            <View style={{width: "78%", backgroundColor: colors.white, borderBottomColor: colors.white, borderBottomWidth: 1}}/>
                                        </View>
                                        <FlatList 
                                            data={specificMessages.replies} 
                                            keyExtractor={reply => reply.id.toString()}
                                            renderItem={({item, index}) => 
                                                <ListComponent
                                                    id={item.id}
                                                    image={item.image}
                                                    message={item.message} 
                                                    name={item.name}
                                                    onPress={()=> Keyboard.dismiss()} 
                                                    seeMore={true}
                                                    renderRightActions={()=> 
                                                        (item.userId === userDetails.uid) &&
                                                        <View style={{flexDirection: "row",  alignItems: "center", backgroundColor: colors.primary}}>
                                                            <EditItemAction onPress={() => editReplies(item, index)}/>
                                                            <DeleteItemAction onCallLoadMessages={getReplies} isReply={true} replyItem={item} messageItem={selectedMessage}/>
                                                        </View>
                                                    }
                                                    ItemSeparatorComponent={()=> 
                                                        <ItemSeparator/>
                                                    }
                                                    itemIndex={index}
                                                />
                                            } 
                                            refreshing={refreshReplies}
                                            onRefresh={()=> {
                                                getReplies();
                                            }}
                                        />
                                    </View>
                                :   <EmptyListNotification style={{alignItems: "flex-start", paddingTop: 0, alignItems: "center", marginTop: 10}} title="No Replies" message="New replies will appear here."/>
                    }
                </GestureHandlerRootView>
            </View>

            <AppInputSubmit
                autoCapitalize={true}
                autoFocus={true}
                buttonHeight={24}
                buttonWidth={24}
                iconName="send"
                onChangeText={(reply)=> setReplyValue(reply)} 
                onPress={()=> addReplies()} 
                placeholder={inputPlaceHolder}
                ref={inputRef} 
                value={replyValue}
                placeholderTextColor={colors.white}
                disabled={replyValue ? false : true}
                onBlur={()=> {setReplyValue(""), setEditReply(false)}}
            />
        </Screen>
    );
}

const styles = StyleSheet.create({
    message: {
        paddingBottom: 10
    },
    replyText: {
        color: colors.white, 
        fontFamily: "Inter-Bold",
        fontSize: 14, 
        marginBottom: 10, 
        marginTop: 10, 
    },
})

export default RepliesScreen;