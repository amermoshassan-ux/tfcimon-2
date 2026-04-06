// TFCImon Discord Bot — MEGA UPDATE
require('dotenv').config();
const { Client, GatewayIntentBits, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, REST, Routes } = require('discord.js');

const BOT_TOKEN = process.env.BOT_TOKEN || 'YOUR_BOT_TOKEN_HERE';
const CLIENT_ID = process.env.CLIENT_ID || 'YOUR_CLIENT_ID_HERE';
const OP_USER = 'haxiii7';
const OP_USER = 'windy_blade555';
// ─── CARD DATA ────────────────────────────────────────────────────────────────

const CARDS = {
  celestia: {
    id: 'celestia', name: 'Celestia', hp: 200, type: 'Dark', rarity: 'Rare', emoji: '🌑', color: 0x2c2c54,
    description: 'A dark warrior with flower-like wings and heavy armor.', gemCost: 300,
    moves: [
      { name: '#Goon', damage: 75, cost: 2, emoji: '👊' },
      { name: 'Drawing w/ Downfall', damage: 150, cost: 4, emoji: '🌀' },
    ],
  },
  flame: {
    id: 'flame', name: 'Flame', hp: 200, type: 'Fire', rarity: 'Rare', emoji: '🔥', color: 0xe84545,
    description: 'Type: Fire | #1 CEO | A plaid-shirted cat with a sailor cap.', gemCost: 300,
    moves: [
      { name: 'Timeout', damage: 50, cost: 2, emoji: '⏱️' },
      { name: 'Kick', damage: 100, cost: 3, emoji: '🦵' },
      { name: 'Ban', damage: 250, cost: 6, emoji: '🔨' },
    ],
  },
  isy: {
    id: 'isy', name: 'Isy EX', hp: 150, type: 'Normal', rarity: 'EX', emoji: '🍌', color: 0x3498db,
    description: 'Type: Normal | T★2 | Member MECT — EX card!', gemCost: 500,
    moves: [
      { name: 'Banana', damage: 50, cost: 2, emoji: '🍌' },
      { name: 'Summon-SPK', damage: 100, cost: 4, emoji: '📢' },
      { name: 'EX POWER: Summon Banana Kingdom', damage: 180, cost: 6, emoji: '👑', isEx: true },
    ],
  },
  michael: {
    id: 'michael', name: 'Michael the Keeper', hp: 300, type: 'Shadow', rarity: 'LEGENDARY', emoji: '👁️', color: 0x1a1a2e,
    description: '⚠️ LEGENDARY — The rarest card in existence.', gemCost: 2000,
    moves: [
      { name: 'Hiding in Not Plain Sight', damage: 100, cost: 3, emoji: '🌫️' },
      { name: 'Server Hopper 3000', damage: 130, cost: 4, emoji: '🚀' },
    ],
  },
  spk_iii: {
    id: 'spk_iii', name: 'SPK_III', hp: 180, type: 'Normal', rarity: 'Uncommon', emoji: '🔊', color: 0xf39c12,
    description: 'A powerful speaker with banana energy and tough resolve.', gemCost: 200,
    moves: [
      { name: 'Banan', damage: 75, cost: 2, emoji: '🍌' },
      { name: 'Tuff Stuff', damage: 170, cost: 5, emoji: '💪' },
    ],
  },
  // ── NEW CARDS ──
  shadowfox: {
    id: 'shadowfox', name: 'Shadow Fox', hp: 220, type: 'Shadow', rarity: 'Rare', emoji: '🦊', color: 0x6c3483,
    description: 'A cunning fox that strikes from the darkness.', gemCost: 350,
    moves: [
      { name: 'Phantom Dash', damage: 80, cost: 2, emoji: '💨' },
      { name: 'Shadow Bite', damage: 140, cost: 3, emoji: '🦷' },
      { name: 'Eclipse Strike', damage: 200, cost: 5, emoji: '🌑' },
    ],
  },
  stormking: {
    id: 'stormking', name: 'Storm King', hp: 250, type: 'Electric', rarity: 'Rare', emoji: '⚡', color: 0xf9ca24,
    description: 'The ruler of storms. His wrath is lightning itself.', gemCost: 400,
    moves: [
      { name: 'Thunder Clap', damage: 90, cost: 2, emoji: '⚡' },
      { name: 'Static Prison', damage: 120, cost: 3, emoji: '🔒' },
      { name: 'LIGHTNING THRONE', damage: 220, cost: 6, emoji: '👑' },
    ],
  },
  voidwalker: {
    id: 'voidwalker', name: 'Void Walker', hp: 170, type: 'Void', rarity: 'EX', emoji: '🌀', color: 0x130f40,
    description: 'Steps between dimensions. Cannot be predicted.', gemCost: 600,
    moves: [
      { name: 'Phase Shift', damage: 60, cost: 1, emoji: '🌀' },
      { name: 'Dimension Rip', damage: 130, cost: 3, emoji: '🕳️' },
      { name: 'EX: VOID COLLAPSE', damage: 220, cost: 6, emoji: '💀', isEx: true },
    ],
  },
  ironclad: {
    id: 'ironclad', name: 'Ironclad', hp: 350, type: 'Steel', rarity: 'Rare', emoji: '🛡️', color: 0x7f8c8d,
    description: 'An unstoppable wall of metal. Slow but devastating.', gemCost: 380,
    moves: [
      { name: 'Iron Wall', damage: 40, cost: 1, emoji: '🛡️' },
      { name: 'Steel Crush', damage: 110, cost: 3, emoji: '⚙️' },
      { name: 'FORTRESS BREAK', damage: 190, cost: 5, emoji: '💥' },
    ],
  },
  cosmicqueen: {
    id: 'cosmicqueen', name: 'Cosmic Queen', hp: 230, type: 'Cosmic', rarity: 'LEGENDARY', emoji: '🌌', color: 0x9b59b6,
    description: '✨ LEGENDARY — Born from the collapse of a star. Second LEGENDARY ever.', gemCost: 2500,
    moves: [
      { name: 'Stardust', damage: 90, cost: 2, emoji: '✨' },
      { name: 'Nebula Burst', damage: 160, cost: 4, emoji: '🌌' },
      { name: 'BIG BANG', damage: 280, cost: 7, emoji: '💫', isEx: true },
    ],
  },
};

const ENERGY_CARD = { id: 'energy', name: 'Energy Card', emoji: '⚡', rarity: 'Common', description: 'Gives +2 bonus energy at the start of your next battle!' };

const PACK_WEIGHTS = {
  celestia: 20, flame: 20, isy: 15, spk_iii: 10, michael: 1,
  shadowfox: 10, stormking: 9, voidwalker: 6, ironclad: 8, cosmicqueen: 0.5,
  energy: 7,
};

const PACK_GEM_COST = 150;

const ALL_CARD_CHOICES = Object.values(CARDS).map(c => ({ name: `${c.emoji} ${c.name} (${c.gemCost}💎) — ${c.rarity}`, value: c.id }));

// ─── ARENA DATA ───────────────────────────────────────────────────────────────

