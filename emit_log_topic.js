'use strict';

const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', (err, conn) => {
  conn.createChannel((err, chan) => {
    const exchange = 'logs';
    const msg = process.argv.slice(2).join(' ') || 'no message is a good message';

    chan.assertExchange(exchange, 'fanout', {durable: false});
    chan.publish(exchange, '', new Buffer(msg));

    console.log("[x] Sent %s", msg);
  });

  setTimeout(_=> {
    conn.close();
    process.exit(0);
  }, 300);
});
