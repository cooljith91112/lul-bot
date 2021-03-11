require('dotenv').config();

const { Client, MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const client = new Client();
const CMD_PREFIX = "!"
client.on('message', (message) => {
    if (message.author.bot) return;
    if (message.content.startsWith(CMD_PREFIX)) {
        const commandReply = parseCMD(message);
        if (commandReply && (typeof commandReply != "object")) {
            message.reply(commandReply);
        } else if(typeof commandReply != "object"){
            generateConfusionGif(message);
        }

    } else {
        const replyMessage = parseCasualMessage(message);
        if (replyMessage) {
            message.reply(replyMessage);
        } else {

        }
    }
});

function parseCasualMessage(message) {
    const { content } = message;
    switch (content.trim().toLowerCase()) {
        case 'hello':
        case 'hi':
            return `Hey ${message.author} 🙋‍♂️. How Are You?`;
        case 'ഹലോ':
        case 'ഹി':
            return `ഹല്ലാ.... ഇതാരാ ${message.author}യോ... സുഖം തന്നെ?`;
        case 'എന്തൊക്കെ ഉണ്ട് വിശേഷം':
        case 'enthokke und vishesham':
        case 'enthokkeyund vishesham': return `അങ്ങിനെ പോണു...🤷‍♂️ സുഖങ്ങളൊക്കെ തന്നെ?`;
        case 'മനുസ്സനല്ലേ പുള്ളെ':
        case 'manusanalle pulle': return `ഇറച്ചിയും ബറോട്ടയും വേണായിരിക്കും... 🤣🤣🤣`;
        case 'നീ ആരാ':
        case 'nee araa': return `താൻ ആരാണെന്ന് തനിക്ക് അറിയാന്മേലെങ്കിൽ താൻ എന്നോട് ചോയ്ക്ക് താൻ ആരാണെന്ന്??? തനിക്ക് ഞാൻ പറഞ്ഞു തരാം താൻ ആരാണെന്ന്... 🤪🤪`;
        default: return null;
    }
}

function generateConfusionGif(message) {
    message.channel.startTyping();
    const embed = new MessageEmbed()
        .setDescription(`I dont understand what you are saying <@${process.env.KLIAS_TAG}> do you know what this guy is asking?`)
        .setColor("RANDOM");
    const randomIndex = Math.floor(Math.random() * 9);
    fetch(`https://api.tenor.com/v1/random?key=${process.env.TENOR_TOKEN}&q=I%20dont%20understand&limit=10`)
        .then(res => res.json())
        .then(response => {
            embed.setImage(response.results[randomIndex].media[0].gif.url);
            message.channel.stopTyping();
            message.channel.send(embed);
        });
}

function parseCMD(message) {
    const [CMD_NAME, ...args] = message.content
        .trim()
        .substring(CMD_PREFIX.length)
        .split(/\s+/);
    switch (CMD_NAME) {
        case 'jokes': randomJokes(message); return {};
        default: return null;
    }
}

function randomJokes(message) {
    message.channel.startTyping();
    fetch(`https://official-joke-api.appspot.com/jokes/random`)
    .then(res => res.json())
    .then(response => {
        message.channel.stopTyping();
        if(response) {
            message.channel.startTyping();
            message.reply(response.setup);
            setTimeout(() => {
                message.channel.stopTyping();
                message.reply(response.punchline);
            }, 5000)
        }  

        console.log(response);
    })
}

client.login(process.env.LUL_BOT_TKN)
    .then(() => {
        console.log("BOT Logged in");
    })
    .catch((error) => {
        console.error("BOT Login Failed ", error);
    });
