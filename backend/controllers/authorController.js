const User = require('../models/Users')
const jwt = require("jsonwebtoken")
// handle errors
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = {email: '', password: ''}
    
    if(err.message === 'incorrect email'){
        errors.email ='email not regester'
    }
    if(err.message === 'incorrect password'){
        errors.password ='password incorrect'
    }


if (err.code === 11000){
        errors.email = "that email is already registered"
        return errors;
        };
       
       
        if (err.message.includes('user validation faild')){
        Object.values(err.errors).forEach(({properties}) => {
            console.log(properties);
            errors[properties.path] = properties.message;
        })
    }
    return errors;
}

const maxAge = 3* 24 * 60 * 60 ;
const createToken = (id) => {
    return jwt.sign({id}, 'net ninja secret', {
        expiresIn: maxAge
    })
}

module.exports.signup_post = async (request,response) => {
    const {email, password} = request.body;
   try {
      const user = await  User.create({email, password})
      const token = createToken(user._id)
    //   res.cookie("jwt", token , {httpOnly: true , maxAge: maxAge * 1000 });
      response.status(201).json({user : user._id, token:token })
   }
   catch (err) {
      const errors = handleErrors(err);
      console.log(errors);
      response.status(400).json({errors});
   }
}
module.exports.login_post = async (request,response) => {
    const {email, password} = request.body;
    try {
        const user = await  User.find({email, password})
        const token = createToken(user._id)
        // res.cookie("jwt", token , {httpOnly: true , maxAge: maxAge * 1000 });
        response.status(201).json({user : user._id, token:token })
     }
     catch (err) {
        const errors = handleErrors(err);
        console.log(errors);
        response.status(400).json({errors});
     }
  }
  module.exports.logout_get = (req, res) => {//
    res.cookie('jwt', '',{maxAge:1})
    res.redirect('/')
}
