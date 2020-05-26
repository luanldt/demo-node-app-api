import { Router } from "express"
import amqpClient from '../services/amqpClient'

const router = Router();

let channel;
amqpClient.createClient().then(ch => {
	channel = ch
})


router.get('/', (req, res) => {
	var param = {
		page: Number.parseInt(req.query.page) || 0,
		size: Number.parseInt(req.query.size) || 10,
	}
	console.log(param);
	amqpClient.sentToQueue(channel, JSON.stringify(param), function(data) {
		res.send(data)
	});
})

export default router;
