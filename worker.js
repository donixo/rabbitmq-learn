'use strict';

const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', (err, conn) => {
  conn.createChannel((err, chan) => {
    const queue = 'hello-kelinci-task';

    chan.assertQueue(queue, {durable: true});
    chan.prefetch(1);

    console.log('[*] waiting for messages in %s. To exit press CTRL+C', queue);

    chan.consume(queue, (msg) => {
      const secs = msg.content.toString().split('.').length - 1;

      console.log(" [x] received %s", msg.content.toString());
      setTimeout(_=> {
        console.log(" [x] Done");
        chan.ack(msg);
      }, secs * 1000);
    }, {noAck: false});
  });
})
