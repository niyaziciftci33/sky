module.exports = {

  name: 'Test App',
  type: 2,

  requiredUserPermissions: ['ADMINISTRATOR'],
  // requiredClientPermissions: false,

  // disabled: false,
  // developerOnly: false,

  run: async (ctx) => {

    let member = await ctx.interaction.guild.members.cache.get(ctx.interaction.targetId);

    ctx.interaction.followUp({ content: `${ctx.function.emoji(ctx.config.emoji.confirmation)} ${member}`});
  },
};