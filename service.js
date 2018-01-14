// Copyright 2017, David Hoelzer/Enclave Forensics Corporation - All Rights Reserved
// No portion of this code may be used in any commercial product without first notifying Enclave Forensics Corporation
// and clear attribution and credit for portions copied or otherwise utilized.

var sys = require('util');
var exec = require('child_process').exec;
var child;

const username = "admin";
const password = "ChangeThisPassword!";

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
 
const app = express();

var valid_sessions = new Array()

app.use(express.static(__dirname));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
}); 

function genSessionID(count) {
    var _sym = 'abcdefghijklmno-$pqrstuvwxyz1234567890';
    var str = '';

    for(var i = 0; i < count; i++) {
        str += _sym[parseInt(Math.random() * (_sym.length))];
    }
    return str
}

function authorized(req)
{
  return valid_sessions.includes(req.query['auth'])
}

app.use(bodyParser.json()); // support json encoded bodies
 
// some data for the API
var foods = [
  "Donuts",
  "Tacos"
];
 
app.post('/api/login', function(req, res) {
  if(req.body.username == username && req.body.password == password) {
    var sessionID = genSessionID(32);
    res.send({"authToken":sessionID});
    valid_sessions.push(sessionID);
    console.log(valid_sessions);
    return
  }
res.send({"Authenticated":false});
})


app.get('/api/authenticated', function(req, res) {
  if(authorized(req)){
    res.send(true)
    return
  }
  res.send(false)
})

app.get('/api/topTalkers', function(req, res) {
  var startTime = (new Date / 1000) - 3600;
  var topTenCommand = "rwfilter --type all --proto=0-255 --start-date="+startTime+" --pass=stdout | rwstats --count 10 --fields sip,proto --no-titles --delimited=, --values=packets --top --no-columns --no-final-delimiter | awk  -F, 'BEGIN{print \"[\"; separator=\"\";};{print separator\"{\\\"source\\\":\\\"\"$1\"\\\", \\\"protocol\\\":\"$2\", \\\"packets\\\":\"$3\", \\\"_percent\\\":\"$4\", \\\"_tally\\\":\"$5\"}\";separator=\",\"}END{print \"]\";}'";

  console.log(req)
  if(!authorized(req)){
    res.send({"Not Authorized":''});
    return
  }
  child = exec(topTenCommand, function(error, stdout, stderr) {
    res.send(stdout)
  })
});

app.get('/api/topTCPConnections', function(req, res) {
  var startTime = (new Date / 1000) - 3600;
  var topTenCommand = "rwfilter --type=all --flags-initial=S/SA --proto=6 --start-date="+startTime+" --pass=stdout | rwstats --count 10 --fields sip  --no-titles --delimited=, --values=packets --top --no-columns --no-final-delimiter | awk  -F, 'BEGIN{print \"[\"; separator=\"\";};{print separator\"{\\\"source\\\":\\\"\"$1\"\\\", \\\"connections\\\":\"$2\", \\\"_percent\\\":\"$3\", \\\"_tally\\\":\"$4\"}\";separator=\",\"}END{print \"]\";}'";

  if(!authorized(req)){
    res.send({"Not Authorized":''});
  return
  }
  child = exec(topTenCommand, function(error, stdout, stderr) {
    res.send(stdout)
  })
});

app.get('/api/30DayStats', function(req, res) {
  var startTime = (new Date / 1000) - (86400*30);
  var endTime = new Date / 1000;
  var commandString = "rwfilter --start-date="+startTime+" --end-date="+endTime+" --type=all --proto=6 --pass=stdout | rwcount --bin-size=86400 --delimited=, --no-titles| awk  -F, 'BEGIN{print \"[\"; separator=\"\";};{print separator\"{\\\"time\\\":\\\"\"$1\"\\\", \\\"records\\\":\"$2\", \\\"bytes\\\":\"$3\", \\\"packets\\\":\"$4\"}\";separator=\",\"}END{print \"]\";}'"

  if(!authorized(req)){
    res.send({"Not Authorized":''});
    return
  }
  child = exec(commandString, function(error, stdout, stderr) {
    res.send(stdout);
  })
})

