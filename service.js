// Copyright 2017, 2018, 2019 David Hoelzer/Enclave Forensics Corporation - All Rights Reserved
// No portion of this code may be used in any commercial product without first notifying Enclave Forensics Corporation
// and clear attribution and credit for portions copied or otherwise utilized.

// Class structure for messages sent through the websockets API.
class Message {
    constructor() {
        /** The API name in the call used by the websocket API router.
         * @member
         */
        this.apiEndpoint = "";
        /** Any required parameters
         * @member
         */
        this.parameters = "";
    }
}

const express = require('express');
const fs = require('fs')
const bodyParser = require('body-parser');
const path = require('path');
const SocketServer = require('ws').Server;
var sys = require('util');
var exec = require('child_process').exec;
const https = require('https')
const app = express();

var child;

function handleSocketData(socket, message) {
    var jsonMessage = Object
    try {
        jsonMessage = JSON.parse(message)
    } catch (error) {
        console.log("Invalid JSON message")
        socket.send(JSON.stringify({
            server: "invalid parameters"
        }))
        return
    }
    console.log("Inbound Message: " + message)
    /*
     *
     * We cannot be certain that the socket message hasn't been tampered with or forged.  As a result,
     * where necessary, efforts are made to verify that properties exist to avoid dereferencing errors
     * that would crash the server.
     *
     */
    if (!jsonMessage.hasOwnProperty("apiEndpoint")) {
        console.log("No API endpoint specified")
        return
    }
    if (jsonMessage.apiEndpoint != "login" && !socket.authenticated) {
        console.log("Attempt to access API without a valid session established.")
        socket.send(JSON.stringify({
            server: "Not Authenticated"
        }))
        return
    }

    switch (jsonMessage.apiEndpoint) {
        case "login":
          if (!jsonMessage.hasOwnProperty("parameters")) {
              console.log("Parameters are missing")
              socket.send(JSON.stringify({
                  server: "Invalid Parameters"
              }))
              return
          }
          login(socket, jsonMessage.parameters.username, jsonMessage.parameters.password)
          break
        case "toptalkers":
          topTalkers(socket)
          break
        case "topTCPConnections":
          topTCPConnections(socket)
          break
        case "largestTransfers":
          largestTransfers(socket)
          break
        case "topTCPPorts":
          _10MinuteTCPPorts(socket)
          break
        case "30DayStats":
          _30DayStats(socket)
          break
        case "60MinuteStats":
          _60MinuteStats(socket)
          break
        case "24HourStats":
          _24HourStats(socket)
          break
        case "runQuery":
          if (!jsonMessage.hasOwnProperty("parameters")) {
              console.log("Parameters are missing")
              socket.send(JSON.stringify({
                  server: "Invalid Parameters"
              }))
              return
          }
          runQuery(socket, jsonMessage.parameters)
          break
    }

}

function runQuery(socket, parameters)
{
  rwFilter = "rwfilter"
  const fieldsToReturn = "sTime,eTime,duration,sip,sport,dip,dport,protocol,packets,bytes,initialFlags,sessionFlags,sensor"
  saddress = parameters.saddress
  daddress = parameters.daddress
  sport = parameters.sport
  dport = parameters.dport
  startDate = parameters.startDate
  endDate = parameters.endDate
  proto = parameters.proto
  flags = parameters.flags
  flagsInitial = parameters.flagsInitial
  sensors = parameters.sensors
  trafficTypes = parameters.trafficTypes
  minDuration = parameters.minDuration
  maxDuration = parameters.maxDuration
  numResults = parameters.numResults

  rwFilter += " --saddress="+saddress
  rwFilter += " --daddress="+daddress
  rwFilter += " --sport="+sport
  rwFilter += " --dport="+dport
  rwFilter += " --proto="+proto
  if(flags !== "any") { rwFilter += " --flags-all="+flags }
  if(flagsInitial !== "any") { rwFilter += " --flags-initial="+flagsInitial }
  if(startDate !== "Today") { rwFilter += " --start-date="+startDate }
  if(endDate !== "Today") { rwFilter += " --end-date="+endDate }
  rwFilter += " --duration="+minDuration+"-"+maxDuration

  if(sensors == "all") { } else { rwFilter += " --sensors="+sensors }
  rwFilter += " --type="+trafficTypes

  rwFilter += " --pass=stdout | rwcut --fields="+fieldsToReturn+" --num-recs="+numResults+" --delimited=, "

  console.log(rwFilter)
  child = exec(rwFilter, function(error, stdout, stderr) {
    sendResults('queryResults', stdout)
    console.log(stderr)
  })

}

