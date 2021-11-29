require('dotenv').config()

const Discord = require('discord.js');
const bot = new Discord.Client();
const hook = new Discord.WebhookClient(process.env.VOICENOTIFY_WEBHOOK_ID, process.env.VOICENOTIFY_WEBHOOK_TOKEN);

const DBL = require("dblapi.js");
try {
    const dbl_ = new DBL(process.env.VOICENOTIFY_TOPGG_TOKEN, bot);
} catch (ex) {
    console.log(`Topgg error : ${ex}`);
    hook.log(`Topgg error : ${ex}`);
}

const Firebase = require("firebase-admin");
Firebase.initializeApp({
    credential: Firebase.credential.cert({
        "client_email": process.env.VOICENOTIFY_FIREBASE_CLIENT_EMAIL,
        "private_key": JSON.parse(`"${process.env.VOICENOTIFY_FIREBASE_PRIVATE_KEY}"`),
        "project_id": process.env.VOICENOTIFY_FIREBASE_PROJECT_ID,
    }),
    databaseURL: process.env.VOICENOTIFY_FIREBASE_DATABASE_URL
});
const db = Firebase.database();

const pjson = require('./package.json');

// Bot will be able to send & receive to Discord only after this
bot.on("ready", () => {
    console.log(`Bot (re)started, version ${pjson.version}`);
    hook.send(`Bot (re)started, version ${pjson.version}`);
    bot.user.setActivity(`${bot.guilds.cache.size} servers ⚡`, { type: 'WATCHING' });
});

bot.on("guildCreate", guild => {
    bot.user.setActivity(`${bot.guilds.cache.size} servers ⚡`, { type: 'WATCHING' });
});

bot.on("guildDelete", guild => {
    bot.user.setActivity(`${bot.guilds.cache.size} servers ⚡`, { type: 'WATCHING' });
});

let thresholdTimes = new Map(); //last threshold time per channel
let broadcastTimes = new Map(); //last broadcast time per channel

bot.on('voiceStateUpdate', async ({channel: oldChannel}, {channel, guild}) => {

    try {

        return db.ref(state.guild.id).once('value').then(function (snapshot) {

            // get guild settings or exit if undefined
            const guildSettings = snapshot.val();
            if (!guildSettings) return;

            // get channel settings or exit if undefined
            const settings = guildSettings[channel.id];
            if (!settings) return;

            // get text channel or exit if undefined (deleted)
            const textChannel = state.guild.channels.cache.find(ch => ch.id === settings.text);
            if (!textChannel) return;

            // exit if user changing mute/listen status
            if (channel?.id === oldChannel?.id) return;

            // exit if threshold is not reached
            if (channel.members.array().length < settings.min) return;

            // get and set last threshold 
            const lastThreshold = thresholdTimes.get(channel.id) ? thresholdTimes.get(channel.id) : Date.now();
            thresholdTimes.set(channel.id, Date.now());

            // exit if threshold already reached <1h ago
            if (lastThreshold && Date.now() - lastThreshold < 60 * 60 * 1000) return; 

            // exit if user is leaving a channel
            if (!channel) return;

            // get last broadcast and exit if already sent <1h ago
            const lastBroadcast = broadcastTimes.get(channel.id)
            if (lastBroadcast && Date.now() - lastBroadcast < 60 * 60 * 1000) return; 

            // set last broadcast
            broadcastTimes.set(channel.id, Date.now());

            // get potential roles to mention
            const rolesList = settings.roles && settings.roles.map(rl => ' <@&' + rl + '>'); //mention roles

            // send message
            textChannel.send(`**:microphone2: A voice chat is taking place in the "${channel.name}" channel !\n${rolesList}**`) //send message

            const embedObj = {
                "color": 16007990,
                "author": {
                    "name": "Click here to add MakePDF bot : Document to PDF converter.",
                    "url": "https://discord.com/oauth2/authorize?client_id=689807933415882762&scope=bot&permissions=52224",
                    "icon_url": "https://images.discordapp.net/avatars/689807933415882762/e8aaa78cc19cc41a2c3bee87ee716c7e.png"
                }
            }
            //if (!state.guild.member("689807933415882762") && Math.random() < 0.33) textChannel.send({ embed: embedObj });

        });

    } catch (ex) {

        console.log(`Error : ${ex}`);
        hook.send(`Error : ${ex}`);

    }

});

bot.on("message", async msg => {

    try {

        if (msg.author.bot) return;
        if (!msg.mentions?.has(msg.guild.me, { ignoreEveryone: true })) return;
        const args = msg.content?.toLowerCase().split(/ +/g);

        if (msg.member.hasPermission('ADMINISTRATOR')) {

            if (args[1] == "enable") {

                if (!msg.member.voice?.channel) return msg.reply("you must be in a voice channel to do this.");

                const threshold = (/^\d+$/.test(args[2])) ? args[2] : 5; //get threshold
                const roles = msg.mentions.roles; //get roles

                const dbGuild = db.ref(msg.guild.id); //get guild
                const dbChannel = dbGuild.child(msg.member.voice.channel.id); //get voice channel

                dbChannel.child("min").set(parseInt(threshold)); //set threshold
                dbChannel.child("roles").set(roles.keyArray()); //set roles
                dbChannel.child("text").set(parseInt(msg.channel.id)); //set text channel

                return msg.reply(`when ${threshold} people or more are connected to "${msg.member.voice.channel.name}", we will send an alert in <#${msg.channel.id}> mentioning ${roles.size} role(s).`);

            } else if (args[1] == "disable") {

                if (!msg.member.voice?.channel) return msg.reply("you must be in a voice channel to do this.");

                const dbGuild = db.ref(msg.guild.id); //get guild

                dbGuild.child(msg.member.voice.channel.id).remove(); //delete voice channel

                return msg.reply(`notifications have been disabled for "${msg.member.voice.channel.name}".`);

            } else {

                return msg.reply(`here are the bot commande to enable & disable voice chat notifications (administrators only) :

\`@VoiceNotify enable [threshold] [roles]\`
Enables voice chat notifications for the voice channel you are in, alerts will be sent to the channel where this command is executed.
Optional : [threshold] to trigger an alert defaults to 5 people ; [roles] will be mentioned when the alert is sent.
                
\`@VoiceNotify disable\`
Disables voice chat notifications for the voice channel you are in.`);

            }

        }

    } catch (ex) {

        console.log(`Error : ${ex}`);
        hook.send(`Error : ${ex}`);

    }

});

bot.login(process.env.VOICENOTIFY_DISCORD_TOKEN);