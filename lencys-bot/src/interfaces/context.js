const config = require('../config.js');

const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

const chalk = require('chalk');

const util = require('util');
const ms = require('ms');

const mute = require('../models/mute.js');

module.exports = class Context {

  constructor(client, interaction) {

    this.client = client;
    this.interaction = interaction;
    this.config = config;

    this.module = {

      util,
      ms,
    };

    this.model = {

      mute,
    };

    this.reply = {

      confirmation ({ content, timeout }) {

        if (timeout) {
  
          interaction.reply({
            ephemeral: false,
            embeds: [
              new MessageEmbed()
              .setColor(config.color.confirmation)
              .setDescription(`${client.emojis.cache.get(config.emoji.confirmation)} ${content}`),
            ],
          }).then(async () => setTimeout(() => interaction.deleteReply(), timeout));

        } else if (!timeout) {

          interaction.reply({
            ephemeral: false,
            embeds: [
              new MessageEmbed()
              .setColor(config.color.confirmation)
              .setDescription(`${client.emojis.cache.get(config.emoji.confirmation)} ${content}`),
            ],
          });
        };
      },
    
      error ({ content }) {
    
        interaction.reply({
          ephemeral: true,
          embeds: [
            new MessageEmbed()
            .setColor(config.color.error)
            .setDescription(`${client.emojis.cache.get(config.emoji.error)} ${content}`),
          ],
        });
      },
    };

    this.followUp = {

      confirmation ({ content }) {
  
        interaction.followUp({
          ephemeral: false,
          embeds: [
            new MessageEmbed()
            .setColor(config.color.confirmation)
            .setDescription(`${client.emojis.cache.get(config.emoji.confirmation)} ${content}`),
          ],
        });
      },
    
      error ({ content }) {
    
        interaction.followUp({
          ephemeral: true,
          embeds: [
            new MessageEmbed()
            .setColor(config.color.error)
            .setDescription(`${client.emojis.cache.get(config.emoji.error)} ${content}`),
          ],
        });
      },
    };

    this.function = {

      emoji (value) {
  
        return client.emojis.cache.get(value);
      },
    
      timestamp (value) {
    
        return Math.floor(new Date(value).getTime() / 1000);
      },
    };

    this.case = {

      title (value) {
    
        return value.split(' ').map((word) => `${word[0].toUpperCase()}${word.slice(1).toLowerCase()}`).join(' ');
      },
    
      filter (value) {
    
        return value.replaceAll('*', '').replaceAll('_', '').replaceAll('--', '').replaceAll('~', '').replaceAll('`', '');
      },
    
      number (value) {
    
        return value.toLocaleString(undefined, { minimumFractionDigits: 0 });
      },
    };

    this.terminal = {

      color ({ text, hex, bold }) {
  
        return bold == true ? chalk.bold.hex(hex)(text) : chalk.hex(hex)(text);
      },
    };

    this.menu = {

      classic ({ content, embeds }) {

        interaction.reply({ 

          ephemeral: false,
          content: content,
          embeds: embeds,
          components: [
            new MessageActionRow().addComponents(
              new MessageButton({ style: 'DANGER', emoji: config.emoji.button.delete, customId: 'delete', disabled: false }),
            ),
          ],
        }).then(async () => {
    
          let fetch = await interaction.fetchReply();
    
          fetch.createMessageComponentCollector({ componentType: 'BUTTON', filter: (clicker) => clicker.user.id == interaction.user.id }).on('collect', async (button) => {
    
            if (button.customId == 'delete') {
    
              interaction.deleteReply();
    
              await button.deferUpdate();
            };
          });
        });
      },

      collector ({ content, embeds, components, collectButton, collectSelectMenu }) {
  
        interaction.reply({ ephemeral: false, content: content, embeds: embeds, components: components }).then(async () => {
      
          let fetch = await interaction.fetchReply();
      
          collectButton ? fetch.createMessageComponentCollector({ componentType: 'BUTTON', filter: (clicker) => clicker.user.id == interaction.user.id }).on('collect', collectButton) : '';
          collectSelectMenu ? fetch.createMessageComponentCollector({ componentType: 'SELECT_MENU', filter: (clicker) => clicker.user.id == interaction.user.id }).on('collect', collectSelectMenu) : '';
        });
      },

      editReply ({ content, embeds, components }) {
  
        interaction.editReply({ ephemeral: false, content: content, embeds: embeds, components: components });
      },

      pagination ({ pages, fastSkip }) {

        let page = 0;
        let checkPages

        if (!fastSkip || fastSkip == false) {

          if (page == pages.length -1) {

            checkPages = interaction.reply({ 

              embeds: [pages[page]],
              components: [
                new MessageActionRow().addComponents(
                  new MessageButton({ style: 'PRIMARY', emoji: config.emoji.button.previous, customId: 'previous', disabled: true }),
                  new MessageButton({ style: 'PRIMARY', emoji: config.emoji.button.next, customId: 'next', disabled: true }),
                  new MessageButton({ style: 'DANGER', emoji: config.emoji.button.delete, customId: 'delete', disabled: false }),
                ),
              ],
            });

          } else if (page !== pages.length -1) {
        
            checkPages = interaction.reply({

              embeds: [pages[page]],
              components: [
                new MessageActionRow().addComponents(
                  new MessageButton({ style: 'PRIMARY', emoji: config.emoji.button.previous, customId: 'previous', disabled: true }),
                  new MessageButton({ style: 'PRIMARY', emoji: config.emoji.button.next, customId: 'next', disabled: false }),
                  new MessageButton({ style: 'DANGER', emoji: config.emoji.button.delete, customId: 'delete', disabled: false }),
                ),
              ],
            })
          };
          
          checkPages.then(async () => {
        
            let fetch = await interaction.fetchReply();
        
            fetch.createMessageComponentCollector({ componentType: 'BUTTON', filter: (clicker) => clicker.user.id == interaction.user.id }).on('collect', async (button) => {
        
              if (button.customId == 'delete') {
        
                interaction.deleteReply();
        
                await button.deferUpdate();
        
              } else if (button.customId == 'previous') {
        
                page--
        
                if (page == 0) {
        
                  interaction.editReply({

                    embeds: [pages[page]],
                    components: [
                      new MessageActionRow().addComponents(
                        new MessageButton({ style: 'PRIMARY', emoji: config.emoji.button.previous, customId: 'previous', disabled: true }),
                        new MessageButton({ style: 'PRIMARY', emoji: config.emoji.button.next, customId: 'next', disabled: false }),
                        new MessageButton({ style: 'DANGER', emoji: config.emoji.button.delete, customId: 'delete', disabled: false }),
                      ),
                    ],
                  });
        
                } else if (page !== 0) {
        
                  interaction.editReply({

                    embeds: [pages[page]],
                    components: [
                      new MessageActionRow().addComponents(
                        new MessageButton({ style: 'PRIMARY', emoji: config.emoji.button.previous, customId: 'previous', disabled: false }),
                        new MessageButton({ style: 'PRIMARY', emoji: config.emoji.button.next, customId: 'next', disabled: false }),
                        new MessageButton({ style: 'DANGER', emoji: config.emoji.button.delete, customId: 'delete', disabled: false }),
                      ),
                    ],
                  });
                };
  
                await button.deferUpdate();
        
              } else if (button.customId == 'next') {
        
                page++
        
                if (page == pages.length -1) {
        
                  interaction.editReply({

                    embeds: [pages[page]],
                    components: [
                      new MessageActionRow().addComponents(
                        new MessageButton({ style: 'PRIMARY', emoji: config.emoji.button.previous, customId: 'previous', disabled: false }),
                        new MessageButton({ style: 'PRIMARY', emoji: config.emoji.button.next, customId: 'next', disabled: true }),
                        new MessageButton({ style: 'DANGER', emoji: config.emoji.button.delete, customId: 'delete', disabled: false }),
                      ),
                    ],
                  });
        
                } else if (page !== pages.length -1) {
        
                  interaction.editReply({

                    embeds: [pages[page]],
                    components: [
                      new MessageActionRow().addComponents(
                        new MessageButton({ style: 'PRIMARY', emoji: config.emoji.button.previous, customId: 'previous', disabled: false }),
                        new MessageButton({ style: 'PRIMARY', emoji: config.emoji.button.next, customId: 'next', disabled: false }),
                        new MessageButton({ style: 'DANGER', emoji: config.emoji.button.delete, customId: 'delete', disabled: false }),
                      ),
                    ],
                  });
                };
        
                await button.deferUpdate();
              };
            });
          });

        } else if (fastSkip == true) {

          if (page == pages.length -1) {

            checkPages = interaction.reply({

              embeds: [pages[page]],
              components: [
                new MessageActionRow().addComponents(
                  new MessageButton({ style: 'PRIMARY', emoji: config.emoji.button.first, customId: 'first', disabled: true }),
                  new MessageButton({ style: 'PRIMARY', emoji: config.emoji.button.previous, customId: 'previous', disabled: true }),
                  new MessageButton({ style: 'PRIMARY', emoji: config.emoji.button.next, customId: 'next', disabled: true }),
                  new MessageButton({ style: 'PRIMARY', emoji: config.emoji.button.last, customId: 'last', disabled: true }),
                  new MessageButton({ style: 'DANGER', emoji: config.emoji.button.delete, customId: 'delete', disabled: false }),
                ),
              ],
            });

          } else if (page !== pages.length -1) {
        
            checkPages = interaction.reply({

              embeds: [pages[page]],
              components: [
                new MessageActionRow().addComponents(
                  new MessageButton({ style: 'PRIMARY', emoji: config.emoji.button.first, customId: 'first', disabled: true }),
                  new MessageButton({ style: 'PRIMARY', emoji: config.emoji.button.previous, customId: 'previous', disabled: true }),
                  new MessageButton({ style: 'PRIMARY', emoji: config.emoji.button.next, customId: 'next', disabled: false }),
                  new MessageButton({ style: 'PRIMARY', emoji: config.emoji.button.last, customId: 'last', disabled: false }),
                  new MessageButton({ style: 'DANGER', emoji: config.emoji.button.delete, customId: 'delete', disabled: false }),
                ),
              ],
            })
          };
        
          checkPages.then(async () => {
        
            let fetch = await interaction.fetchReply();
        
            fetch.createMessageComponentCollector({ componentType: 'BUTTON', filter: (clicker) => clicker.user.id == interaction.user.id }).on('collect', async (button) => {
        
              if (button.customId == 'delete') {
        
                interaction.deleteReply();
        
                await button.deferUpdate();
        
              } else if (button.customId == 'first') {
        
                page = 0;
        
                interaction.editReply({

                  embeds: [pages[page]],
                  components: [
                    new MessageActionRow().addComponents(
                      new MessageButton({ style: 'PRIMARY', emoji: config.emoji.button.first, customId: 'first', disabled: true }),
                      new MessageButton({ style: 'PRIMARY', emoji: config.emoji.button.previous, customId: 'previous', disabled: true }),
                      new MessageButton({ style: 'PRIMARY', emoji: config.emoji.button.next, customId: 'next', disabled: false }),
                      new MessageButton({ style: 'PRIMARY', emoji: config.emoji.button.last, customId: 'last', disabled: false }),
                      new MessageButton({ style: 'DANGER', emoji: config.emoji.button.delete, customId: 'delete', disabled: false }),
                    ),
                  ],
                });
        
                await button.deferUpdate();
        
              } else if (button.customId == 'previous') {
        
                page--
        
                if (page == 0) {
        
                  interaction.editReply({

                    embeds: [pages[page]],
                    components: [
                      new MessageActionRow().addComponents(
                        new MessageButton({ style: 'PRIMARY', emoji: config.emoji.button.first, customId: 'first', disabled: true }),
                        new MessageButton({ style: 'PRIMARY', emoji: config.emoji.button.previous, customId: 'previous', disabled: true }),
                        new MessageButton({ style: 'PRIMARY', emoji: config.emoji.button.next, customId: 'next', disabled: false }),
                        new MessageButton({ style: 'PRIMARY', emoji: config.emoji.button.last, customId: 'last', disabled: false }),
                        new MessageButton({ style: 'DANGER', emoji: config.emoji.button.delete, customId: 'delete', disabled: false }),
                      ),
                    ],
                  });
        
                } else if (page !== 0) {
        
                  interaction.editReply({

                    embeds: [pages[page]],
                    components: [
                      new MessageActionRow().addComponents(
                        new MessageButton({ style: 'PRIMARY', emoji: config.emoji.button.first, customId: 'first', disabled: false }),
                        new MessageButton({ style: 'PRIMARY', emoji: config.emoji.button.previous, customId: 'previous', disabled: false }),
                        new MessageButton({ style: 'PRIMARY', emoji: config.emoji.button.next, customId: 'next', disabled: false }),
                        new MessageButton({ style: 'PRIMARY', emoji: config.emoji.button.last, customId: 'last', disabled: false }),
                        new MessageButton({ style: 'DANGER', emoji: config.emoji.button.delete, customId: 'delete', disabled: false }),
                      ),
                    ],
                  });
                };
  
                await button.deferUpdate();
        
              } else if (button.customId == 'next') {
        
                page++
        
                if (page == pages.length -1) {
        
                  interaction.editReply({

                    embeds: [pages[page]],
                    components: [
                      new MessageActionRow().addComponents(
                        new MessageButton({ style: 'PRIMARY', emoji: config.emoji.button.first, customId: 'first', disabled: false }),
                        new MessageButton({ style: 'PRIMARY', emoji: config.emoji.button.previous, customId: 'previous', disabled: false }),
                        new MessageButton({ style: 'PRIMARY', emoji: config.emoji.button.next, customId: 'next', disabled: true }),
                        new MessageButton({ style: 'PRIMARY', emoji: config.emoji.button.last, customId: 'last', disabled: true }),
                        new MessageButton({ style: 'DANGER', emoji: config.emoji.button.delete, customId: 'delete', disabled: false }),
                      ),
                    ],
                  });
        
                } else if (page !== pages.length -1) {
        
                  interaction.editReply({

                    embeds: [pages[page]],
                    components: [
                      new MessageActionRow().addComponents(
                        new MessageButton({ style: 'PRIMARY', emoji: config.emoji.button.first, customId: 'first', disabled: false }),
                        new MessageButton({ style: 'PRIMARY', emoji: config.emoji.button.previous, customId: 'previous', disabled: false }),
                        new MessageButton({ style: 'PRIMARY', emoji: config.emoji.button.next, customId: 'next', disabled: false }),
                        new MessageButton({ style: 'PRIMARY', emoji: config.emoji.button.last, customId: 'last', disabled: false }),
                        new MessageButton({ style: 'DANGER', emoji: config.emoji.button.delete, customId: 'delete', disabled: false }),
                      ),
                    ],
                  });
                };
        
                await button.deferUpdate();
  
              } else if (button.customId == 'last') {
        
                page = pages.length -1
        
                interaction.editReply({
                  
                  embeds: [pages[page]],
                  components: [
                    new MessageActionRow().addComponents(
                      new MessageButton({ style: 'PRIMARY', emoji: config.emoji.button.first, customId: 'first', disabled: false }),
                      new MessageButton({ style: 'PRIMARY', emoji: config.emoji.button.previous, customId: 'previous', disabled: false }),
                      new MessageButton({ style: 'PRIMARY', emoji: config.emoji.button.next, customId: 'next', disabled: true }),
                      new MessageButton({ style: 'PRIMARY', emoji: config.emoji.button.last, customId: 'last', disabled: true }),
                      new MessageButton({ style: 'DANGER', emoji: config.emoji.button.delete, customId: 'delete', disabled: false }),
                    ),
                  ],
                });
        
                await button.deferUpdate();
              };
            });
          });
        };
      },
    };
  };
};
