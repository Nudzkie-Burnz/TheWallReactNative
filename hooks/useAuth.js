import { FIREBASE_AUTH } from '../firebaseconfig';
import { signInWithEmailAndPassword, getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

/*
    DOCU: GET USER DETAILS BY AUTHENTICATION
    SOURCE: https://firebase.google.com/docs/auth/web/start
*/
export const getUser = ()=> {
    const auth = getAuth();

    return auth.currentUser;
};

/*
    DOCU: SIGNIN AUTHENTICATION USING FIREBASE AUTH USER
    SOURCE: https://firebase.google.com/docs/auth/web/password-auth
*/
export const LogInAccount = async(email, password) => {
    let response = {status: false, result: null};

    try {
        const userCredential = await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
        const user = userCredential.user;
    
        response.result = user;
        response.status = true;
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
    
        response.status = false;
        response.result = { errorCode, errorMessage }; // Optional: include error details in the response
    }

    return response;
};

 /*
    DOCU: SIGNUP AUTHENTICATION USING FIREBASE AUTH USER
    SOURCE: https://firebase.google.com/docs/auth/web/password-auth
*/
export const registerUser = async(name, email, password) => {
    const auth = getAuth();
    let response = {status: false, result: null, error: null};

    try{
        await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(auth.currentUser, { displayName: name });

        response.status = true;
    } catch (error) {
        /* Call setHandleError and send parameter (error.code) to utils.js */
        response.error = error.code
    };

    return response;
}