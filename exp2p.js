const fs = require('fs');
const inputReader = require('wait-console-input')

const Discord = require('discord.js');
const Constants = require('discord.js/src/util/Constants.js');

// Constants.DefaultOptions.ws.properties.$browser = `Discord Android`;
const client = new Discord.Client();

function print(x) {
	console.log(x);
}

function prt(x) {
	process.stdout.write(x);
}

function input(p) {
	prt(p);
	return inputReader.readLine('');
}

var chid = '12345678';
const fn = String(Math.floor(Math.random() * (99999999 - 10000000) + 10000000)) + ".CSV";

function appendFile(filename, content) {
	fs.appendFile(filename, content, 'utf-8', function(err) {
		if(err) {
			return;
		}
	}); 
	
	// fs.close();
}

appendFile(fn, `"사용자 번호","이름","메시지 번호","내용"\r\n`);

client.on('ready', async function() {
	client.user.setPresence({
		status: "invisible"
	});
	
	var s = 1;
	
	for(server of client.guilds.array())
		{
			print(`[${s++}] ${server['name']}`);
		}
	
	var guildname = input("대상 서버: ");
	var guild = client.guilds.array()[Number(guildname) - 1];
	prt('\r\n');
	
	var c = 0;
	
	for(ch of guild.channels.array())
		{
			if(ch['type'] == 'category') { c++; continue; }
			if(ch['type'] == 'voice') { c++; continue; }
			print(`[${c++}] ${ch['name']}`);
		}
		
	var chname = input("대상 채널: ");
	var channel = guild.channels.array()[chname];
	
	chid = channel.id;
	
	print("\n메시지를 불러오는 중입니다.");
	
	var sid = '1';
	var lid = '0';
	
	channel.fetchMessages({ limit: 1 }).then(async function(messages) {
		for(rmsg of messages) {
			const cm = rmsg[1];
			
			lid = String(cm['id']);
		}
		
		var msglst = [];
	
		for(var i=1; i<=12345678; i++) {
			const msgs = await channel.fetchMessages({ limit: 100, after: sid });
			
			for(var msg of msgs) {
				const cm = msg[1];
				
				msglst.push(`"(${cm['author']['id']})","${cm['author']['username'].replace(/["]/g, '""')}","(${cm['id']})","${cm['content'].replace(/["]/g, '""')}"`);
				
				// sid = cm['id'];
			}
			
			sid = msgs.first()['id'];
			
			if(Number(sid) > Number(lid)) break;
			
			input(`(${sid.slice(0,2)}/${lid.slice(0,2)}) 계속 저장하려면 리턴글쇠를 누르십시오. . . `);
		}
		
		var ac = '';
		
		for(var it of msglst) {
			ac += it;
		}
		
		appendFile(fn, ac);
		
		print("\n" + fn + "에 저장되었읍니다.");
	}).catch(console.error);
});

client.login("dsafrgvsefdsdasd");
