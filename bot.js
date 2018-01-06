const Discord = require('discord.js');
const config = require("./configfile.json");
const client = new Discord.Client();


var users = [];
var  guildVar;
var userDatabase = {};



var countdown_loop = false;
var difference;
var start_timestamp;
var current_timestamp;
var countdown_default = "-- HOURS -- MINUTES (COUNTDOWN)";
var guildRolesVar;
var refreshrate = 60000;
var mrHODL = 397518680789090315;
var countdown_role = '398537968970891277';
var subtraction;
var cdhours = 0;
var cdminutes = 0;


var psvar  = "*(The invite count is refreshed every 10 minutes)*";



client.on('ready', () => {
  console.log('I am ready!');

  guildRolesVar = client.guilds.array()[0].roles;
  
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
        
        const channel = guildVar.channels.find('name', 'console');
        if (channel) channel.send('```UPDATED invite info```');
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

                        case "cd": {
                          if (message.author.id = mrHODL) {
                            switch (args[0]) {
                              case "set": {
                                Array.from(guildRolesVar.values())[Array.from(guildRolesVar.keys()).indexOf(countdown_role)].setName(args.slice(1).join(" "));
                                
                              }
                              break;

                              case "default": {
                                Array.from(guildRolesVar.values())[Array.from(guildRolesVar.keys()).indexOf(countdown_role)].setName(countdown_default);
                              }
                              break;

                              case "start": {
                                countdown_loop = true;
                                difference = parseInt(args[1]);
                                start_timestamp = Date.now();

                                var cdloop = () => {
                                  current_timestamp = Date.now();
                                  subtraction = start_timestamp + difference - current_timestamp;

                                  if (subtraction>0) {
                                    cdhours = Math.floor(subtraction/3600000);
                                    cdminutes = Math.floor((subtraction-(cdhours*3600000))/60000);
                                  }
                                  else {
                                     countdown_loop = false;
                                  }

                                  if (countdown_loop) {
                                    Array.from(guildRolesVar.values())[Array.from(guildRolesVar.keys()).indexOf(countdown_role)].setName(cdhours + " HOURS " + cdminutes + " MINUTES (COUNTDOWN)");
                                    setTimeout(cdloop, refreshrate);
                                  }
                                  else {
                                    Array.from(guildRolesVar.values())[Array.from(guildRolesVar.keys()).indexOf(countdown_role)].setName(countdown_default);
                                  }
                                }
                                cdloop();

                              }
                              break;

                              case "stop": {
                                countdown_loop = false;
                              }
                              break;

                              default: {
                                Array.from(guildRolesVar.values())[Array.from(guildRolesVar.keys()).indexOf(countdown_role)].setName(countdown_default);
                              }
                            }
                          }
                          else {
                            message.delete();
                          }


                        }
                        break;
              
            case "icon": {
              if (message.author.id = mrHODL) {
                guildVar.setIcon(args[0]);
              }
            }
            break;

            case "i":
            case "invite" :
            case "invites" : {

              
              if (userDatabase.hasOwnProperty(msg_author_id)) {
                
                
                var amount = userDatabase[msg_author_id];
                var ending;
                //var psvar  = "*⏰      (The invite countes are refreshed every 10 minutes)*";
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
          
        }

  }

});

client.login(process.env.BOT_TOKEN);
