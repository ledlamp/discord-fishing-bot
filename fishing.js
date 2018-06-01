console.log('Starting');
const Discord = require('discord.js');
const fs = require('fs');
//const color_namer = require('color-namer');
const Color = require('./Color.js');
const colors = require('colors');
const client = new Discord.Client();
/* token --> */																																																																																	client.login(/* token redacted */);
client.on('ready', ()=>{
	console.log('Ready');

	var fishing = client.channels.get('332984202436018176');
	var fishhook = new Discord.WebhookClient('334079721119809537', /* token redacted */);

	fs.readFile('./fishing/fish.txt', 'utf8', (err,data) => {
		if (err) throw err;
		fish = data.split('\n');
	});
	//var newfish = ["Anchovy","Basa","Bass","Striped Bass","Black cod","Blowfish","Bluefish","Bombay duck","Bream","Brill","Butter fish","Catfish","Cod","Pacific cod","Atlantic cod","Dogfish","Dorade","Eel","Flounder","Grouper","Haddock","Hake","Halibut","Herring","Ilish","John Dory","Kingfish","Lamprey","Lingcod","Mackerel","Mahi Mahi","Monkfish","Mullet","Orange roughy","Parrott fish","Patagonian toothfish","Pike","Pilchard","Pollock","Pomfret","Pompano","Sablefish","Salmon","Sanddab","Sardine","Sea bass","Shad","Alewife","American shad","Shark","Skate","Smelt","Snakehead","Snapper","Rockfish","Rock cod","Pacific snapper","Sole","Sprat","Sturgeon","Surimi","Swordfish","Tilapia","Tilefish","Trout","Rainbow trout","Tuna","Albacore tuna","Yellowfin tuna","Bigeye tuna","Bluefin tuna","Turbot","Wahoo","Whitefish","Whiting"];
	var fish_tastes = [
	// It tasted...
		'fishy',
		'delicious',
		'horrible',
		'like Vloxor',
		'tangy',
		'sweet',
		'like something you wouldn\'t want to eat',
		'like chicken',
		'epic',
		'wonderful',
		'like rainbows and sunshine',
		'like candy',
		'terrific',
		'sour',
		'spicy',
		'salty',
		'orange',
		'like a fish',
		'like nothing',
		'unknown',
		'like shit',
		'peppery',
		'incredible',
		'meh',
		'bland',
		'raw',
		'like cheese',
		'awesome',
		'ok',
		'fine'
	];
	var fish_sizes = [
		'small',
		'medium-sized',
		'large',
		'giant',
		'rather small',
		'rather large',
		'microscopic'
	]

	var fishingTimers = {};
	var isFishing = {};

	var kekklefruit = 10;
	setInterval(()=>{kekklefruit++}, 300000);

	var nofruit = [
		"You started picking the fruit when you heard a sound or something that distracted you and made you forget what you were doing. Then, you remember: you tried to pick a fruit. You take a deep breath and decide to try again",
		"What a funny-looking tree without its fruit!",
		"Your fruit will grow, just wait.",
		"You study the tree's fruitless branches.",
		'There is no fruit, so you just ponder about the tree.',
		'Should be a fruit pickable soon.',
		'The tree is without fruit.',
		'Keep trying to get fruit.',
		'It\'s like every time the tree grows fruit somebody is stealing it.',
		'Alas, the tree wasn\'t currently displaying any fruit.',
		'Robbed of its precious fruit, the tree sat vexed.',
		'Hold on.',
		'Good view of the branches with no fruit on them.',
		'No fruit.',
		'Get a fruit from the tree after they grow.',
		'No fruit found.',
		'Keep trying, but wait until the tree has fruit.',
		'You consider again what might happen if the fruit stopped growing.',
		'Watch the kekklefruit to make sure they have grown before picking them from the tree.',
		'Pick a fruit after it grows.',
		'Wait for fruit growth.',
		'You wonder how many fruit this tree has grown in its lifetime.',
		'The tree has long slender limbs, barren of fruit.',
		'The tree is not showing fruit.',
		'There was no fruit for you to pick.',
		'You could have sworn you were wrapping your hand around a sweet kekklefruit, but it seemingly disappeared from reality right as you grasped it??',
		'Wait, give it time to grow fruit.',
		'Wait between each pick for fruit to grow.',
		'The tree has no fruit.',
		'The revered fruit have been lost.',
		'No fruit? Okay...',
		'You notice the way the tree looks without fruit.',
		'The tree branches looked sinister with no fruit on them at all.',
		"You look, but don't find any fruit.",
		"Slow down, there aren't any fruit to pick yet.",
		'Ugh, no fruit..'
	];

	function addToSack(id, item){
		var path = './sacks/'+id+'.json';
		if (fs.existsSync(path)) {
			fs.readFile(path, 'utf8', (err, data)=>{
				let sack = JSON.parse(data);
				sack.push(item);
				fs.writeFile(path, JSON.stringify(sack));
			});
		} else {
			fs.writeFile(path, '["'+item+'"]');
		}
	}

	client.on('message', message => {
		if (message.channel !== fishing) return;
		var arg = message.content.split(' ');
		var cmd = arg[0].slice(1).toLowerCase();
		var txt = function(i) {return arg.slice(i).join(' ');}

		if (cmd === 'help') message.channel.send("F̲i̲s̲h̲i̲n̲g̲: !fish, !cast (starts fishing), !reel (stops fishing), !caught [name] (shows fish you've caught), !eat (eats one of your fish), !give [name] (gives fish to someone else), !give_[number] [name] (give up to 100 at a time), !pick (picks fruit from the tree)");

		if (cmd === "fish" || cmd === "cast") {
			if (!isFishing[message.author.id]) {
				message.channel.send('Our friend **'+message.member.displayName+'** casts LURE into a water for catching fish.');
				fishingTimers[message.author.id] = setTimeout(function(){
					var caught_fish = fish.random();
					message.channel.send(`Our good friend **${message.member.displayName}** caught a ${fish_sizes.random()} **${caught_fish}**.`);
					addToSack(message.author.id, caught_fish);
					delete isFishing[message.author.id];
				}, getRandomArbitrary(0, 1800000)); // 0-30 min
				isFishing[message.author.id] = new Date();
			} else {
				let minutes = ((new Date() - isFishing[message.author.id])/1000/60).toFixed(2);
				message.channel.send(`Friend **${message.member.displayName}**: Your lure is already in the water (since ${minutes} minutes ago).`)
			}
		}

		if (cmd === "sack" || cmd === "caught") {
			fs.readFile('./sacks/'+message.author.id+'.json', 'utf8', (err, data)=>{
//				if (typeof data === 'undefined'|| data === "[]") {message.channel.send('Your sack is empty.'); return;}
				var sacklist = JSON.parse(data).join(', ');
				if (!sacklist) {sacklist = "(none)"}
				if (sacklist.length > 1950) {
					message.channel.send(`Friend **${message.author.displayName}**: Your sack is too large to fit in the chat!`);
				} else {
					message.channel.send('Contents of **'+message.member.displayName+'**\'s sack: ```\n' + sacklist + '```');
				}
			});
		}

		if (cmd === "eat") {
			fs.readFile('./sacks/'+message.author.id+'.json', 'utf8', (err, data)=>{
				if (typeof data === 'undefined' || data === "[]") return message.channel.send(`Friend **${message.member.displayName}**: You have no food. !fish to get some.`);
				var sack = JSON.parse(data);
				var sackTLC = [];
				sack.forEach(item=>{sackTLC.push(item.toLowerCase());});
				if (arg[1] != "" && sackTLC.includes(txt(1).toLowerCase())) {
					var eatfish = sack.splice(sackTLC.indexOf(txt(1).toLowerCase()), 1);
				} else {
					var eatfish = sack.splice(getRandomInt(0,sack.length-1), 1);
				}
				fs.writeFile('./sacks/'+message.author.id+'.json', JSON.stringify(sack));
				if ([false,false,false,true].random()) {
					message.member.colorRole.setColor('RANDOM').then(()=>{
		//				let colorname = color_namer(message.member.colorRole.hexColor, { pick: ['ntc'] }).ntc[0].name;
						message.channel.send('Our friend **'+message.member.displayName+'** ate a **'+eatfish+'** and it made them turn '+new Color(message.member.colorRole.hexColor).getName()+'.');
					});
				} else {
					message.channel.send('Our friend **'+message.member.displayName+'** ate a **'+eatfish+'**. It tasted '+fish_tastes.random()+'.');
				}
			});
		}

		if (cmd === 'pick') {
			if (kekklefruit === 0) {
				message.channel.send(nofruit.random());
			} else {
				kekklefruit--;
				addToSack(message.author.id, 'kekklefruit');
				message.channel.send(`Our friend **${message.member.displayName}** picked 1 fruit from the kekklefruit tree and placed it into their fish sack.`);
			}
		}

		if (cmd === 'count_fish') {
			let person = message.member;
		/*	if (txt(1)) {
				let results = [];
				message.guild.members.array().forEach(function(member){
					if (member.displayName.toLowerCase().includes(txt(1).toLowerCase())) {
						results.push(member);
					}
				});
				if (results !== []) person = results.random();
			}*/
			fs.readFile('./sacks/'+person.id+'.json', 'utf8', (err, data)=>{
				message.channel.send(`Friend **${message.member.displayName}**: By my count, **${person.displayName}** has ${JSON.parse(data).length} fish.`)
			});
		}

		if (cmd === 'reel') {
			if (fishingTimers[message.author.id]) {
				clearTimeout(fishingTimers[message.author.id]);
				message.channel.send(`Our friend **${message.member.displayName}** reel their lure back inside, temporarily decreasing their chances of catching a fish by 100%.`);
			} else {
				message.channel.send(`Friend **${message.member.displayName}**: You haven't !casted it.`);
			}
		}

		if (message.author.id === "281134216115257344" && message.content.startsWith('f>')) {
			try {message.channel.send('`'+eval(message.content.substr(2))+'`')}
			catch(e) {message.channel.send('`'+e+'`')}
		}
	});
});




Array.prototype.random = function () {
	return this[Math.floor(Math.random()*this.length)];
}
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}
