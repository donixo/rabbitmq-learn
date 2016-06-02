'use strict';

const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', (err, conn) => {
  conn.createChannel((err, chan) => {
    const queue = 'hello-kelinci';

    console.log('[*] waiting for messages in %s. To exit press CTRL+C', queue);

    chan.assertQueue(queue, {durable: false});
    chan.consume(queue, (msg) => {
      console.log("[x] received %s", msg.content.toString());
    }, {noAck: true});
  });
})
