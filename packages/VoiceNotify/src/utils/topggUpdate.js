import { request } from 'https'

export const topggUpdate = (server_count) => {
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
