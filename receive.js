'use strict';

const amqp = require('amqplib/callback_api');

amqp.connect('amqp://user:pass@127.0.0.1/ahoy_vhost', (err, conn) => {
  if (err) {
    console.log(err);
    return process.exit(0);
  }

  conn.createChannel((err, chan) => {
    const queue = 'doni-hello-kelinci';

    console.log('[*] waiting for messages in %s. To exit press CTRL+C', queue);

    chan.assertQueue(queue, {durable: false});
    chan.consume(queue, (msg) => {
      console.log("[x] received %s", msg.content.toString());
    }, {noAck: true});
  });
})