const ARENAS = {
  '100_player_island': {
    id: '100_player_island', name: '100 Player Island', emoji: '🏝️', color: 0x00b894,
    description: 'Only one survives. The island swallows the rest.', holder: null, holderName: null,
    guardian: { name: 'THE LAST ONE', emoji: '💀', hp: 350, energy: 4, moves: [
      { name: 'Island Wipe', damage: 90, cost: 2, emoji: '🌊' },
      { name: 'Final Circle', damage: 160, cost: 4, emoji: '🔴' },
      { name: 'Only Survivor', damage: 240, cost: 6, emoji: '☠️' },
    ]},
  },
  mingle: {
    id: 'mingle', name: 'Mingle', emoji: '💞', color: 0xff6b9d,
    description: 'The arena where friendships are made... and destroyed.', holder: null, holderName: null,
    guardian: { name: 'CUPID REAPER', emoji: '💘', hp: 280, energy: 3, moves: [
      { name: 'Heartbreak Strike', damage: 80, cost: 2, emoji: '💔' },
      { name: 'Toxic Charm', damage: 130, cost: 3, emoji: '🩷' },
      { name: 'Lovebomb', damage: 200, cost: 5, emoji: '💣' },
    ]},
  },
  rlgl: {
    id: 'rlgl', name: 'RLGL', emoji: '🚦', color: 0xe74c3c,
    description: "Red Light. Green Light. One wrong move and you're gone.", holder: null, holderName: null,
    guardian: { name: 'THE DOLL', emoji: '🎎', hp: 320, energy: 3, moves: [
      { name: 'Red Light', damage: 60, cost: 1, emoji: '🔴' },
      { name: 'Green Light Rush', damage: 120, cost: 3, emoji: '🟢' },
      { name: 'Elimination', damage: 220, cost: 5, emoji: '🎯' },
    ]},
  },
  jumprope: {
    id: 'jumprope', name: 'Jumprope', emoji: '🪢', color: 0x6c5ce7,
    description: 'The rope never stops. Neither does the pain.', holder: null, holderName: null,
    guardian: { name: 'ROPEGOD', emoji: '🌀', hp: 260, energy: 3, moves: [
      { name: 'Whiplash', damage: 70, cost: 2, emoji: '💫' },
      { name: 'Double Dutch', damage: 140, cost: 3, emoji: '🌀' },
      { name: 'Infinite Loop', damage: 190, cost: 5, emoji: '♾️' },
    ]},
  },
  spinner: {
    id: 'spinner', name: 'Spinner', emoji: '🌪️', color: 0xfdcb6e,
    description: 'Spin the wheel. Face what it lands on.', holder: null, holderName: null,
    guardian: { name: 'VORTEX', emoji: '🌪️', hp: 290, energy: 3, moves: [
      { name: 'Dizzy Slam', damage: 85, cost: 2, emoji: '😵' },
      { name: 'Tornado Fist', damage: 150, cost: 4, emoji: '🌪️' },
      { name: 'Chaos Spin', damage: 210, cost: 6, emoji: '💥' },
    ]},
  },
  red_vs_blue: {
    id: 'red_vs_blue', name: 'Red vs Blue Island', emoji: '⚔️', color: 0xd63031,
    description: 'Pick a side. There is no neutral here.', holder: null, holderName: null,
    guardian: { name: 'COMMANDER NULL', emoji: '🎖️', hp: 330, energy: 4, moves: [
      { name: 'Blue Barrage', damage: 95, cost: 2, emoji: '🔵' },
      { name: 'Red Rush', damage: 145, cost: 3, emoji: '🔴' },
      { name: 'Total War', damage: 230, cost: 6, emoji: '💣' },
    ]},
  },
  pick_a_side: {
    id: 'pick_a_side', name: 'Pick a Side', emoji: '🪙', color: 0x2d3436,
    description: 'Every choice has a consequence. Choose wisely.', holder: null, holderName: null,
    guardian: { name: 'THE DECIDER', emoji: '⚖️', hp: 310, energy: 3, moves: [
      { name: 'Coin Flip Crush', damage: 75, cost: 2, emoji: '🪙' },
      { name: 'Wrong Choice', damage: 140, cost: 3, emoji: '❌' },
      { name: 'Judgement Day', damage: 250, cost: 6, emoji: '⚖️' },
    ]},
  },
};

// ─── STORAGE ──────────────────────────────────────────────────────────────────

const playerData = new Map();
const activeBattles = new Map();
const activeArenaBattles = new Map();
const auctionListings = new Map();
const tradeOffers = new Map();
const activeTournament = { running: false, players: [], bracket: [], currentMatch: null };
let listingCounter = 1;
let tradeCounter = 1;
let doubleGemsEvent = false;

function getPlayer(userId) {
  if (!playerData.has(userId)) {
    playerData.set(userId, {
      deck: [], energyCards: 0, gems: 100, nicknames: {},
      wins: 0, losses: 0, cardWins: {}, cardLosses: {}, cardLevels: {},
      lastDaily: null, totalBattles: 0,
    });
  }
  const p = playerData.get(userId);
  if (!p.wins) p.wins = 0;
  if (!p.losses) p.losses = 0;
  if (!p.cardWins) p.cardWins = {};
  if (!p.cardLosses) p.cardLosses = {};
  if (!p.cardLevels) p.cardLevels = {};
  if (!p.lastDaily) p.lastDaily = null;
  if (!p.totalBattles) p.totalBattles = 0;
  if (!p.nicknames) p.nicknames = {};
  return p;
}

function getCardLevel(player, cardId) {
  return player.cardLevels[cardId] || 1;
}

