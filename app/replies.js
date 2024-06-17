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
import { getAuth } from 'firebase/auth';

function RepliesScreen(props) {
    const selectedMessage = useLocalSearchParams(); /* Capture data pass from route */
    const updateMessage = doc(FIREBASE_DB, "messages", selectedMessage.id);
    const inputRef = useRef();
    const id = new Date().valueOf(); /* Create id for new reply */

    const auth = getAuth();
    const userName = auth.currentUser.displayName;
    const userId = auth.currentUser.uid;

    const [replies, setReplies] = useState([]);
    const [message, setMessage] = useState(selectedMessage);
    const [replyValue, setReplyValue] = useState();
    const [loadReplies, setLoadReplies] = useState(false);
    const [replyIndex, setReplyIndex] = useState("");
    const [editReply, setEditReply] = useState(false);
    const [refreshReplies, setRefreshReplies] = useState(false);

    const [inputPlaceHolder, setInputPlaceHolder] = useState("Enter Reply");
    const [isMessageEdit, setIsMessageEdit] = useState(false);
    const [closeSwipeable, setCloseSwipeable] = useState(null);

    const repliesCount = replies.length;

    /* 
        DOC: FUNCTION FOR HANDLING DELETE REPLIES ARRAY
        SOURCE: https://firebase.google.com/docs/firestore/manage-data/add-data#update_elements_in_an_array
    */
    const addReplies = async() => {
        if (replyValue.length) {
            if(editReply){
                const getAllReplies = await getDoc(updateMessage); /* Get all replies from firebase database */

                repliesArray = getAllReplies.data().replies; /* Contain database to an array  */
                repliesArray[replyIndex].message = replyValue; /* Select data from array via index and set new data for message  */

                /* Update array replies on firebase database */
                await updateDoc(updateMessage, {
                    replies: repliesArray
                });

                setEditReply(false);
                getReplies();
            } else if (!editReply && isMessageEdit) { 
                /* To edit main message  */
                await updateDoc(updateMessage, {
                    message: replyValue
                });

                const getMessages = await getDoc(updateMessage); /* Get selected message from firebase database */

                message.message = replyValue; 

                setMessage(getMessages.data());
                closeSwipeable.close(); /* Close message swipeable options*/

                setIsMessageEdit(false);
                setInputPlaceHolder("Enter Reply");
            } else {
                /* To add new reply */
                let newReply = {
                    id: id,
                    image: require("../assets/user.jpg"),
                    message: replyValue,
                    name: userName,
                    replies: [],
                    userId: userId,
                };

                await updateDoc(updateMessage, { replies: arrayUnion( newReply ) });
                getReplies();
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
    const editReplies = async (item, index)=> {
        setInputPlaceHolder("Enter Reply");
        setReplyIndex(index);
        setEditReply(true);
        setReplyValue(item.message);
        handleFocus();
    };

    /*
        DOC: FUNCTION FOR LOAD REPLIES FROM FIRESTRORE DATABASE
    */
    const getReplies = async ()=> {
        setLoadReplies(true);

        const docSnap = await getDoc(updateMessage);

        if (docSnap.exists()) {
            // console.log("Document data:", docSnap.data());
            setLoadReplies(false);
            setReplies(docSnap.data().replies);
        } else {
            // docSnap.data() will be undefined in this case
            console.log("No such document!");
        };
    };

    const editMessageItem = ()=> {
        setInputPlaceHolder("Enter Message");
        setReplyValue(message.message);
        setIsMessageEdit(true);
        handleFocus();
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
        getReplies(); 
        setLoadReplies(true);
    }, []);
    
    return (
        <Screen>
            <View style={{flex: 1}}>
                <Header profile={false} route="/messages" />
                <GestureHandlerRootView style={{marginTop: 10}}>
                    <ListComponent
                        id={message.id}
                        image={message.image}
                        message={message.message}
                        name={message.name}
                        onPress={()=> Keyboard.dismiss()}
                        style={styles.message}
                        seeMore={true}
                        isEdit={isMessageEdit}
                        setCloseSwipeable={setCloseSwipeable}
                        renderRightActions={()=> 
                            (message.userId === userId) &&
                            <View style={{flexDirection: "row"}}>
                                <EditItemAction onPress={() => editMessageItem()}/>
                                <DeleteItemAction messageItem={selectedMessage}/>
                            </View>
                        }
                    />
                    {
                        (loadReplies)
                            ? 
                                <Loading text="Loading Replies"/>
                            :
                                (replies.length) 
                                    ? 
                                        <View>
                                            <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                                                <Text style={styles.replyText}>({repliesCount ? repliesCount : ""}) {repliesCount > 1 ? "Replies" : "Reply"}</Text>
                                                <View style={{width: "78%", backgroundColor: colors.white, borderBottomColor: colors.white, borderBottomWidth: 1}}/>
                                            </View>
                                            <FlatList 
                                                data={replies} 
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
                                                            (item.userId === userId) &&
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