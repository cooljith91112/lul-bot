const Airtable = require('airtable');
const {MessageEmbed} = require('discord.js'); 
Airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: process.env.AIRTABLE_KEY
});
const base = Airtable.base('appppieGLc8loZp5H');
const AirTableConfigs = {
    MAIN_TABLE: 'cod_loadout',
    WEAPONS_TYPE_TABLE: 'Weapon Types',
    WEAPONS_TABLE: 'Weapons',
    GRID_VIEW: 'Grid view',
    WEAPON_TYPE: 'cod_weapon_type',
    WEAPON_NAME: 'cod_weapon_name',
    MATCH_TYPE: 'cod_match_type',
    ATTACHMENTS: 'cod_weapon_attachments',
};

async function getCodMLoadOut(message, args) {
    const codUserName = args[0];
    if (!codUserName) return;
    base(AirTableConfigs.MAIN_TABLE).select({
        maxRecords: 2,
        view: AirTableConfigs.GRID_VIEW,
        filterByFormula: `({cod_username} = '${args[0]}')`
    }).eachPage((records, fetchNextPage) => {
        if (records && records.length > 0) {
            records.forEach(async (record) => {
                const weaponType = await getWeaponType(record.get(AirTableConfigs.WEAPON_TYPE));
                const weaponName = await getWeaponName(record.get(AirTableConfigs.WEAPON_NAME));
                const loadOutMessage = new MessageEmbed()
                    .setTitle(`Loadout of ${codUserName} : ${record.get(AirTableConfigs.MATCH_TYPE)}`)
                    .addField('Weapon Name', weaponName, true)
                    .addField('Weapon Type', weaponType, true)
                    .addField('Attachments', record.get(AirTableConfigs.ATTACHMENTS), true)
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
        base(AirTableConfigs.WEAPONS_TYPE_TABLE).find(weaponType, (error, record) => {
            if (error) {
                console.log(error);
                reject();
            } else {
                resolve(record.get(AirTableConfigs.WEAPON_TYPE));
            }
        });
    })
}

async function getWeaponName(weaponName) {
    return new Promise((resolve, reject) => {
        base(AirTableConfigs.WEAPONS_TABLE).find(weaponName, (error, record) => {
            if (error) {
                console.log(error);
                reject();
            } else {
                resolve(record.get(AirTableConfigs.WEAPON_NAME));
            }
        });
    })
}

module.exports = {
    execute(client,message, args) {
        getCodMLoadOut(message,args);
    }
}