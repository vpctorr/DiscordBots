import { newSetupModal } from '../components/modal.js'

import { db } from '../utils/database.js'

export const defaultsPresetValues = {
  one2one: ['1', '30 seconds', 'Yes'],
  many2many: ['5', '10 minutes', 'Yes'],
  one2many: ['15', '1 hour', 'No']
}

export const selectSubmitHandler = async (interaction) => {
  const [ACTION] = interaction.customId.split('_')
  if (ACTION === 'enable') handleEnableSelect(interaction)
}

export const handleEnableSelect = async (interaction) => {
  const { values, customId, guild } = interaction

  const SELECTED = values[0]
  const [_, VOICE_ID] = customId.split('_')
  const GUILD_ID = guild.id

  let modal

  const [PRESET_SET, PRESET_ID] = SELECTED.split('_')

  if (PRESET_SET === 'defaults') {
    const [threshold, interval, requireEmpty] = defaultsPresetValues[PRESET_ID]
    modal = newSetupModal(`${VOICE_ID}_${SELECTED}`, { threshold, interval, requireEmpty })
  }
  if (PRESET_SET === 'guild') {
    const preset = await db.get(`${GUILD_ID}_presets`, `guild_${PRESET_ID}`)
    modal = newSetupModal(`${VOICE_ID}_${SELECTED}`, { ...preset.settings })
  }

  await interaction.showModal(modal)
}
