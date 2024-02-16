const express = require('express');
const app = express();
const port = 3000;
const {v4 : uuidv4} = require('uuid');
let tasks = require('./tasks');
const bodyParser = require('body-parser');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.send("Welcome to the To-do list app")
   })



app.get("/tasks", (req, res) => {
 let page = req.query.page;
 let filteredTasks = tasks.slice(page-10,page);
 if(tasks.length > 0){
    if(!page){
        res.status(200).json({message: "tasks fetched successfully", result: tasks});
        }else{
           res.status(200).json({message: "tasks fetched successfully", result: filteredTasks});
        }
 }else{
    res.status(204).json({message : "No tasks found"})
 }

})

app.get("/tasks/:id", (req, res) => {
    let id = req.params.id;
    let taskIndex = tasks.findIndex((task) => task.id == id);
    if(taskIndex !== -1){
        let task = tasks[taskIndex]
        res.status(200).json({message: "task fetched successfully", result: task});
    }else{
        res.status(404).json({message: "Task not found"})
    }
   })



app.post("/tasks", (req, res) => {
    let task = req.body.task;
    let title = req.body.title;
    if(task === undefined ||  title === undefined){
       res.status(400).json({error: "Invalid input"})
    }else{
        let newTask = {id: uuidv4(),title : title, task: task};
        tasks = [...tasks, newTask];
        res.status(200).json({message: "task added successfully", result: newTask});
    }
      
})

app.put("/tasks/:id", (req, res)=>{
    let updatedTitle = req.body.title;
    let updatedTask = req.body.task;
    let id = req.params.id;

    let taskIndex = tasks.findIndex((task) => task.id == id);

    if(taskIndex !== -1){
    tasks[taskIndex].title = updatedTitle;
    tasks[taskIndex].task = updatedTask;
    res.status(200).json({message : "task updated successfully", result : tasks});
    }else{
        res.status(404).json({error: "task not found"})
    }
})

app.delete("/tasks/:id", (req, res) => {
    let id = req.params.id;
    tasks = tasks.filter((task) => task.id !== id)
    res.status(200).json({message: "task deleted successfully", result : tasks});
})

app.get('/*',(req, res) => {
    res.status(404).send("This page does not exist");
})

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
})
