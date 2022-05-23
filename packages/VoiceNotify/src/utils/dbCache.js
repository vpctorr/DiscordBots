import { initializeApp, cert } from 'firebase-admin/app'
import { getDatabase } from 'firebase-admin/database'

let db

export const initializeDatabase = async () => {
  await initializeApp({
    credential: cert({
      clientEmail: process.env.VOICENOTIFY_FIREBASE_CLIENT_EMAIL,
      privateKey: JSON.parse(`"${process.env.VOICENOTIFY_FIREBASE_PRIVATE_KEY}"`),
      projectId: process.env.VOICENOTIFY_FIREBASE_PROJECT_ID
    }),
    databaseURL: process.env.VOICENOTIFY_FIREBASE_DATABASE_URL
  })
  db = getDatabase()
}

export const manager = {
  cache: {},
  get: async (g, c) => (c ? (await manager.get(g))?.[c] : (manager.cache[g] ||= (await db.ref(g).once('value')).val())),
  set: async (g, c, s) =>
    s &&
    (await db
      .ref(g)
      .child(c)
      .update(s)
      .then(async () => (await manager.get(g)) && (manager.cache[g][c] = s))),
  del: async (g, c) =>
    c
      ? await db
          .ref(g)
          .child(c)
          .remove()
          .then(() => delete manager.cache[g]?.[c])
      : await db
          .ref(g)
          .remove()
          .then(() => delete manager.cache[g])
}
