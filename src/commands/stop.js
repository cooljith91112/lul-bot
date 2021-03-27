async function stopMusik(client,message) {
    const voiceChannel = message.member.voice.channel;

    if (!voiceChannel) {
        return message.channel.send("Join a voice channel to Execute this command");
    }

    await voiceChannel.leave();
    await message.channel.send("Stoping Music... Baye Baye.... 😅");
    client.user.setPresence({ activity: { name: `COMMANDS`, type: 'LISTENING' } });
}

module.exports = {
    execute(client,message, args) {
        stopMusik(client, message);
    }
}