'use strict';

const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', (err, conn) => {
  conn.createChannel((err, chan) => {
    const ex  = 'logs';
    const args = process.argv.slice(2);
    const key = (args.length > 0) ? args[0] : 'anonymous.info';
    const msg = args.slice(1).join(' ') || 'hello world';

    chan.assertExchange(ex, 'topic', {durable: false});
    chan.publish(ex, key, new Buffer(msg));
    console.log(" [x] Sent %s: '%s'", key, msg);
  });

  setTimeout(_=> {
    conn.close();
    process.exit(0);
  }, 300);
});
