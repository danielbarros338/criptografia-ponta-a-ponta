const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv-safe').config();

app.use(cors());
app.use(express.json());
app.use(express.static(`${process.cwd()}/public`));//Somente para desenvolvimento

require('../routes/routes')(app);     

module.exports = app