const axios = require('axios').default;
const {MessageEmbed} = require('discord.js'); 
const instance = axios.create({
    baseURL: 'https://cdn-api.co-vin.in/api/v2',
    headers: {
        'accept': '*/*',
        'accept-language': 'en-US',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36'
    }
  });
async function getVaccineAvailablity(message, args) {
    const [pincode, date] = args;
    const url = `/appointment/sessions/public/findByPin?${new URLSearchParams({ pincode, date })}`;
    instance.get(url).then(res => {
        if (res.data && res.data.sessions) {
            const {sessions} = res.data;
            if (sessions && sessions.length > 0 ){
                sessions.forEach(async (session) => {
                    const vaccineMessage = new MessageEmbed()
                        .setTitle(`${session.name} : ${session.address}`)
                        .addField('State', session.state_name, true)
                        .addField('District', session.district_name, true)
                        .addField('Vaccine', session.vaccine, true)
                        .addField('Available Capacity', session.available_capacity, true)
                        .addField('Available SLots', session.slots.join("/"), true)
                        .setColor("RANDOM");
                    message.channel.send(vaccineMessage);
                })

            }else {
                message.channel.send(`No Vaccine Available at place with pincode => ${pincode} on ${date}`)
            }
        }
    }).catch(error =>  message.channel.send(`Error Fetching Data from Cowin`));
}

module.exports = {
    execute(client, message, args) {
        getVaccineAvailablity(message, args);
    }
}