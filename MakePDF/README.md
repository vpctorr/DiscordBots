# MakePDF

## What this does

MakePDF is a Discord bot that automatically converts word processing, spreadsheet and presentation documents to PDF.

[You can also directly add the bot here](https://discord.com/oauth2/authorize?client_id=689807933415882762&scope=bot&permissions=52224)

## Setting it up

Install LibreOffice (Windows/Mac : Use the regular installer | Linux/Others : See below)

```
sudo apt-get install libreoffice-core --no-install-recommends
```

You MUST run this with environment variables, or alternatively use a `.env` file as follows
Set the desired formats allowed for conversion with the `MAKEPDF_SETTINGS_FORMATS` property

```
MAKEPDF_DISCORD_TOKEN=your_discord_token
MAKEPDF_SETTINGS_FORMATS=doc,docx,odt,rtf,ppt,pps,pptx,ppsx,odp,xls,xlsx,ods,csv
```

Then install the bot with `npm install` & start it with `npm start`
You might want to use a process manager such as PM2 to keep the bot running

## Using the bot

Simply add MakePDF to your server. It will automatically convert all supported files to PDF, in all the channels it has access to.
