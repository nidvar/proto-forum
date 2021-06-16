const express = require('express');
const authentication = require('./middleware/auth')
const {Task} = require('../db/mongoose');

const task_route = new express.Router()

task_route.post('/tasks/create', authentication, async (req, res)=>{
    console.log('TASKS POST ROUTE', req.user_data)

    const task = new Task({
        task: req.body.task,
        completed: req.body.completed,
        owner: req.user_data._id
    })

    task.save()
    res.send(task)
})

task_route.get('/tasks', authentication, async (req, res)=>{
    console.log('GETTING TASKS ---------------', req.user_data)

    console.log('REQ QUERY', req.query)

    // how many tasks to show per page
    const the_limit = parseInt(req.query.limit)

    // skipping to specific page number
    let the_skip = 0;


    if(req.query.skip != undefined){
        // 0 = first page. 1 = second page
        the_skip = parseInt(req.query.skip) - 1
    }
    
    const generate_results = async (completed, limit)=>{
        const the_tasks = await Task.find({
            owner: req.user_data._id,
            completed:completed
        })

        // generate an array of arrays. 
        const final_results = []

        // split the array of tasks into small mini-arrays based on how much the limit is.
        // Eg, if there are 20 tasks, and the limit is 5, there will be 4 pages of 5 tasks.
        for(let i = 0; i <= the_tasks.length; i = i + limit ){
            const results = the_tasks.slice(i, i + limit)
            final_results.push(results)
        }
        res.send(final_results[the_skip])
    } 

    if(req.query.completed == 'false'){
        console.log('FALSE')
        generate_results(false, the_limit)

    }else if(req.query.completed == 'true'){
        console.log('TRUE')
        generate_results(true, the_limit)

    }else{
        console.log('ALL')
        const the_tasks = await Task.find({
            owner: req.user_data._id
        })
        const final_results = []

        for(let i = 0; i <= the_tasks.length ; i = i + the_limit ){
            const results = the_tasks.slice(i, i+the_limit)
            final_results.push(results)
        }
        res.send(final_results[the_skip])
    }

    
    
    
})

task_route.patch('/tasks/update', authentication, async (req, res)=>{

    const the_tasks = await Task.findOne({_id:'60b9abe6a2eeb626740e119b' ,owner: req.user_data._id})

    the_tasks.task = req.body.task
    the_tasks.completed = req.body.completed

    await the_tasks.save()

    console.log('TASK TO CHANGE', the_tasks)
    res.send(the_tasks)
})

module.exports = task_route