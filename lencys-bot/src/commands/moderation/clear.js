module.exports = {

  name: 'clear',
  description: 'Deletes the specified number of messages in the channel.',
  type: 1,
  options: [
    {
      name: 'number',
      description: 'Number of messages to be deleted.',
      type: 4,
      required: true,
    },
  ],

  cooldown: 5,

  category: 'moderation',
  usage: ['<number>'],

  ownerOnly: false,
  requiredUserPermissions: ['MANAGE_MESSAGES'],
  requiredClientPermissions: ['ADMINISTRATOR'],

  disabled: false,
  developerOnly: false,
  
  run: async (ctx) => {

    let number = ctx.interaction.options.getInteger('number');

    if (number < 1) return ctx.reply.error({ content: `The number of messages to be deleted cannot be less than \`1\`.` });
    if (number > 100) return ctx.reply.error({ content: `The number of messages to be deleted cannot exceed \`100\`.` });

    let messages = await ctx.interaction.channel.messages.fetch({ limit: number })
    let filter = messages.filter((message) => Date.now() - message.createdTimestamp < ctx.module.ms('14 days'));

    await ctx.interaction.channel.bulkDelete(filter);

    ctx.reply.confirmation({ content: `Deleted \`${filter.size}\` messages.`, timeout: 3500 });
  },
};