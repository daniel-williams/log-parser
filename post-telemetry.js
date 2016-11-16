var fetch = require('node-fetch');
var telemetry = require('./telemetry-hits.json');

var top = telemetry[0];

fetch('http://localhost:5000/api/telemetry/legacy', { 
    method: 'POST',
    body:    JSON.stringify(top),
    headers: { 'Content-Type': 'application/json' },
})
  .then(function(res) {
    console.log('success');
  })
  .catch(function(err) {
    console.log('failed', err);
  });