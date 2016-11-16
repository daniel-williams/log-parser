var fs = require('fs');
var readline = require('readline');

fs.readdir(__dirname + '/logs/', function(err, files) {
  var count = files.length;
  var requests = [];

  for(var i = 0; i < files.length; i++) {
    var lineReader = readline.createInterface({
      input: fs.createReadStream(__dirname + '/logs/' + files[i])
    });
    lineReader.on('line', function(line) {
      var req = buildRequest(files[i], line);

      if(req.url !== null) {
        requests.push(req);

        if(requests.length === count) {
          requests.sort(function(a, b) {
            return a.file < b.file ? 1 : a.file > b.file ? -1 : 0;
          }).forEach(function(item) {
            console.log(item.file + ' -> ' + item.url);
          });
        }
      }
    });
  }

  function buildRequest(file, line) {
    if(line[0] === '#') { return { url: null }; }

    var req = {};
    var items = line.split(' ');
    req = Object.assign({}, req, {
      file: file,
      date: items[0],
      time: items[1],
      ip: items[2],
      origUrl: items[4],
      url: null,
      userAgent: items[9],
      status: items[10]
    });

    switch (req.origUrl) {
      case '/partials/home.html':
        req.url = '/promises';
        break;
      case '/partials/engineroom.html':
        req.url = '/engine-room';
        break;
      case '/partials/process.html':
        req.url = '/engineering-process';
        break;
      case '/partials/status.html':
        req.url = '/edge-status';
        break;
      case '/partials/team.html':
        req.url = '/team';
        break;
      case '/partials/promises/promise01.html':
        req.url = '/promises/store';
        break;
      case '/partials/promises/promise02.html':
        req.url = '/promises/flow';
        break;
      case '/partials/promises/promise03.html':
        req.url = '/promises/switch';
        break;
      case '/partials/promises/promise04.html':
        req.url = '/promises/search-and-productivity';
        break;
      case '/partials/promises/promise05.html':
        req.url = '/promises/immersive-reading';
        break;
      case '/partials/promises/promise06.html':
        req.url = '/promises/enterprise-and-education';
        break;
      case '/partials/promises/promise07.html':
        req.url = '/promises/shopping';
        break;
      case '/partials/promises/promise08.html':
        req.url = '/promises/3d';
        break;
      case '/partials/promises/promise09.html':
        req.url = '/promises/windows-10-devices';
        break;
      case '/partials/promises/promise10.html':
        req.url = '/promises/community';
        break;
      default:
        req.url = null;
    }

    if(req.url !== null) {
      
    }

    return req;
  }
});