function login(ws, username, password) {

  // This is a VERY SIMPLE authentication system.  I'm not interested in backing this with a databse
  // at the moment.  The format of the passwd file is:

  // username:password:
  
  // Note the trailing colon!  Without it, the password will have a comma appended by our splits.

  var entries = fs.readFileSync('passwd').toString().split("\n")
  var passwdEntries = Object
  for(entry in entries){
    var[user, passwd] = entries.toString().split(':')
    passwdEntries[user]=passwd
  }
  if(passwdEntries[username.toString()] == password.toString()){
    ws.authenticated = true
    ws.send(JSON.stringify({
        apiEndpoint: 'login',
        result: true
    }))
  } else {
    console.log("Failed logon attempt: " + username + " with password >" + password + "< (wrong password)")
    ws.send(JSON.stringify({
        apiEndpoint: 'login',
        result: false
    }))
  }
}

function topTalkers()
{
  var startTime = (new Date / 1000) - 3600;
  var topTenCommand = "rwfilter --type all --proto=0-255  --pass=stdout | rwstats --count 10 --fields sip,proto --no-titles --delimited=, --values=packets --top --no-columns --no-final-delimiter | awk  -F, 'BEGIN{print \"[\"; separator=\"\";};{print separator\"{\\\"source\\\":\\\"\"$1\"\\\", \\\"protocol\\\":\\\"\"$2\"\\\", \\\"packets\\\":\\\"\"$3\"\\\", \\\"_percent\\\":\\\"\"$4\"\\\", \\\"_tally\\\":\\\"\"$5\"\\\"}\";separator=\",\"}END{print \"]\";}'";

  child = exec(topTenCommand, function(error, stdout, stderr) {
    sendResults('toptalkers', stdout)
  })
}

function topTCPConnections()
{
  var startTime = (new Date / 1000) - 3600;
  var topTenCommand = "rwfilter --type=all --flags-initial=S/SA --proto=6 --start-date="+startTime+" --pass=stdout | rwstats --count 10 --fields sip  --no-titles --delimited=, --values=packets --top --no-columns --no-final-delimiter | awk  -F, 'BEGIN{print \"[\"; separator=\"\";};{print separator\"{\\\"source\\\":\\\"\"$1\"\\\", \\\"connections\\\":\"$2\", \\\"_percent\\\":\"$3\", \\\"_tally\\\":\"$4\"}\";separator=\",\"}END{print \"]\";}'";

  child = exec(topTenCommand, function(error, stdout, stderr) {
    sendResults('topTCPConnections', stdout)
  })
}

function _30DayStats()
{
  var startTime = (new Date / 1000) - (86400*30);
  var endTime = new Date / 1000;
  var commandString = "rwfilter --start-date="+startTime+" --end-date="+endTime+" --type=all --proto=6 --pass=stdout | rwcount --bin-size=86400 --delimited=, --no-titles| awk  -F, 'BEGIN{print \"[\"; separator=\"\";};{print separator\"{\\\"time\\\":\\\"\"$1\"\\\", \\\"records\\\":\"$2\", \\\"bytes\\\":\"$3\", \\\"packets\\\":\"$4\"}\";separator=\",\"}END{print \"]\";}'"

  child = exec(commandString, function(error, stdout, stderr) {
    sendResults('30DayStats', stdout)
  })
}

function _24HourStats()
{
  var startTime = (new Date / 1000) - (3600*24);
  var endTime = new Date / 1000;
  var commandString = "rwfilter --start-date="+startTime+" --end-date="+endTime+" --type=all --proto=6 --pass=stdout | rwcount --bin-size=1800 --delimited=, --no-titles| awk  -F, 'BEGIN{print \"[\"; separator=\"\";};{print separator\"{\\\"time\\\":\\\"\"$1\"\\\", \\\"records\\\":\"$2\", \\\"bytes\\\":\"$3\", \\\"packets\\\":\"$4\"}\";separator=\",\"}END{print \"]\";}'"

  child = exec(commandString, function(error, stdout, stderr) {
    sendResults('24HourStats', stdout)
  })
}

