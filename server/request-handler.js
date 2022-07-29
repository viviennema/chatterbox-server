/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
//const messages = require('../client/scripts/messages.js');
// const messages = [{"id": 0,
//   "username": "Tobby",
//   "text": "this is hard",
//   "roomname": "lobby" }];
const messages = [];

var getPostMessage = function(body) {
  const {id, username, text, roomname} = JSON.parse(body);
  const message = {
    id,
    username,
    text,
    roomname
  };
  message.id = messages.length + 1;
  return message;
};



var requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  //var statusCode = 200;

  var defaultCorsHeaders = {
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'access-control-allow-headers': 'content-type, accept, authorization',
    'access-control-max-age': 10 // Seconds.
  };

  var headers = defaultCorsHeaders;

  if (request.url === '/classes/messages' && request.method === 'GET') {
    response.writeHead(200, headers);

    // headers['Content-Type'] = 'application/json';

    response.end(JSON.stringify(messages));
  } else if (request.url === '/classes/messages' && request.method === 'OPTIONS') {
    response.writeHead(200, headers);
    //headers['Content-Type'] = 'application/json';
    response.end(JSON.stringify(messages));
  } else if (request.url === '/classes/messages' && request.method === 'POST') {
    response.writeHead(201, headers);
    var body = '';
    request.on('data', (chunk) => {
      body += chunk.toString();
    }).on('end', () => {
      var message = getPostMessage(body);
      messages.push(message);

      response.writeHead(201, headers);
      response.end(JSON.stringify(messages));
    });
  } else {
    response.writeHead(404, headers);
    response.end(JSON.stringify({message: 'Route Not Found'}));
  }


};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve your chat
// client from this domain by setting up static file serving.

module.exports.requestHandler = requestHandler;