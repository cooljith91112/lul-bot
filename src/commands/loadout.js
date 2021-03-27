const Airtable = require('airtable');
const {MessageEmbed} = require('discord.js'); 
Airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: process.env.AIRTABLE_KEY
});
const base = Airtable.base('appppieGLc8loZp5H');
const AirTableFields = {
    WEAPON_TYPE: 'cod_weapon_type',
    WEAPON_NAME: 'cod_weapon_name',
    MATCH_TYPE: 'cod_match_type',
    ATTACHMENTS: 'cod_weapon_attachments'
};

async function getCodMLoadOut(message, args) {
    const codUserName = args[0];
    if (!codUserName) return;
    base('cod_loadout').select({
        maxRecords: 2,
        view: "Grid view",
        filterByFormula: `({cod_username} = '${args[0]}')`
    }).eachPage((records, fetchNextPage) => {
        if (records && records.length > 0) {
            records.forEach(async (record) => {
                const weaponType = await getWeaponType(record.get(AirTableFields.WEAPON_TYPE));
                const weaponName = await getWeaponName(record.get(AirTableFields.WEAPON_NAME));
                const loadOutMessage = new MessageEmbed()
                    .setTitle(`Loadout of ${codUserName} : ${record.get(AirTableFields.MATCH_TYPE)}`)
                    .addField('Weapon Name', weaponName, true)
                    .addField('Weapon Type', weaponType, true)
                    .addField('Attachments', record.get(AirTableFields.ATTACHMENTS), true)
                    .setColor("RANDOM");
                message.channel.send(loadOutMessage);
            });
            fetchNextPage();
        } else {
            message.channel.send(`No Loadout found for ***${codUserName}***`);
        }

    }, function done(err) {
        if (err) { console.error(err); return; }
    });
}

async function getWeaponType(weaponType) {
    return new Promise((resolve, reject) => {
        base('Weapon Types').find(weaponType, (error, record) => {
            if (error) {
                console.log(error);
                reject();
            } else {
                resolve(record.get(AirTableFields.WEAPON_TYPE));
            }
        });
    })
}

async function getWeaponName(weaponName) {
    return new Promise((resolve, reject) => {
        base('Weapons').find(weaponName, (error, record) => {
            if (error) {
                console.log(error);
                reject();
            } else {
                resolve(record.get(AirTableFields.WEAPON_NAME));
            }
        });
    })
}

module.exports = {
    execute(client,message, args) {
        getCodMLoadOut(message,args);
    }
}