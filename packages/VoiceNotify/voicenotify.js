/* eslint-disable no-case-declarations */
/* eslint-disable no-fallthrough */
/* eslint-disable eqeqeq */

import { Client, WebhookClient, MessageMentions, MessageEmbed } from 'discord.js'
import { initializeApp, cert } from 'firebase-admin/app'
import { getDatabase } from 'firebase-admin/database'
import { request } from 'https'

import info from './package.json' assert { type: 'json' }
const version = (process.env.HEROKU_DEV && process.env.HEROKU_SLUG_DESCRIPTION) || info.version

const client = new Client()
const hook = new WebhookClient(process.env.VOICENOTIFY_WEBHOOK_ID, process.env.VOICENOTIFY_WEBHOOK_TOKEN)

const log = (msg) => {
  console.log(msg)
  hook.send(new MessageEmbed().setDescription(msg).setTitle('VoiceNotify – Debug').setColor('#08C754')).catch(() => {})
}
initializeApp({
  credential: cert({
    clientEmail: process.env.VOICENOTIFY_FIREBASE_CLIENT_EMAIL,
    privateKey: JSON.parse(`"${process.env.VOICENOTIFY_FIREBASE_PRIVATE_KEY}"`),
    projectId: process.env.VOICENOTIFY_FIREBASE_PROJECT_ID
  }),
  databaseURL: process.env.VOICENOTIFY_FIREBASE_DATABASE_URL
})
const db = getDatabase()
const lastRestart = Date.now()

const thresholdTimes = new Map() //last threshold time per channel
const broadcastTimes = new Map() //last broadcast time per channel

// settings management
const manager = {
  cache: {},
  get: async (g, c) => (c ? (await manager.get(g))?.[c] : (manager.cache[g] ||= (await db.ref(g).once('value')).val())),
  set: async (g, c, s) =>
    s &&
    (await db
      .ref(g)
      .child(c)
      .set(s)
      .then(async () => (await manager.get(g)) && (manager.cache[g][c] = s))),
  del: async (g, c) =>
    c
      ? await db
          .ref(g)
          .child(c)
          .remove()
          .then(() => delete manager.cache[g]?.[c])
      : await db
          .ref(g)
          .remove()
          .then(() => delete manager.cache[g])
}

client.on('voiceStateUpdate', async ({ channel: oldChannel }, { channel, guild }) => {
  // exit if user is leaving a channel
  if (!channel) return

  // exit if user changing mute/listen status
  if (channel.id == oldChannel?.id) return

  // fetch channel settings from db
  const settings = await manager.get(guild.id, channel.id)
  if (!settings) return

  // get text channel or delete if undefined (deleted channel)
  const textCh = await guild.channels.cache.find((ch) => ch.id == settings.text)
  if (!textCh?.isText() || textCh?.deleted) return manager.del(guild.id, channel.id)

  // exit if threshold is not reached
  if (channel.members.array().length < settings.min) return

  // get and set last threshold
  const lastThreshold = thresholdTimes.get(channel.id)
  thresholdTimes.set(channel.id, Date.now())

  // exit if threshold already reached recently
  // (progressive antispam depending on set threshold: 1p = 5m, 2p = 2.5m, 5p = 1m, 10p = 30s...)
  if (lastThreshold && Date.now() - lastThreshold < (5 / settings.min) * 60 * 1000) return

  // get last broadcast and exit if already sent <10m ago
  const lastBroadcast = broadcastTimes.get(channel.id)
  if (lastBroadcast && Date.now() - lastBroadcast < 10 * 60 * 1000) return

  // set last broadcast
  broadcastTimes.set(channel.id, Date.now())

  // get potential roles to mention
  const rolesList = settings.roles || ''

  // send message
  textCh.send(`\`🎙️\` A voice chat is taking place in "**${channel.name}**"!\n${rolesList}`)
})

client.on('message', async (msg) => {
  const { member, guild, mentions, content, channel } = msg

  if (!member || member.id == guild.me.id) return
  if (!mentions?.has(guild.me, { ignoreEveryone: true })) return
  if (!member.hasPermission('ADMINISTRATOR')) return msg.reply('you must be an administrator to use this bot.')

  const [, command, ...params] = content.toLowerCase().split(/ +/g)

  switch (command) {
    case 'enable' || 'disable':
      if (!member.voice.channelID) return msg.reply('you must be in a voice channel to use this bot.')

    case 'enable':
      const settings = {
        text: Number(channel.id),
        min: Number(/^\d+$/.test(params[0]) ? params[0] : '5'),
        roles: params?.toString().match(MessageMentions.ROLES_PATTERN)
      }
      await manager.set(guild.id, member.voice.channelID, settings)
      return msg.reply(
        `when ${settings.min} people or more are connected to "${
          member.voice.channel.name
        }", we will send an alert in <#${channel.id}> mentioning ${settings.roles?.length || '0'} role(s).`
      )

    case 'disable':
      await manager.del(guild.id, member.voice.channelID)
      return msg.reply(`notifications have been disabled for "${member.voice.channel.name}".`)

    case 'debug':
      msg.reply(
        new MessageEmbed().setTitle('VoiceNotify – Debug').setColor('#08C754').setDescription(`
              **version :** VoiceNotify v${version}
              **time :** ${Date.now()}
              **lastRestart :** ${lastRestart}
              **guildId :** ${guild.id}
              **memberId :** ${member.id}
              **textChannelId :** ${channel.id}
              **voiceChannelId :** ${member.voice?.channelID}
              **lastThreshold :** ${thresholdTimes.get(member.voice?.channelID)}
              **lastBroadcast :** ${broadcastTimes.get(member.voice?.channelID)}
              **guildSettings :**\n${JSON.stringify(await manager.get(guild.id))}
            `)
      )
      thresholdTimes.set(member.voice?.channelID, undefined)
      broadcastTimes.set(member.voice?.channelID, undefined)
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
  process.env.VOICENOTIFY_TOPGG_TOKEN &&
    request({
      hostname: 'top.gg',
      port: 443,
      path: `/api/bots/${process.env.VOICENOTIFY_BOT_ID}/stats`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${process.env.VOICENOTIFY_TOPGG_TOKEN}`
      }
    }).end(
      JSON.stringify({
        server_count
      })
    )
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
