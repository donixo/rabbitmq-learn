'use strict';

const amqp = require('amqplib/callback_api');

const args = process.argv.slice(2);

if (args.length == 0) {
  console.log("usage: receive_logs_topic.js <facility>.<severity>");
  process.exit(1);
}

amqp.connect('amqp://localhost', (err, conn) => {
  conn.createChannel((err, chan) => {
    const exchange = 'logs';

    chan.assertExchange(exchange, 'topic', {durable: false});

    chan.assertQueue('', {exclusive: true}, (err, q) => {
      console.log(" [*] waiting for logs. to exit press Ctrl+C");

      args.forEach(key => {
        chan.bindQueue(q.queue, exchange, key);
      });

      chan.consume(q.queue, (msg) => {
        console.log(" [x] %s: %s", msg.fields.routingKey, msg.content.toString());
      }, {noAck: true});
    });
  });
});
