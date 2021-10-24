const chalk = require('chalk');
const moment = require('moment-timezone');

module.exports = {

  data: {

    developers: ['ID'],
    token: 'TOKEN',
    database: 'MONGODB URL',
  },

  activity: {
    
    status: 'online',
    
    name: '/help',
    type: 'COMPETING',
  },

  color: {

    default: '#2F3136',

    confirmation: '#57F287',
    error: '#ED4245',

    info: '#5865F2',
  },

  emoji: {

    transparent: '875274727965462528',

    confirmation: '890905185583497276',
    error: '890905185398980641',

    button: {

      approve: '890905185508016158',
      reject: '890905186200084540',

      first: '890905185218600980',
      previous: '890905185260544020',
      next: '890905184883064883',
      last: '890905185398980638',

      delete: '890961676319457351',
    },

    guild: {
      
      tier_1: '876756659551227904',
      tier_2: '876756662281699338',
      tier_3: '876756661891641355',
    },

    badge: {

      discord_employee: '875650347446710292',
      partnered_server_owner: '875650433572564992',
      discord_certified_moderator: '875650446000283658',
      hypeSquad_events: '875650515151761420',
  
      house_bravery: '875650549482156073',
      house_brilliance: '875650570504003617',
      house_balance: '875650584101928981',
  
      bugHunter_level_1: '875650614930051122',
      bugHunter_level_2: '875650630293815317',
  
      early_verified_bot_developer: '875650694714109962',
      early_supporter: '875650742277537803',

      nitro_subscriber: '875650765706907669',
    },
  },

  log: {

    time: `${chalk.bold.hex('#FFFFFF')(`${moment().tz('Europe/Istanbul').format('hh:mm:ss')}`)}`,
  },
};
