// server.js

const express = require('express');
const WebSocket = require('ws');
const uuid = require('node-uuid');
// Set the port to 4000
const PORT = 4000;

let messages = [
    { count: 0,
      id: 7,
      type: "count"
    },
    {
        id: 1,
        username: 'Bob',
        content: 'Has anyone seen my marbles?',
        type: "incomingMessage",
        userColor: "#1E1B92"
    }, {
        id: 2,
        username: 'Anonymous',
        content: 'No, I think you lost them. You lost your marbles Bob. You lost them for good.',
        type: "incomingMessage",
        userColor: "#D113E4"
    }
];

// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new WebSocket.Server({ server });

// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.
wss.on('connection', (ws) => {
  messages[0].count += 1;
  console.log(messages[0].count)
  console.log('Client connected');
  ws.send(JSON.stringify(messages));
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    let p = JSON.parse(message)
    switch(p.type) {
      case "incomingMessage":
        console.log("a message")
        p.id = uuid.v4();
        messages.push(p);
        wss.clients.forEach(function each(client) {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(messages));
          }
        })
        break;
      case "incomingNotification":
        console.log("a notification")
        p.id = uuid.v4();
        messages.push(p);
        wss.clients.forEach(function each(client) {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(messages));
          }
        })
        break;
      default:
        // show an error in the console if the message type is unknown
        throw new Error("Unknown event type " + p.type);
    }
  });

  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => {
    messages[0].count -= 1;
    console.log(messages[0].count);
    console.log('Client disconnected');
  })
});
