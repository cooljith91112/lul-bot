const {MessageEmbed} = require('discord.js');
const fetch = require('node-fetch');
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

module.exports = {
    execute(message) {
        generateConfusionGif(message);
    }
}