app.get('/api/24HourStats', function(req, res) {
  var startTime = (new Date / 1000) - (3600*24);
  var endTime = new Date / 1000;
  var commandString = "rwfilter --start-date="+startTime+" --end-date="+endTime+" --type=all --proto=6 --pass=stdout | rwcount --bin-size=1800 --delimited=, --no-titles| awk  -F, 'BEGIN{print \"[\"; separator=\"\";};{print separator\"{\\\"time\\\":\\\"\"$1\"\\\", \\\"records\\\":\"$2\", \\\"bytes\\\":\"$3\", \\\"packets\\\":\"$4\"}\";separator=\",\"}END{print \"]\";}'"

  if(!authorized(req)){
    res.send({"Not Authorized":''});
    return
  }
  child = exec(commandString, function(error, stdout, stderr) {
    res.send(stdout);
  })
})

app.get('/api/60MinuteStats', function(req, res) {
  var startTime = Math.floor((new Date / 1000) - (3600));
  var endTime = Math.floor(new Date / 1000);
  var commandString = "rwfilter --start-date="+startTime+" --end-date="+endTime+" --type=all --proto=6 --pass=stdout | rwcount --bin-size=60 --delimited=, --no-titles| awk  -F, 'BEGIN{print \"[\"; separator=\"\";};{print separator\"{\\\"time\\\":\\\"\"$1\"\\\", \\\"records\\\":\"$2\", \\\"bytes\\\":\"$3\", \\\"packets\\\":\"$4\"}\";separator=\",\"}END{print \"]\";}'"

  if(!authorized(req)){
    res.send({"Not Authorized":''});
    return
  }
  child = exec(commandString, function(error, stdout, stderr) {
    res.send(stdout);
  })
})

app.get('/api/10MinuteTCPPorts', function(req, res) {
  var startTime = (new Date / 1000) - (600);
  var endTime = new Date / 1000;
  var commandString = "rwfilter --start-date="+startTime+" --end-date="+endTime+" --flags-initial=S/SA --type=all --proto=6 --pass=stdout | rwstats --count 10 --fields dport --delimited=, --values=packets --top --no-titles| awk  -F, 'BEGIN{print \"[\"; separator=\"\";};{print separator\"{\\\"port\\\":\\\"\"$1\"\\\", \\\"packets\\\":\"$2\", \\\"_percent\\\":\"$3\", \\\"_tally\\\":\"$4\"}\";separator=\",\"}END{print \"]\";}'"

  if(!authorized(req)){
    res.send({"Not Authorized":''});
    return
  }
  child = exec(commandString, function(error, stdout, stderr) {
    res.send(stdout);
  })
})

app.get('/api/largestTransfers', function(req, res) {
  var startTime = (new Date / 1000) - 3600;
  var largestTransfersCommand = "rwfilter --type all --proto=0-255 --start-date="+startTime+" --pass=stdout | rwstats --count 10 --fields sip,sport,dip,dport,bytes --no-titles --delimited=, --values=bytes --top --no-columns --no-final-delimiter | awk  -F, 'BEGIN{print \"[\"; separator=\"\";};{print separator\"{\\\"source\\\":\\\"\"$1\"\\\", \\\"sport\\\":\"$2\", \\\"dest\\\":\\\"\"$3\"\\\", \\\"dport\\\":\"$4\", \\\"bytes\\\":\"$5\", \\\"_percent\\\":\"$6\", \\\"_tally\\\":\"$7\"}\";separator=\",\"}END{print \"]\";}'";

  if(!authorized(req)){
    res.send({"Not Authorized":''});
    return
  }
  child = exec(largestTransfersCommand, function(error, stdout, stderr) {
    res.send(stdout)
  })
});

app.use(express.static('dist'))

// the GET "foods" API endpoint
app.get('/api/food', function (req, res) {
  if(!authorized(req)){
    res.send({"Not Authorized":''});
    return
  }
    res.send(foods);
});
  
// HTTP listener
app.listen(3000, function () {
    console.log('Silk query service listening on port 3000!');
});
module.exports = app;

