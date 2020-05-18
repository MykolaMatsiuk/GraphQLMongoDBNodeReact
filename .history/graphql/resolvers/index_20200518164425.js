const bcrypt = require('bcryptjs');

const Event = require('../../models/event');
const User = require('../../models/user');
const Booking = require('../../models/booking');
const { dateToString } = require('../../helpers/date');

module.exports = {
	bookings: async () => {
		try {
			const bookings = await Booking.find();

			return bookings.map(booking => transformBooking(booking));
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
		try {
			const fetchedEvent = await Event.findOne({ _id: args.eventId });
			const booking = new Booking({
				user: '5ec256b44e76af1bc0ee0890',
				event: fetchedEvent
			})
			const result = await booking.save();

			return transformBooking(result);
		} catch (error) {
			throw error;
		}
	},
	cancelBooking: async args => {
		try {
			const booking = await Booking.findById(args.bookingId).populate('event');
			const event = transformEvent(booking.event);

			await Booking.deleteOne({ _id: args.bookingId });
			return event;
		} catch (error) {
			throw error;
		}
	}
}