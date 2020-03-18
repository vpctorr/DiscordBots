require('dotenv').config()

const Discord = require('discord.js');
const bot = new Discord.Client();

const DBL = require("dblapi.js");
try {
    const dbl_ = new DBL(process.env.MAKEPDF_TOPGG_TOKEN, bot);
} catch (ex) {
    console.log(`Error : ${ex}`);
}

const https = require('https');
const libre = require('libreoffice-convert');

// Bot will be able to send & receive to Discord only after this
bot.on("ready", () => {
    console.log('MakePDF bot started & ready to answer !');
    bot.user.setActivity(`${bot.guilds.cache.size} servers ⚡`, { type: 'WATCHING' });
});

bot.on("guildCreate", guild => {
    bot.user.setActivity(`${bot.guilds.cache.size} servers ⚡`, { type: 'WATCHING' });
});

bot.on("guildDelete", guild => {
    bot.user.setActivity(`${bot.guilds.cache.size} servers ⚡`, { type: 'WATCHING' });
});

// On message received
bot.on('message', async msg => {

    try {

        if (msg.author.id == bot.user.id) return

        const Attachment = (msg.attachments).array();

        if (Attachment === undefined || Attachment === null) return;

        Attachment.forEach((attachment) => {

            if (attachment === undefined || attachment === null) return;

            const fileName = attachment.name;

            const formats = process.env.MAKEPDF_SETTINGS_FORMATS.split(',');
            const extension = fileName.substring(fileName.lastIndexOf(".") + 1);

            if (formats.includes(extension)) {

                https.get(attachment.url, res => {

                    const bufs = [];

                    res.on('data', function (chunk) {
                        bufs.push(chunk)
                    });

                    res.on('error', function (err) {
                        console.log(`Error during HTTP request : ${err.message}`);
                    });

                    res.on('end', function () {

                        const fileData = Buffer.concat(bufs);

                        libre.convert(fileData, ".pdf", undefined, (err, pdfData) => {

                            if (err) {
                                msg.channel.send(`Sorry, the conversion has failed :(`);
                                console.log(`Error converting file : ${err}`);
                            }

                            const newName = fileName.substring(0, fileName.lastIndexOf(".")) + ".pdf";
                            const newAttachment = new Discord.MessageAttachment(pdfData, newName);
                            msg.channel.send(`Here is your converted PDF file !`, newAttachment);

                        });

                    });

                });

            }

        });

    } catch (ex) {

        console.log(`Error : ${ex}`);

    }

});

bot.login(process.env.MAKEPDF_DISCORD_TOKEN);