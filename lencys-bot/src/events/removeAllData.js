const ctx = new (require('../interfaces/context.js'));

const muteModel = require('../models/mute.js');

module.exports = {
  
  name: 'guildDelete',
  disabled: false,

  run: async (client, guild) => {

    await muteModel.deleteMany({ guild: guild.id }).catch((error) => console.log(error));
  },
};