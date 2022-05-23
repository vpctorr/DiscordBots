import { MessageSelectMenu, MessageActionRow } from 'discord.js'

import { db } from '../utils/database.js'

const defaults = {
  one2one: [
    'defaults_one2one',
    {
      label: 'A personnal voice chat',
      emoji: '🤝',
      description: 'Lower thresholds suited for one-to-one chats'
    }
  ],
  many2many: [
    'defaults_many2many',
    {
      label: 'A voice chat with a few people',
      emoji: '👋',
      description: 'Mid-ranged thresholds suited for many-to-many chats'
    }
  ],
  one2many: [
    'defaults_one2many',
    {
      label: 'A voice chat for larger events',
      emoji: '🙌',
      description: 'Higher thresholds suited for one-to-many chats'
    }
  ]
}

export const selectPreset = async (guildId, channelId) => {
  const guildPresets = await db.get(`${guildId}_presets`)
  const presetsArray = Object.entries(guildPresets)

  if (!guildPresets['guild_one2one']) presetsArray.push(defaults.one2one)
  if (!guildPresets['guild_many2many']) presetsArray.push(defaults.many2many)
  if (!guildPresets['guild_one2many']) presetsArray.push(defaults.one2many)

  const options = presetsArray.map(([id, { label, description, emoji, settings }]) => ({
    label: label || defaults[id.split('_')[1]][1].label,
    description:
      description ||
      `${settings.threshold} users, 
      ${secondsToHms(settings.interval)} between alerts${settings.requireEmpty ? ', empty channel.' : '.'}`,
    value: id,
    emoji: {
      id: null,
      name: emoji || defaults[id.split('_')[1]][1].emoji
    }
  }))

  return new MessageActionRow().addComponents(
    new MessageSelectMenu().setCustomId(`enable_${channelId}`).setPlaceholder('Select a preset').addOptions(options)
  )
}

const secondsToHms = (d) => {
  d = Number(d)
  const h = Math.floor(d / 3600)
  const m = Math.floor((d % 3600) / 60)
  const s = Math.floor((d % 3600) % 60)
  return `${h > 0 ? h + 'h ' : ''}${m > 0 ? m + 'm ' : ''}${s > 0 ? s + 's' : ''}`
}
