import { WebhookClient, MessageEmbed } from 'discord.js'

const hook = new WebhookClient({
  id: process.env.VOICENOTIFY_WEBHOOK_ID,
  token: process.env.VOICENOTIFY_WEBHOOK_TOKEN
})

export const log = (msg) => {
  console.log(msg)
  hook
    .send({
      embeds: [new MessageEmbed().setDescription(msg).setTitle('VoiceNotify – Debug').setColor('#08C754')]
    })
    .catch(() => {})
}
