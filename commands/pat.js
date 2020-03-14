const h = require("../jsons/fact.json");
const { colour } = require("../shh/config.json");
const Discord = require("discord.js");
module.exports = {
  name: "pat",
  description: "pat upgrades",
  aliases: [
    "p",
    "pf",
    "fusty",
    "patfusty",
    "frosty",
    "snowman",
    "fusticator",
    "patfrosty",
    "thicc"
  ],
  usage: "!pat <level>",
  execute(message, args, client) {
    if (!args) {
      return message.channel.send(
        `Please specify a level \`\`e.g.: ${message.content} 4\`\``
      );
    }
    const hh = h["pat"][parseInt(args[0])];
    if (!hh) return message.channel.send("Please specify a valid hero level!");
    const heroEmbed = new Discord.RichEmbed()
      .setTitle("Pat Fusty")
      .addField("cost", `${hh.cost}`)
      .addField("desc", `${hh.desc}`)
      .setFooter("use q!ap for help and elaboration")
      .setColor(colour);
    message.channel.send(heroEmbed);
  }
};
