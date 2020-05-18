const Event = require('../../models/event');
const { dateToString } = require('../../helpers/date');

const transformEvent = event => ({
	...event._doc,
	date: dateToString(event._doc.date),
	creator: user.bind(this, event.creator)
});

module.exports = {
	events: async () => {
		try {
			const events = await Event.find();

			return events.map(event => transformEvent(event));
		} catch (error) {
			throw error;
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
			createdEvent = transformEvent(res);

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
	}
}