var fs = require('fs');
var readline = require('readline');
var agentParser = require('userAgent');

var dirList = fs.readdirSync(__dirname + '/logs/');
var count = dirList.length;
var index = -1;
var requests = [];
var distinctUrls = [];


getTargetFile();

function getTargetFile() {
  ++index;
  if(index === count) {
    console.log('finished processing ' + count + ' log files.');
    console.log('telemetry hits: ', requests.length);
    fs.writeFile(__dirname + '/telemetry-hits.json', JSON.stringify(requests, null, 2));
    // distinctUrls.sort();
    // for(var i = 0; i < distinctUrls.length; i++) {
    //   console.log(' -- ', distinctUrls[i]);
    // }
    return;
  }

  readNextLog(dirList[index], getTargetFile);
}

function readNextLog(file, cb) {
  console.log(index, 'readNextLog', file);

  var lineReader = readline.createInterface({
    input: fs.createReadStream(__dirname + '/logs/' + file)
  });

  lineReader.on('line', function(line) {
    var req = buildRequest(file, line);

    if(req.url !== null) {
      requests.push(req);
    }
  });

  lineReader.on('close', cb);
}


function buildRequest(file, line) {
  if(line[0] === '#') {
    return { url: null };
  }


  var req = {};
  var items = line.split(' ');

  if(items[11] === '404') {
    return { url: null };
  }


  req = Object.assign({}, req, {
    file: file,
    date: items[0],
    time: items[1],
    ip: items[2],
    origUrl: items[4],
    url: null,
    userAgent: items[9],
    status: items[11]
  });

  var len = req.origUrl.length;
  if(len > 5) {
    if(req.origUrl.slice(len - 5, len) === '.html') {
      if(distinctUrls.indexOf(req.origUrl) === -1) {
        distinctUrls.push(req.origUrl);
      }
    } else {
      return { url: null };
    }
  }

  var parsedUserAgent = agentParser.parse(req.userAgent);
  req.browser = `${parsedUserAgent.family} ${parsedUserAgent.major}.${parsedUserAgent.minor}.${parsedUserAgent.patch}`;
  req.operatingSystem = `${parsedUserAgent.os.family} ${parsedUserAgent.os.major}.${parsedUserAgent.os.minor}.${parsedUserAgent.os.patch}`;
  req.sessionId = newId();

  switch (req.origUrl) {
    case '/edge/partials/home.html':
    case '/edge/partials/promises.html':
    case '/saga/edge/partials/home.html':
    case '/saga/partials/home.html':
    case '/partials/home.html':
      req.url = '/promises';
      break;

    case '/saga/partials/engineroom.html':
    case '/partials/engineroom.html':
      req.url = '/engine-room';
      break;

    case '/saga/partials/process.html':
    case '/partials/process.html':
      req.url = '/engineering-process';
      break;

    case '/saga/partials/status.html':
    case '/partials/status.html':
    case '/partials/status/status.html':
      req.url = '/edge-status';
      break;

    case '/team.html':
    case '/partials/team.html':
    case '/saga/partials/team.html':
      req.url = '/team';
      break;

    case '/saga/partials/promises/promise01.html':
    case '/partials/promises/promise01.html':
    case '/partials/promises/01_store/promise.html':
      req.url = '/promises/store';
      break;

    case '/saga/partials/promises/promise02.html':
    case '/partials/promises/promise02.html':
    case '/partials/promises/02_flow/promise.html':
      req.url = '/promises/flow';
      break;

    case '/saga/partials/promises/promise03.html':
    case '/partials/promises/promise03.html':
    case '/partials/promises/03_switch/promise.html':
      req.url = '/promises/switch';
      break;

    case '/saga/partials/promises/promise04.html':
    case '/partials/promises/promise04.html':
    case '/partials/promises/04_search/promise.html':
      req.url = '/promises/search-and-productivity';
      break;

    case '/saga/partials/promises/promise05.html':
    case '/partials/promises/promise05.html':
    case '/partials/promises/05_reading/promise.html':
      req.url = '/promises/immersive-reading';
      break;

    case '/saga/partials/promises/promise06.html':
    case '/partials/promises/promise06.html':
    case '/partials/promises/06_enterprise/promise.html':
      req.url = '/promises/enterprise-and-education';
      break;

    case '/saga/partials/promises/promise07.html':
    case '/partials/promises/promise07.html':
    case '/partials/promises/07_shopping/promise.html':
      req.url = '/promises/shopping';
      break;

    case '/saga/partials/promises/promise08.html':
    case '/partials/promises/promise08.html':
    case '/partials/promises/08_3d/promise.html':
      req.url = '/promises/3d';
      break;

    case '/saga/partials/promises/promise09.html':
    case '/partials/promises/promise09.html':
    case '/partials/promises/09_devices/promise.html':
      req.url = '/promises/windows-10-devices';
      break;

    case '/saga/partials/promises/promise10.html':
    case '/partials/promises/promise10.html':
    case '/partials/promises/10_community/promise.html':
      req.url = '/promises/community';
      break;

    default:
      // console.log('miss: ', req.origUrl);
      req.url = null;
  }

  return req;
}



function newId() {
  var d = new Date().getTime();
  var id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (d + Math.random()*16)%16 | 0;
    d = Math.floor(d/16);
    return (c=='x' ? r : (r&0x3|0x8)).toString(16);
  });
  var temp = id.split('');
  temp.splice(9, 4, 'S', 'A', 'G', 'A');

  return temp.join('');
}

// #Date: 2016-05-27 00:42:42
// #Fields:
// 00 date
// 01 time
// 02 s-ip
// 03 cs-method
// 04 cs-uri-stem
// 05 cs-uri-query
// 06 s-port
// 07 cs-username
// 08 c-ip
// 09 cs(User-Agent)
// 10 cs(Referer)
// 11 sc-status
// 12 sc-substatus
// 13 sc-win32-status
// 14 time-taken


// process.stdin.resume();
// process.stdin.setEncoding('utf8');
// var util = require('util');

// process.stdin.on('data', function (text) {
//   console.log('received data:', util.inspect(text));
//   if (text === 'q\r\n') {
//     done();
//   }
// });

// function done() {
//   console.log('Now that process.stdin is paused, there is nothing more to do.');
//   process.exit();
// }
