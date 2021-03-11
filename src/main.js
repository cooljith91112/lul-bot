require('dotenv').config();

const { Client } = require('discord.js');

const client = new Client();
const CMD_PREFIX = "!"
client.on('message', (message) => {
    if (message.author.bot) return;
    if (message.content.startsWith(CMD_PREFIX)) {

    } else {
        message.reply(parseCasualMessage(message));
    }
});

function parseCasualMessage(message) {
    const {content} = message;
    switch(content.trim()) {
        case 'hello': return `Hey ${message.author} 🙋‍♂️. How Are You?`;
        case 'ഹലോ': return `ഹല്ലാ.... ഇതാരാ ${message.author}യോ... സുഖം തന്നെ?`;
        case 'എന്തൊക്കെ ഉണ്ട് വിശേഷം':
        case 'enthokke und vishesham' :  return `അങ്ങിനെ പോണു...🤷‍♂️ സുഖങ്ങളൊക്കെ തന്നെ?`;
        case 'മനുസ്സനല്ലേ പുള്ളെ' :
        case 'manusanalle pulle': return `ഇറച്ചിയും ബറോട്ടയും വേണായിരിക്കും... 🤣🤣🤣`;
        case 'നീ ആരാ':
        case 'nee aara':  return `താൻ ആരാണെന്ന് തനിക്ക് അറിയാന്മേലെങ്കിൽ താൻ എന്നോട് ചോയ്ക്ക് താൻ ആരാണെന്ന്??? തനിക്ക് ഞാൻ പറഞ്ഞു തരാം താൻ ആരാണെന്ന്... 🤪🤪`;
    }
}

client.login(process.env.LUL_BOT_TKN)
    .then(() => {
        console.log("BOT Logged in");
    })
    .catch((error) => {
        console.error("BOT Login Failed ", error);
    });
