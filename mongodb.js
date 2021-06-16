// //run mongodb first: mongod.exe --dbpath=/Users/user/mongodb-data

// // grab mongodb from npm i mongodb
// const mongodb = require('mongodb')
// const mongoClient = mongodb.MongoClient

// // instead of localhost, the number 127.0.0.1 was used because localhost causes bugs.
// // 27017 is the default MongoDB robo client port
// const connectionURL = process.env.MONGODBURL

// //database name:
// const databaseName = 'task-manager'

// //mongoclient has one method we can use. 'connect'
// //useNewUrlParser is deprecated and must be inserted manually
// mongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client)=>{
//     //2 arguments. error and client

//     if(error){
//         console.log('failed to connect')
//         return
//     }

//     console.log('connection success! win')
    
//     const db = client.db(databaseName)

//     //collection is a function that takes argument of collection name
//     //and we can use a method on that collection to insert a document
//     //insertOne takes an object with data that is to be inserted.

//     //Insert just One
//     // db.collection('users').insertOne({
//     //     name:'Muna',
//     //     age:28
//     // },(error, result)=>{
//     //     if(error){
//     //         return console.log('fail to execute insertOne')
//     //     }

//     //     return console.log(result.ops)
//     // })

//     //Insert many

//     // db.collection('tasks').insertMany([
//     //     {
//     //         task: 'finish node course',
//     //         completed: false
//     //     },
//     //     {
//     //         task: 'finish react course',
//     //         completed: false
//     //     },
//     //     {
//     //         task: 'finish watch dogs 2',
//     //         completed: true
//     //     }
//     // ],(error, result)=>{
//     //     if(error){
//     //         return console.log('failed to add tasks')
//     //     }

//     //     return console.log('tasks added')
//     // // })

//     // db.collection('users').findOne({_id: new mongodb.ObjectID('60a7b9d74f922f31b0c50467')},(error, users)=>{
//     //     console.log(users.name)
//     // })

//     // db.collection('tasks').updateMany({
//     //     completed:false
//     // }, {
//     //     $set: {
//     //         completed: true
//     //     }
//     // }).then(a=>{
//     //     console.log(a)
//     // }).catch(a=>{
//     //     console.log(a)
//     // })

//     db.collection('tasks').deleteOne({
//         _id: new mongodb.ObjectID('60a891e070f22611202b1fca')
//     }).then(a=>{
//         console.log(a)
//     }).catch(a=>{
//         console.log(a)
//     })

// })

// //install mongoose: 
// // - npm i mongoose@5.12.10