function getLevelBonus(level) {
  return (level - 1) * 10; // +10 damage per level
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function weightedRandom(weights) {
  const total = Object.values(weights).reduce((a, b) => a + b, 0);
  let rand = Math.random() * total;
  for (const [id, weight] of Object.entries(weights)) {
    rand -= weight;
    if (rand <= 0) return id;
  }
  return Object.keys(weights)[0];
}

function openPack(count = 3) {
  const pulled = [];
  for (let i = 0; i < count; i++) pulled.push(weightedRandom(PACK_WEIGHTS));
  return pulled;
}

function hpBar(hp, maxHp) {
  const pct = Math.max(0, Math.min(1, hp / maxHp));
  const filled = Math.round(pct * 10);
  const color = pct > 0.5 ? '🟩' : pct > 0.25 ? '🟨' : '🟥';
  return color.repeat(filled) + '⬛'.repeat(10 - filled) + ` ${hp}/${maxHp}`;
}

function aiPickMove(guardian, energy) {
  const affordable = guardian.moves.filter(m => m.cost <= energy);
  if (affordable.length === 0) return guardian.moves.reduce((a, b) => a.cost < b.cost ? a : b);
  return affordable.reduce((best, m) => m.damage > best.damage ? m : best);
}

function isOp(interaction) { return interaction.user.username === OP_USER; }

function gemMultiplier() { return doubleGemsEvent ? 2 : 1; }

function buildDeckEmbed(userId, player) {
  const embed = new EmbedBuilder()
    .setTitle('📦 Your TFCImon Deck')
    .setColor(0x9b59b6)
    .setFooter({ text: `💎 ${player.gems} gems | ⚡ ${player.energyCards} energy cards | ⚔️ ${player.wins}W ${player.losses}L` });

  if (player.deck.length === 0) {
    embed.setDescription('Your deck is empty! Use `/openpack` to get cards.');
    return embed;
  }

  const counts = {};
  for (const id of player.deck) counts[id] = (counts[id] || 0) + 1;

  const lines = Object.entries(counts).map(([id, count]) => {
    const card = CARDS[id];
    if (!card) return null;
    const nickname = player.nicknames[id] ? ` *"${player.nicknames[id]}"*` : '';
    const level = getCardLevel(player, id);
    const lvlStr = level > 1 ? ` ⬆️Lv${level}` : '';
    const wins = player.cardWins[id] || 0;
    return `${card.emoji} **${card.name}**${nickname}${lvlStr} ×${count} — ${card.hp}HP | ${card.rarity} | ${wins}W`;
  }).filter(Boolean);

  embed.setDescription(lines.join('\n'));
  embed.addFields({ name: '🃏 Total Cards', value: `${player.deck.length}`, inline: true });
  return embed;
}

// ─── COMMANDS ─────────────────────────────────────────────────────────────────

const ARENA_CHOICES = [
  { name: '🏝️ 100 Player Island', value: '100_player_island' },
  { name: '💞 Mingle', value: 'mingle' },
  { name: '🚦 RLGL', value: 'rlgl' },
  { name: '🪢 Jumprope', value: 'jumprope' },
  { name: '🌪️ Spinner', value: 'spinner' },
  { name: '⚔️ Red vs Blue Island', value: 'red_vs_blue' },
  { name: '🪙 Pick a Side', value: 'pick_a_side' },
];

const commands = [
  new SlashCommandBuilder().setName('openpack').setDescription('Open a TFCImon pack and get 3 cards!').toJSON(),
  new SlashCommandBuilder().setName('deck').setDescription('View your TFCImon card deck').toJSON(),
  new SlashCommandBuilder().setName('gems').setDescription('Check your gem balance').toJSON(),
  new SlashCommandBuilder().setName('shop').setDescription('View the gem shop').toJSON(),
  new SlashCommandBuilder().setName('daily').setDescription('Claim your daily gem reward!').toJSON(),
  new SlashCommandBuilder().setName('leaderboard').setDescription('View the TFCImon leaderboard').toJSON(),
  new SlashCommandBuilder().setName('stats').setDescription('View your battle stats').toJSON(),
  new SlashCommandBuilder().setName('arenas').setDescription('View all TFCImon arenas and holders').toJSON(),

  new SlashCommandBuilder()
    .setName('buycard')
    .setDescription('Buy a specific card with gems')
    .addStringOption(opt => opt.setName('card').setDescription('Card to buy').setRequired(true).addChoices(...ALL_CARD_CHOICES.slice(0, 25)))
    .toJSON(),

  new SlashCommandBuilder().setName('buypack').setDescription(`Buy a pack for ${PACK_GEM_COST} gems`).toJSON(),

  new SlashCommandBuilder()
    .setName('battle')
    .setDescription('Challenge another member to a TFCImon battle!')
    .addUserOption(opt => opt.setName('opponent').setDescription('The member to battle').setRequired(true))
    .toJSON(),

  new SlashCommandBuilder()
    .setName('name')
    .setDescription('Give a nickname to a card in your deck')
    .addStringOption(opt => opt.setName('card').setDescription('Card to rename').setRequired(true).addChoices(...ALL_CARD_CHOICES.slice(0, 25)))
    .addStringOption(opt => opt.setName('nickname').setDescription('The nickname').setRequired(true).setMaxLength(32))
    .toJSON(),

  new SlashCommandBuilder()
    .setName('challenge')
    .setDescription('Challenge an arena guardian!')
    .addStringOption(opt => opt.setName('arena').setDescription('Which arena').setRequired(true).addChoices(...ARENA_CHOICES))
    .toJSON(),

  new SlashCommandBuilder()
    .setName('gamble')
    .setDescription('Gamble your gems for a chance to double them!')
    .addIntegerOption(opt => opt.setName('amount').setDescription('Amount of gems to gamble').setRequired(true).setMinValue(10))
    .toJSON(),

  new SlashCommandBuilder()
    .setName('gift')
    .setDescription('Gift a card to another player')
    .addUserOption(opt => opt.setName('user').setDescription('Who to gift to').setRequired(true))
    .addStringOption(opt => opt.setName('card').setDescription('Card to gift').setRequired(true).addChoices(...ALL_CARD_CHOICES.slice(0, 25)))
    .toJSON(),

  new SlashCommandBuilder()
    .setName('trade')
    .setDescription('Offer a card trade to another player')
    .addUserOption(opt => opt.setName('user').setDescription('Who to trade with').setRequired(true))
    .addStringOption(opt => opt.setName('yougive').setDescription('Card you give').setRequired(true).addChoices(...ALL_CARD_CHOICES.slice(0, 25)))
    .addStringOption(opt => opt.setName('youget').setDescription('Card you want').setRequired(true).addChoices(...ALL_CARD_CHOICES.slice(0, 25)))
    .toJSON(),

  // Auction House
  new SlashCommandBuilder().setName('ah').setDescription('Browse the auction house').toJSON(),

  new SlashCommandBuilder()
    .setName('ah-sell')
    .setDescription('List a card on the auction house')
    .addStringOption(opt => opt.setName('card').setDescription('Card to sell').setRequired(true).addChoices(...ALL_CARD_CHOICES.slice(0, 25)))
    .addIntegerOption(opt => opt.setName('price').setDescription('Instant buy price in gems').setRequired(true).setMinValue(1))
    .addIntegerOption(opt => opt.setName('bidstart').setDescription('Starting bid (optional)').setMinValue(1))
    .toJSON(),

  new SlashCommandBuilder()
    .setName('ah-search')
    .setDescription('Search the auction house')
    .addStringOption(opt => opt.setName('card').setDescription('Card to search').setRequired(true).addChoices(...ALL_CARD_CHOICES.slice(0, 25)))
    .toJSON(),

  // OP COMMANDS
  new SlashCommandBuilder()
    .setName('makecard')
    .setDescription('[OP] Create a custom card')
    .addStringOption(opt => opt.setName('name').setDescription('Card name').setRequired(true))
    .addIntegerOption(opt => opt.setName('hp').setDescription('HP').setRequired(true).setMinValue(1).setMaxValue(9999))
    .addStringOption(opt => opt.setName('type').setDescription('Type').setRequired(true))
    .addStringOption(opt => opt.setName('rarity').setDescription('Rarity').setRequired(true))
    .addStringOption(opt => opt.setName('move1').setDescription('Move 1 name').setRequired(true))
    .addIntegerOption(opt => opt.setName('move1dmg').setDescription('Move 1 damage').setRequired(true))
    .addStringOption(opt => opt.setName('move2').setDescription('Move 2 name').setRequired(true))
    .addIntegerOption(opt => opt.setName('move2dmg').setDescription('Move 2 damage').setRequired(true))
    .addUserOption(opt => opt.setName('giveto').setDescription('Give to player'))
    .toJSON(),

  new SlashCommandBuilder()
    .setName('givegems').setDescription('[OP] Give gems to a player')
    .addUserOption(opt => opt.setName('user').setDescription('Player').setRequired(true))
    .addIntegerOption(opt => opt.setName('amount').setDescription('Amount').setRequired(true).setMinValue(1))
    .toJSON(),

  new SlashCommandBuilder()
    .setName('givecard').setDescription('[OP] Give a card to a player')
    .addUserOption(opt => opt.setName('user').setDescription('Player').setRequired(true))
    .addStringOption(opt => opt.setName('card').setDescription('Card').setRequired(true).addChoices(...ALL_CARD_CHOICES.slice(0, 25)))
    .toJSON(),

  new SlashCommandBuilder()
    .setName('kill').setDescription('[OP] Wipe a player\'s deck')
    .addUserOption(opt => opt.setName('user').setDescription('Player').setRequired(true))
    .toJSON(),

  new SlashCommandBuilder()
    .setName('resetarena').setDescription('[OP] Reset an arena holder')
    .addStringOption(opt => opt.setName('arena').setDescription('Arena').setRequired(true).addChoices(...ARENA_CHOICES))
    .toJSON(),

  new SlashCommandBuilder()
    .setName('announce').setDescription('[OP] Send a TFCImon announcement')
    .addStringOption(opt => opt.setName('message').setDescription('Message').setRequired(true))
    .toJSON(),

  new SlashCommandBuilder()
    .setName('doublegems').setDescription('[OP] Toggle double gems event')
    .toJSON(),

  new SlashCommandBuilder()
    .setName('tournament').setDescription('[OP] Start a tournament')
    .toJSON(),

  new SlashCommandBuilder()
    .setName('jointournament').setDescription('Join the upcoming tournament!')
    .toJSON(),
];

// ─── REGISTER ─────────────────────────────────────────────────────────────────

async function registerCommands() {
  const rest = new REST({ version: '10' }).setToken(BOT_TOKEN);
  try {
    console.log('Registering slash commands...');
    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
    console.log('✅ Slash commands registered!');
  } catch (err) { console.error('Failed to register commands:', err); }
}

// ─── CLIENT ───────────────────────────────────────────────────────────────────

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', () => {
  console.log(`✅ TFCImon MEGA bot online as ${client.user.tag}!`);
  client.user.setActivity('TFCImon — /openpack to start!');
});

// ─── INTERACTIONS ─────────────────────────────────────────────────────────────

