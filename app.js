const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const https = require('https');
const axios = require('axios');
const auth = require('./middleware/auth')
const connection = require('./config/sql-database');
const app = express();
const PORT = process.env.PORT || 5000;

// set body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());

app.post('/api/login', (req, res) => {
  // res.header("Access-Control-Allow-Origin", "*");

  const { username, password } = req.body;

  connection.query('SELECT * FROM users WHERE username = ?', [username], (error, results) => {
    if (error) {
      console.log('Error getting user from database:', error);
      res.sendStatus(500);
    } else if (results.length === 0) {
      res.status(401).send('Invalid username or password');
    } else {
      const user = results[0];

      if (password == user.password) {
        const token = jwt.sign({ id: user.id, username: user.username }, 'my-secret-key', { expiresIn: '1h' });
        connection.query('UPDATE users SET token = ? WHERE id = ?', [token, user.id], (error) => {
          if (error) {
            console.log('Error updating user token:', error);
            res.sendStatus(500);
          } else {
            res.status(200).json({
              token
            })
          }
        });
      } else {
        res.status(401).send('Invalid username or password');
      }

      // bcrypt.compare(password, user.password, (error, isMatch) => {
      //   if (error) {
      //     console.log('Error comparing passwords:', error);
      //     res.sendStatus(500);
      //   } else if (!isMatch) {
      //     console.log(error);
      //     res.status(401).send('Invalid username or password');
      //   } else {
      //     const token = jwt.sign({ userId: user.id }, 'my-secret-key', { expiresIn: '1h' });
      //     connection.query('UPDATE users SET token = ? WHERE id = ?', [token, user.id], (error) => {
      //       if (error) {
      //         console.log('Error updating user token:', error);
      //         res.sendStatus(500);
      //       } else {
      //         res.send({ token });
      //       }
      //     });
      //   }
      // });
    }
  });
});

// with headers my-secret-key
app.post('/api/logout', auth.verifyToken, (req, res) => {
  const { username } = req.body;

  connection.query('UPDATE users SET token = NULL WHERE username = ?', [username], (error) => {
    if (error) {
      console.log('Error deleting user token:', error);
      res.sendStatus(500);
    } else {
      res.sendStatus(200);
    }
  });
});

app.get('/api/jobs', auth.verifyToken, async (req, res) => {
  try {
    const { description, location, type, page } = req.query;

    // with page parameters
    if (page) {
      const response = await axios.get(`http://dev3.dansmultipro.co.id/api/recruitment/positions.json?page=${page}`)
      res.status(200).json(response.data);
      return
    }

    // with search parameters
    if (description || location || type ) {
      let params = {
        desc: description ? 'description='+description : '',
        loc: location ? 'location='+location : '',
        type: type ? 'type='+type : ''
      }

      const response = await axios.get(`http://dev3.dansmultipro.co.id/api/recruitment/positions.json?${params.desc + params.loc + params.type}`)
      res.status(200).json(response.data);
      return
    }

    // all jobs
    const response = await axios.get('http://dev3.dansmultipro.co.id/api/recruitment/positions.json')
    res.status(200).json(response.data);
  }

  catch (err) {
    console.log(err);

    return res.json({
      error: 1,
      message: err.message
    });
  }
});

app.get('/api/jobs/:id', auth.verifyToken, async (req, res) => {
  try {
    const response = await axios.get(`http://dev3.dansmultipro.co.id/api/recruitment/positions/${req.params.id}`)
    res.status(200).json(response.data);
  } catch (err) {
    console.log(err);

    return res.json({
      error: 1,
      message: err.message
    });
  }
});

// server
app.listen(PORT, () => console.log(`Server running at port: ${PORT}`));