# Discord-MakePDF

## What this does

Discord-MakePDF is a Discord bot that automatically converts DOC, DOCX, ODT, RTF files to PDF

[You can also directly add the bot here](https://discordapp.com/oauth2/authorize?client_id=689807933415882762&scope=bot&permissions=52224)

## Setting up
Install LibreOffice (Windows/Mac : use the installer as you normally would)
```
sudo apt-get install libreoffice-core --no-install-recommends
```
Create a `config.json` file containing your bot token and supported formats as follows
```
{
	"token": "your_discord_token",
	"formats" : [ "doc", "docx", "odt", "rtf" ]
}
```
Run the bot with `node index`