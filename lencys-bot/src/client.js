const ctx = new (require('./interfaces/context.js'));

const { Client, Collection } = require('discord.js');

module.exports = class extends Client {

  constructor() {
    super({

      intents: [
        'GUILDS',
        'GUILD_MEMBERS',
        'GUILD_BANS',
        'GUILD_EMOJIS_AND_STICKERS',
        'GUILD_INTEGRATIONS',
        'GUILD_WEBHOOKS',
        'GUILD_INVITES',
        'GUILD_VOICE_STATES',
        'GUILD_PRESENCES',
        'GUILD_MESSAGES',
        'GUILD_MESSAGE_REACTIONS',
        'GUILD_MESSAGE_TYPING',
        'DIRECT_MESSAGES',
        'DIRECT_MESSAGE_REACTIONS',
        'DIRECT_MESSAGE_TYPING',
      ],
      allowedMentions: {
        repliedUser: false,
        parse: [
          'users',
          'roles',
          'everyone', 
        ],
      },
      presence: {
        status: ctx.config.activity.status,
        activities: [
          {
            name: ctx.config.activity.name,
            type: ctx.config.activity.type,
          },
        ],
      },
      restTimeOffset: 100,
      partials: [
        'MESSAGE',
        'CHANNEL',
        'REACTION',
      ],
    });

    this.commands = new Collection();
    this.apps = new Collection();

    this.cooldowns = new Collection();
  };

  async loader() {

    await require('./loaders/events.js')(this);
    await require('./loaders/apps.js')(this);
    await require('./loaders/commands.js')(this);
    await require('./loaders/database.js')(this);

    await this.login(ctx.config.data.token);
  };
};
