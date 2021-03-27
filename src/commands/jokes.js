const fetch = require('node-fetch');

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


module.exports = {
    execute(client,message, args) {
        randomJokes(message);
    }
}