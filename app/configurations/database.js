const mongoose = require('mongoose')

module.exports = supdb = mongoose.createConnection(Configuration.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
