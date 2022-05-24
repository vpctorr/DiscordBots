import { initializeApp, cert } from 'firebase-admin/app'
import { getDatabase } from 'firebase-admin/database'

let f

export const initializeDatabase = async () => {
  await initializeApp({
    credential: cert({
      clientEmail: process.env.VOICENOTIFY_FIREBASE_CLIENT_EMAIL,
      privateKey: JSON.parse(`"${process.env.VOICENOTIFY_FIREBASE_PRIVATE_KEY}"`),
      projectId: process.env.VOICENOTIFY_FIREBASE_PROJECT_ID
    }),
    databaseURL: process.env.VOICENOTIFY_FIREBASE_DATABASE_URL
  })
  f = getDatabase()
}

export const db = {
  cache: {},
  get: async (g, c) => (c ? (await db.get(g))?.[c] : (db.cache[g] ||= (await f.ref(g).once('value')).val())),
  set: async (g, c, s) =>
    s &&
    (await f
      .ref(g)
      .child(c)
      .update(s)
      .then(async () => (await db.get(g)) && (db.cache[g][c] = s))),
  del: async (g, c) =>
    c
      ? await f
          .ref(g)
          .child(c)
          .remove()
          .then(() => delete db.cache[g]?.[c])
      : await f
          .ref(g)
          .remove()
          .then(() => delete db.cache[g])
}
