import { Client, Intents } from 'discord.js'

import { slashCommandHandler } from './handlers/slashCommand.js'
import { modalSubmitHandler } from './handlers/modalSubmit.js'
import { selectSubmitHandler } from './handlers/selectSubmit.js'
import { buttonClickHandler } from './handlers/buttonClick.js'
import { voiceUpdateHandler } from './handlers/voiceUpdate.js'

import { initializeDatabase, db } from './utils/database.js'
import { log, postMetrics, registerCommands } from './utils/discord.js'

import info from '../package.json' assert { type: 'json' }
const version = (process.env.HEROKU_DEV && process.env.HEROKU_SLUG_DESCRIPTION) || info.version

await Promise.all([await registerCommands(), await initializeDatabase()])

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES] })

client.on('voiceStateUpdate', async ({ channel: oldChannel }, { channel, guild }) => {
  return await voiceUpdateHandler(oldChannel, channel, guild)
})

client.on('interactionCreate', async (interaction) => {
  if (interaction.isCommand()) return await slashCommandHandler(interaction)
  if (interaction.isModalSubmit()) return await modalSubmitHandler(interaction)
  if (interaction.isSelectMenu()) return await selectSubmitHandler(interaction)
  if (interaction.isButton()) return await buttonClickHandler(interaction)
})

const updateGuildCount = (server_count) => {
  client.user.setActivity(`${server_count} servers ⚡`, { type: 'WATCHING' })
  postMetrics(server_count)
}

client.on('ready', () => {
  log(`Bot (re)started, version ${version}`)
  updateGuildCount(client.guilds.cache.size)
})

client.on('guildCreate', () => {
  updateGuildCount(client.guilds.cache.size)
})

client.on('guildDelete', ({ id }) => {
  db.del(id)
  updateGuildCount(client.guilds.cache.size)
})

client.on('shardError', (e) => {
  log(`Websocket connection error: ${e}`)
})

process.on('unhandledRejection', (e) => {
  e.code != 50013 && e.code != 50001 && log(`Unhandled promise rejection:\n\n${e.stack}\n\n${JSON.stringify(e)}`)
})

client.login(process.env.VOICENOTIFY_DISCORD_TOKEN)
