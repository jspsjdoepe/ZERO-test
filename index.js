const {
    Client,
    GatewayIntentBits,
    PermissionsBitField
} = require("discord.js");

// ضع توكن البوت هنا
const TOKEN = "YOUR_BOT_TOKEN";

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const prefix = "!";

client.once("ready", () => {
    console.log(`✅ ${client.user.tag} Online`);
});

// ترحيب
client.on("guildMemberAdd", member => {
    const channel = member.guild.channels.cache.find(
        c => c.name === "welcome"
    );

    if (channel) {
        channel.send(`🎉 أهلاً بك ${member} في السيرفر!`);
    }
});

client.on("messageCreate", async message => {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const cmd = args.shift().toLowerCase();

    // بان
    if (cmd === "ban") {
        if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers))
            return;

        const member = message.mentions.members.first();
        if (!member) return message.reply("حدد العضو.");

        await member.ban();
        message.reply(`🔨 تم حظر ${member.user.tag}`);
    }

    // كيك
    if (cmd === "kick") {
        if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers))
            return;

        const member = message.mentions.members.first();
        if (!member) return message.reply("حدد العضو.");

        await member.kick();
        message.reply(`👢 تم طرد ${member.user.tag}`);
    }

    // حذف
    if (cmd === "clear") {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages))
            return;

        const amount = parseInt(args[0]);
        if (!amount || amount < 1 || amount > 100)
            return message.reply("اختر عدد بين 1 و100");

        await message.channel.bulkDelete(amount, true);
        message.channel.send(`🗑️ تم حذف ${amount} رسالة`);
    }

    // ميوت ساعة
    if (cmd === "mute") {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers))
            return;

        const member = message.mentions.members.first();
        if (!member) return;

        await member.timeout(60 * 60 * 1000);
        message.reply(`🔇 تم ميوت ${member.user.tag} لمدة ساعة`);
    }

    // بنغ
    if (cmd === "ping") {
        message.reply(`🏓 ${client.ws.ping}ms`);
    }

    // أوامر
    if (cmd === "help") {
        message.reply(`
!ban @user
!kick @user
!mute @user
!clear 10
!ping
        `);
    }
});

client.login(TOKEN);
