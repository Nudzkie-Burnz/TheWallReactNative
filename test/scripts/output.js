output.newMessage = "";

/* FOR CREDENTIAL PURPOSES */
output.credentials = {
    "email": "sbnudo@village88.com",
    "password" : "stan092492"
};

/* SET GLOBAL ELEMENT ID */
output.OPEN_LINK                = "exp://192.168.86.48:8081"
output.CANCEL_BUTTON            = "Cancel Delete";
output.DELETE_BUTTON            = "Delete Delete";
output.EDIT_BUTTON              = "Edit Button";
output.CONFIRM_DELETE_BUTTON    = "Confirm Delete";
output.MESSAGE_INPUT_BOX        = "Enter Message";
output.SUBMIT_BUTTON            = "Submit Message Button";
output.LOGOUT                   = "Logout";

/* VARIABLE MESSAGE TO SET */
var MESSAGE = [
    "Hello I am glad to have this conversation",
    "It is great to meet you team",
    "Maestro supports testing React Native",
    "React Native is great!",
    "Using Maestro testing is really great!",
    "Ang pogi m stan",
    "There are several convenience methods",
    "I have problem with my codes please help!",
    "You have to understand things first",
];

/* THIS FUNCTION CREATES RANDOM MESSAGE */
output.createMessage = () => {
    return MESSAGE[Math.round(Math.random()*MESSAGE.length)];
};

output.createdMessage = output.createMessage();