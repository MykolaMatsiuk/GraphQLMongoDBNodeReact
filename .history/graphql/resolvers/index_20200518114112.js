const bcrypt = require('bcryptjs');

const Event = require('../../models/event');
const User = require('../../models/user');


const events = async eventIds => {
	try {
		const events = await Event.find({ _id: { $in: eventIds } });
		return events.map(event => {
			return { 
				...event._doc,
				date: new Date(event._doc.date).toISOString(),
				creator: user.bind(this, event.creator)
			};
		})
	} catch (err) {
		throw err;
	}
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

module.exports = {
	events: () => {
		return Event.find()
			.then(events => {
				return events.map(event => ({ 
					...event._doc,
					date: new Date(event._doc.date).toISOString(),
					creator: user.bind(this, event._doc.creator)
				}));
			})
			.catch(err => {
				throw err;
			});
	},
	createEvent: args => {
		const event = new Event({
			title: args.eventInput.title,
			description: args.eventInput.description,
			price: +args.eventInput.price,
			date: new Date(args.eventInput.date),
			creator: '5ebe73610a76f035f4571bd7'
		});

		let createdEvent;

		return event
			.save()
			.then(res => {
				createdEvent = { 
					...res._doc,
					date: new Date(res._doc.date).toISOString(),
					creator: user.bind(this, res._doc.creator)
				};
				return User.findById('5ebe73610a76f035f4571bd7')
			})
			.then(user => {
				if (!user) {
					throw new Error('User not found.');
				}

				user.createdEvents.push(event);
				return user.save();
			})
			.then(result => {
				return createdEvent;
			})
			.catch(err => {
				throw err;
			});
	},
	createUser: args => {
		return User.findOne({ email: args.userInput.email })
			.then(user => {
				if (user) {
					throw new Error('User exists already.');
				}
				return bcrypt.hash(args.userInput.password, 12);
			})
			.then(hashedPassword => {
				const user = new User({
					email: args.userInput.email,
					password: hashedPassword
				});
				return user.save();
			})
			.then(res => {
				return { ...res._doc, password: null };
			})
			.catch(err => {
				throw err;
			});
	}
}