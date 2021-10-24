module.exports = {

  name: 'unban',
  description: 'Unbans user from the server.',
  type: 1,
  options: [
    {
      name: 'user',
      description: 'User identity.',
      type: 6,
      required: true,
    },
  ],

  cooldown: 5,

  category: 'moderation',
  usage: ['<user-id>'],

  ownerOnly: false,
  requiredUserPermissions: ['BAN_MEMBERS'],
  requiredClientPermissions: ['ADMINISTRATOR'],

  disabled: false,
  developerOnly: false,
  
  run: async (ctx) => {

    let user = ctx.interaction.options.getUser('user');
  
    if (user.id == ctx.interaction.user.id) return ctx.reply.error({ content: `You cannot perform this action on yourself.` });
    if (user.id == ctx.client.user.id) return ctx.reply.error({ content: `You cannot perform this action on the bot.` });
    if (!await ctx.interaction.guild.bans.fetch().then(async (banneds) => banneds.find((value) => value.user.id == user.id))) return ctx.reply.error({ content: `You can only use this command on banned users.` });
  
    ctx.interaction.guild.members.unban(user);
  
    ctx.reply.confirmation({ content: `\`${ctx.case.filter(user.tag)}\` has been unbanned from the server.` });
  },
};