client.on('interactionCreate', async (interaction) => {

  if (interaction.isChatInputCommand()) {
    const { commandName } = interaction;
    const userId = interaction.user.id;
    const player = getPlayer(userId);

    // ── /openpack ──
    if (commandName === 'openpack') {
      await interaction.deferReply();
      const pulled = openPack(3);
      for (const cardId of pulled) {
        if (cardId === 'energy') player.energyCards++;
        else player.deck.push(cardId);
      }
      const earned = 10 * gemMultiplier();
      player.gems += earned;

      const embed = new EmbedBuilder()
        .setTitle('📦 Pack Opened!')
        .setDescription(`${interaction.user.displayName} tore open a TFCImon pack...\n*+${earned}💎 gems earned!*${doubleGemsEvent ? ' 🎉 DOUBLE GEMS EVENT!' : ''}`)
        .setColor(0xf39c12)
        .setFooter({ text: `${player.deck.length} cards | 💎 ${player.gems} gems` });

      const lines = pulled.map((id, i) => {
        if (id === 'energy') return `**Card ${i + 1}:** ⚡ **Energy Card** — +2 battle energy!`;
        const card = CARDS[id];
        const tag = card.rarity === 'LEGENDARY' ? ' 🌟 LEGENDARY!!' : card.rarity === 'EX' ? ' ✨ EX!' : '';
        return `**Card ${i + 1}:** ${card.emoji} **${card.name}**${tag} — ${card.hp}HP`;
      });
      embed.addFields({ name: '🎴 You got:', value: lines.join('\n') });
      await interaction.editReply({ embeds: [embed] });
    }

    // ── /deck ──
    else if (commandName === 'deck') {
      await interaction.reply({ embeds: [buildDeckEmbed(userId, player)] });
    }

    // ── /gems ──
    else if (commandName === 'gems') {
      await interaction.reply({ embeds: [new EmbedBuilder().setTitle('💎 Your Gems').setDescription(`You have **${player.gems} gems**!\n\nEarn gems by:\n• Opening packs (+${10 * gemMultiplier()}💎)\n• Winning PvP battles (+${25 * gemMultiplier()}💎)\n• Conquering arenas (+${50 * gemMultiplier()}💎)\n• Daily reward (up to 200💎)\n• Gambling 🎰${doubleGemsEvent ? '\n\n🎉 **DOUBLE GEMS EVENT IS ACTIVE!**' : ''}`).setColor(0xf1c40f)] });
    }

    // ── /daily ──
    else if (commandName === 'daily') {
      const now = Date.now();
      const cooldown = 24 * 60 * 60 * 1000;
      if (player.lastDaily && now - player.lastDaily < cooldown) {
        const remaining = cooldown - (now - player.lastDaily);
        const hours = Math.floor(remaining / 3600000);
        const mins = Math.floor((remaining % 3600000) / 60000);
        return interaction.reply({ content: `⏰ Daily reward not ready yet! Come back in **${hours}h ${mins}m**.`, ephemeral: true });
      }
      const reward = Math.floor(Math.random() * 151) + 50; // 50-200 gems
      const total = reward * gemMultiplier();
      player.gems += total;
      player.lastDaily = now;
      await interaction.reply({ embeds: [new EmbedBuilder().setTitle('🎁 Daily Reward!').setDescription(`You claimed your daily reward!\n\n+**${total}💎 gems**${doubleGemsEvent ? ' (×2 event!)' : ''}\n\nTotal: **${player.gems}💎**`).setColor(0x00b894)] });
    }

    // ── /leaderboard ──
    else if (commandName === 'leaderboard') {
      const players = [...playerData.entries()].map(([id, p]) => ({ id, ...p }));
      const byWins = [...players].sort((a, b) => (b.wins || 0) - (a.wins || 0)).slice(0, 5);
      const byGems = [...players].sort((a, b) => (b.gems || 0) - (a.gems || 0)).slice(0, 5);

      const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];
      const embed = new EmbedBuilder().setTitle('🏆 TFCImon Leaderboard').setColor(0xf1c40f);

      const winsText = byWins.map((p, i) => `${medals[i]} <@${p.id}> — **${p.wins || 0}W** ${p.losses || 0}L`).join('\n') || 'No battles yet!';
      const gemsText = byGems.map((p, i) => `${medals[i]} <@${p.id}> — **${p.gems || 0}💎**`).join('\n') || 'No data yet!';

      embed.addFields(
        { name: '⚔️ Top Battlers', value: winsText },
        { name: '💎 Top Gem Holders', value: gemsText },
      );

      // Arena holders
      const holders = Object.values(ARENAS).filter(a => a.holder).map(a => `${a.emoji} **${a.name}** → ${a.holderName}`).join('\n');
      if (holders) embed.addFields({ name: '🏟️ Arena Holders', value: holders });

      await interaction.reply({ embeds: [embed] });
    }

    // ── /stats ──
    else if (commandName === 'stats') {
      const embed = new EmbedBuilder()
        .setTitle(`📊 ${interaction.user.displayName}'s Stats`)
        .setColor(0x3498db)
        .addFields(
          { name: '⚔️ Battles', value: `${player.wins}W / ${player.losses}L`, inline: true },
          { name: '💎 Gems', value: `${player.gems}`, inline: true },
          { name: '🃏 Cards', value: `${player.deck.length}`, inline: true },
          { name: '⚡ Energy Cards', value: `${player.energyCards}`, inline: true },
        );

      // Best card
      if (Object.keys(player.cardWins).length > 0) {
        const bestCardId = Object.entries(player.cardWins).sort((a, b) => b[1] - a[1])[0][0];
        const bestCard = CARDS[bestCardId];
        if (bestCard) {
          const lvl = getCardLevel(player, bestCardId);
          embed.addFields({ name: '🌟 Best Card', value: `${bestCard.emoji} ${bestCard.name} (${player.cardWins[bestCardId]}W, Lv${lvl})`, inline: true });
        }
      }

      // Card levels
      const leveled = Object.entries(player.cardLevels).filter(([, lv]) => lv > 1).map(([id, lv]) => {
        const card = CARDS[id];
        return card ? `${card.emoji} ${card.name}: Lv${lv}` : null;
      }).filter(Boolean);
      if (leveled.length > 0) embed.addFields({ name: '⬆️ Leveled Cards', value: leveled.join('\n') });

      await interaction.reply({ embeds: [embed] });
    }

    // ── /shop ──
    else if (commandName === 'shop') {
      const embed = new EmbedBuilder()
        .setTitle('🛒 TFCImon Gem Shop')
        .setDescription(`Your balance: **${player.gems}💎**${doubleGemsEvent ? '\n🎉 **DOUBLE GEMS EVENT ACTIVE!**' : ''}`)
        .setColor(0xf1c40f)
        .addFields({ name: '📦 Pack (150💎)', value: '3 random cards — `/buypack`' });

      for (const c of Object.values(CARDS)) {
        embed.addFields({ name: `${c.emoji} ${c.name} (${c.gemCost}💎)`, value: `${c.rarity} | ${c.hp}HP`, inline: true });
      }
      await interaction.reply({ embeds: [embed] });
    }

    // ── /buypack ──
    else if (commandName === 'buypack') {
      if (player.gems < PACK_GEM_COST) return interaction.reply({ content: `❌ Need ${PACK_GEM_COST}💎, you have ${player.gems}💎.`, ephemeral: true });
      player.gems -= PACK_GEM_COST;
      const pulled = openPack(3);
      for (const id of pulled) id === 'energy' ? player.energyCards++ : player.deck.push(id);
      const embed = new EmbedBuilder().setTitle('🛒 Pack Purchased!').setColor(0xf39c12).setFooter({ text: `Remaining: ${player.gems}💎` });
      embed.addFields({ name: '🎴 You got:', value: pulled.map((id, i) => id === 'energy' ? `**${i+1}:** ⚡ Energy Card` : `**${i+1}:** ${CARDS[id].emoji} **${CARDS[id].name}**`).join('\n') });
      await interaction.reply({ embeds: [embed] });
    }

    // ── /buycard ──
    else if (commandName === 'buycard') {
      const cardId = interaction.options.getString('card');
      const card = CARDS[cardId];
      if (!card) return interaction.reply({ content: '❌ Card not found.', ephemeral: true });
      if (player.gems < card.gemCost) return interaction.reply({ content: `❌ Need ${card.gemCost}💎, you have ${player.gems}💎.`, ephemeral: true });
      player.gems -= card.gemCost;
      player.deck.push(cardId);
      await interaction.reply({ embeds: [new EmbedBuilder().setTitle('🛒 Card Purchased!').setDescription(`${card.emoji} **${card.name}** added to your deck!`).setColor(card.color).setFooter({ text: `Remaining: ${player.gems}💎` })] });
    }

    // ── /name ──
    else if (commandName === 'name') {
      const cardId = interaction.options.getString('card');
      const nickname = interaction.options.getString('nickname');
      if (!player.deck.includes(cardId)) return interaction.reply({ content: `❌ You don't have ${CARDS[cardId]?.name || cardId} in your deck!`, ephemeral: true });
      player.nicknames[cardId] = nickname;
      const card = CARDS[cardId];
      await interaction.reply({ embeds: [new EmbedBuilder().setTitle('✏️ Nickname Set!').setDescription(`${card.emoji} **${card.name}** is now *"${nickname}"*!`).setColor(card.color)] });
    }

    // ── /gamble ──
    else if (commandName === 'gamble') {
      const amount = interaction.options.getInteger('amount');
      if (player.gems < amount) return interaction.reply({ content: `❌ You only have ${player.gems}💎!`, ephemeral: true });

      const roll = Math.random();
      let result, gained;

      if (roll < 0.45) {
        // Win — double
        gained = amount;
        player.gems += gained;
        result = `🎰 **YOU WIN!** +${gained}💎\nBalance: **${player.gems}💎**`;
      } else if (roll < 0.55) {
        // Push — get back half
        gained = Math.floor(amount / 2);
        player.gems -= gained;
        result = `🎰 **PUSH!** You get back half. -${gained}💎\nBalance: **${player.gems}💎**`;
      } else {
        // Lose
        player.gems -= amount;
        result = `🎰 **YOU LOSE!** -${amount}💎\nBalance: **${player.gems}💎**`;
      }

      const embed = new EmbedBuilder().setTitle('🎰 Gem Gamble!').setDescription(`You bet **${amount}💎**\n\n${result}`).setColor(roll < 0.45 ? 0x00b894 : roll < 0.55 ? 0xf39c12 : 0xe74c3c);
      await interaction.reply({ embeds: [embed] });
    }

    // ── /gift ──
    else if (commandName === 'gift') {
      const target = interaction.options.getUser('user');
      const cardId = interaction.options.getString('card');
      const card = CARDS[cardId];
      if (!player.deck.includes(cardId)) return interaction.reply({ content: `❌ You don't have **${card?.name}** in your deck!`, ephemeral: true });
      if (target.id === userId) return interaction.reply({ content: '❌ You cannot gift yourself!', ephemeral: true });

      player.deck.splice(player.deck.indexOf(cardId), 1);
      const tp = getPlayer(target.id);
      tp.deck.push(cardId);

      await interaction.reply({ embeds: [new EmbedBuilder().setTitle('🎁 Card Gifted!').setDescription(`${interaction.user.displayName} gifted ${card.emoji} **${card.name}** to **${target.displayName}**!`).setColor(0x00b894)] });
    }

    // ── /trade ──
    else if (commandName === 'trade') {
      const target = interaction.options.getUser('user');
      const giveId = interaction.options.getString('yougive');
      const wantId = interaction.options.getString('youget');

      if (!player.deck.includes(giveId)) return interaction.reply({ content: `❌ You don't have **${CARDS[giveId]?.name}** to trade!`, ephemeral: true });
      if (target.id === userId) return interaction.reply({ content: '❌ Cannot trade with yourself!', ephemeral: true });

      const tradeId = tradeCounter++;
      tradeOffers.set(tradeId, { tradeId, fromId: userId, fromName: interaction.user.displayName, toId: target.id, toName: target.displayName, giveId, wantId });

      const gCard = CARDS[giveId]; const wCard = CARDS[wantId];
      const embed = new EmbedBuilder()
        .setTitle('🔄 Trade Offer!')
        .setDescription(`**${interaction.user.displayName}** wants to trade with **${target.displayName}**!`)
        .setColor(0x6c5ce7)
        .addFields(
          { name: '📤 They offer', value: `${gCard.emoji} **${gCard.name}**`, inline: true },
          { name: '📥 They want', value: `${wCard.emoji} **${wCard.name}**`, inline: true },
        ).setFooter({ text: `Trade #${tradeId} — ${target.displayName}, do you accept?` });

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId(`trade_accept_${tradeId}`).setLabel('✅ Accept Trade').setStyle(ButtonStyle.Success),
        new ButtonBuilder().setCustomId(`trade_decline_${tradeId}`).setLabel('❌ Decline').setStyle(ButtonStyle.Danger),
      );
      await interaction.reply({ embeds: [embed], components: [row] });
    }

    // ── /arenas ──
    else if (commandName === 'arenas') {
      const embed = new EmbedBuilder().setTitle('🏟️ TFCImon Arenas').setDescription('Use `/challenge` to fight a guardian!').setColor(0x00cec9);
      for (const arena of Object.values(ARENAS)) {
        const holder = arena.holder ? `👑 **${arena.holderName}**` : '🔓 *Unclaimed!*';
        embed.addFields({ name: `${arena.emoji} ${arena.name}`, value: `${arena.description}\n${holder} | 🛡️ **${arena.guardian.name}** (${arena.guardian.hp}HP)` });
      }
      await interaction.reply({ embeds: [embed] });
    }

    // ── /challenge ──
    else if (commandName === 'challenge') {
      const arenaId = interaction.options.getString('arena');
      const arena = ARENAS[arenaId];
      if (player.deck.length === 0) return interaction.reply({ content: '❌ You have no cards!', ephemeral: true });

      const cardId = player.deck[Math.floor(Math.random() * player.deck.length)];
      const card = CARDS[cardId];
      const bonus = player.energyCards > 0 ? (player.energyCards--, 2) : 0;
      const battleId = `arena_${arenaId}_${userId}_${Date.now()}`;
      const level = getCardLevel(player, cardId);

      activeArenaBattles.set(battleId, {
        battleId, arenaId, userId, userName: interaction.user.displayName,
        cardId, playerHp: card.hp, playerEnergy: 3 + bonus,
        guardianHp: arena.guardian.hp, guardianEnergy: arena.guardian.energy,
        cardLevel: level,
      });

      const embed = new EmbedBuilder()
        .setTitle(`${arena.emoji} Arena Challenge: ${arena.name}`)
        .setDescription(`**${interaction.user.displayName}** steps into the arena!\n\n${arena.guardian.emoji} **${arena.guardian.name}** blocks the way!${bonus > 0 ? '\n⚡ Energy card activated! +2 energy!' : ''}${level > 1 ? `\n⬆️ ${card.name} is Lv${level}! (+${getLevelBonus(level)} damage bonus)` : ''}`)
        .setColor(arena.color)
        .addFields(
          { name: `${card.emoji} Your Card`, value: `**${card.name}** Lv${level} — ${card.hp}HP`, inline: true },
          { name: '⚔️ VS', value: '──────', inline: true },
          { name: `${arena.guardian.emoji} Guardian`, value: `**${arena.guardian.name}** — ${arena.guardian.hp}HP`, inline: true },
        ).setFooter({ text: 'You go first!' });

      await interaction.reply({ embeds: [embed] });
      await sendArenaBattleState(interaction.channel, battleId);
    }

    // ── /battle ──
    else if (commandName === 'battle') {
      const challenger = interaction.user;
      const opponent = interaction.options.getUser('opponent');
      if (opponent.id === challenger.id) return interaction.reply({ content: '❌ Cannot battle yourself!', ephemeral: true });
      if (opponent.bot) return interaction.reply({ content: '❌ Cannot battle a bot!', ephemeral: true });

      const cp = getPlayer(challenger.id); const op = getPlayer(opponent.id);
      if (cp.deck.length === 0) return interaction.reply({ content: '❌ You have no cards!', ephemeral: true });
      if (op.deck.length === 0) return interaction.reply({ content: `❌ ${opponent.displayName} has no cards!`, ephemeral: true });

      const battleId = `pvp_${challenger.id}_${opponent.id}_${Date.now()}`;
      const cCardId = cp.deck[Math.floor(Math.random() * cp.deck.length)];
      const oCardId = op.deck[Math.floor(Math.random() * op.deck.length)];
      const cCard = CARDS[cCardId]; const oCard = CARDS[oCardId];
      const cBonus = cp.energyCards > 0 ? (cp.energyCards--, 2) : 0;
      const oBonus = op.energyCards > 0 ? (op.energyCards--, 2) : 0;
      const cLevel = getCardLevel(cp, cCardId);
      const oLevel = getCardLevel(op, oCardId);

      activeBattles.set(battleId, {
        battleId,
        challenger: { id: challenger.id, name: challenger.displayName, cardId: cCardId, hp: cCard.hp, energy: 3 + cBonus, level: cLevel },
        opponent: { id: opponent.id, name: opponent.displayName, cardId: oCardId, hp: oCard.hp, energy: 3 + oBonus, level: oLevel },
        turn: challenger.id, accepted: false,
      });

      const embed = new EmbedBuilder().setTitle('⚔️ TFCImon Battle Challenge!').setDescription(`${challenger.displayName} challenges ${opponent} to a battle!`).setColor(0xe74c3c)
        .addFields(
          { name: `${cCard.emoji} ${challenger.displayName}`, value: `**${cCard.name}** Lv${cLevel} — ${cCard.hp}HP${cBonus ? ' ⚡+2' : ''}`, inline: true },
          { name: '⚔️ VS', value: '─────', inline: true },
          { name: `${oCard.emoji} ${opponent.displayName}`, value: `**${oCard.name}** Lv${oLevel} — ${oCard.hp}HP${oBonus ? ' ⚡+2' : ''}`, inline: true },
        ).setFooter({ text: `${opponent.displayName}, do you accept?` });

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId(`accept_${battleId}`).setLabel('✅ Accept').setStyle(ButtonStyle.Success),
        new ButtonBuilder().setCustomId(`decline_${battleId}`).setLabel('❌ Decline').setStyle(ButtonStyle.Danger),
      );
      await interaction.reply({ embeds: [embed], components: [row] });
    }

    // ── /ah ──
    else if (commandName === 'ah') {
      const listings = [...auctionListings.values()];
      if (listings.length === 0) return interaction.reply({ content: '🏪 Auction house is empty! Use `/ah-sell` to list a card.' });
      const embed = new EmbedBuilder().setTitle('🏪 Auction House').setColor(0xe17055);
      for (const l of listings.slice(0, 10)) {
        const card = CARDS[l.cardId];
        const bidInfo = l.bidPrice ? `\n🏷️ Bid: ${l.currentBid || l.bidPrice}💎 (${l.highestBidderName || 'nobody'})` : '';
        embed.addFields({ name: `#${l.id} ${card?.emoji} ${card?.name} — ${l.sellerName}`, value: `💰 Buy Now: **${l.price}💎**${bidInfo}` });
      }
      const rows = [];
      const buyRow = new ActionRowBuilder();
      for (const l of listings.slice(0, 5)) {
        const card = CARDS[l.cardId];
        buyRow.addComponents(new ButtonBuilder().setCustomId(`ah_buy_${l.id}`).setLabel(`Buy #${l.id} ${card?.emoji || ''}`).setStyle(ButtonStyle.Success));
      }
      rows.push(buyRow);
      await interaction.reply({ embeds: [embed], components: rows });
    }

    // ── /ah-sell ──
    else if (commandName === 'ah-sell') {
      const cardId = interaction.options.getString('card');
      const price = interaction.options.getInteger('price');
      const bidStart = interaction.options.getInteger('bidstart');
      if (!player.deck.includes(cardId)) return interaction.reply({ content: `❌ You don't have **${CARDS[cardId]?.name}** in your deck!`, ephemeral: true });
      player.deck.splice(player.deck.indexOf(cardId), 1);
      const id = listingCounter++;
      auctionListings.set(id, { id, sellerId: userId, sellerName: interaction.user.displayName, cardId, price, bidPrice: bidStart || null, currentBid: null, highestBidder: null, highestBidderName: null });
      const card = CARDS[cardId];
      await interaction.reply({ embeds: [new EmbedBuilder().setTitle('🏪 Card Listed!').setDescription(`${card?.emoji} **${card?.name}** listed!\n💰 Buy Now: **${price}💎**${bidStart ? `\n🏷️ Bidding from: **${bidStart}💎**` : ''}`).setColor(0xe17055)] });
    }

    // ── /ah-search ──
    else if (commandName === 'ah-search') {
      const cardId = interaction.options.getString('card');
      const card = CARDS[cardId];
      const results = [...auctionListings.values()].filter(l => l.cardId === cardId);
      if (results.length === 0) return interaction.reply({ content: `🔍 No listings for **${card?.name}**.` });
      const embed = new EmbedBuilder().setTitle(`🔍 ${card?.emoji} ${card?.name}`).setColor(card?.color || 0x9b59b6);
      for (const l of results) {
        const bidInfo = l.bidPrice ? `\n🏷️ Bid: ${l.currentBid || l.bidPrice}💎 (${l.highestBidderName || 'nobody'})` : '';
        embed.addFields({ name: `#${l.id} — ${l.sellerName}`, value: `💰 **${l.price}💎**${bidInfo}` });
      }
      const row = new ActionRowBuilder();
      for (const l of results.slice(0, 3)) {
        row.addComponents(new ButtonBuilder().setCustomId(`ah_buy_${l.id}`).setLabel(`Buy #${l.id}`).setStyle(ButtonStyle.Success));
        if (l.bidPrice) row.addComponents(new ButtonBuilder().setCustomId(`ah_bid_${l.id}`).setLabel(`Bid #${l.id}`).setStyle(ButtonStyle.Primary));
      }
      await interaction.reply({ embeds: [embed], components: [row] });
    }

    // ── /jointournament ──
    else if (commandName === 'jointournament') {
      if (!activeTournament.running) return interaction.reply({ content: '❌ No tournament open right now! Wait for an OP to start one.', ephemeral: true });
      if (activeTournament.bracket.length > 0) return interaction.reply({ content: '❌ Tournament already started!', ephemeral: true });
      if (activeTournament.players.find(p => p.id === userId)) return interaction.reply({ content: '❌ You already joined!', ephemeral: true });
      if (player.deck.length === 0) return interaction.reply({ content: '❌ You need cards to join!', ephemeral: true });
      activeTournament.players.push({ id: userId, name: interaction.user.displayName });
      await interaction.reply({ embeds: [new EmbedBuilder().setTitle('🏆 Joined Tournament!').setDescription(`**${interaction.user.displayName}** joined! (${activeTournament.players.length} players so far)\n\nWait for the OP to start the matches!`).setColor(0xf1c40f)] });
    }

    // ════════════ OP COMMANDS ════════════

    else if (commandName === 'makecard') {
      if (!isOp(interaction)) return interaction.reply({ content: '❌ No permission.', ephemeral: true });
      const name = interaction.options.getString('name');
      const hp = interaction.options.getInteger('hp');
      const type = interaction.options.getString('type');
      const rarity = interaction.options.getString('rarity');
      const m1 = interaction.options.getString('move1'); const m1d = interaction.options.getInteger('move1dmg');
      const m2 = interaction.options.getString('move2'); const m2d = interaction.options.getInteger('move2dmg');
      const giveToUser = interaction.options.getUser('giveto');
      const newId = `custom_${Date.now()}`;
      CARDS[newId] = { id: newId, name, hp, type, rarity, emoji: '🃏', color: 0x6c5ce7, description: `Custom card by ${interaction.user.displayName}.`, gemCost: 9999, moves: [{ name: m1, damage: m1d, cost: 2, emoji: '⚔️' }, { name: m2, damage: m2d, cost: 4, emoji: '💥' }] };
      if (giveToUser) getPlayer(giveToUser.id).deck.push(newId);
      await interaction.reply({ embeds: [new EmbedBuilder().setTitle('🃏 Custom Card Created!').setDescription(`**${name}** — ${hp}HP | ${type} | ${rarity}\n⚔️ ${m1}: ${m1d}dmg\n💥 ${m2}: ${m2d}dmg${giveToUser ? `\nGiven to **${giveToUser.displayName}**!` : ''}`).setColor(0x6c5ce7)] });
    }

    else if (commandName === 'givegems') {
      if (!isOp(interaction)) return interaction.reply({ content: '❌ No permission.', ephemeral: true });
      const target = interaction.options.getUser('user'); const amount = interaction.options.getInteger('amount');
      const tp = getPlayer(target.id); tp.gems += amount;
      await interaction.reply({ embeds: [new EmbedBuilder().setTitle('💎 Gems Given!').setDescription(`Gave **${amount}💎** to **${target.displayName}**! They now have **${tp.gems}💎**.`).setColor(0xf1c40f)] });
    }

    else if (commandName === 'givecard') {
      if (!isOp(interaction)) return interaction.reply({ content: '❌ No permission.', ephemeral: true });
      const target = interaction.options.getUser('user'); const cardId = interaction.options.getString('card');
      const tp = getPlayer(target.id); tp.deck.push(cardId);
      const card = CARDS[cardId];
      await interaction.reply({ embeds: [new EmbedBuilder().setTitle('🎴 Card Given!').setDescription(`Gave ${card?.emoji} **${card?.name}** to **${target.displayName}**!`).setColor(card?.color || 0x9b59b6)] });
    }

    else if (commandName === 'kill') {
      if (!isOp(interaction)) return interaction.reply({ content: '❌ No permission.', ephemeral: true });
      const target = interaction.options.getUser('user');
      const tp = getPlayer(target.id); tp.deck = []; tp.energyCards = 0;
      await interaction.reply({ embeds: [new EmbedBuilder().setTitle('💀 Player Wiped!').setDescription(`**${target.displayName}**'s deck wiped. 💀`).setColor(0xe74c3c)] });
    }

    else if (commandName === 'resetarena') {
      if (!isOp(interaction)) return interaction.reply({ content: '❌ No permission.', ephemeral: true });
      const arenaId = interaction.options.getString('arena');
      const arena = ARENAS[arenaId]; arena.holder = null; arena.holderName = null;
      await interaction.reply({ embeds: [new EmbedBuilder().setTitle('🏟️ Arena Reset!').setDescription(`**${arena.name}** is unclaimed again!`).setColor(arena.color)] });
    }

    else if (commandName === 'announce') {
      if (!isOp(interaction)) return interaction.reply({ content: '❌ No permission.', ephemeral: true });
      const message = interaction.options.getString('message');
      await interaction.reply({ embeds: [new EmbedBuilder().setTitle('📢 TFCImon Announcement').setDescription(message).setColor(0xfdcb6e).setFooter({ text: `From: ${interaction.user.displayName}` })] });
    }

    else if (commandName === 'doublegems') {
      if (!isOp(interaction)) return interaction.reply({ content: '❌ No permission.', ephemeral: true });
      doubleGemsEvent = !doubleGemsEvent;
      await interaction.reply({ embeds: [new EmbedBuilder().setTitle(doubleGemsEvent ? '🎉 Double Gems Event STARTED!' : '⏹️ Double Gems Event ENDED!').setDescription(doubleGemsEvent ? 'All gem rewards are doubled until further notice!' : 'Gem rewards are back to normal.').setColor(doubleGemsEvent ? 0xf1c40f : 0x636e72)] });
    }

    else if (commandName === 'tournament') {
      if (!isOp(interaction)) return interaction.reply({ content: '❌ No permission.', ephemeral: true });
      if (activeTournament.running && activeTournament.players.length < 2) {
        activeTournament.running = false; activeTournament.players = [];
        return interaction.reply({ content: '❌ Tournament cancelled (not enough players joined).' });
      }
      if (!activeTournament.running) {
        activeTournament.running = true; activeTournament.players = []; activeTournament.bracket = [];
        return interaction.reply({ embeds: [new EmbedBuilder().setTitle('🏆 Tournament Open!').setDescription('A TFCImon tournament is starting! Use `/jointournament` to enter!\n\nOP will start the bracket when enough players have joined.').setColor(0xf1c40f)] });
      }
      // Start bracket
      const shuffled = [...activeTournament.players].sort(() => Math.random() - 0.5);
      activeTournament.bracket = shuffled;
      const matchups = [];
      for (let i = 0; i < shuffled.length - 1; i += 2) {
        matchups.push(`⚔️ **${shuffled[i].name}** vs **${shuffled[i+1]?.name || 'BYE'}**`);
      }
      await interaction.reply({ embeds: [new EmbedBuilder().setTitle('🏆 Tournament Bracket!').setDescription(matchups.join('\n') + '\n\nChallenge your opponent using `/battle`!').setColor(0xf1c40f)] });
    }
  }

  // ─── BUTTONS ─────────────────────────────────────────────────────────────────

  else if (interaction.isButton()) {
    const customId = interaction.customId;
    const userId = interaction.user.id;
    const player = getPlayer(userId);

    // Trade accept/decline
    if (customId.startsWith('trade_accept_') || customId.startsWith('trade_decline_')) {
      const tradeId = parseInt(customId.replace('trade_accept_', '').replace('trade_decline_', ''));
      const trade = tradeOffers.get(tradeId);
      if (!trade) return interaction.reply({ content: '❌ Trade expired.', ephemeral: true });
      if (interaction.user.id !== trade.toId) return interaction.reply({ content: '❌ This trade is not for you!', ephemeral: true });

      if (customId.startsWith('trade_decline_')) {
        tradeOffers.delete(tradeId);
        return interaction.update({ content: '❌ Trade declined.', embeds: [], components: [] });
      }

      const fromPlayer = getPlayer(trade.fromId);
      const toPlayer = getPlayer(trade.toId);

      if (!fromPlayer.deck.includes(trade.giveId)) {
        tradeOffers.delete(tradeId);
        return interaction.update({ content: '❌ Trader no longer has that card!', embeds: [], components: [] });
      }
      if (!toPlayer.deck.includes(trade.wantId)) {
        tradeOffers.delete(tradeId);
        return interaction.update({ content: '❌ You no longer have that card!', embeds: [], components: [] });
      }

      fromPlayer.deck.splice(fromPlayer.deck.indexOf(trade.giveId), 1);
      toPlayer.deck.splice(toPlayer.deck.indexOf(trade.wantId), 1);
      fromPlayer.deck.push(trade.wantId);
      toPlayer.deck.push(trade.giveId);
      tradeOffers.delete(tradeId);

      const gCard = CARDS[trade.giveId]; const wCard = CARDS[trade.wantId];
      await interaction.update({ embeds: [new EmbedBuilder().setTitle('🔄 Trade Complete!').setDescription(`**${trade.fromName}** got ${wCard.emoji} **${wCard.name}**\n**${trade.toName}** got ${gCard.emoji} **${gCard.name}**`).setColor(0x00b894)], components: [] });
    }

    // AH Buy
    else if (customId.startsWith('ah_buy_')) {
      const listingId = parseInt(customId.replace('ah_buy_', ''));
      const listing = auctionListings.get(listingId);
      if (!listing) return interaction.reply({ content: '❌ Listing no longer exists.', ephemeral: true });
      if (listing.sellerId === userId) return interaction.reply({ content: "❌ Can't buy your own listing!", ephemeral: true });
      if (player.gems < listing.price) return interaction.reply({ content: `❌ Need ${listing.price}💎, you have ${player.gems}💎.`, ephemeral: true });

      player.gems -= listing.price;
      player.deck.push(listing.cardId);
      getPlayer(listing.sellerId).gems += listing.price;
      auctionListings.delete(listingId);

      const card = CARDS[listing.cardId];
      await interaction.reply({ embeds: [new EmbedBuilder().setTitle('🏪 Purchase Complete!').setDescription(`${card?.emoji} **${card?.name}** bought for **${listing.price}💎**!`).setColor(0x00b894)] });
    }

    // AH Bid
    else if (customId.startsWith('ah_bid_')) {
      const listingId = parseInt(customId.replace('ah_bid_', ''));
      const listing = auctionListings.get(listingId);
      if (!listing) return interaction.reply({ content: '❌ Listing not found.', ephemeral: true });
      if (listing.sellerId === userId) return interaction.reply({ content: "❌ Can't bid your own listing!", ephemeral: true });
      const minBid = (listing.currentBid || listing.bidPrice) + 1;
      if (player.gems < minBid) return interaction.reply({ content: `❌ Min bid is ${minBid}💎, you have ${player.gems}💎.`, ephemeral: true });
      if (listing.highestBidder) getPlayer(listing.highestBidder).gems += listing.currentBid;
      player.gems -= minBid;
      listing.currentBid = minBid; listing.highestBidder = userId; listing.highestBidderName = interaction.user.displayName;
      await interaction.reply({ embeds: [new EmbedBuilder().setTitle('🏷️ Bid Placed!').setDescription(`You bid **${minBid}💎** — you're the highest bidder!`).setColor(0x6c5ce7)] });
    }

    // PvP accept/decline
    else if (customId.startsWith('accept_') || customId.startsWith('decline_')) {
      const battleId = customId.replace('accept_', '').replace('decline_', '');
      const battle = activeBattles.get(battleId);
      if (!battle) return interaction.reply({ content: '❌ Battle expired.', ephemeral: true });
      if (interaction.user.id !== battle.opponent.id) return interaction.reply({ content: '❌ Only the challenged player can respond!', ephemeral: true });
      if (customId.startsWith('decline_')) {
        activeBattles.delete(battleId);
        return interaction.update({ content: `❌ ${battle.opponent.name} declined.`, embeds: [], components: [] });
      }
      battle.accepted = true;
      await interaction.update({ components: [] });
      await sendBattleState(interaction.channel, battle, CARDS[battle.challenger.cardId], CARDS[battle.opponent.cardId], battleId);
    }

    // PvP moves
    else if (customId.startsWith('move_pvp_')) {
      const parts = customId.split('_');
      const moveIndex = parseInt(parts[parts.length - 1]);
      const battleId = parts.slice(2, parts.length - 1).join('_');
      const battle = activeBattles.get(battleId);
      if (!battle) return interaction.reply({ content: '❌ Battle not found.', ephemeral: true });
      if (interaction.user.id !== battle.turn) return interaction.reply({ content: "❌ Not your turn!", ephemeral: true });

      const isChallenger = interaction.user.id === battle.challenger.id;
      const attacker = isChallenger ? battle.challenger : battle.opponent;
      const defender = isChallenger ? battle.opponent : battle.challenger;
      const aCard = CARDS[attacker.cardId];
      const move = aCard.moves[moveIndex];
      if (!move) return interaction.reply({ content: '❌ Invalid move.', ephemeral: true });
      if (attacker.energy < move.cost) return interaction.reply({ content: `❌ Need ${move.cost}⚡, have ${attacker.energy}⚡.`, ephemeral: true });

      const bonus = getLevelBonus(attacker.level || 1);
      const totalDmg = move.damage + bonus;
      attacker.energy -= move.cost;
      defender.hp = Math.max(0, defender.hp - totalDmg);
      attacker.energy = Math.min(attacker.energy + 1, 6);
      defender.energy = Math.min(defender.energy + 1, 6);
      battle.turn = defender.id;

      await interaction.update({ components: [] });

      if (defender.hp <= 0) {
        activeBattles.delete(battleId);
        const atkPlayer = getPlayer(attacker.id); const defPlayer = getPlayer(defender.id);
        const gemGain = 25 * gemMultiplier();
        atkPlayer.wins++; atkPlayer.gems += gemGain;
        atkPlayer.cardWins[attacker.cardId] = (atkPlayer.cardWins[attacker.cardId] || 0) + 1;
        defPlayer.losses++;
        defPlayer.cardLosses[defender.cardId] = (defPlayer.cardLosses[defender.cardId] || 0) + 1;
        // Level up card every 3 wins
        const cWins = atkPlayer.cardWins[attacker.cardId];
        if (cWins % 3 === 0) {
          atkPlayer.cardLevels[attacker.cardId] = (atkPlayer.cardLevels[attacker.cardId] || 1) + 1;
        }
        const lvlMsg = cWins % 3 === 0 ? `\n⬆️ **${aCard.name}** leveled up to Lv${atkPlayer.cardLevels[attacker.cardId]}!` : '';
        return interaction.channel.send({ embeds: [new EmbedBuilder().setTitle('🏆 Battle Over!').setDescription(`**${attacker.name}** wins! +${gemGain}💎${lvlMsg}\n${move.emoji} **${move.name}** dealt **${totalDmg}** as the finishing blow!`).setColor(0xf1c40f)] });
      }

      const dCard = CARDS[defender.cardId];
      await sendBattleState(interaction.channel, battle, CARDS[battle.challenger.cardId], CARDS[battle.opponent.cardId], battleId,
        `${move.emoji} **${attacker.name}** used **${move.name}** → **${totalDmg}** damage!${bonus > 0 ? ` *(+${bonus} level bonus)*` : ''}`);
    }

    // Arena moves
    else if (customId.startsWith('move_arena_')) {
      const parts = customId.split('_');
      const moveIndex = parseInt(parts[parts.length - 1]);
      const battleId = parts.slice(2, parts.length - 1).join('_');
      const ab = activeArenaBattles.get(battleId);
      if (!ab) return interaction.reply({ content: '❌ Arena battle not found.', ephemeral: true });
      if (interaction.user.id !== ab.userId) return interaction.reply({ content: '❌ Not your battle!', ephemeral: true });

      const card = CARDS[ab.cardId]; const arena = ARENAS[ab.arenaId];
      const move = card.moves[moveIndex];
      if (!move) return interaction.reply({ content: '❌ Invalid move.', ephemeral: true });
      if (ab.playerEnergy < move.cost) return interaction.reply({ content: `❌ Need ${move.cost}⚡, have ${ab.playerEnergy}⚡.`, ephemeral: true });

      const bonus = getLevelBonus(ab.cardLevel || 1);
      const totalDmg = move.damage + bonus;
      ab.playerEnergy -= move.cost;
      ab.guardianHp = Math.max(0, ab.guardianHp - totalDmg);
      ab.playerEnergy = Math.min(ab.playerEnergy + 1, 6);
      ab.guardianEnergy = Math.min(ab.guardianEnergy + 1, 6);

      await interaction.update({ components: [] });
      const pLog = `${move.emoji} **${ab.userName}** used **${move.name}** → **${totalDmg}** damage!${bonus > 0 ? ` *(+${bonus} level bonus)*` : ''}`;

      if (ab.guardianHp <= 0) {
        activeArenaBattles.delete(battleId);
        const prevHolder = arena.holderName;
        arena.holder = ab.userId; arena.holderName = ab.userName;
        const gemGain = 50 * gemMultiplier();
        const wp = getPlayer(ab.userId); wp.gems += gemGain; wp.wins++;
        wp.cardWins[ab.cardId] = (wp.cardWins[ab.cardId] || 0) + 1;
        if (wp.cardWins[ab.cardId] % 3 === 0) wp.cardLevels[ab.cardId] = (wp.cardLevels[ab.cardId] || 1) + 1;
        return interaction.channel.send({ embeds: [new EmbedBuilder().setTitle(`${arena.emoji} Arena Conquered!`).setDescription(`👑 **${ab.userName}** defeated **${arena.guardian.name}** and claimed **${arena.name}**! +${gemGain}💎\n${prevHolder ? `*${prevHolder} lost the arena.*` : '*First claim ever!*'}`).setColor(0xf1c40f)] });
      }

      const gMove = aiPickMove(arena.guardian, ab.guardianEnergy);
      ab.guardianEnergy -= gMove.cost;
      ab.playerHp = Math.max(0, ab.playerHp - gMove.damage);
      ab.guardianEnergy = Math.min(ab.guardianEnergy + 1, 6);
      ab.playerEnergy = Math.min(ab.playerEnergy + 1, 6);
      const gLog = `${gMove.emoji} **${arena.guardian.name}** used **${gMove.name}** → **${gMove.damage}** damage!`;

      if (ab.playerHp <= 0) {
        activeArenaBattles.delete(battleId);
        const lp = getPlayer(ab.userId); lp.losses++;
        return interaction.channel.send({ embeds: [new EmbedBuilder().setTitle(`${arena.emoji} Defeated!`).setDescription(`💀 **${ab.userName}** was defeated by **${arena.guardian.name}**!`).setColor(0xe74c3c)] });
      }

      await sendArenaBattleState(interaction.channel, battleId, `${pLog}\n${gLog}`);
    }
  }
});

