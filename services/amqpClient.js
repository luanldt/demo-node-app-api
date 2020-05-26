import amqp from "amqplib/callback_api"

const MOVIE_QUEUE_REQ = "movie.req"
const MOVIE_QUEUE_RES = "movie.res"

const url = 'amqp://rabbitmq'

const createClient = () => {
	return new Promise((resolve, reject) => {
		amqp.connect(url, (err, conn) => {
			if (err) return reject(err)
			conn.createChannel((err, channel) => {
				if (err) return reject(err)
				resolve(channel)
			})
		})
	});
}

const sentToQueue = (channel, message, reply) => {


	channel.assertQueue('', {
		exclusive: true
	}, function(err, q) {

		var correlationId = generateUuid();

    // channel.prefetch(1);

		console.log(err);

		channel.consume(q.queue, function(msg) {
			console.log("Queue has data...", msg.properties.correlationId, correlationId)
			if (msg.properties.correlationId == correlationId) {
				reply(JSON.parse(msg.content.toString()))
				// console.log(' [.] Got %s', msg.content.toString());
			}
		}, {
			noAck: true
		}, function() {
			console.log(q.queue)
			channel.sendToQueue(MOVIE_QUEUE_REQ, new Buffer(message), {
				replyTo: q.queue,
				correlationId: correlationId
			})
		});




	})

}

function generateUuid() {
  return Math.random().toString();
}

export default {
	createClient,
 	sentToQueue
}
