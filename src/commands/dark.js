const axios = require('axios').default;
const { MessageEmbed } = require('discord.js');
const instance = axios.create({
    baseURL: 'https://dark-api.herokuapp.com/api/v1'
});

async function getRandomQuotes(message, args) {
    const randomQuotesUrl = "/quote/random";
    try {
        const result = await instance.get(randomQuotesUrl);
        const { author, season, episode, quote } = result.data;
        const randomQuoteMessage = new MessageEmbed()
            .setDescription(quote)
            .setFooter(`${author}, S${season} : Episode - ${episode}`);
        message.channel.send(randomQuoteMessage);
    } catch (error) {
        const errorMessage = new MessageEmbed()
            .setTitle("Something went wrong: Error getting quotes from Mikkel Nielsen")
            .setColor("RED");
        message.channel.send(errorMessage);
    }
}

module.exports = {
    execute(client, message, args) {
        getRandomQuotes(message, args);
    }
}

