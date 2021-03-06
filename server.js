var express = require('express');
var bodyParser = require("body-parser");
var tasks = require('./Data/todo');
var cors = require('cors');

var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('port',(process.env.PORT||80));


function responseServer(text){
    return {
        "blocks":[
            {
                "type" : "section",
                "fields" : [{
                    "type" : "plain_text",
                    "text" : text
                }]
            }
           ]
           };
}
app.get("/",(req,res)=>{
    res.json("Hi welcome to To-DO application");
})
app.post('/addtodo',(req,res)=>{
    var channel_id=req.body.channel_id;
    var newTask = req.body.text;
    var result;
    if(tasks[channel_id]){
        if(tasks[channel_id].indexOf(newTask)>=0){
            result = responseServer("Task " +newTask + "Already exists");
        }else{
            tasks[channel_id].push(newTask);
            result = responseServer("ADDED TODO for \" "  +newTask + "\"");
        }
    }else{
        tasks[channel_id] = [newTask];
        result = responseServer("ADDED TODO for \" "  +newTask + "\"");
    }
    res.json(result);
});

app.post('/marktodo', (req,res)=>{
     var deletetask = req.body.text;
     var result;
     var channel_id=req.body.channel_id;
     if(tasks[channel_id]){
      if(tasks[channel_id].indexOf(deletetask)>=0){
        tasks[channel_id].splice(tasks[channel_id].indexOf(deletetask),1);
        result= responseServer("Removed TODO for \" "  +deletetask + "\"");
        res.json(result);
     }else{
        result = responseServer("No such task found to delete") ;
        res.json(result);
     }}else{
        result= responseServer("No such task found to delete");
        res.json(result);
     }
});

app.get('/listtodos', (req,res)=> {
     var channel_id=req.query.channel_id;
     var result;
     if(tasks[channel_id]){
         if(tasks[channel_id].length>0){
            var string = tasks[channel_id].join("\n");
            result = responseServer(string);
            res.json(result);
         }else{
            result= responseServer("NO TODOS");
            res.json(result);
         }      
    }else{
        result= responseServer("NO TODOS");
        res.json(result);
    }}
   );

app.listen(app.get('port'), ()=> {
  console.log('Server is running at',app.get('port'));
});