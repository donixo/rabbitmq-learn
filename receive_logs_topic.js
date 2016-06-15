'use strict';

const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', (err, conn) => {
  conn.createChannel((err, chan) => {
    const exchange = 'logs';

    chan.assertExchange(exchange, 'fanout', {durable: false});

    chan.assertQueue('', {exclusive: true}, (err, qManager) => {
      console.log(' [*] waiting for messages in %s. To exit press CTRL+C', qManager.queue);
      chan.bindQueue(qManager.queue, exchange, '');

      chan.consume(qManager.queue, (msg) => {
        console.log(" [x] %s", msg.content.toString());
      }, {noAck: true});
    });
  });
});
