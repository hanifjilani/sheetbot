const express = require("express");
const app = express();
const rp = require('request-promise-native');
const bodyParser = require("body-parser");
require("dotenv").config();

const dfff = require("dialogflow-fulfillment");
app.use(bodyParser.urlencoded({extended: true}));


app.get("/", function(req,res){
  res.send("We are working by the will of Allah!");
})

app.post("/", express.json(), function(request,response){
  dialogflow(request,response);


})

const dialogflow = (request, response) => {
  const agent = new dfff.WebhookClient({request,response})

  console.log(request);

  function demo(agent){
    var name = request.body.queryResult.parameters.Name.name;
    const apiId = process.env.API;
    const url = "https://sheetdb.io/api/v1/"+ apiId +"/search?Name="+ name
    return rp.get(url)
      .then( jsonBody => {
        var body = JSON.parse(jsonBody);
        var grade = body[0].Grade
        var subject = body[0].Subject
        var city = body[0].City
        agent.add("The details of " + name + " Grade: " + grade + " subject: " + subject + " city: " + city);
        return Promise.resolve(agent);
      });
    }
    let intentMap = new Map();
    intentMap.set('Details',demo)

    agent.handleRequest(intentMap)


}


app.listen(3000, function(){
  console.log("only by the will of Allah !!");
})
