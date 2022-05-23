/* eslint-disable no-case-declarations */
/* eslint-disable no-fallthrough */
/* eslint-disable eqeqeq */

import { Client, MessageMentions, MessageEmbed, Intents, Permissions } from 'discord.js'

import { handleCommand } from './handlers/commands/commands.js'
import { handleModalSubmit } from './handlers/modalSubmit.js'
import { handleSelectSubmit } from './handlers/selectSubmit.js'

import { initializeDatabase, manager } from './utils/dbCache.js'
import { registerCommands } from './utils/registerCommands.js'
import { log } from './utils/logWebhook.js'

await registerCommands()
await initializeDatabase()

import info from '../package.json' assert { type: 'json' }
import { topggUpdate } from './utils/topggUpdate.js'
import { handleVoiceState } from './handlers/voiceStateUpdate.js'
import { handleButtonSubmit } from './handlers/buttonSubmit.js'

const version = (process.env.HEROKU_DEV && process.env.HEROKU_SLUG_DESCRIPTION) || info.version

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGES]
})

const lastRestart = Date.now()

client.on('voiceStateUpdate', async ({ channel: oldChannel }, { channel, guild }) => {
  handleVoiceState(oldChannel, channel, guild)
})

client.on('interactionCreate', async (interaction) => {
  if (interaction.isCommand()) return await handleCommand(interaction)
  if (interaction.isModalSubmit()) return await handleModalSubmit(interaction)
  if (interaction.isSelectMenu()) return await handleSelectSubmit(interaction)
  if (interaction.isButton()) return await handleButtonSubmit(interaction)
})

client.on('messageCreate', async (msg) => {
  const { member, guild, mentions, content, channel } = msg

  if (!member || member.id == guild.me.id) return
  if (!mentions?.has(guild.me, { ignoreEveryone: true })) return
  if (!member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
    return msg.reply('you must be an administrator to use this bot.')
  }

  const [, command, ...params] = content.toLowerCase().split(/ +/g)

  switch (command) {
    case 'enable' || 'disable':
      if (!member.voice.channelId) return msg.reply('you must be in a voice channel to use this bot.')

    case 'enable':
      const settings = {
        text: Number(channel.id),
        min: Number(/^\d+$/.test(params[0]) ? params[0] : '5'),
        roles: params?.toString().match(MessageMentions.ROLES_PATTERN)
      }
      await manager.set(guild.id, member.voice.channelId, settings)
      return msg.reply(
        `when ${settings.min} people or more are connected to "${
          member.voice.channel.name
        }", we will send an alert in <#${channel.id}> mentioning ${settings.roles?.length || '0'} role(s).`
      )

    case 'disable':
      await manager.del(guild.id, member.voice.channelId)
      return msg.reply(`notifications have been disabled for "${member.voice.channel.name}".`)

    case 'debug':
      msg.reply({
        embeds: [
          new MessageEmbed()
            .setTitle('VoiceNotify – Debug')
            .setColor('#08C754')
            .setDescription(
              `
              **version :** VoiceNotify v${version}
              **time :** ${Date.now()}
              **lastRestart :** ${lastRestart}
              **guildId :** ${guild.id}
              **memberId :** ${member.id}
              **textChannelId :** ${channel.id}
              **voiceChannelId :** ${member.voice?.channelId}
              **lastThreshold :** ${thresholdTimes.get(member.voice?.channelId)}
              **lastBroadcast :** ${broadcastTimes.get(member.voice?.channelId)}
              **guildSettings :**\n\`\`\`${JSON.stringify(await manager.get(guild.id))}\`\`\`
            `
            )
        ]
      })
      thresholdTimes.set(member.voice?.channelId, undefined)
      broadcastTimes.set(member.voice?.channelId, undefined)
      return

    default:
      return msg.reply(`
here are the bot commande to enable & disable voice chat notifications (administrators only) :

\`@VoiceNotify enable [threshold] [roles]\`
Enables voice chat notifications for the voice channel you are in, alerts will be sent to the channel where this command is executed.
Optional : [threshold] to trigger an alert defaults to 5 people ; [roles] will be mentioned when the alert is sent.

\`@VoiceNotify disable\`
Disables voice chat notifications for the voice channel you are in.
      `)
  }
})

const updateGuildCount = (server_count) => {
  client.user.setActivity(`${server_count} servers ⚡`, { type: 'WATCHING' })
  topggUpdate(server_count)
}

client.on('ready', () => {
  log(`Bot (re)started, version ${version}`)
  updateGuildCount(client.guilds.cache.size)
})

client.on('guildCreate', () => updateGuildCount(client.guilds.cache.size))

client.on('guildDelete', ({ id }) => {
  manager.del(id)
  updateGuildCount(client.guilds.cache.size)
})

client.on('shardError', (e) => log(`Websocket connection error: ${e}`))

process.on(
  'unhandledRejection',
  (e) => e.code != 50013 && e.code != 50001 && log(`Unhandled promise rejection:\n\n${e.stack}\n\n${JSON.stringify(e)}`)
)

client.login(process.env.VOICENOTIFY_DISCORD_TOKEN)
