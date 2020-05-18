const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Event = require('./models/event');
const User = require('./models/user');

const app = express();

app.use(bodyParser.json());

const events = eventIds => {
	return Event.find({ _id: { $in: eventIds } })
		.then(events => {
			return events.map(event => {
				return { 
					...event._doc,
					creator: user.bind(this, event.creator)
				};
			})
		})
		.catch(err => {
			throw err;
		});
}

const user = userId => {
	return User.findById(userId)
		.then(user => {
			return { 
				...user._doc,
				createdEvents: events.bind(this, user.createdEvents)
			};
		})
		.catch(err => {
			throw err
		})
}

app.use('/graphql',
	graphqlHttp({
		schema: ,
		rootValue: ,
		graphiql: true
	})
);

mongoose.connect(
	`mongodb+srv://${process.env.MONGO_USER}:${
		process.env.MONGO_PASSWORD
	}@cluster0-wmnk7.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
).then(() => {
	app.listen(3000);
}).catch(err => console.log(err));
