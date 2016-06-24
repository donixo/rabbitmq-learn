'use strict';

//direct-to-queue model example

const amqp = require('amqplib/callback_api');

amqp.connect('amqp://user:pass@127.0.0.1/ahoy_vhost', (err, conn) => {
  if (err) {
    console.log('cannot connect to server');
    return process.exit(0);
  }

  conn.createChannel((err, chan) => {
    const queue = 'doni-hello-kelinci';

    chan.assertQueue(queue, {durable: false});
    chan.sendToQueue(queue, new Buffer('Hello World'));
    console.log("[x] Sent Hello world");
  });

  setTimeout(_=> {
    conn.close();
    process.exit(0);
  }, 300);
});
