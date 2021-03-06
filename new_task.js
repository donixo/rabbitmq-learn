'use strict';

const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', (err, conn) => {
  conn.createChannel((err, chan) => {
    const queue = 'hello-kelinci-task';
    const msg = process.argv.slice(2).join(' ') || 'no message is a good message';

    chan.assertQueue(queue, {durable: true});
    chan.sendToQueue(queue, new Buffer(msg), {persistent: true});
    console.log("[x] Sent %s", msg);
  });

  setTimeout(_=> {
    conn.close();
    process.exit(0);
  }, 500);
});
