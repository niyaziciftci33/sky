module.exports = {

  name: 'unmute',
  description: 'Unmutes the muted member.',
  type: 1,
  options: [
    {
      name: 'member',
      description: 'Member tag or identity.',
      type: 6,
      required: true,
    },
  ],

  cooldown: 5,

  category: 'moderation',
  usage: ['<member>'],

  ownerOnly: false,
  requiredUserPermissions: ['MANAGE_MESSAGES'],
  requiredClientPermissions: ['ADMINISTRATOR'],

  disabled: false,
  developerOnly: false,
  
  run: async (ctx) => {

    let user = ctx.interaction.options.getUser('member');
    let member = ctx.interaction.guild.members.cache.get(user.id);
    let muted = ctx.interaction.guild.roles.cache.find((role) => role.name == 'Muted');
  
    if (!member) return ctx.reply.error({ content: `This command can only be used on members.` });
    if (!muted) return ctx.reply.error({ content: `There is no \`Muted\` role on the server.` });
    if (user.id == ctx.interaction.user.id) return ctx.reply.error({ content: `You cannot perform this action on yourself.` });
    if (user.id == ctx.client.user.id) return ctx.reply.error({ content: `You cannot perform this action on the bot.` });
    if (!await ctx.model.mute.findOne({ guild: ctx.interaction.guild.id, user: user.id })) return ctx.reply.error({ content: `The user is not already muted.` });
    if (member.roles.highest.position >= ctx.interaction.guild.me.roles.highest.position) return ctx.reply.error({ content: `I can't access the user you want to mute.` });
    if (muted.position >= ctx.interaction.guild.me.roles.highest.position) return ctx.reply.error({ content: `I cannot access the \`Muted\` role.` });
  
    await ctx.model.mute.findOne({ guild: ctx.interaction.guild.id, user: user.id }).deleteOne().catch((error) => console.log(error));
  
    await member.roles.remove(muted);
  
    ctx.reply.confirmation({ content: `\`${ctx.case.filter(user.tag)}\` has been unmuted on the server.` });
  },
};
