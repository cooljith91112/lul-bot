const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
async function playMusik(client, message, args) {
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
        client.user.setPresence({ activity: { name: `${video.title}`, type: 'LISTENING' } });
        connection.play(youtubeStream, { seek: 0, volume: 1 })
            .on('finish', () => {
                voiceChannel.leave();
                client.user.setPresence({ activity: { name: ` ` } });
            });
        await message.reply(`Now Playing ${video.title}...`);
    } else {
        message.channel.send("No music found to play for you mate. Try again! 👍");
    }
}

async function searchVideo(query) {
    const searchResult = await ytSearch(query);
    return (searchResult.videos.length > 1) ? searchResult.videos[0] : null;
}


module.exports = {
    execute(client,message, args) {
        playMusik(client,message,args);
    }
}