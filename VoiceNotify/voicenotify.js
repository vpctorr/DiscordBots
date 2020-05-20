require('dotenv').config()
const Discord = require('discord.js');

// Create an instance of a Discord client
const client = new Discord.Client();

// Bot will be able to send & receive to Discord only after this
client.on("ready", () => {
    console.log('VoiceNotify bot started & ready to answer !');
    client.user.setActivity(`${client.guilds.cache.size} servers ⚡`, { type: 'WATCHING' });
});

client.on("guildCreate", guild => {
    client.user.setActivity(`${client.guilds.cache.size} servers ⚡`, { type: 'WATCHING' });
});

client.on("guildDelete", guild => {
    client.user.setActivity(`${client.guilds.cache.size} servers ⚡`, { type: 'WATCHING' });
});

// On msg received
client.on('voiceStateUpdate', async (oldState, state) => {

    try {

        if (state.channel.members.length > 5) {



        }

    } catch (ex) {

        console.log(`Error : ${ex}`);

    }

});

client.on("message", async msg => {

    console.log(msg.content)

    try {

        if (msg.author.bot) return;
        if (msg.content.indexOf(process.env.PREFIX) !== 0) return;
        const args = msg.content.slice(process.env.PREFIX).trim().split(/ +/g);
        const command = args.shift().toLowerCase();

        if (msg.member.hasPermission('ADMINISTRATOR')) {

            if (command === "enable") {

                return msg.reply("Voice chat notifications will be sent to this channel.");

            } else {

                return msg.reply(`here are the bot command to enable & disable voice chat notifications (administrators only) :

\`@VoiceNotify enable [threshold]\`
Enables voice chat notifications for the voice channel you are in, alerts will be sent to the channel where this command is executed.
Threshold is the minimum amount of connected people to trigger a notification (optional setting, must be a number, default is 5).
                
\`@VoiceNotify enableall [threshold]\`
Same as "enable" command, but applies to every voice channel on the server.
                
\`@VoiceNotify disable\`
Disables voice chat notifications for the voice channel you are in.
                
\`@VoiceNotify disableall\`
Same as "disable" command, but applies to every voice channel on the server`);

            }

        } else {

            // regular user settings

        }

    } catch (ex) {

        console.log(`Error : ${ex}`);

    }

});

client.login(process.env.TOKEN);