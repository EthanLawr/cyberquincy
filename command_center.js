const fs = require('fs')
const secretsConfig = require('./1/config.json')
const Advertisements = require('./helpers/advertisements.js')

module.exports = {
    PREFIX: secretsConfig.prefix,

    XPCOMMANDS: ['level', 'setxp', 'deletexp', 'freezexp', 'resumexp'],

    configureCommands(client) {
        client.commands = new Discord.Collection()

        // List of command files
        const commandFiles = fs
            .readdirSync('./commands')
            .filter((file) => file.endsWith('.js'))

        // Register commands
        for (const file of commandFiles) {
            const command = require(`./commands/${file}`)
            client.commands.set(command.name, command)
        }
    },

    async handleCommand(message) {
        try {
            // checks for bots
            if (message.author.bot) return

            // "Normalize" message
            const c = message.content.toLowerCase()

            // Queries must begin with q!
            if (!c.startsWith(module.exports.PREFIX)) return

            // ...and have no following space (it's a common mistake)
            if (c.startsWith(module.exports.PREFIX + ' ')) {
                return message.channel.send(
                    'There isnt a space between q! and the command name.'
                )
            }

            // If the channel topic is set to something like no{oooo}c, then commands are blocked
            if (/no+c/i.test(message.channel.topic)) return

            // Command tokens are space-separated tokens starting immediately after the `!`
            const args = c.slice(module.exports.PREFIX.length).split(/ +/)

            // The command name is the first token; args are the rest
            const commandName = args.shift().toLowerCase()

            // Search through command names taking into account their aliases
            const command =
                client.commands.get(commandName) ||
                client.commands.find(
                    (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
                )

            if (!command) {
                return message.channel.send(
                    `${commandName} is not a valid command. Type \`q!alias\` for a list of all available commands.`
                )
            }

            // Keeps track of cooldowns for commands/users and determines if cooldown has expired
            if (Cooldowns.handleCooldown(command, message)) {
                command.execute(message, args)

                // Don't want the user gaining xp from metacommands
                if (
                    !module.exports.XPCOMMANDS.includes(command.name) &&
                    xpEnabled
                ) {
                    Xp.addCommandXp(message)
                }

                // May or may not embed an advertisement message in addition to the command output

                Advertisements.spin(message)
            }
        } catch (error) {
            // in case of command failures
            console.error(error)
            const errorEmbed = new Discord.MessageEmbed()
                .setColor(colours.red)
                .setDescription('Oh no! Something went wrong!')
                .addField(
                    '~~I got bonked by a DDT again~~',
                    'Please [report the bug](https://discord.gg/VMX5hZA)'
                )
            return message.channel.send(errorEmbed)
        }
    }
}