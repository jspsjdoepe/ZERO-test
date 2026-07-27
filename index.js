const {
    Client,
    GatewayIntentBits,
    PermissionsBitField
} = require("discord.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const PREFIX = "!";
const TOKEN = process.env.TOKEN;

if (!TOKEN) {
    console.error("❌ TOKEN variable not found in Railway.");
    process.exit(1);
}

client.once("ready", () => {
    console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on("guildMemberAdd", member => {
    const channel = member.guild.channels.cache.find(
        ch => ch.name === "welcome"
    );

    if (channel) {
        channel.send(`🎉 أهلاً وسهلاً ${member} في السيرفر!`);
    }
});

client.on("messageCreate", async message => {
    if (message.author.bot) return;
    if (!message.content.startsWith(PREFIX)) return;

    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === "ping") {
        return message.reply(`🏓 ${client.ws.ping}ms`);
    }

    if (command === "ban") {
        if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers))
            return message.reply("❌ ليس لديك صلاحية.");

        const member = message.mentions.members.first();
        if (!member) return message.reply("❌ منشن العضو.");

        await member.ban();
        return message.channel.send(`🔨 تم حظر ${member.user.tag}`);
    }

    if (command === "kick") {
        if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers))
            return message.reply("❌ ليس لديك صلاحية.");

        const member = message.mentions.members.first();
        if (!member) return message.reply("❌ منشن العضو.");

        await member.kick();
        return message.channel.send(`👢 تم طرد ${member.user.tag}`);
    }

    if (command === "mute") {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers))
            return message.reply("❌ ليس لديك صلاحية.");

        const member = message.mentions.members.first();
        if (!member) return message.reply("❌ منشن العضو.");

        await member.timeout(60 * 60 * 1000);
        return message.channel.send(`🔇 تم ميوت ${member.user.tag} لمدة ساعة`);
    }

    if (command === "clear") {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages))
            return message.reply("❌ ليس لديك صلاحية.");

        const amount = parseInt(args[0]);

        if (!amount || amount < 1 || amount > 100)
            return message.reply("❌ اختر عدد بين 1 و100.");

        await message.channel.bulkDelete(amount, true);
        return message.channel.send(`🗑️ تم حذف ${amount} رسالة`);
    }

    if (command === "help") {
        return message.reply(`
📋 الأوامر:

!ping
!ban @user
!kick @user
!mute @user
!clear 10
        `);
    }
});

client.login(TOKEN);
