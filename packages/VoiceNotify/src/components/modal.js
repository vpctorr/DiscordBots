import { Modal, TextInputComponent, MessageActionRow } from 'discord.js'

const thresholdInput = (preset) =>
  new MessageActionRow().addComponents(
    new TextInputComponent()
      .setCustomId('threshold')
      .setLabel('How many users must join the voice channel?') //How many users should join for an alert to be sent?
      .setPlaceholder('1, 5, 10...')
      .setStyle('SHORT')
      .setRequired(true)
      .setMaxLength(4)
      .setValue(preset)
  )

const intervalInput = (preset) =>
  new MessageActionRow().addComponents(
    new TextInputComponent()
      .setCustomId('interval')
      .setLabel('How much time must pass between two alerts?') //How much time should have passed between two alerts?
      .setPlaceholder('30s, 5 mins, 1 hour...')
      .setStyle('SHORT')
      .setRequired(true)
      .setMaxLength(40)
      .setValue(preset)
  )

const requireEmptyInput = (preset) =>
  new MessageActionRow().addComponents(
    new TextInputComponent()
      .setCustomId('empty')
      .setLabel('Must the channel be empty prior to new alert?') //Should the channel be empty prior to any further alerts?
      .setPlaceholder('Yes / no')
      .setStyle('SHORT')
      .setRequired(true)
      .setMaxLength(4)
      .setValue(preset)
  )

export const newSetupModal = (id, { threshold, interval, requireEmpty }) => {
  const def = typeof requireEmpty !== 'boolean'

  const THRESHOLD = def ? threshold : `${threshold}`
  const INTERVAL = def ? interval : secondsToHms(interval)
  const REQUIREEMPTY = def ? requireEmpty : requireEmpty ? 'Yes' : 'No'

  return new Modal()
    .setCustomId(id)
    .setTitle(`Configure voice channel`)
    .addComponents(thresholdInput(THRESHOLD), intervalInput(INTERVAL), requireEmptyInput(REQUIREEMPTY))
}

const secondsToHms = (d) => {
  d = Number(d)
  const h = Math.floor(d / 3600)
  const m = Math.floor((d % 3600) / 60)
  const s = Math.floor((d % 3600) % 60)
  const hDisplay = h > 0 ? h + (h == 1 ? ' hour ' : ' hours ') : ''
  const mDisplay = m > 0 ? m + (m == 1 ? ' minute ' : ' minutes ') : ''
  const sDisplay = s > 0 ? s + (s == 1 ? ' second' : ' seconds') : ''
  return `${hDisplay}${mDisplay}${sDisplay}`
}
