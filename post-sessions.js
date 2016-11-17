// node post-sessions.js > sessions-result.txt

var fetch = require('node-fetch');
var telemetry = require('./telemetry-hits.json');

// var host = 'http://localhost:5000/';
var host = 'http://studiosaga:35494/';
var index = -1;
var count = telemetry.sessions.length;

console.log('sessions: ', count);

postNext();

function postNext() {
  index++;
  if(index === count) {
    console.log('done');
    return;
  }

  fetch(host + 'api/telemetry/legacy-session', { 
      method: 'POST',
      body:    JSON.stringify(telemetry.sessions[index]),
      headers: { 'Content-Type': 'application/json' },
  })
  .then(function(res) {
    console.log('success');
    postNext();
  })
  .catch(function(err) {
    console.log('failed: ' + telemetry.sessions[index].sessionId);
    postNext();
  });

}
