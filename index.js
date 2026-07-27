const {
  Client,
  GatewayIntentBits,
  PermissionsBitField,
  ChannelType
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const PREFIX = "!";
const TOKEN = process.env.TOKEN;

client.once("ready", () => {
  console.log(`✅ ${client.user.tag} Online`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(PREFIX)) return;

  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === "ticket") {
    const existing = message.guild.channels.cache.find(
      ch => ch.name === `ticket-${message.author.id}`
    );

    if (existing) {
      return message.reply(`لديك تذكرة مفتوحة بالفعل: ${existing}`);
    }

    const channel = await message.guild.channels.create({
      name: `ticket-${message.author.id}`,
      type: ChannelType.GuildText,
      permissionOverwrites: [
        {
          id: message.guild.id,
          deny: [PermissionsBitField.Flags.ViewChannel]
        },
        {
          id: message.author.id,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.ReadMessageHistory
          ]
        }
      ]
    });

    await channel.send(
      `🎫 مرحباً ${message.author}\nاكتب مشكلتك هنا.\n\nلإغلاق التذكرة استخدم: !close`
    );

    message.reply(`✅ تم إنشاء التذكرة: ${channel}`);
  }

  if (command === "close") {
    if (!message.channel.name.startsWith("ticket-")) {
      return message.reply("هذا الأمر يعمل داخل التذاكر فقط.");
    }

    await message.channel.send("🔒 سيتم حذف التذكرة بعد 5 ثوانٍ...");

    setTimeout(async () => {
      await message.channel.delete();
    }, 5000);
  }
});

client.login(TOKEN);
