const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongodb_url = process.env.MONGODBURL;
console.log('mongodb url =========================',mongodb_url)



mongoose.connect(`${mongodb_url}/task-manager-api`,{
    useNewUrlParser:true,
    useCreateIndex:true
})

const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true
    },
    age:{
        type: Number
    },
    email:{
        type:String,
        unique:true,
        validate(the_email){
            if(validator.isEmail(the_email)!=true){
                throw new Error('email fail')
            }
        }
    },
    password:{
        type:String,
        required:true,
        validate(the_password){
            if(the_password.length < 6){
                throw new Error('password is too short')
            }
        }
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],
    avatar:{
        type: Buffer
    }
})

const TaskSchema = new mongoose.Schema({
    task:{
        type:String,
        required:true,
    },
    completed:{
        type:Boolean,
        required:false,
        default:false
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    }
},{
    timestamps:true
})

UserSchema.methods.toJSON = function(){
    const the_data = this.toObject()
    delete the_data.password
    delete the_data.tokens
    return the_data
}

//----------- CREATE TOKEN ---------------
UserSchema.methods.create_token = async function(){
    const new_token = jwt.sign({_id: this._id.toString()}, process.env.jwt_secret)
    this.tokens = this.tokens.concat({token: new_token})
    await this.save()
    return new_token
}

UserSchema.statics.check_login = async (email, password)=>{
    console.log('CHECK LOGIN FUNCTION -> ')
    const user = await User.findOne({
        email:email
    })

    if(user == undefined){
        return console.log('cannot find user')
    }
    console.log('USER->', user)
    console.log('USER PWORD', user.password)
    console.log('THE PWORD', password)
    const password_checked_using_brypt = await bcrypt.compare(password, user.password)
    console.log('LINE 88',password_checked_using_brypt)
    if(password_checked_using_brypt == true){
        console.log('correct password')
        return user
    }else{
        throw new Error('fail password')
    }
}

UserSchema.pre('save', async function(next){
    if(this.isModified('password')){
        const result = await bcrypt.hash(this.password, 8)
        this.password = result
        console.log('PWORD HASH RESULT', result)
    }
    next()
})

// DELETE USER
UserSchema.pre('remove', async function(next){
    console.log('PRE REMOVE FUNCTION')
    console.log(this)
    await Task.deleteMany({owner: this._id})

    next()
})

//create MODEL. It is a constructor function.
const User = mongoose.model('User', UserSchema)
const Task = mongoose.model('Tasks', TaskSchema)

// Create instance of the MODEL above.
// const me = new User({name: 'Jay', age: 34, password:'superjay', email:'superjay@mail.com'})

// me.save().then(a=>{
//     console.log(me)
// }).catch(a=>{
//     console.log(a)
// })





module.exports = { User, Task }

// {
//     "password": "president",
//     "email": "biden@mail.com",
//     "name": "biden",
//     "age": 70
// }