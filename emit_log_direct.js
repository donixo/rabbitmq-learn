'use strict';

const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', (err, conn) => {
  conn.createChannel((err, chan) => {
    const exchange = 'direct_logs';

    const args     = process.argv.slice(2);
    const msg      = args.slice(1).join(' ') || 'hello world logs';
    const severity = (args.length > 0) ? args[0] : 'info';

    chan.assertExchange(exchange, 'direct', {durable: false});
    chan.publish(exchange, severity, new Buffer(msg));

    console.log(" [x] Sent %s: %s", severity, msg);
  });

  setTimeout(() => {
    conn.close();
    process.exit(0);
  }, 300);
});
