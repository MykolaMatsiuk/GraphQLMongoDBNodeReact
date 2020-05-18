const Event = require('../../models/event');
const User = require('../../models/user');

const events = async eventIds => {
	try {
		const events = await Event.find({ _id: { $in: eventIds } });
		return events.map(event => {
			return transformEvent(event);
		})
	} catch (error) {
		throw error;
	}
};

const singleEvent = async eventId => {
	try {
		const event = await Event.findById(eventId);
		return transformEvent(event);
	} catch (error) {
		throw error;
	}
};

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
};

const transformEvent = event => ({
	...event._doc,
	date: dateToString(event._doc.date),
	creator: user.bind(this, event.creator)
});

// exports.events = events;
exports.singleEvent = singleEvent;
// exports.user = user;