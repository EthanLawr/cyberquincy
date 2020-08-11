xpCurve = require('../jsons/discord-user-xp.json')

module.exports = {
    async addCommandXp(message) {
        user = message.author

        let tag = await Tags.findOne({
            where: {
                name: user.id
            }
        })

        // Create db user if it doesn't already exist
        if (!tag) {
            tag = await Tags.create({
                name: user.id,
                xp: 0,
                showAds: true,
                showLevelUpMsg: true,
                quiz: 0
            })
        }

        xpGain = h.randomIntegerFromInclusiveRange(5, 12)

        oldLevel = module.exports.xpToLevel(tag.xp)

        Tags.update({ xp: tag.xp + xpGain }, { where: { name: user.id } })

        tag = await Tags.findOne({
            where: {
                name: user.id
            }
        })

        newLevel = module.exports.xpToLevel(tag.xp)

        const showlvlmsg = Tags.showLevelUpMsg

        if (showlvlmsg == false) return

        if (newLevel > oldLevel) {
            return module.exports.levelUpMessage(message, newLevel)
        }
    },

    xpToLevel(xp) {
        for (level = 1; level < xpCurve.length; level++) {
            if (xpCurve[level] > xp) return level
        }
        // If user's leveling calculation made it this far, assign the highest level
        return xpCurve.length
    },

    levelUpMessage(message, newLevel) {
        module.exports.levelUpRole(user, newLevel)
        user = message.author

        levelUpEmbed = new Discord.MessageEmbed()
            .setTitle('Level Up!')
            .addField(
                `Congratulations ${user.username}#${user.discriminator}!`,
                `You have advanced to level ${newLevel}`
            )
            .setFooter('Type `q!level` for more information; you can turn this message off using q!toggle lvl')
            .setColor(colours.green)

        message.channel.send(levelUpEmbed)
    },
    async levelUpRole(user, newLevel) {
        const guildmember = client.guilds.cache
            .get('598768024761139240')
            .members.cache.array()
            .find((m) => m.id === user.id)
        if (newLevel === 3) {
            await guildmember.roles.add('645126928340353036')
        } else if (newLevel === 10) {
            // if member is level 10 add role
            await guildmember.roles.add('645629187322806272')
        }
    }
}