// ─── BATTLE STATE ─────────────────────────────────────────────────────────────

async function sendBattleState(channel, battle, cCard, oCard, battleId, lastAction = null) {
  const cur = battle.turn === battle.challenger.id ? battle.challenger : battle.opponent;
  const curCard = CARDS[cur.cardId];
  const embed = new EmbedBuilder().setTitle('⚔️ TFCImon Battle!').setColor(0x2ecc71)
    .addFields(
      { name: `${cCard.emoji} ${battle.challenger.name} — ${cCard.name} Lv${battle.challenger.level || 1}`, value: `❤️ ${hpBar(battle.challenger.hp, cCard.hp)}\n⚡ ${battle.challenger.energy}` },
      { name: `${oCard.emoji} ${battle.opponent.name} — ${oCard.name} Lv${battle.opponent.level || 1}`, value: `❤️ ${hpBar(battle.opponent.hp, oCard.hp)}\n⚡ ${battle.opponent.energy}` },
    ).setFooter({ text: `🎮 ${cur.name}'s turn!` });
  if (lastAction) embed.setDescription(lastAction);

  const level = cur.level || 1;
  const bonus = getLevelBonus(level);
  const row = new ActionRowBuilder();
  for (let i = 0; i < curCard.moves.length; i++) {
    const m = curCard.moves[i];
    const totalDmg = m.damage + bonus;
    row.addComponents(new ButtonBuilder()
      .setCustomId(`move_pvp_${battleId}_${i}`)
      .setLabel(`${m.emoji} ${m.name} (${m.cost}⚡, ${totalDmg}dmg)`)
      .setStyle(m.isEx ? ButtonStyle.Danger : ButtonStyle.Primary)
      .setDisabled(cur.energy < m.cost));
  }
  await channel.send({ embeds: [embed], components: [row] });
}

