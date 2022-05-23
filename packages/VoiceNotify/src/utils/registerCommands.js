import { SlashCommandBuilder } from '@discordjs/builders'
import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'

const commands = [
  new SlashCommandBuilder().setName('enable').setDescription('Enable VoiceNotify for this channel'),
  new SlashCommandBuilder().setName('disable').setDescription('Disable VoiceNotify for this channel'),
  new SlashCommandBuilder()
    .setName('roles')
    .setDescription('Must be used in a voice channel')
    .addSubcommand((sub) =>
      sub
        .setName('add')
        .setDescription('Notify some roles for the voice channel you are in')
        .addRoleOption((opt) => opt.setName('role').setDescription('…').setRequired(true))
        .addRoleOption((opt) => opt.setName('rоle').setDescription('…'))
        .addRoleOption((opt) => opt.setName('rolе').setDescription('…'))
        .addRoleOption((opt) => opt.setName('rоlе').setDescription('…'))
    )
    .addSubcommand((sub) =>
      sub
        .setName('remove')
        .setDescription('Stop notifying some roles for the voice channel you are in')
        .addRoleOption((opt) => opt.setName('role').setDescription('…').setRequired(true))
        .addRoleOption((opt) => opt.setName('rоle').setDescription('…'))
        .addRoleOption((opt) => opt.setName('rolе').setDescription('…'))
        .addRoleOption((opt) => opt.setName('rоlе').setDescription('…'))
    )
    .addSubcommand((sub) =>
      sub.setName('list').setDescription('List roles that are notified for the voice channel you are in')
    )
].map((command) => command.toJSON())

const rest = new REST({ version: '9' }).setToken(process.env.VOICENOTIFY_DISCORD_TOKEN)

export const registerCommands = async () => {
  try {
    await rest.put(Routes.applicationCommands(process.env.VOICENOTIFY_DISCORD_CLIENT_ID), { body: commands })
    console.log('Successfully registered application commands.')
  } catch (e) {
    throw new Error(e)
  }
}
