const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();

app.use(bodyParser.json());

app.use('/', () => 'Hello World');

app.get('/graphql', graphqlHttp({
	schema: buildSchema(`
		type RootQuery {
			events: [String!]!
		}

		type RootMutation {
			createEvent(name: String): String
		}

		schema {
			query: RootQuery
			mutation: RootMutation
		}
	`),
	rootValue: {
		events: () => {
			return ['Cooking', 'Dancing', 'Coding'];
		},
		createEvent: (args) => {
			const eventName = args.name;
			return eventName;
		}
	},
	graphiql: true
}));

app.listen(3000);