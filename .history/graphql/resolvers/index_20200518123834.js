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

const user = async userId => {
	try {
		const user = await User.findById(userId);
		return { 
			...user._doc,
			createdEvents: events.bind(this, user.createdEvents)
		};
	} catch (err) {
		throw err;
	}
}

module.exports = {
	events: async () => {
		try {
			const events = await Event.find()
			return events.map(event => ({ 
				...event._doc,
				date: new Date(event._doc.date).toISOString(),
				creator: user.bind(this, event._doc.creator)
			}));
		} catch (err) {
			throw err;
		};
	},
	createEvent: async args => {
		const event = new Event({
			title: args.eventInput.title,
			description: args.eventInput.description,
			price: +args.eventInput.price,
			date: new Date(args.eventInput.date),
			creator: '5ec256b44e76af1bc0ee0890'
		});

		let createdEvent;

		try {
			const res = await event.save();
			createdEvent = {
				...res._doc,
				date: new Date(res._doc.date).toISOString(),
				creator: user.bind(this, res._doc.creator)
			};
			const user = await User.findById('5ec256b44e76af1bc0ee0890');

			if (!user) {
				throw new Error('User not found.');
			}
			user.createdEvents.push(event);
			await user.save();

			return createdEvent;
		} catch (err) {
			throw err;
		}
	},
	createUser: async args => {
		try {
			const existingUser = await User.findOne({ email: args.userInput.email });
			if (existingUser) {
				throw new Error('User exists already.');
			}
			const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
			const user = new User({
				email: args.userInput.email,
				password: hashedPassword
			});
			const res = await user.save();
			return { ...res._doc, password: null };
		} catch (err) {
			throw err;
		}
	}
}