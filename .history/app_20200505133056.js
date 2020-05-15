const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();

app.use(bodyParser.json());

app.get('/', (req, res, next) => res.send('Hello World'));

app.get('/graphql',
	graphqlHttp({
		schema: null,
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
	})
);

app.listen(3000);