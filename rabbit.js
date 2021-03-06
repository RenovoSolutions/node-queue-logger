var Rx = require('rx');
var rabbit = require('amqp');

module.exports = {
	configure: function(config) {
		var exchangeStream = new Rx.Subject();

		var connection = rabbit.createConnection({ host: config.host, login: config.login, password: config.password });
		var connected = Rx.Observable.fromEvent(connection, 'ready');
		connected.subscribe(function() {
			connection.exchange(config.exchange, {
				type: 'direct',
				durable: true,
				autoDelete: false,
			}, function(exchange) {
				exchangeStream.onNext(exchange);
			});
		}, function(error) {
			console.log('- an error occurred connecting to rabbit -');
			if (error) { console.log(error); }
		});

		return exchangeStream;
	}
};
