const axios = require('axios').default;
const {MessageEmbed} = require('discord.js'); 
const instance = axios.create({
    baseURL: 'https://game-of-thrones-quotes.herokuapp.com/v1'
  });

async function getRandomQuotes(message, args) {
    const randomQuotesUrl = "/random";
    try {
        const result = await instance.get(randomQuotesUrl);
        const {sentence, character: {name, house: {name:houseName}}} = result.data;
        const randomQuoteMessage = new MessageEmbed()
                                            .setDescription(sentence)
                                            .setFooter(`${name}, ${houseName}`);
        message.channel.send(randomQuoteMessage);
    } catch(error) {
        const errorMessage = new MessageEmbed()
        .setTitle("Something went wrong: Error getting quotes from Arya Stark")
        .setColor("RED");
        message.channel.send(errorMessage);
    }
}

module.exports = {
    execute(client, message, args) {
        getRandomQuotes(message, args);
    }
}