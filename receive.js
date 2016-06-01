'use strict';

var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', (err, conn) => {
  conn.createChannel((err, chan) => {
    var chanName = 'hello-kelinci';

    console.log('[*] waiting for messages in %s. To exit press CTRL+C', chanName);

    chan.assertQueue(chanName, {durable: false});
    chan.consume(chanName, (msg) => {
      console.log("[x] received %s", msg.content.toString());
    }, {noAck: true});
  });
})
