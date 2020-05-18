const bcrypt = require('bcryptjs');

const Event = require('../../models/event');
const User = require('../../models/user');
const Booking = require('../../models/booking');


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
	} catch (error) {
		throw error;
	}
}

const user = async userId => {
	try {
		const user = await User.findById(userId);
		return { 
			...user._doc,
			createdEvents: events.bind(this, user.createdEvents)
		};
	} catch (error) {
		throw error;
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
		} catch (error) {
			throw error;
		};
	},
	bookings: async () => {
		try {
			const bookings = await Booking.find();
			return bookings.map(booking => ({
				...booking._doc,
				createdAt: new Date(booking._doc.createdAt).toISOString(),
				updatedAt: new Date(booking._doc.updatedAt).toISOString()
			}));
		} catch (error) {
			throw error;
		}
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
			const creator = await User.findById('5ec256b44e76af1bc0ee0890');

			if (!creator) {
				throw new Error('User not found.');
			}
			creator.createdEvents.push(event);
			await creator.save();

			return createdEvent;
		} catch (error) {
			throw error;
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
		} catch (error) {
			throw error;
		}
	},
	bookEvent: async args => {
		const fetchedEvent = await Event.findOne({ _id: args.eventId });
		const booking = new Booking({
			user: '5ec256b44e76af1bc0ee0890',
			event: fetchedEvent._doc._id
		})
	}
}