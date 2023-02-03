import express from 'express';
import bcrypt from 'bcrypt';

const app = express();

app.use(express.json());

const users = [];

app.get('/users', (req, res) => {
  res.json(users);
});

app.post('/users/create', async (req, res) => {
  try {
    const { username, password } = req.body;

    const isUserAlreadyRegistered = users.find(user => user.username === username);

    if (isUserAlreadyRegistered) {
      return res.status(302).send({
        message: 'This username is already in use'
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = {
      username,
      password: hashedPassword
    };

    users.push(newUser);

    res.status(201).send({
      message: 'User created successfully'
    });

    console.log(users);
  } catch (err) {
    console.log(err);
    res.status(400).send({
      message: 'Invalid data'
    });
  }
});

app.post('/users/login', async (req, res) => {
  const { username, password } = req.body;

  const foundUser = users.find(user => user.username === username);

  if (!foundUser) {
    return res.status(400).send({
      message: 'User or Password incorrect'
    });
  }

  try {
    const isPasswordCorrect = await bcrypt.compare(password, foundUser.password);

    if (isPasswordCorrect) {
      res.send({
        message: 'Login successfully'
      });
    } else {
      res.send({
        message: 'User or Password incorrect'
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: 'Server error'
    });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
