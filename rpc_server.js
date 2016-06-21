var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', (err, conn) => {
  if (err) {
    return console.log(err.code + ' tidak dapat terkoneksi dgn server');
  }

  conn.createChannel((err, chan) => {
    var q = 'rpc_queue';

    chan.assertQueue(q, {durable: false});
    chan.prefetch(1); //spread the load equal over multiple server

    console.log(' [x] awaiting RPC request');
    chan.consume(q, (msg) => {
      const n = parseInt(msg.content.toString());
      console.log(" [.] fib(%d)", n);

      const r = fibonacci(n);
      chan.sendToQueue(
        msg.properties.replyTo, 
        new Buffer(r.toString()), 
        {correlationId: msg.properties.correlationId}
      );

      chan.ack(msg);
    });
  });
});

function fibonacci(n) {
  if (n == 0 || n == 1) {
    return n;
  }

  return fibonacci(n - 1) + fibonacci(n - 2);
}
