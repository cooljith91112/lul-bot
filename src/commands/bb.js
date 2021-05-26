const axios = require('axios').default;
const { MessageEmbed } = require('discord.js');
const instance = axios.create({
    baseURL: 'https://breaking-bad-quotes.herokuapp.com/v1'
});

async function getRandomQuotes(message, args) {
    const randomQuotesUrl = "/quotes";
    try {
        const result = await instance.get(randomQuotesUrl);
        const { quote, author } = result.data[0];
        const randomQuoteMessage = new MessageEmbed()
            .setDescription(quote)
            .setFooter(`${author}`);
        message.channel.send(randomQuoteMessage);
    } catch (error) {
        const errorMessage = new MessageEmbed()
            .setTitle("Stay out of territory: Error getting quotes from Walter White")
            .setColor("RED");
        message.channel.send(errorMessage);
    }
}

module.exports = {
    execute(client, message, args) {
        getRandomQuotes(message, args);
    }
}