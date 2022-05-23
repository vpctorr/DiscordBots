import { selectPreset } from '../components/select.js'

export const slashCommandHandler = async (interaction) => {
  if (interaction.commandName === 'enable') {
    await handleEnableCommand(interaction)
  }
}

const handleEnableCommand = async (interaction) => {
  const VOICE_ID = interaction.member.voice.channelId
  if (!VOICE_ID) return interaction.reply('You must be in a voice channel to use this command.')

  const GUILD_ID = interaction.guild.id
  await interaction.reply({
    content: 'What kind of channel is this?',
    components: [await selectPreset(GUILD_ID, VOICE_ID)]
  })
}
