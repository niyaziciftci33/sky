const ctx = new (require('../interfaces/context.js'));

module.exports = {
  
  name: 'ready',
  disabled: false,

  run: async (client) => {

    client.guilds.cache.forEach(async (guild) => {

      guild.members.cache.forEach(async (member) => {
  
        let fetch = await ctx.model.mute.findOne({ guild: guild.id, user: member.id });
        let muted = guild.roles.cache.find((role) => role.name == 'Muted');
  
        if (!fetch) return;
        
        if ((Date.now() <= fetch.endDate) || fetch) {
  
          setTimeout(async () => {
  
            if (!guild.members.cache.has(member.id)) return await ctx.model.mute.findOne({ guild: guild.id, user: member.id }).deleteOne().catch((error) => console.log(error));
            if (!muted) return await ctx.model.mute.findOne({ guild: guild.id, user: member.id }).deleteOne().catch((error) => console.log(error));
            if (member.roles.highest.position >= guild.me.roles.highest.position) return await ctx.model.mute.findOne({ guild: guild.id, user: member.id }).deleteOne().catch((error) => console.log(error));
            if (muted.position >= guild.me.roles.highest.position) return await ctx.model.mute.findOne({ guild: guild.id, user: member.id }).deleteOne().catch((error) => console.log(error));
  
            await ctx.model.mute.findOne({ guild: guild.id, user: member.id }).deleteOne().catch((error) => console.log(error));
            
            await member.roles.remove(muted);
  
          }, fetch.endDate - Date.now());
        };
      });
    });
  },
};