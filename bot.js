const Discord = require('discord.js');
const config = require("./configfile.json");
const client = new Discord.Client();


var users = [];
var  guildVar;
var userDatabase = {};



client.on('ready', () => {
  console.log('I am ready!');

  guildVar = client.guilds.array()[0];

  var doit2 = () => {
    userDatabase = {};
    guildVar.fetchInvites().then(data => {
      var myArray = data.array();
      myArray.forEach((x)=>{
        var user_id = x.inviter.id + "";
        var invite_uses = x.uses;
        if (userDatabase.hasOwnProperty(user_id)) {
          userDatabase[user_id] += invite_uses;
        }
        else {
          userDatabase[user_id] = invite_uses;
        }
      });
    });
    setTimeout(doit2, config.time_interval);
  }
  doit2();
});



client.on('message', message => {

  if (message.channel.name === "check-invites") {

        if (message.author.bot) {message = null; return;}

        if (!message.content.startsWith(config.prefix)) {
          message.delete();
          message = null;
          return;
        }

        let command = message.content.split(" ")[0].slice(config.prefix.length);
        let args = message.content.split(" ").slice(1);

        var msg_author_id = "" + message.author.id;


        try{
          switch (command.toLowerCase()) {

            case "i":
            case "invite" :
            case "invites" : {

              if (userDatabase.hasOwnProperty(msg_author_id)) {
                var amount = userDatabase[msg_author_id];
                var ending;
                var psvar  = "*⏰      (The invite countes are refreshed every 5 minutes)*";
                var rolevalue = 0;

                if (amount < 1) { ending = "**1** more to become an **Affiliate**"; }
                else if (amount <10) { ending = "**" + (10-amount) + "** more to become a **Counselor**"; guildVar.members.get(msg_author_id).addRole(config.roles.Affiliate); }
                else if (amount <20) { ending = "**" + (20-amount) + "** more to become a **Minister**"; guildVar.members.get(msg_author_id).addRole(config.roles.Counselor); }
                else if (amount <50) { ending = "**" + (50-amount) + "** more to become a **Senator**"; guildVar.members.get(msg_author_id).addRole(config.roles.Minister); }
                else if (amount <150) { ending = "**" + (150-amount) + "** more to become an **Ambassador**"; guildVar.members.get(msg_author_id).addRole(config.roles.Senator); }
                else if (amount >=150) { ending = "You are an **Ambassador**"; guildVar.members.get(msg_author_id).addRole(config.roles.Ambassador); }


                message.channel.send("🚀      You have **" + userDatabase[msg_author_id] + " invites**\n🚀      " + ending + "\n" + psvar);
              }
              else {
                message.channel.send("🚀      You have **0 invites**\n🚀      **1** more to be come an **Affiliate**"  + "\n" + psvar);
              }
            }
            break;


            default: {
              message.delete();

            }
          }
        } catch (e) {
          console.log(e);
        }

  }

});

client.login(process.env.BOT_TOKEN);
