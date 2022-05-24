import { MessageSelectMenu, MessageActionRow } from 'discord.js'

import { db } from '../utils/database.js'
import { defaults } from './defaults.js'
import { secondsToHms } from './time.js'

const handleEnableCommand = async (event) => {
  const { member, guild } = event

  //make sure the user is in a voice channel
  const VOICE_ID = member.voice.channelId
  if (!VOICE_ID) return event.reply('You must be in a voice channel to use this command.')

  //send the preset selector
  const GUILD_ID = guild.id
  await event.reply({
    content: 'What kind of channel is this?',
    components: [await selectPresetComponent(GUILD_ID, VOICE_ID)]
  })
}

const selectPresetComponent = async (guildId, voiceId) => {
  //fetch guild presets
  const guildPresets = await db.get(`${guildId}_presets`)
  const presetsArray = Object.entries(guildPresets)

  //add default presets if needed
  Object.entries(defaults).map(([presetId, values]) => {
    if (!guildPresets[presetId]) presetsArray.push([presetId, values])
  })

  //generate preset list
  const options = presetsArray.map(([presetId, { label, description, emoji, settings }]) => {
    const { threshold, interval, requireEmpty } = settings

    const generatedDescription =
      `${threshold} users, ` + `${secondsToHms(interval)} between alerts` + `${requireEmpty ? ', empty channel' : ''}.`

    return {
      label: label,
      description: description || generatedDescription,
      value: presetId,
      emoji: {
        id: null,
        name: emoji
      }
    }
  })

  //prompt user to edit default presets along the way?
  const ACTION = guildPresets?.length >= 2 ? 'enable' : 'enableEdit'
  //return select component
  return new MessageActionRow().addComponents(
    new MessageSelectMenu().setCustomId(`${ACTION}_${voiceId}`).setPlaceholder('Select a preset').addOptions(options)
  )
}

export const handlePresetSelect = async (event) => {
  const { values: selectedItems, customId, guild } = event

  const [ACTION, VOICE_ID] = customId.split('_')
  const PRESET_ID = selectedItems[0]

  // WHAT ABOUT EDIT NEW + ENABLE NEW

  if (ACTION === 'edit' || ACTION === 'enableEdit') {
    const presetValues = (await db.get(`${guild.id}_presets`, PRESET_ID)) || defaults[PRESET_ID] || {}
    const modal = await editPresetComponent(guild.id, PRESET_ID, presetValues)
    await event.showModal(modal)
    //tell to enable for this channel as well
  }

  if (ACTION === 'enable') {
    //enable(presetid)
  }
}
