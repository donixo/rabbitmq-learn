'use strict';

var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', (err, conn) => {
  conn.createChannel((err, chan) => {
    var chanName = 'hello-kelinci-task';

    chan.assertQueue(chanName, {durable: true});
    chan.prefetch(1);

    console.log('[*] waiting for messages in %s. To exit press CTRL+C', chanName);

    chan.consume(chanName, (msg) => {
      const secs = msg.content.toString().split('.').length - 1;

      console.log(" [x] received %s", msg.content.toString());
      setTimeout(_=> {
        console.log(" [x] Done");
        chan.ack(msg);
      }, secs * 1000);
    }, {noAck: false});
  });
})
