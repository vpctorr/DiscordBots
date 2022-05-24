import { WebhookClient, MessageEmbed } from 'discord.js'
import { Routes } from 'discord-api-types/v9'
import { REST } from '@discordjs/rest'
import { request } from 'https'

import { commands } from '../components/slash.js'

const LoggingWebhook = new WebhookClient({
  id: process.env.VOICENOTIFY_WEBHOOK_ID,
  token: process.env.VOICENOTIFY_WEBHOOK_TOKEN
})

export const log = (msg) => {
  console.log(msg)
  LoggingWebhook.send({
    embeds: [new MessageEmbed().setDescription(msg).setTitle('VoiceNotify – Debug').setColor('#08C754')]
  }).catch(() => {})
}

export const postMetrics = (server_count) => {
  process.env.VOICENOTIFY_TOPGG_TOKEN &&
    request({
      hostname: 'top.gg',
      port: 443,
      path: `/api/bots/${process.env.VOICENOTIFY_BOT_ID}/stats`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${process.env.VOICENOTIFY_TOPGG_TOKEN}`
      }
    }).end(
      JSON.stringify({
        server_count
      })
    )
}

export const registerCommands = async () => {
  const restEndpoint = new REST({ version: '9' }).setToken(process.env.VOICENOTIFY_DISCORD_TOKEN)
  const commandsJson = commands.map((cmd) => cmd.toJSON())
  await restEndpoint.put(Routes.applicationCommands(process.env.VOICENOTIFY_DISCORD_CLIENT_ID), { body: commandsJson })
  console.log('Successfully registered application commands.')
}
