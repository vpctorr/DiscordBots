import { presetChanges } from './modalSubmit.js'
import { db } from '../utils/database.js'
import { defaults } from '../defaults.js'

import { MessageActionRow, MessageButton } from 'discord.js'

export const buttonClickHandler = async (interaction) => {
  const [ACTION] = interaction.customId.split('_')
  if (ACTION === 'presetUpdate') handlePresetUpdate(interaction)
}

const handlePresetUpdate = async (event) => {
  const { guild, customId } = event

  const [_, PRESET_ID] = customId.split('_')

  //get changes map for guild
  const guildPresetChanges = presetChanges.get(guild.id)
  //return if button not tied to ongoing change
  if (!guildPresetChanges[PRESET_ID]) return
  //remove ongoing change from map
  presetChanges.set({ ...guildPresetChanges, [PRESET_ID]: undefined })
  //extract values from ongoing change
  const { channel: CH_UPDATE, values: NEW_VALUES } = guildPresetChanges[PRESET_ID]

  Promise.all([
    //update preset
    await db.set(`${guild.id}_presets`, PRESET_ID, {
      settings: NEW_VALUES,
      label: defaults[PRESET_ID].label,
      emoji: defaults[PRESET_ID].emoji
    }),
    //update channel
    await db.set(guild.id, CH_UPDATE, {
      settings: PRESET_ID
    }),
    //update button
    await event.update({ components: [updatedBtn] })
  ])
}

const updatedBtn = new MessageActionRow().addComponents(
  new MessageButton()
    .setCustomId(`nothing_`)
    .setLabel('The preset has been updated')
    .setStyle('PRIMARY')
    .setDisabled(true)
)
