import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Keyboard, KeyboardAvoidingView, View} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

/*EXPO IMPORTS*/
import { useRouter } from 'expo-router';

/* FIREBASE IMPORTS */
import { getAuth } from 'firebase/auth';
import { FIREBASE_AUTH, FIREBASE_DB} from '../firebaseconfig';
import { collection, addDoc, getDocs, query, deleteDoc, doc, updateDoc, orderBy } from "firebase/firestore"; 

/* CUSTOM COMPONENTS IMPORTS */
import DeleteItemAction from '../components/DeleteItemAction';
import EditItemAction from '../components/EditItemAction';
import EmptyListNotification from '../components/EmptyListNotification';
import Header from '../components/Header';
import ItemSeparator from '../components/ItemSeparator';
import ListComponent from '../components/ListComponent';
import Loading from '../components/Loading';
import Screen from '../components/Screen';
import AppInputSubmit from '../components/AppInputSubmit';
import colors from '../config/colors';

function MessagesScreen(props) {
    const router = useRouter();
    const [createMessage, setCreateMessage] = useState("");
    const [messageList, setMessageList] = useState([]);
    const [editMessage, setEditMessage] = useState(false);
    const [messageId, setMessageId] = useState(false);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false)

    const auth = getAuth();
    const user_name = auth.currentUser.displayName;
    const userId = auth.currentUser.uid;

    const inputRef = useRef(null);
    const messageRef = useRef(null);

    /*
        DOCU: FUNCTION ON LOADING MESSAGES FROM FIREBASE DATABASE
        SOURCE: https://firebase.google.com/docs/firestore/query-data/get-data
    */
    const loadMessages = async ()=> {
        setLoading(true);

        const messageContainer = [];
        const querySnapshot = await getDocs(query(collection(FIREBASE_DB, "messages"), orderBy("date")));

        querySnapshot.forEach((doc) => {
            messageContainer.push({
                ...doc.data(),
                id: doc.id,
            });
        });

        setMessageList(messageContainer);

        setTimeout(() => {
            setLoading(false); 
        }, 400);
    };

    /*
        DOCU: FUNCTION TO ADD AND EDIT MESSAGES
        SOURCE: https://firebase.google.com/docs/firestore/manage-data/add-data
    */
    const addMessage = async ()=> {
        if(createMessage.length){
            if(editMessage){
                const updateMessage = doc(FIREBASE_DB, "messages", messageId.toString());

                await updateDoc(updateMessage, {
                    message: createMessage
                });

                setEditMessage(false);
            }else{
                try {
                    /* Create new object message that will be sent to Firebase Database */
                    const newMessage = {
                        image: "",
                        date: new Date().toLocaleString(),
                        message: createMessage,
                        name: user_name,  
                        replies: [],
                        userId: userId,
                    }

                    /* Save message object to firebase database */
                    const docRef = await addDoc(collection(FIREBASE_DB, "messages"), newMessage);
          
                    console.log("Document written with ID: ", docRef.id);
                } catch (e) {
                    console.error("Error adding document: ", e);
                }
            }

            setCreateMessage("");
            loadMessages();
            Keyboard.dismiss();
        }else{
            console.log("Error"); 
        }
    }

    /*
        DOCU: FUNCTION TO SET STATE FOR EDITING MESSAGES
    */
    const editMessageItem = async (message)=> {
        setMessageId(message.id);
        setCreateMessage(message.message);
        setEditMessage(true);
        handleFocus();
    }

    const handleFocus = ()=> {
        if(inputRef.current){ 
            inputRef.current.focus();
        }
    };

    useEffect(()=> {
        loadMessages(); 
        setLoading(true); 
    }, []); 

    return (
        <Screen>
            <View style={{flex: 1, flexDirection: "column", justifyContent: "space-between"}}>
                <Header profile={true} title="Messages"/>
                <GestureHandlerRootView testID="Message Container">
                    {
                        (loading) 
                            ?
                                <Loading text="Loading Messages"/>
                            :
                                (messageList.length)
                                    ?
                                        <FlatList 
                                            data={messageList}
                                            keyExtractor={item => item.id} 
                                            ref={messageRef}
                                            renderItem={({item, index}) => 
                                                <ListComponent
                                                    userId={item.userId}
                                                    id={item.id}
                                                    image={item.image}
                                                    itemIndex={index}
                                                    message={item.message}
                                                    name={item.name}
                                                    repliesCount={item.replies.length}
                                                    seeMore={true}
                                                    onPress={()=> router.push({pathname: "/replies", params: item})}
                                                    renderRightActions={()=> 
                                                        (item.userId === userId) &&
                                                        <View style={{flexDirection: "row", alignItems: "center"}}>
                                                            <EditItemAction onPress={() => editMessageItem(item)}/>
                                                            <DeleteItemAction onCallLoadMessages={loadMessages} isLoading={setLoading} messageItem={item}/>
                                                        </View>
                                                    }
                                                />
                                            }
                                            ItemSeparatorComponent={()=>  
                                                <ItemSeparator/>
                                            }
                                            refreshing={refreshing}
                                            onRefresh={()=>{
                                                loadMessages();
                                            }}
                                        />
                                    : <EmptyListNotification title="No messages" message="New messages will appear here."/>
                    }
                </GestureHandlerRootView>
            </View>
            <AppInputSubmit
                autoCapitalize={true}
                autoFocus={true}
                buttonHeight={24}
                buttonWidth={24}
                iconName="send"
                onChangeText={(message)=> setCreateMessage(message)}
                onPress={()=> addMessage()}
                placeholder="Enter Message"
                ref={inputRef}
                value={createMessage}
                placeholderTextColor={colors.white}
                disabled={(createMessage.length) ? false : true}
                onBlur={()=> {setCreateMessage(""), setEditMessage(false)}}
            />
        </Screen>
    );
}

export default MessagesScreen;