const jwt = require('jsonwebtoken');


module.exports = (req, res, next) => {
	const authHeader = req.get('Authorization');

	if (!authHeader) {
		req.isAuth = false;
		return next();
	}

	const token = authHeader.split()[1];

	if (!token || token === '') {
		req.isAuth = false;
		return next();
	}

	let decodedToken;

	try {
		decodedToken = jwt.verify(token, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZWJlNzM2MTBhNzZmMDM1ZjQ1NzFiZDciLCJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJpYXQiOjE1OTEwMTUwMDQsImV4cCI6MTU5MTAxODYwNH0.iexAX0hwM38bC1kh4AAUjRmUVN5XQ8tqW_49m4O7DDE');
	} catch (error) {
		req.isAuth = false;
		return next();
	}

	if (!decodedToken) {
		req.isAuth = false;
		return next();
	}

	req.isAuth = true;
	req.userId = decodedToken.userId;
	
	next();
};