function _60MinuteStats()
{
  var startTime = Math.floor((new Date / 1000) - (3600));
  var endTime = Math.floor(new Date / 1000);
  var commandString = "rwfilter --start-date="+startTime+" --end-date="+endTime+" --type=all --proto=6 --pass=stdout | rwcount --bin-size=60 --delimited=, --no-titles| awk  -F, 'BEGIN{print \"[\"; separator=\"\";};{print separator\"{\\\"time\\\":\\\"\"$1\"\\\", \\\"records\\\":\"$2\", \\\"bytes\\\":\"$3\", \\\"packets\\\":\"$4\"}\";separator=\",\"}END{print \"]\";}'"

  child = exec(commandString, function(error, stdout, stderr) {
    sendResults('60MinuteStats', stdout)
  })
}

function _10MinuteTCPPorts()
{
  var startTime = (new Date / 1000) - (600);
  var endTime = new Date / 1000;
  var commandString = "rwfilter --start-date="+startTime+" --end-date="+endTime+" --flags-initial=S/SA --type=all --proto=6 --pass=stdout | rwstats --count 10 --fields dport --delimited=, --values=packets --top --no-titles| awk  -F, 'BEGIN{print \"[\"; separator=\"\";};{print separator\"{\\\"port\\\":\\\"\"$1\"\\\", \\\"packets\\\":\"$2\", \\\"_percent\\\":\"$3\", \\\"_tally\\\":\"$4\"}\";separator=\",\"}END{print \"]\";}'"

  child = exec(commandString, function(error, stdout, stderr) {
    sendResults('topTCPPorts', stdout)
  })
}

function largestTransfers()
{
  var startTime = (new Date / 1000) - 3600;
  var largestTransfersCommand = "rwfilter --type all --proto=0-255 --start-date="+startTime+" --pass=stdout | rwstats --count 10 --fields sip,sport,dip,dport,bytes --no-titles --delimited=, --values=bytes --top --no-columns --no-final-delimiter | awk  -F, 'BEGIN{print \"[\"; separator=\"\";};{print separator\"{\\\"source\\\":\\\"\"$1\"\\\", \\\"sport\\\":\"$2\", \\\"dest\\\":\\\"\"$3\"\\\", \\\"dport\\\":\"$4\", \\\"bytes\\\":\"$5\", \\\"_percent\\\":\"$6\", \\\"_tally\\\":\"$7\"}\";separator=\",\"}END{print \"]\";}'";

  child = exec(largestTransfersCommand, function(error, stdout, stderr) {
    sendResults("largestTransfers", stdout)
  })
}

function sendResults(endpoint, data)
{
  const message = JSON.stringify({ apiEndpoint: endpoint, result: data})
  for(ws of wss.clients)
  {
    if(ws.authenticated) {
      ws.send(message)
    }
  }
}

setInterval(largestTransfers, (1000 * 60 * 5))
setInterval(_10MinuteTCPPorts, (1000 * 60))
setInterval(_60MinuteStats, (1000 * 60 * 15))
setInterval(_24HourStats, (1000 * 60 * 60))
setInterval(topTCPConnections, (1000 * 60 * 5))
setInterval(topTalkers, (1000 * 60 * 5))

app.use(express.static('dist'))
app.use(express.static(__dirname));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
}); 

app.use(bodyParser.json()); // support json encoded bodies
// HTTP listener
var listenPort = process.env.SILKY_PORT || 3000
var server = app.listen(listenPort)
const wss = new SocketServer({
    server,
    clientTracking: true
});
//init Websocket ws and handle incoming connect requests
wss.on('connection', function connection(ws) {
    console.log("Websocket Connection ...");
    ws.on('message', (message => handleSocketData(ws, message)));
    ws.send(JSON.stringify({
        server: "Good morning, Dave."
    }))
    ws.on('close', (stuff => {
        console.log("Socket reported a close")
    }))
    ws.on('error', (error => {
        console.log("Socket reported an error.")
    }))
});


module.exports = app;