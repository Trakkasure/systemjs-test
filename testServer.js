/*
 * Quick and dirty web server for testing.
 * Doesn't require any third party modules.
 * Doesn't call any other code.
 */
var http = require('http')
var fs = require('fs')
var URL = require('url')
var exec = require('child_process').exec;
var BASE = ".";

var mime = {
    'js'  : 'application/javascript'
  , 'html': 'text/html'
  , 'php' : 'application/php'
  , 'json': 'application/json'
  , 'csv' : 'text/csv'
  , 'css' : 'text/css'
}
const PORT=8000;

var server = http.createServer(function (req, res) {
    var url = URL.parse(req.url)
    
    if (url === "/")  {
        res.writeHead(200, {'Content-Type': 'text/html'})
        return res.end(fs.readFileSync('index.html'))
    }

    if (/\/downloads\//.test(url.pathname)) {
        BASE = "/Users/brandon";
    }
    var fileExt=url.pathname.match(/\.(\w+)/);
    var ext;
    if (!fileExt) {
        url.pathname+='/index.html';
        ext='text/html';
    } else
        ext = mime[fileExt.pop()]||'text/plain'

    if (ext == 'application/php') {
        var child = exec('php -f ' +BASE+url.pathname.substr(1),function(err,stdout,stderr) {
            res.writeHead(200, {'Content-Type': 'text/html'})
            console.log('%s - phpcgi - %s',new Date(),stderr);
            res.end(stdout);
        })
        return
    }

    if (fs.existsSync(BASE+url.pathname)) {
        try {
            console.log('200 %s - %s - %s',new Date(),BASE+url.pathname,url.query);
            var file = fs.readFileSync(BASE+url.pathname)
            res.writeHead(200, {'Content-Type': ext})
            return res.end(file)
        } catch(e) {
            console.log('500 %s - %s - %s',new Date(),BASE+url.pathname,url.query);
            res.writeHead(500,{'Content-Type':'text/plain'});
            return res.end('500 Internal server Error: '+JSON.stringify(e))
        }
    } else {
        console.log('404 %s - %s - %s',new Date(),BASE+url.pathname,url.query);
        res.writeHead(404,{'Content-Type':'text/plain'});
        return res.end('404 could not find page: '+BASE+url.pathname)
    }
})
    
server.listen(PORT);
console.log("Listening on port ",PORT);

