# VoiceNotify

## What this does

VoiceNotify is a Discord bot that notifies people when a voice chat is taking place.

[You can also directly add the bot here](https://discord.com/oauth2/authorize?client_id=712670038267789352&scope=bot&permissions=150528)

## Setting up
You MUST run this with environment variables, or alternatively use a `.env` file as follows
```
VOICENOTIFY_DISCORD_TOKEN=your_discord_token
VOICENOTIFY_FIREBASE_CLIENT_EMAIL=your_firebase_client_email
VOICENOTIFY_FIREBASE_PRIVATE_KEY='your_firebase_private_key'
VOICENOTIFY_FIREBASE_PROJET_ID=your_firebase_project_id
VOICENOTIFY_FIREBASE_DATABASE_URL=your_firebase_database_url
```
Then run the bot with `node voicenotify`