async function sendArenaBattleState(channel, battleId, lastAction = null) {
  const ab = activeArenaBattles.get(battleId);
  if (!ab) return;
  const card = CARDS[ab.cardId]; const arena = ARENAS[ab.arenaId];
  const level = ab.cardLevel || 1;
  const bonus = getLevelBonus(level);

  const embed = new EmbedBuilder().setTitle(`${arena.emoji} ${arena.name} — Arena Battle!`).setColor(arena.color)
    .addFields(
      { name: `${card.emoji} ${ab.userName} — ${card.name} Lv${level}`, value: `❤️ ${hpBar(ab.playerHp, card.hp)}\n⚡ ${ab.playerEnergy}` },
      { name: `${arena.guardian.emoji} ${arena.guardian.name}`, value: `❤️ ${hpBar(ab.guardianHp, arena.guardian.hp)}\n⚡ ${ab.guardianEnergy}` },
    ).setFooter({ text: `Your turn, ${ab.userName}!` });
  if (lastAction) embed.setDescription(lastAction);

  const row = new ActionRowBuilder();
  for (let i = 0; i < card.moves.length; i++) {
    const m = card.moves[i];
    const totalDmg = m.damage + bonus;
    row.addComponents(new ButtonBuilder()
      .setCustomId(`move_arena_${battleId}_${i}`)
      .setLabel(`${m.emoji} ${m.name} (${m.cost}⚡, ${totalDmg}dmg)`)
      .setStyle(m.isEx ? ButtonStyle.Danger : ButtonStyle.Primary)
      .setDisabled(ab.playerEnergy < m.cost));
  }
  await channel.send({ embeds: [embed], components: [row] });
}

// ─── START ────────────────────────────────────────────────────────────────────

(async () => {
  await registerCommands();
  await client.login(BOT_TOKEN);
})();
