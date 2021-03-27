require('dotenv').config();
const { Client, MessageEmbed, Collection } = require('discord.js');
const fetch = require('node-fetch');
const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const Airtable = require('airtable');
Airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: process.env.AIRTABLE_KEY
});
const base = Airtable.base('appppieGLc8loZp5H');

const client = new Client();
const CMD_PREFIX = "!";
const dayToMilliS = 60 * 60 * 24 * 1000;

client.on('message', (message) => {
    if (message.author.bot) return;
    if (message.content.startsWith(CMD_PREFIX)) {
        const commandReply = parseCMD(message);
        if (commandReply && (typeof commandReply != "object")) {
            message.reply(commandReply);
        } else if (!commandReply) {
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

client.on('ready', () => {
    console.log("BOT is now LIVE");
})

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
        case 'kya banana hei': return `Thumarah banana kaha hei...🤣🤣`;
        case 'ക്യാ ബനാന ഹേയ്': return 'തുമരഹ് ബനാന കഹാ ഹേയ്...🤣🤣';
        case 'good night': return null;
        default: return null;
    }
}

function generateConfusionGif(message) {
    message.channel.startTyping();
    const embed = new MessageEmbed()
        .setDescription(`I dont understand what you are saying <@${process.env.KLIAS_TAG}> do you know what this guy is asking?`)
        .setColor("RANDOM");
    const randomIndex = Math.floor(Math.random() * 49);
    fetch(`https://api.tenor.com/v1/random?key=${process.env.TENOR_TOKEN}&q=I%20dont%20understand&limit=50`)
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
        case 'play': playMusik(message, args); return {};
        case 'stop': stopMusik(message); return {};
        case 'loadout': getCodMLoadOut(message, args); return{};
        default: return null;
    }
}

function randomJokes(message) {
    message.channel.startTyping();
    getJokes().then(response => {
        message.channel.stopTyping();
        if (response) {
            message.channel.startTyping();
            message.reply(response.setup);
            setTimeout(() => {
                message.channel.stopTyping();
                message.reply(`||${response.punchline}||`);
            }, 5000);
        }
    });
}

async function getJokes() {
    return fetch(`https://official-joke-api.appspot.com/jokes/random`)
        .then(res => res.json())
}

function intervalJokes() {
    getJokesChannel().then(channel => {
        if (channel) {
            // channel.bulkDelete(100);
            setInterval(jokeOfTheDay.bind(this, channel), dayToMilliS);
        }
    });
}

function jokeOfTheDay(channel) {
    getJokes().then(response => {
        if (response) {
            const joke = new MessageEmbed()
                .setTitle(`**${response.setup}**`)
                .setDescription(`||${response.punchline}||`)
                .setFooter('https://github.com/15Dkatz/official_joke_api')
                .setColor("RANDOM");
            channel.send(joke);
        }
    });
}



async function getJokesChannel() {
    const channel = await client.channels.fetch(process.env.JOKES_CHANNEL);
    return channel;
}

async function playMusik(message, args) {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
        return message.channel.send("Join a voice channel to Play Music");
    }
    const permission = voiceChannel.permissionsFor(message.client.user);
    if (!permission.has('CONNECT') || !permission.has('SPEAK')) {
        return message.channel.send("You don't have the permission to play music. 😥");
    }

    if (!args.length) {
        return message.channel.send("Please pass something to play as second argument");
    }

    const connection = await voiceChannel.join();
    const video = await searchVideo(args.join(' '));

    if (video) {
        const youtubeStream = ytdl(video.url, { filter: 'audioonly' });
        client.user.setPresence({activity: {name: `${video.title}`, type: 'LISTENING'}});
        connection.play(youtubeStream, { seek: 0, volume: 1 })
            .on('finish', () => {
                voiceChannel.leave();
                client.user.setPresence({activity: {name: ` `}});
            });
        await message.reply(`Now Playing ${video.title}...`);
    } else {
        message.channel.send("No music found to play for you mate. Try again! 👍");
    }
}

async function stopMusik(message) {
    const voiceChannel = message.member.voice.channel;

    if (!voiceChannel) {
        return message.channel.send("Join a voice channel to Execute this command");
    }

    await voiceChannel.leave();
    await message.channel.send("Stoping Music... Baye Baye.... 😅");
    client.user.setPresence({activity: {name: `COMMANDS`, type: 'LISTENING'}});
}

async function searchVideo(query) {
    const searchResult = await ytSearch(query);
    return (searchResult.videos.length > 1) ? searchResult.videos[0] : null;
}

async function getCodMLoadOut(message, args) {
    const codUserName = args[0];
    if(!codUserName) return;
    base('cod_loadout').select({
        maxRecords: 2,
        view: "Grid view",
        filterByFormula: `({cod_username} = '${args[0]}')`
    }).eachPage(function page(records, fetchNextPage) {
        records.forEach((record) => {
            const loadOutMessage = new MessageEmbed()
                .setTitle(`Loadout of ${codUserName} : ${record.get('cod_match_type')}`)
                .addField('Weapon Name', record.get('cod_weapon_name'),true)
                .addField('Weapon Type', record.get('cod_weapon_type'),true)
                .addField('Attachments', record.get('cod_weapon_attachments'),true)
                .setColor("RANDOM");
            message.channel.send(loadOutMessage);
        });
        fetchNextPage();
    
    }, function done(err) {
        if (err) { console.error(err); return; }
    });
}

client.login(process.env.LUL_BOT_TKN)
    .then(() => {
        intervalJokes();
    })
    .catch((error) => {
        console.error("BOT Login Failed ", error);
    });
