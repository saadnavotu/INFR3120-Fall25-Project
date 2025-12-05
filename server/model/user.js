// from lecture notes
const { trim, type } = require('jquery');
let mongoose = require('mongoose');
let passportLocalMongoose = require('passport-local-mongoose');
const { collection } = require('./booking');
const crypto = require('crypto'); 

let User = mongoose.Schema({
    username:
    {
        type:String,
        default:"",
        trim:true,
        required:'Username is required'
    },
    profileImage:
    {
        type:String,
        default:"",
    },
    /*password:
    {
        type:String,
        default:"",
        trim:true,
        required:'Password is required'
    },*/
    email:
    {
        type:String,
        default:"",
        trim:true,
        required:'email is required'
    },
    displayName:
    {
        type:String,
        default:"",
        trim:true,
        required:'displayName is required'
    },
    created:
    {
        type:Date,
        default:Date.now
    },
    updated:
    {
        type:Date,
        default:Date.now
    },

    // implementing the password reset fields for bonus marks 
    resetPasswordToken: {
        type: String,
        default: undefined
    },
    resetPasswordExpires: {
        type: Date,
        default: undefined
    }

}, {
  collection: "user"
});


//  for passport local mongoose 
const options = { MissingPasswordError: 'Wrong/Missing Password' };


User.plugin(passportLocalMongoose, options);

//  create reset token and store its hash and expiry on the user

User.methods.createPasswordResetToken = function () { 


  //  token we will send in email

  const rawToken = crypto.randomBytes(32).toString('hex');

  // then we store hashed token in DB for security

  this.resetPasswordToken = crypto.createHash('sha256').update(rawToken).digest('hex');
  
  // make the expire date one hour from now
  this.resetPasswordExpires = Date.now() + 60 * 60 * 1000;
  return rawToken;
};


module.exports.User = mongoose.model('User',User);
