/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-case-declarations */
/* eslint-disable no-fallthrough */
/* eslint-disable import/order */
/* eslint-disable eqeqeq */
/* eslint-disable radix */

require('dotenv').config()

const {
  Client,
  WebhookClient,
  MessageMentions: { ROLES_PATTERN },
  MessageEmbed
} = require('discord.js')
const client = new Client()
const hook = new WebhookClient(process.env.VOICENOTIFY_WEBHOOK_ID, process.env.VOICENOTIFY_WEBHOOK_TOKEN)

const log = (msg) => {
  console.log(msg)
  hook.send(new MessageEmbed().setDescription(msg).setTitle('VoiceNotify – Debug').setColor('#08C754')).catch(() => {})
}

const DBL = require('dblapi.js')
const _dbl = new DBL(process.env.VOICENOTIFY_TOPGG_TOKEN, client).on('error', () => {})

const Firebase = require('firebase-admin')
Firebase.initializeApp({
  credential: Firebase.credential.cert({
    client_email: process.env.VOICENOTIFY_FIREBASE_CLIENT_EMAIL,
    private_key: JSON.parse(`"${process.env.VOICENOTIFY_FIREBASE_PRIVATE_KEY}"`),
    project_id: process.env.VOICENOTIFY_FIREBASE_PROJECT_ID
  }),
  databaseURL: process.env.VOICENOTIFY_FIREBASE_DATABASE_URL
})
const db = Firebase.database()

const { version } = require('./package.json')

const thresholdTimes = new Map() //last threshold time per channel
const broadcastTimes = new Map() //last broadcast time per channel

client.on('voiceStateUpdate', async ({ channel: oldChannel }, { channel, guild }) => {
  // exit if user is leaving a channel
  if (!channel) return

  // exit if user changing mute/listen status
  if (channel.id == oldChannel?.id) return

  // fetch channel settings from db
  const settings = (await db.ref(guild.id).child(channel.id).once('value')).val()
  if (!settings) return

  // get text channel or delete if undefined (deleted channel)
  const textCh = guild.channels.cache.find((ch) => ch.id == settings.text)
  if (!textCh || !textCh.isText || textCh.deleted) return await db.ref(guild.id).child(channel.id).remove()

  // exit if threshold is not reached
  if (channel.members.array().length < settings.min) return

  // get and set last threshold
  const lastThreshold = broadcastTimes.get(channel.id)
  thresholdTimes.set(channel.id, Date.now())

  // exit if threshold already reached <20m ago
  if (lastThreshold && Date.now() - lastThreshold < 20 * 60 * 1000) return

  // get last broadcast and exit if already sent <40m ago
  const lastBroadcast = broadcastTimes.get(channel.id)
  if (lastBroadcast && Date.now() - lastBroadcast < 40 * 60 * 1000) return

  // set last broadcast
  broadcastTimes.set(channel.id, Date.now())

  // get potential roles to mention
  const rolesList = settings.roles || ''

  // send message
  textCh.send(`**:microphone2: A voice chat is taking place in the "${channel.name}" channel !\n${rolesList}**`)
})

client.on('message', async (msg) => {
  const { member, guild, mentions, content, channel } = msg

  if (!member || member.id == guild.me.id) return
  if (!mentions?.has(guild.me, { ignoreEveryone: true })) return
  if (!member.hasPermission('ADMINISTRATOR')) return msg.reply('you must be an administrator to use this bot.')

  const [_prefix, command, ...params] = content.toLowerCase().split(/ +/g)

  switch (command) {
    case 'enable' || 'disable':
      if (!member.voice?.channel) return msg.reply('you must be in a voice channel to use this bot.')

    case 'enable':
      const settings = {
        text: parseInt(channel.id),
        min: parseInt(/^\d+$/.test(params[0]) ? params[0] : 5),
        roles: params?.toString().match(ROLES_PATTERN)
      }
      await db.ref(guild.id).child(member.voice.channel.id).set(settings)
      return msg.reply(
        `when ${settings.min} people or more are connected to "${
          member.voice.channel.name
        }", we will send an alert in <#${channel.id}> mentioning ${settings.roles?.length || '0'} role(s).`
      )

    case 'disable':
      await db.ref(guild.id).child(member.voice.channel.id).remove()
      return msg.reply(`notifications have been disabled for "${member.voice.channel.name}".`)

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

client.on('ready', () => {
  log(`Bot (re)started, version ${version}`)
  client.user.setActivity(`${client.guilds.cache.size} servers ⚡`, { type: 'WATCHING' })
})

client.on('guildCreate', () => client.user.setActivity(`${client.guilds.cache.size} servers ⚡`, { type: 'WATCHING' }))
client.on('guildDelete', () => client.user.setActivity(`${client.guilds.cache.size} servers ⚡`, { type: 'WATCHING' }))

client.on('shardError', (e) => log(`Websocket connection error: ${e}`))
process.on(
  'unhandledRejection',
  (e) => e.code != '50013' && log(`Unhandled promise rejection:\n\n${e.stack}\n\n${JSON.stringify(e)}`)
)

client.login(process.env.VOICENOTIFY_DISCORD_TOKEN)
