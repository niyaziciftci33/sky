const ctx = new (require('../interfaces/context.js'));

const mongoose = require('mongoose');

module.exports = async () => {

  mongoose.connect(ctx.config.data.database , { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: true });

  mongoose.connection.on('connected', () => {

    console.log(`${ctx.config.log.time} Connected to database.\n`);
  });

  mongoose.connection.on('error', () => {

    console.log(`${ctx.config.log.time} Dataabse connection error.\n`);
  });
};