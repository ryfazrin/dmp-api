const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  // const token = req.headers.authorization;
  const token = req.body.token || req.query.token || req.headers["my-secret-key"];

  if (!token) {
    res.status(401).send('No token provided');
  } else {
    jwt.verify(token, 'my-secret-key', (error, decoded) => {
      if (error) {
        console.log('Error verifying token:', error);
        res.status(401).send('Invalid token');
      } else {
        req.username = decoded.username;
        next();
      }
    });
  }
};

module.exports = {
  verifyToken
}