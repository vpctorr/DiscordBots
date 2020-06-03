require('dotenv').config()

const Discord = require('discord.js');
const bot = new Discord.Client();

const DBL = require("dblapi.js");
try {
    const dbl_ = new DBL(process.env.VOICENOTIFY_TOPGG_TOKEN, bot);
} catch (ex) {
    console.log(`Error : ${ex}`);
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

// Bot will be able to send & receive to Discord only after this
bot.on("ready", () => {
    console.log('VoiceNotify bot started & ready to answer !');
    bot.user.setActivity(`${bot.guilds.cache.size} servers ⚡`, { type: 'WATCHING' });
});

bot.on("guildCreate", guild => {
    bot.user.setActivity(`${bot.guilds.cache.size} servers ⚡`, { type: 'WATCHING' });
});

bot.on("guildDelete", guild => {
    bot.user.setActivity(`${bot.guilds.cache.size} servers ⚡`, { type: 'WATCHING' });
});

var lastJoinTime = new Map(); //last join time per channel

// On msg received
bot.on('voiceStateUpdate', async (oldState, state) => {

    try {

        return db.ref(state.guild.id).once('value').then(function (snapshot) {

            var dbServerData = snapshot.val();

            if (dbServerData == undefined) return; //return if server is not in db

            var voiceChannel = state.channel;

            if (voiceChannel == undefined) return; //return if user is leaving a channel

            if (oldState.channel != undefined && voiceChannel.id == oldState.channel.id) return; //return if user changing mute/listen status

            var dbChannelData = dbServerData[voiceChannel.id];

            if (dbChannelData == undefined) return; //return if voice channel is not in db

            if (voiceChannel.members.array().length < dbChannelData.min) return; //return if threshold is not reached

            if (Date.now() - lastJoinTime.get(voiceChannel.id) < 30 * 60 * 1000) return lastJoinTime.set(voiceChannel.id, Date.now()); //return if last join is >30m ago + update last join

            lastJoinTime.set(voiceChannel.id, Date.now()); //update last join

            var textChannel = state.guild.channels.cache.find(ch => ch.id == dbChannelData.text);

            if (textChannel == undefined) return; //return if text channel does not exists

            var rolesList = "";

            if (dbChannelData.roles != undefined) rolesList = dbChannelData.roles.map(el => ' <@&' + el + '>'); //mention roles

            textChannel.send(`**:microphone2: A voice chat is taking place in the "${voiceChannel.name}" channel !\n${rolesList}**`) //send message

            const embedObj = {
                "color": 16007990,
                "author": {
                    "name": "Click here to add MakePDF bot : Document to PDF converter.",
                    "url": "https://discord.com/oauth2/authorize?client_id=689807933415882762&scope=bot&permissions=52224",
                    "icon_url": "https://images.discordapp.net/avatars/689807933415882762/e8aaa78cc19cc41a2c3bee87ee716c7e.png"
                }
            }
            if (!state.guild.member("689807933415882762") && Math.random() < 0.75) {
                textChannel.send({ embed: embedObj });
            }

        });

    } catch (ex) {

        console.log(`Error : ${ex}`);

    }

});

bot.on("message", async msg => {

    try {

        if (msg.author.bot) return;
        if (!msg.mentions.has(msg.guild.me, { ignoreEveryone: true })) return;
        var args = msg.content.toLowerCase().split(/ +/g);

        if (msg.member.hasPermission('ADMINISTRATOR')) {

            if (args[1] == "enable") {

                if (msg.member.voice.channel == undefined) return msg.reply("you must be in a voice channel to do this.");

                var threshold = 5; //get threshold
                if (/^\d+$/.test(args[2]) == true) threshold = args[2];

                var roles = msg.mentions.roles; //get roles
                if (!msg.mentions.has(msg.guild.me, { ignoreRoles: true })) roles.delete(msg.mentions.roles.first().id); //if bot was mentionned with role delete first role
                // https://github.com/discordjs/discord.js/issues/2669

                var dbGuild = db.ref(msg.guild.id); //set server
                var dbChannel = dbGuild.child(msg.member.voice.channel.id); //set voice channel
                dbChannel.child("min").set(parseInt(threshold)); //set threshold
                dbChannel.child("roles").set(roles.keyArray()); //set roles
                dbChannel.child("text").set(parseInt(msg.channel.id)); //set text channel

                return msg.reply(`when ${threshold} people or more are connected to "${msg.member.voice.channel.name}", we will send an alert in <#${msg.channel.id}> mentioning ${roles.size} role(s).`);

            } else if (args[1] == "disable") {

                if (msg.member.voice.channel == undefined) return msg.reply("you must be in a voice channel to do this.");

                var dbGuild = db.ref(msg.guild.id); //get server

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

        } else {

            // regular user settings

        }

    } catch (ex) {

        console.log(`Error : ${ex}`);

    }

});

bot.login(process.env.VOICENOTIFY_DISCORD_TOKEN);