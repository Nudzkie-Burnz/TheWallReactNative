/* FIREBASE IMPORTS */
import { getAuth } from 'firebase/auth';
import { FIREBASE_DB } from '../firebaseconfig';
import { collection, addDoc, getDocs, getDoc, query, deleteDoc, doc, updateDoc, orderBy, arrayUnion } from "firebase/firestore";

/*
    DOCU: FUNCTION GET SPECIFIC MESSAGE 
    SOURCE: https://firebase.google.com/docs/firestore/query-data/get-data
*/
export const getMessage = async(messageId) => {
    let response = {status: false, result: null};

    try {
        const docRef = doc(FIREBASE_DB, "messages", messageId.toString());
        const docSnap = await getDoc(docRef); 

        if(docSnap.exists()){
            response.result = docSnap.data();
            response.status = true;
        }
    } catch (error) {
        response.status = false;
    }

    return response;
};

 /*
    DOCU: FUNCTION GET USER CREDENTIAL 
    SOURCE: https://firebase.google.com/docs/firestore/query-data/get-data
*/
export const getMessages = async()=> {
    let response = {status: false, result: null};

    try {
        const messageContainer = [];
        const querySnapshot = await getDocs(query(collection(FIREBASE_DB, "messages"), orderBy("date"))); //Get all messages from the firebase database or firestore
    
        querySnapshot.forEach((doc) => {
            messageContainer.push({
                ...doc.data(),
                id: doc.id,
            });
        }); 

        response.result = messageContainer;
        response.status = true;

        return response;
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;

        response.status = false;
    }

    return response;
};


/*
    DOCU: FUNCTION TO ADD MESSAGES
    SOURCE: https://firebase.google.com/docs/firestore/manage-data/add-data
*/
export const setMessage = async (message) => {
    let response = {status: false, result: null};

    try {
        const auth = getAuth();

        /* Create new object message that will be sent to Firebase Database */
        const newMessage = {
            image: "",
            date: new Date().toLocaleString(),
            message: message,
            name: auth.currentUser.displayName,  
            replies: [],
            userId: auth.currentUser.uid,
        }

        /* Save message object to firebase database */
        const docRef = await addDoc(collection(FIREBASE_DB, "messages"), newMessage);

        response.status = true;

        console.log("Document written with ID: ", docRef.id);
    } catch (error) {
        response.status = false;
        console.error("Error adding document: ", error);
    }

    return response;
}

/*
    DOCU: FUNCTION TO EDIT MESSAGES
    SOURCE: https://firebase.google.com/docs/firestore/manage-data/add-data#update-data
*/
export const updateMessage = async (messageId, editedMessage, replies) => {
    let response = {status: false, result: null};
    const editReplies = (messageId !== null && replies !== null);
    const editMessage = (messageId !== null && editedMessage !== null);

    try {
        if(editMessage) {
            await updateDoc(doc(FIREBASE_DB, "messages", messageId.toString()), {
                message: editedMessage
            });
        };

        if(editReplies) {
            await updateDoc(doc(FIREBASE_DB, "messages", messageId.toString()), {
                replies: replies
            });
        };

        response.status = true;
    } catch (error) {
        response.status = false;
    }

    return response;
}

/*
    DOCU: FUNCTION TO ADD NEW REPLIES ON MESSAGES
    SOURCE: https://firebase.google.com/docs/firestore/manage-data/add-data#update-data
*/
export const addReply = async (messageId, replyValue, userDetails) => {
    response = {status: false, result: null};
    
    try {
        /* Create dummy object for new reply */
        let newReply = {
            id: new Date().valueOf(), /* Create id for new reply */
            image: require("../assets/user.jpg"),
            message: replyValue,
            name: userDetails.displayName,
            replies: [],
            userId: userDetails.uid,
        };

        await updateDoc(doc(FIREBASE_DB, "messages", messageId.toString()), { replies: arrayUnion(newReply) });

        response.status = true;
    } catch (error) {
        response.status = false;
    };

    return response;
}