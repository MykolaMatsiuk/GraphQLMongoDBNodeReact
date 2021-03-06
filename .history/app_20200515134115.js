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

app.use('/graphql',
	graphqlHttp({
		schema: buildSchema(`
			type Event {
				_id: ID!
				title: String!
				description: String!
				price: Float!
				date: String!
			}

			type User {
				_id: ID!
				email: String!
				password: String
			}

			input EventInput {
				title: String!
				description: String!
				price: Float!
				date: String!
			}

			input UserInput {
				email: String!
				password: String!
			}

			type RootQuery {
				events: [Event!]!
			}
			
			type RootMutation {
				createEvent(eventInput: EventInput): Event
				createUser(userInput: UserInput): User
			}
			
			schema {
				query: RootQuery
				mutation: RootMutation
			}
		`),
		rootValue: {
			events: () => {
				return Event.find().then(events => {
					return events.map(event => ({ ...event._doc }));
				}).catch(err => {
					throw err;
				});
			},
			createEvent: args => {
				const event = new Event({
					title: args.eventInput.title,
					description: args.eventInput.description,
					price: +args.eventInput.price,
					date: new Date(args.eventInput.date)
				});

				return event.save().then(res => {
					console.log(res);
					return { ...res._doc };
				}).catch(err => {
					console.log(err);
					throw err;
				});
			},
			createUser: args => {
				return bcrypt
					.hash(args.userInput.password, 12)
					.then(hashedPassword => {
						const user = new User({
							email: args.userInput.email,
							password: hashedPassword
						})
					})
					.catch(err => {
						throw err;
					});
			}
		},
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
