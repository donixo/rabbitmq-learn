'use strict';

var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', (err, conn) => {
  conn.createChannel((err, chan) => {
    var exchange = 'direct_logs';

    var args     = process.argv.slice(2);
    var msg      = args.slice(1).join(' ') || 'hello world logs';
    var severity = (args.length > 0) ? args[0] : 'info';

    chan.assertExchange(exchange, 'direct', {durable: false});
    chan.publish(exchange, severity, new Buffer(msg));

    console.log(" [x] Sent %s: %s", severity, msg);
  });

  setTimeout(() => {
    conn.close();
    process.exit(0);
  }, 300);
});
