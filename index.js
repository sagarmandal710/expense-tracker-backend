const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv')
dotenv.config({path: './config.env'});

const app = express();
app.use(express.json());
app.use(cors());

// connect to mongodb atlas
require('./db.js');
// import routes
app.use(require('./routes/user.routes.js'));
app.use(require('./routes/expense.routes.js'));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server started at port number ${PORT}`);
})