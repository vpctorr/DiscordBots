import { presetChanges } from './modalSubmit.js'
import { manager } from '../utils/dbCache.js'

import { MessageActionRow, MessageButton } from 'discord.js'

export const handleButtonSubmit = async (interaction) => {
  const [ACTION] = interaction.customId.split('_')
  if (ACTION === 'presetUpdate') handlePresetUpdate(interaction)
}

const handlePresetUpdate = async (interaction) => {
  const { guild, customId } = interaction
  const [_, PRESET_SET, PRESET_ID] = customId.split('_')
  const PRESET_FULL = `${PRESET_SET}_${PRESET_ID}`

  //get changes map for guild
  const guildPresetChanges = presetChanges.get(guild.id)
  //return if button not tied to ongoing change
  if (!guildPresetChanges[PRESET_FULL]) return
  //remove ongoing change from map
  presetChanges.set({ ...guildPresetChanges, [PRESET_FULL]: undefined })
  //extract values from ongoing change
  const { channel: CH_UPDATE, values: NEW_VALUES } = guildPresetChanges[PRESET_FULL]

  Promise.all([
    //update preset
    await manager.set(`${guild.id}_presets`, `guild_${PRESET_ID}`, {
      settings: NEW_VALUES
    }),
    //update channel
    await manager.set(guild.id, CH_UPDATE, {
      settings: `guild_${PRESET_ID}`
    }),
    //update button
    await interaction.update({ components: [updatedBtn] })
  ])
}

const updatedBtn = new MessageActionRow().addComponents(
  new MessageButton()
    .setCustomId(`nothing_`)
    .setLabel('The preset has been updated')
    .setStyle('PRIMARY')
    .setDisabled(true)
)
