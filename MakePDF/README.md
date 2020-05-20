# MakePDF

## What this does

MakePDF is a Discord bot that automatically converts word processing, spreadsheet and presentation documents to PDF

[You can also directly add the bot here](https://discordapp.com/oauth2/authorize?client_id=689807933415882762&scope=bot&permissions=52224)

## Setting up
Install LibreOffice (Windows/Mac : use the installer as you normally would)
```
sudo apt-get install libreoffice-core --no-install-recommends
```
You MUST run this with environment variables, or alternatively use a `.env` file as follows
```
TOKEN=you_discord_token
FORMATS=doc,docx,odt,rtf,ppt,pps,pptx,ppsx,odp,xls,xlsx,ods,csv
```
Then run the bot with `node makepdf`