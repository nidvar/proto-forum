const express = require('express');
const {User, Task} = require('../db/mongoose')
const user_route = new express.Router()
const sharp = require('sharp')

const {welcome_email, cancel_email} = require('./emails/account')

const authentication = require('./middleware/auth')

// Multer middleware for file uploads
const multer = require('multer')
const uploading_files = multer({
    // dest:'images',
    limits:{
        filesize: 1000000
    },
    fileFilter(req, file, cb){
        if(file.originalname.endsWith('.jpg') || file.originalname.endsWith('.png')){
            return cb(undefined, true)
        }
        return cb(new Error('not a jpg file from line 16'))
    }
})

user_route.post('/users/me/avatar', authentication, uploading_files.single('avatar'), async (req, res)=>{
    const sharp_transfer = await sharp(req.file.buffer).resize(320, 240).png().toBuffer()

    console.log('LINE 24 ====================', req.user_data)
    console.log('LINE 25 ====================', req.file)

    req.user_data.avatar = sharp_transfer

    await req.user_data.save();

    res.send()
}, (error, req, res, next)=>{
    res.status(400).send({error: error.message})
})

user_route.delete('/users/me/avatar', authentication, async (req, res)=>{
    req.user_data.avatar = ''
    await req.user_data.save()
    res.send('deleted avatar')
})

user_route.get('/users/:id/avatar', async (req, res)=>{
    const result = await User.findById(req.params.id)
    console.log(result)

    res.set('Content-Type', 'image/jpg')

    res.send(result.avatar)
})

user_route.get('/users', authentication, async (req, res)=>{
    const grab_all_users = await User.find({})
    res.send(grab_all_users)
    return
})

user_route.patch('/users/update', authentication, async (req, res)=>{

    console.log('PATCH REQUEST - USER-DATA TO UPDATE:', req.user_data)

    req.user_data.name = 'Joe Biden'

    console.log('NEW USER DATA', req.user_data)

    await req.user_data.save()

    res.send(x)
})

user_route.post('/users/logout', authentication, async(req, res)=>{
    console.log('LOGGING OUT')
    req.user_data.tokens = req.user_data.tokens.filter(a=>{
        if(a.token!==req.user_token){
            return true
        }
    })

    await req.user_data.save();

    res.send(req.user_data)
})

user_route.post('/users/logoutall', authentication, async(req, res)=>{
    console.log('LOGGING OUT')
    
    req.user_data.tokens = req.user_data.tokens.filter(a=>{
        return false
    })

    await req.user_data.save();

    res.send(req.user_data)
})

user_route.get('/users/me', authentication, async(req, res)=>{
    res.send(req.user_data)
})

user_route.delete('/users/me', authentication, async (req, res)=>{
    console.log('DELETE REQUEST')
    
    // await Task.deleteMany({owner: req.user_data._id})

    cancel_email(req.user_data.email, req.user_data.name)

    await req.user_data.remove();
    
    res.send(req.user_data)
})

user_route.post('/users/create', async (req, res)=>{

    const new_user = new User({
        name: req.body.name,
        age: req.body.age,
        password: req.body.password,
        email: req.body.email
    })

    welcome_email(req.body.email, req.body.name)

    const new_token_created = await new_user.create_token()

    new_user.save().then(a=>{
        console.log(a)
    }).catch(a=>{
        console.log(a)
    })

    res.send({new_user, new_token_created})
})

user_route.get('/users/:id', (req, res)=>{
  
    User.findById(req.params.id).then(a=>{
        console.log('HERE IT IS', a)
    })
    res.send('finished')
})

user_route.post('/users/login', async (req, res)=>{
    console.log('LOGIN ROUTE')
    console.log(req.body.password, req.body.email)
    const login_check = await User.check_login(req.body.email, req.body.password)
    const new_token_created = await login_check.create_token()

    res.send({login_check, new_token_created})
})

module.exports = user_route