require('dotenv').config();
const fs = require('fs');
const { Client, MessageEmbed, Collection } = require('discord.js');
const fetch = require('node-fetch');
const confusion = require('./commons/confusion');
const client = new Client();
client.commands = new Collection();
let casualMessages = {};
const CMD_PREFIX = "!";

client.on('message', (message) => {
    if (message.author.bot) return;
    if (message.content.startsWith(CMD_PREFIX)) {
        const commandReply = parseCMD(message);
        if (!commandReply) {
            confusion.execute(message);
        }
    } else {
        const replyMessage = parseCasualMessage(message);
        if (replyMessage) {
            message.reply(replyMessage);
        }
    }
});

client.on('ready', () => {
    console.log("BOT is now LIVE");
    initConfig();
    initLanguages();
})

function initConfig() {
    fs.readFile('src/configs/commands.config.json', 'utf8', (error, data) => {
        if (error) throw error;
        const { commands } = JSON.parse(data);
        if (commands) {
            commands.forEach(command => {
                const commandFile = require(command.file);
                client.commands.set(command.name, commandFile);
            });
        }
    })
}

function initLanguages() {
    fs.readFile('src/language/language.json', 'utf8', (error, data) => {
        if (error) throw error;
        casualMessages = JSON.parse(data);
    });
}

function parseCasualMessage(message) {
    const { content } = message;
    const parsedMessage = content.trim().toLowerCase();
    if (!casualMessages.hasOwnProperty(parsedMessage)) return null;
    return casualMessages[parsedMessage];
}

function parseCMD(message) {
    const [CMD_NAME, ...args] = message.content
        .trim()
        .substring(CMD_PREFIX.length)
        .split(/\s+/);

    if (!client.commands.has(CMD_NAME)) return false;

    client.commands.get(CMD_NAME).execute(client, message, args);

    return true;
}

client.login(process.env.LUL_BOT_TKN)
    .catch((error) => {
        console.error("BOT Login Failed ", error);
    });
