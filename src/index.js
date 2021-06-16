console.log('testing index.js')
//install json web token + require it ----- npm i jsonwebtoken 
const jwt = require('jsonwebtoken')

const express = require('express');
const app = express();
require('../db/mongoose')

const user_route = require('./userRoute')
const task_route = require('./taskRoute')

const {Task} = require('../db/mongoose')
const {User} = require('../db/mongoose')

//middleware
// app.use((req, res, next)=>{
//     res.send('no path available')
// })

app.use(express.json())
app.use(user_route)
app.use(task_route)

app.patch('/update/:id', async (req, res)=>{
    
    // check if the user input correct fields
    const fields = ['name', 'age', 'password', 'email']
    const the_keys = Object.keys(req.body)

    let result = null

    the_keys.forEach(a=>{
        if(!fields.includes(a)){
            result = 'fail'
        }
    })

    if(result == 'fail'){
        res.send('fail')
        return console.log('failed to update because field error')
    }
    // =====================

    const task_to_update = await Task.findById(req.params.id)

    the_keys.forEach(a=>{
        task_to_update[a] = req.body[a]
    })

    const final = task_to_update.save();

    // const updating = await Task.findByIdAndUpdate('60acb8088a6b1f00f09babfb', {task:'Buy division 2'})
    res.send('done')
    // return updating

    return final

})

// const testing_task_user = async ()=>{
//     console.log('TESTING TASK USER')
//     const a_task = await Task.findById('60b9990d9814fb3ee44bb6ea')
//     console.log(a_task)

//     const a_user = await User.findById('60b976559562d224cc6e39ed')
//     console.log(a_user)
// }

// testing_task_user()

const port = process.env.PORT || 3000
app.listen(port, console.log('============================'))