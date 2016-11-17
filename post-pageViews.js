// node post-pageViews.js > pageViews-result.txt

var fetch = require('node-fetch');
var telemetry = require('./telemetry-hits.json');

// var host = 'http://localhost:5000/';
var host = 'http://studiosaga:35494/';
var index = -1;
var count = telemetry.pageViews.length;

console.log('pageViews: ', count);

postNext();

function postNext() {
  index++;
  if(index === count) {
    console.log('done');
    return;
  }

  fetch(host + 'api/telemetry/legacy-page-view', { 
      method: 'POST',
      body:    JSON.stringify(telemetry.pageViews[index]),
      headers: { 'Content-Type': 'application/json' },
  })
  .then(function(res) {
    console.log('success');
    postNext();
  })
  .catch(function(err) {
    console.log('failed: ' + telemetry.pageViews[index].sessionId);
    postNext();
  });

}
