const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../models/user');


module.exports = {
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
	login: async ({ email, password }) => {
		const user = await User.findOne({ email });

		if (!user) throw new Error('User does not exist!');

		const isEqual = await bcrypt.compare(password, user.password);

		if (!isEqual) throw new Error('Password is incorrect!');

		const token = jwt.sign(
			{ userId: user.id, email: user.email },
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZWJlNzM2MTBhNzZmMDM1ZjQ1NzFiZDciLCJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJpYXQiOjE1OTEwMTUwMDQsImV4cCI6MTU5MTAxODYwNH0.iexAX0hwM38bC1kh4AAUjRmUVN5XQ8tqW_49m4O7DDE',
			{ expiresIn: '1h' }
		);

		return {
			userId: user.id,
			token,
			tokenExpiration: 1
		};
	}
}