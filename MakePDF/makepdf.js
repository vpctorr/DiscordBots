/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/order */
/* eslint-disable eqeqeq */

require('dotenv').config()

const { Client, WebhookClient, MessageAttachment } = require('discord.js')
const client = new Client()
const hook = new WebhookClient(process.env.MAKEPDF_WEBHOOK_ID, process.env.MAKEPDF_WEBHOOK_TOKEN)

const log = (msg) => {
  console.log(msg)
  try {
    hook.send(msg)
  } catch {}
}

const DBL = require('dblapi.js')
try {
  const _dbl = new DBL(process.env.MAKEPDF_TOPGG_TOKEN, client)
} catch (e) {
  log(`Topgg error : ${e}`)
}

const https = require('https')
const libre = require('./convert')

const { version } = require('./package.json')

client.on('message', async (msg) => {
  const { author, attachments, channel } = msg

  if (author.id == client.user.id) return

  const filesArray = attachments.array()

  filesArray.length > 0 &&
    filesArray.forEach(({ name, url }) => {
      if (!url) return

      const formats = process.env.MAKEPDF_SETTINGS_FORMATS.split(',')
      const extension = name.substring(name.lastIndexOf('.') + 1)

      if (!formats.includes(extension)) return

      https.get(url, (res) => {
        const bufs = []
        res.on('data', (chunk) => bufs.push(chunk))
        res.on('error', (err) => {
          channel.send(`Sorry, the conversion has failed :cry:`)
          return log(`Error during HTTP request : ${err.message}`)
        })
        res.on('end', () => {
          const fileData = Buffer.concat(bufs)

          libre.convert(fileData, '.pdf', undefined, (err, pdfData) => {
            if (err) {
              channel.send(`Sorry, the conversion has failed :cry:`)
              return log(`Error converting file : ${err}`)
            }

            const newName = name.substring(0, name.lastIndexOf('.')) + '.pdf'
            const newAttachment = new MessageAttachment(pdfData, newName)
            channel.send(`**:paperclip: Here is your converted PDF file :**`, newAttachment)
          })
        })
      })
    })
})

client.on('ready', () => {
  log(`Bot (re)started, version ${version}`)
  client.user.setActivity(`${client.guilds.cache.size} servers ⚡`, { type: 'WATCHING' })
})

client.on('guildCreate', () => client.user.setActivity(`${client.guilds.cache.size} servers ⚡`, { type: 'WATCHING' }))
client.on('guildDelete', () => client.user.setActivity(`${client.guilds.cache.size} servers ⚡`, { type: 'WATCHING' }))

client.on('shardError', (e) => log(`Websocket connection error: ${e}`))
process.on('unhandledRejection', (e) => log(`Unhandled promise rejection: ${e}`))

client.login(process.env.MAKEPDF_DISCORD_TOKEN)
