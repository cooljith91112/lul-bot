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
    let videoUrl = false;
    let video;
    const youtubeRegex = /(http:|https:)?\/\/(www\.)?(youtube.com|youtu.be)\/(watch)?(\?v=)?(\S+)?/; 
    if (youtubeRegex.test(args[0])) {
        video = args[0];
        videoUrl = true;
    } else {
        video = await searchVideo(args.join(' '));
    }

    if (video) {
        const youtubeStream = ytdl(videoUrl ? video : video.url, { filter: 'audioonly' });
        client.user.setPresence({ activity: { name: `${video.title}`, type: 'LISTENING' } });
        connection.play(youtubeStream, { seek: 0, volume: 1 })
            .on('finish', () => {
                voiceChannel.leave();
                client.user.setPresence({ activity: { name: ` ` } });
            });
        await message.reply(`Now Playing ${videoUrl ? args[0] : video.title}...`);
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