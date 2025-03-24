import { Schema, model } from 'mongoose';

const signup = Schema({
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required: true
    },
    displayName: {
        type: String,
        required: true,
    },
});
const SignUp = model('SignUp',signup);
export default SignUp;