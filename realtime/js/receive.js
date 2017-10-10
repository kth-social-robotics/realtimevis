var amqp = require('amqp');

var connection = amqp.createConnection({host: "130.237.67.202", port: 5672, login: 'test', password: 'test'});

connection.on('ready', function(){
    connection.queue('queue-name', function(queue) {
        _queue = queue;

        // Bind to the exchange
        queue.bind('pre-processor', 'mocap.processing.*');

        console.log(' [*] Waiting for messages from NODEJS. To exit press CTRL+C');

        queue.subscribe(function(msg){
            var body = msg.data.toString('utf-8');
            console.log(body)
        });
    });
});
