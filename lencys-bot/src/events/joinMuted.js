const ctx = new (require('../interfaces/context.js'));

module.exports = {

  name: 'guildMemberAdd',
  disabled: false,

  run: async (client, member) => {

    let fetch = await ctx.model.mute.findOne({ guild: member.guild.id, user: member.id });
    let muted = member.guild.roles.cache.find((role) => role.name == 'Muted');

    if (!fetch) return;

    if ((Date.now() <= fetch.endDate) || fetch) {

      if (!muted) return await ctx.model.mute.findOne({ guild: member.guild.id, user: member.id }).deleteOne().catch((error) => console.log(error));
      if (member.roles.highest.position >= member.guild.me.roles.highest.position) return await ctx.model.mute.findOne({ guild: member.guild.id, user: member.id }).deleteOne().catch((error) => console.log(error));
      if (muted.position >= member.guild.me.roles.highest.position) return await ctx.model.mute.findOne({ guild: member.guild.id, user: member.id }).deleteOne().catch((error) => console.log(error));

      await member.roles.add(muted);

      setTimeout(async () => {

        if (!muted) return await ctx.model.mute.findOne({ guild: member.guild.id, user: member.id }).deleteOne().catch((error) => console.log(error));
        if (member.roles.highest.position >= member.guild.me.roles.highest.position) return await ctx.model.mute.findOne({ guild: member.guild.id, user: member.id }).deleteOne().catch((error) => console.log(error));
        if (muted.position >= member.guild.me.roles.highest.position) return await ctx.model.mute.findOne({ guild: member.guild.id, user: member.id }).deleteOne().catch((error) => console.log(error));

        await ctx.model.mute.findOne({ guild: member.guild.id, user: member.id }).deleteOne().catch((error) => console.log(error));

        await member.roles.remove(muted);

      }, fetch.endDate - Date.now());
    };
  },
};
