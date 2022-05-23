import { db } from '../utils/database.js'

const thresholdTimes = new Map() //last threshold time per channel
const broadcastTimes = new Map() //last broadcast time per channel

export const voiceUpdateHandler = async (oldChannel, channel, guild) => {
  // exit if user is leaving a channel
  if (!channel) return

  // exit if user changing mute/listen status
  if (channel.id == oldChannel?.id) return

  // fetch channel settings from db
  const settings = await db.get(guild.id, channel.id)
  if (!settings) return

  // get text channel or delete if undefined (deleted channel)
  const textCh = await guild.channels.cache.find((ch) => ch.id == settings.text)
  if (!textCh?.isText() || textCh?.deleted) return db.del(guild.id, channel.id)

  // exit if threshold is not reached
  if (channel.members.size < settings.min) return

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
}
