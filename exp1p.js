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
}

appendFile(fn, `"사용자 번호","이름","메시지 번호","내용"\r\n`);

client.on('ready', () => {
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
	
	var sid = '';
	
	channel.fetchMessages({ limit: 100 }).then(messages => {
		var msgarr = [];
		
		print("\n메시지를 처리하는 중입니다.");
		
		for(rmsg of messages) {
			const msg = rmsg[1];
			
			msgarr.push(msg);
		}
		
		//  sid = msgarr[msgarr.length - 1]['id'];
		    sid = String(Number(msgarr[0]['id']) + 1);
	}).catch(console.error);
	
	for(var i = 1; i <= 100; i++) {
		channel.fetchMessages({ limit: 100, before: sid }).then(messages => {
			var msgarr = [];
			
			print("\n메시지를 처리하는 중입니다.");
			
			for(rmsg of messages) {
				const msg = rmsg[1];
				
				msgarr.push(msg);
			}
			
			for(var m = msgarr.length - 1; m >= 0; m--) {
				const cm = msgarr[m];
				
				appendFile(fn, `"(${cm['author']['id']})","${cm['author']['username'].replace(/["]/g, '""')}","(${cm['id']})","${cm['content'].replace(/["]/g, '""')}"\r\n`)
			}
			
			sid = String(Number(msgarr[msgarr.length-1]['id']) + 1);
		}).catch(console.error);
		
		input("계속 저장하려면 리턴글쇠를 누르십시오. . . ");
	}
	
	print("\n" + fn + "에 저장되었읍니다.");
});

client.login("...");
