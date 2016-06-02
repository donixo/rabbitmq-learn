'use strict';

const amqp = require('amqplib/callback_api');
const args = process.argv.slice(2);

if (args.length == 0) {
  console.log("Usage: receive_logs_direct.js [info] [warning] [error]");
  return process.exit(0);
}

amqp.connect('amqp://localhost', (err, conn) => {
  conn.createChannel((err, chan) => {
    const exchange = 'direct_logs';

    chan.assertExchange(exchange, 'direct', {durable: false});

    chan.assertQueue('', {exclusive: true}, (err, qManager) => {
      console.log(' [*] Waiting for logs. To exit press CTRL+C');
      
      args.forEach((severity) => {
        chan.bindQueue(qManager.queue, exchange, severity);
      });

      chan.consume(qManager.queue, (msg) => {
        console.log(" [x] %s: '%s'", msg.fields.routingKey, msg.content.toString());
      }, {noAck: true});

    });
  });
});
