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

exports.events = events;
exports.singleEvent = singleEvent;
exports.user = user;