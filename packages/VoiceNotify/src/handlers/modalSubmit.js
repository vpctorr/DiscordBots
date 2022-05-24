import duration from 'parse-duration'

import { MessageActionRow, MessageButton } from 'discord.js'

import { defaultsPresetValues } from './selectSubmit.js'
import { db } from '../utils/database.js'

export const presetChanges = new Map()

export const modalSubmitHandler = async (interaction) => {
  const { member, guild, mentions, content, channel, fields, customId } = interaction

  const [VOICE_ID, PRESET_SET, PRESET_ID] = customId.split('_')
  const PRESET_FULL = `${PRESET_SET}_${PRESET_ID}`

  const THRESHOLD = normalizeThreshold(fields.getTextInputValue('threshold'))
  const INTERVAL_MINS = normalizeInterval(fields.getTextInputValue('interval'))
  const REQUIRE_EMPTY = normalizeEmpty(fields.getTextInputValue('empty'))

  if (THRESHOLD === undefined || INTERVAL_MINS === undefined || REQUIRE_EMPTY === undefined) return

  const isDifferentFromPreset = checkDiffersFromPreset(
    { PRESET_SET, PRESET_ID },
    { THRESHOLD, INTERVAL_MINS, REQUIRE_EMPTY }
  )

  const newValues = {
    threshold: THRESHOLD,
    interval: INTERVAL_MINS,
    requireEmpty: REQUIRE_EMPTY
  }

  if (isDifferentFromPreset) {
    const presetsChanged = { ...presetChanges.get(guild.id), [PRESET_FULL]: { values: newValues, channel: VOICE_ID } }
    presetChanges.set(guild.id, presetsChanged)
  }

  await db.set(guild.id, VOICE_ID, {
    text: Number(channel.id),
    settings: isDifferentFromPreset ? newValues : PRESET_FULL
  })
  //roles: params?.toString().match(MessageMentions.ROLES_PATTERN)

  const row = new MessageActionRow().addComponents(
    new MessageButton().setCustomId(`presetUpdate_${PRESET_FULL}`).setLabel('Update preset').setStyle('PRIMARY')
  )

  return await interaction.reply({
    content: `VoiceNotify has been activated.\n\n**Further steps:**\n— You can add some role to notify by typing \`/roles add\` while in the voice channel.${
      isDifferentFromPreset
        ? "\n— We've noticed you made some changes to the preset. Clicking the button below will update all channels using this preset."
        : ''
    }`,
    components: isDifferentFromPreset ? [row] : undefined
  })
}

const checkDiffersFromPreset = ({ PRESET_SET, PRESET_ID }, { THRESHOLD, INTERVAL_MINS, REQUIRE_EMPTY }) => {
  if (PRESET_SET === 'defaults') {
    const [presetThreshold, presetInterval, presetEmpty] = defaultsPresetValues[PRESET_ID]
    if (THRESHOLD !== normalizeThreshold(presetThreshold)) return true
    if (INTERVAL_MINS !== normalizeInterval(presetInterval)) return true
    if (REQUIRE_EMPTY !== normalizeEmpty(presetEmpty)) return true
    return false
  }
}

const normalizeThreshold = (thresholdInput) => {
  const normalThreshold = Number(thresholdInput)
  if (Number.isInteger(normalThreshold)) return normalThreshold
  else return undefined
}

const normalizeInterval = (intervalInput) => {
  const normalInterval = duration(intervalInput, 's')
  if (!normalInterval && normalInterval !== 0) return undefined
  if (normalInterval > 60 * 60 * 24) return undefined
  return normalInterval
}

const normalizeEmpty = (emptyInput) => {
  const emptyIsTrue = emptyInput.match(/y|1|true/i)?.length >= 1
  const emptyIsFalse = emptyInput.match(/n|0|false/i)?.length >= 1
  if (emptyIsTrue === !emptyIsFalse) return emptyIsTrue
  else return undefined
}
