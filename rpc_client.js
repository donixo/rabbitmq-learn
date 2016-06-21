"use strict";

const amqp = require('amqplib/callback_api');

const args = process.argv.slice(2);

if (args.length == 0) {
  console.log("usage: rpc_client.js num");
  process.exit(1);
}

amqp.connect('amqp://localhost', (err, conn) => {
  if (err) {
    return new Error('tidak dapat terkoneksi dengan queue server');
  }

  conn.createChannel((err, chan) => {
    if (err) {
      return new Error('tidak dapat membuat channel');
    }

    chan.assertQueue('', {exclusive: true}, (err, q) => {
      const corr = generateUuid();
      const num = parseInt(args[0]);

      console.log(' [x] Requesting  fib(%d)', num);

      chan.consume(q.queue, (msg) => {
        if (msg.properties.correlationId == corr) {
          console.log(' [.] Got %s', msg.content.toString());
          setTimeout(_=> {
            conn.close();
            process.exit(0);
          }, 500);
        }
      }, {noAck: true});

      chan.sendToQueue(
        'rpc_queue', 
        new Buffer(num.toString()),
        {correlationId: corr, replyTo: q.queue}
      );

    });
  });
});

function generateUuid() {
  return Math.random().toString() + 
    Math.random().toString() +
    Math.random().toString();
}
