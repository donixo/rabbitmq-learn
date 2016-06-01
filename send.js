'use strict';

const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', (err, conn) => {
  conn.createChannel((err, chan) => {
    const chanName = 'hello-kelinci';

    chan.assertQueue(chanName, {durable: false});
    chan.sendToQueue(chanName, new Buffer('Hello World'));
    console.log("[x] Sent Hello world");
  });

  setTimeout(_=> {
    conn.close();
    process.exit(0);
  }, 500);
});
