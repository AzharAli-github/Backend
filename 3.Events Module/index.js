const EventEmitter = require('events');
const event = new EventEmitter();

event.on('sayHello', (sc, msg) => {
    console.log(`The status code is: ${sc} and the message is: ${msg}`);
});

event.emit('sayHello', 500, 'Hello World!');