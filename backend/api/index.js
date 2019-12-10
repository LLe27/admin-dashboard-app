const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const PORT = process.env.PORT || 8080;

// App and Routes
const app = express();
const auth = require('./routes/auth');
const users = require('./routes/users');

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use('/api/auth', auth);
app.use('/api/users', users);

app.listen(PORT, () => {
    console.log(`Running on PORT:${PORT}`);
});