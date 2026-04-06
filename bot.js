// TFCImon Discord Bot — MEGA UPDATE + PERSISTENT STORAGE
require('dotenv').config();
const { Client, GatewayIntentBits, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

const BOT_TOKEN = process.env.BOT_TOKEN || 'YOUR_BOT_TOKEN_HERE';
const CLIENT_ID = process.env.CLIENT_ID || 'YOUR_CLIENT_ID_HERE';
const OP_USER = 'haxiii7';

// ─── PERSISTENT STORAGE ───────────────────────────────────────────────────────

const DATA_FILE = path.join(__dirname, 'data.json');

function loadData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load data.json:', e.message);
  }
  return { players: {}, arenas: {}, auctionListings: {}, listingCounter: 1, doubleGemsEvent: false, xpBoostEvent: false, customCards: {}, opUsers: [], bounties: {}, bannedUsers: [], frozenUsers: [] };
}

function saveData() {
  try {
    const data = {
      players: Object.fromEntries(playerData),
      arenas: Object.fromEntries(Object.entries(ARENAS).map(([id, a]) => [id, { holder: a.holder, holderName: a.holderName }])),
      auctionListings: Object.fromEntries(auctionListings),
      listingCounter,
      doubleGemsEvent,
      xpBoostEvent,
      customCards: Object.fromEntries(Object.entries(CARDS).filter(([id]) => id.startsWith('custom_'))),
      opUsers,
      bounties: Object.fromEntries(bounties),
      bannedUsers,
      frozenUsers,
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Failed to save data.json:', e.message);
  }
}

setInterval(saveData, 60_000);

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
    description: '✨ LEGENDARY — Born from the collapse of a star.', gemCost: 2500,
    moves: [
      { name: 'Stardust', damage: 90, cost: 2, emoji: '✨' },
      { name: 'Nebula Burst', damage: 160, cost: 4, emoji: '🌌' },
      { name: 'BIG BANG', damage: 280, cost: 7, emoji: '💫', isEx: true },
    ],
  },
};

const PACK_WEIGHTS = {
  celestia: 20, flame: 20, isy: 15, spk_iii: 10, michael: 1,
  shadowfox: 10, stormking: 9, voidwalker: 6, ironclad: 8, cosmicqueen: 0.5,
  energy: 7,
};

const PACK_GEM_COST = 150;
const SELL_BACK_RATE = 0.3;

function getAllCardChoices() {
  return Object.values(CARDS).map(c => ({ name: `${c.emoji} ${c.name} (${c.gemCost}💎) — ${c.rarity}`, value: c.id })).slice(0, 25);
}

// ─── ARENA DATA ───────────────────────────────────────────────────────────────

const ARENAS = {
  '100_player_island': {
    id: '100_player_island', name: '100 Player Island', emoji: '🏝️', color: 0x00b894,
    description: 'Only one survives.', holder: null, holderName: null,
    guardian: { name: 'THE LAST ONE', emoji: '💀', hp: 350, energy: 4, moves: [
      { name: 'Island Wipe', damage: 90, cost: 2, emoji: '🌊' },
      { name: 'Final Circle', damage: 160, cost: 4, emoji: '🔴' },
      { name: 'Only Survivor', damage: 240, cost: 6, emoji: '☠️' },
    ]},
  },
  mingle: {
    id: 'mingle', name: 'Mingle', emoji: '💞', color: 0xff6b9d,
    description: 'Friendships made and destroyed.', holder: null, holderName: null,
    guardian: { name: 'CUPID REAPER', emoji: '💘', hp: 280, energy: 3, moves: [
      { name: 'Heartbreak Strike', damage: 80, cost: 2, emoji: '💔' },
      { name: 'Toxic Charm', damage: 130, cost: 3, emoji: '🩷' },
      { name: 'Lovebomb', damage: 200, cost: 5, emoji: '💣' },
    ]},
  },
  rlgl: {
    id: 'rlgl', name: 'RLGL', emoji: '🚦', color: 0xe74c3c,
    description: "One wrong move and you're gone.", holder: null, holderName: null,
    guardian: { name: 'THE DOLL', emoji: '🎎', hp: 320, energy: 3, moves: [
      { name: 'Red Light', damage: 60, cost: 1, emoji: '🔴' },
      { name: 'Green Light Rush', damage: 120, cost: 3, emoji: '🟢' },
      { name: 'Elimination', damage: 220, cost: 5, emoji: '🎯' },
    ]},
  },
  jumprope: {
    id: 'jumprope', name: 'Jumprope', emoji: '🪢', color: 0x6c5ce7,
    description: 'The rope never stops.', holder: null, holderName: null,
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
    description: 'There is no neutral here.', holder: null, holderName: null,
    guardian: { name: 'COMMANDER NULL', emoji: '🎖️', hp: 330, energy: 4, moves: [
      { name: 'Blue Barrage', damage: 95, cost: 2, emoji: '🔵' },
      { name: 'Red Rush', damage: 145, cost: 3, emoji: '🔴' },
      { name: 'Total War', damage: 230, cost: 6, emoji: '💣' },
    ]},
  },
  pick_a_side: {
    id: 'pick_a_side', name: 'Pick a Side', emoji: '🪙', color: 0x2d3436,
    description: 'Every choice has a consequence.', holder: null, holderName: null,
    guardian: { name: 'THE DECIDER', emoji: '⚖️', hp: 310, energy: 3, moves: [
      { name: 'Coin Flip Crush', damage: 75, cost: 2, emoji: '🪙' },
      { name: 'Wrong Choice', damage: 140, cost: 3, emoji: '❌' },
      { name: 'Judgement Day', damage: 250, cost: 6, emoji: '⚖️' },
    ]},
  },
};

// ─── LOAD DATA ────────────────────────────────────────────────────────────────

const savedData = loadData();
const playerData = new Map(Object.entries(savedData.players || {}));

for (const [arenaId, arenaState] of Object.entries(savedData.arenas || {})) {
  if (ARENAS[arenaId]) {
    ARENAS[arenaId].holder = arenaState.holder || null;
    ARENAS[arenaId].holderName = arenaState.holderName || null;
  }
}

for (const [id, card] of Object.entries(savedData.customCards || {})) {
  CARDS[id] = card;
}

const auctionListings = new Map(Object.entries(savedData.auctionListings || {}).map(([k, v]) => [parseInt(k), v]));
let listingCounter = savedData.listingCounter || 1;
let doubleGemsEvent = savedData.doubleGemsEvent || false;
let xpBoostEvent = savedData.xpBoostEvent || false;
let opUsers = savedData.opUsers || [];
const bounties = new Map(Object.entries(savedData.bounties || {}));
let bannedUsers = savedData.bannedUsers || [];
let frozenUsers = savedData.frozenUsers || [];

const activeBattles = new Map();
const activeArenaBattles = new Map();
const tradeOffers = new Map();
const activeTournament = { running: false, players: [], bracket: [] };
const buildDeckSessions = new Map();
let tradeCounter = 1;

console.log(`✅ Loaded ${playerData.size} players, ${auctionListings.size} AH listings, ${Object.keys(savedData.customCards || {}).length} custom cards, ${bounties.size} bounties`);

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function getPlayer(userId) {
  if (!playerData.has(userId)) {
    playerData.set(userId, { deck: [], activeDeck: [], energyCards: 0, gems: 100, nicknames: {}, wins: 0, losses: 0, cardWins: {}, cardLosses: {}, cardLevels: {}, lastDaily: null, totalBattles: 0, banned: false });
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
  if (!p.activeDeck) p.activeDeck = [];
  if (p.banned === undefined) p.banned = false;
  return p;
}

function isBanned(userId) {
  return bannedUsers.includes(userId);
}

function isFrozen(userId) {
  return frozenUsers.includes(userId);
}

function getCardLevel(player, cardId) { return player.cardLevels[cardId] || 1; }
function getLevelBonus(level) { return (level - 1) * 10; }

function weightedRandom(weights) {
  const total = Object.values(weights).reduce((a, b) => a + b, 0);
  let rand = Math.random() * total;
  for (const [id, weight] of Object.entries(weights)) { rand -= weight; if (rand <= 0) return id; }
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

function isOp(interaction) {
  return interaction.user.username === OP_USER || opUsers.includes(interaction.user.id);
}

function gemMultiplier() { return doubleGemsEvent ? 2 : 1; }

// XP boost: win threshold to level up is halved (every 2 wins instead of 3)
function xpThreshold() { return xpBoostEvent ? 2 : 3; }

function getBattleCard(player) {
  if (player.activeDeck && player.activeDeck.length > 0) {
    const valid = player.activeDeck.filter(id => player.deck.includes(id) && CARDS[id]);
    if (valid.length > 0) return valid[Math.floor(Math.random() * valid.length)];
  }
  const valid = player.deck.filter(id => CARDS[id]);
  return valid[Math.floor(Math.random() * valid.length)];
}

function buildDeckEmbed(userId, player, displayName) {
  const embed = new EmbedBuilder()
    .setTitle(`📦 ${displayName}'s TFCImon Deck`)
    .setColor(0x9b59b6)
    .setFooter({ text: `💎 ${player.gems} gems | ⚡ ${player.energyCards} energy cards | ⚔️ ${player.wins}W ${player.losses}L` });

  if (player.deck.length === 0) {
    embed.setDescription('Deck is empty! Use `/openpack` to get cards.');
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
    const inActive = player.activeDeck && player.activeDeck.includes(id) ? ' 🎯' : '';
    return `${card.emoji} **${card.name}**${nickname}${lvlStr}${inActive} ×${count} — ${card.hp}HP | ${card.rarity} | ${wins}W`;
  }).filter(Boolean);

  embed.setDescription(lines.join('\n'));
  if (player.activeDeck && player.activeDeck.length > 0) {
    const activeNames = player.activeDeck.map(id => CARDS[id]?.name || id).join(', ');
    embed.addFields({ name: '🎯 Active Battle Deck', value: activeNames });
  }

  if (bounties.has(userId)) {
    const b = bounties.get(userId);
    embed.addFields({ name: '🎯 BOUNTY', value: `**${b.amount}💎** — set by ${b.setByName}` });
  }

  if (isFrozen(userId)) {
    embed.addFields({ name: '🧊 FROZEN', value: 'This player cannot battle or gamble.' });
  }

  embed.addFields({ name: '🃏 Total Cards', value: `${player.deck.length}`, inline: true });
  return embed;
}

function buildCardInfoEmbed(card) {
  const embed = new EmbedBuilder()
    .setTitle(`${card.emoji} ${card.name}`)
    .setColor(card.color || 0x9b59b6)
    .setDescription(card.description || '')
    .addFields(
      { name: '❤️ HP', value: `${card.hp}`, inline: true },
      { name: '⚡ Type', value: card.type, inline: true },
      { name: '⭐ Rarity', value: card.rarity, inline: true },
      { name: '💎 Shop Price', value: `${card.gemCost}💎`, inline: true },
      { name: '💰 Sell Value', value: `${Math.round(card.gemCost * SELL_BACK_RATE)}💎`, inline: true },
    );
  if (card.lore) embed.addFields({ name: '📖 Lore', value: card.lore });
  const movesText = card.moves.map(m => `${m.emoji} **${m.name}** — ${m.damage} dmg | Cost: ${m.cost}⚡${m.isEx ? ' ✨EX' : ''}`).join('\n');
  embed.addFields({ name: '⚔️ Moves', value: movesText });
  return embed;
}

// ─── SLOT MACHINE ─────────────────────────────────────────────────────────────

const SLOT_SYMBOLS = ['🍋', '🍒', '🔔', '⭐', '💎', '7️⃣'];
const SLOT_PAYOUTS = {
  '💎💎💎': 20,
  '7️⃣7️⃣7️⃣': 15,
  '⭐⭐⭐': 10,
  '🔔🔔🔔': 7,
  '🍒🍒🍒': 5,
  '🍋🍋🍋': 4,
  'pair': 1.5,
};

function spinSlots() {
  return [
    SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)],
    SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)],
    SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)],
  ];
}

function evalSlots(reels) {
  const key = reels.join('');
  if (SLOT_PAYOUTS[key]) return SLOT_PAYOUTS[key];
  if (reels[0] === reels[1] || reels[1] === reels[2] || reels[0] === reels[2]) return SLOT_PAYOUTS['pair'];
  return 0;
}

// ─── ARENA CHOICES ────────────────────────────────────────────────────────────

const ARENA_CHOICES = [
  { name: '🏝️ 100 Player Island', value: '100_player_island' },
  { name: '💞 Mingle', value: 'mingle' },
  { name: '🚦 RLGL', value: 'rlgl' },
  { name: '🪢 Jumprope', value: 'jumprope' },
  { name: '🌪️ Spinner', value: 'spinner' },
  { name: '⚔️ Red vs Blue Island', value: 'red_vs_blue' },
  { name: '🪙 Pick a Side', value: 'pick_a_side' },
];

// ─── COMMANDS ─────────────────────────────────────────────────────────────────

const commands = [
  new SlashCommandBuilder().setName('openpack').setDescription('Open a TFCImon pack and get 3 cards!').toJSON(),
  new SlashCommandBuilder().setName('deck').setDescription('View your TFCImon card deck').toJSON(),
  new SlashCommandBuilder().setName('inspect').setDescription("View another player's deck").addUserOption(opt => opt.setName('user').setDescription('Player to inspect').setRequired(true)).toJSON(),
  new SlashCommandBuilder().setName('cardinfo').setDescription('View detailed info about any card').addStringOption(opt => opt.setName('card').setDescription('Card to inspect').setRequired(true).addChoices(...getAllCardChoices())).toJSON(),
  new SlashCommandBuilder().setName('gems').setDescription('Check your gem balance').toJSON(),
  new SlashCommandBuilder().setName('shop').setDescription('View the gem shop').toJSON(),
  new SlashCommandBuilder().setName('daily').setDescription('Claim your daily gem reward!').toJSON(),
  new SlashCommandBuilder().setName('leaderboard').setDescription('View the TFCImon leaderboard').toJSON(),
  new SlashCommandBuilder().setName('top').setDescription('Shortcut: View leaderboard').toJSON(),
  new SlashCommandBuilder().setName('stats').setDescription('View your battle stats').toJSON(),
  new SlashCommandBuilder().setName('arenas').setDescription('View all arenas and holders').toJSON(),

  new SlashCommandBuilder().setName('builddeck').setDescription('Choose up to 3 cards as your active battle deck').toJSON(),
  new SlashCommandBuilder().setName('cleardeck').setDescription('Clear your active deck and go back to random card selection').toJSON(),

  new SlashCommandBuilder()
    .setName('order')
    .setDescription('Sort your deck cards')
    .addStringOption(opt => opt.setName('by').setDescription('How to sort').setRequired(true)
      .addChoices(
        { name: '⭐ Rarity', value: 'rarity' },
        { name: '❤️ HP (highest first)', value: 'hp' },
        { name: '🔤 Name (A-Z)', value: 'name' },
        { name: '🏆 Most wins', value: 'wins' },
        { name: '⬆️ Level', value: 'level' },
      )
    ).toJSON(),

  new SlashCommandBuilder().setName('sell').setDescription(`Sell a card back for ${Math.round(SELL_BACK_RATE * 100)}% of its gem cost`).addStringOption(opt => opt.setName('card').setDescription('Card to sell').setRequired(true).addChoices(...getAllCardChoices())).toJSON(),
  new SlashCommandBuilder().setName('buypack').setDescription(`Buy a pack for ${PACK_GEM_COST} gems`).toJSON(),

  new SlashCommandBuilder().setName('battle').setDescription('Challenge another member to a TFCImon battle!').addUserOption(opt => opt.setName('opponent').setDescription('The member to battle').setRequired(true)).toJSON(),

  new SlashCommandBuilder().setName('name').setDescription('Give a nickname to a card in your deck')
    .addStringOption(opt => opt.setName('card').setDescription('Card to rename').setRequired(true).addChoices(...getAllCardChoices()))
    .addStringOption(opt => opt.setName('nickname').setDescription('The nickname').setRequired(true).setMaxLength(32)).toJSON(),

  new SlashCommandBuilder().setName('challenge').setDescription('Challenge an arena guardian!').addStringOption(opt => opt.setName('arena').setDescription('Which arena').setRequired(true).addChoices(...ARENA_CHOICES)).toJSON(),

  // ─── GAMBLING ───
  new SlashCommandBuilder().setName('gamble').setDescription('Gamble gems (45% win, 10% push, 45% lose)').addIntegerOption(opt => opt.setName('amount').setDescription('Amount to gamble').setRequired(true).setMinValue(10)).toJSON(),

  new SlashCommandBuilder().setName('coinflip').setDescription('Flip a coin — call it right and double your bet!')
    .addIntegerOption(opt => opt.setName('amount').setDescription('Amount to bet').setRequired(true).setMinValue(5))
    .addStringOption(opt => opt.setName('call').setDescription('Heads or tails?').setRequired(true).addChoices({ name: '🪙 Heads', value: 'heads' }, { name: '🔵 Tails', value: 'tails' })).toJSON(),

  new SlashCommandBuilder().setName('slots').setDescription('Spin the slot machine! Match symbols to multiply your bet.')
    .addIntegerOption(opt => opt.setName('amount').setDescription('Amount to bet').setRequired(true).setMinValue(10)).toJSON(),

  new SlashCommandBuilder().setName('dice').setDescription('Roll dice against the house — roll higher to win!')
    .addIntegerOption(opt => opt.setName('amount').setDescription('Amount to bet').setRequired(true).setMinValue(10))
    .addStringOption(opt => opt.setName('mode').setDescription('Game mode').setRequired(true).addChoices(
      { name: '🎲 Classic (1d6 vs house)', value: 'classic' },
      { name: '🎲🎲 High Stakes (2d6, must beat 7)', value: 'highstakes' },
      { name: '🃏 Lucky 21 (d20 + d6, must hit 21)', value: 'lucky21' },
    )).toJSON(),

  // ─── BOUNTIES ───
  new SlashCommandBuilder().setName('bounties').setDescription('View all active bounties').toJSON(),

  // ─── TRADE / GIFT ───
  new SlashCommandBuilder().setName('gift').setDescription('Gift a card to another player').addUserOption(opt => opt.setName('user').setDescription('Who to gift to').setRequired(true)).addStringOption(opt => opt.setName('card').setDescription('Card to gift').setRequired(true).addChoices(...getAllCardChoices())).toJSON(),
  new SlashCommandBuilder().setName('trade').setDescription('Offer a card trade to another player')
    .addUserOption(opt => opt.setName('user').setDescription('Who to trade with').setRequired(true))
    .addStringOption(opt => opt.setName('yougive').setDescription('Card you give').setRequired(true).addChoices(...getAllCardChoices()))
    .addStringOption(opt => opt.setName('youget').setDescription('Card you want').setRequired(true).addChoices(...getAllCardChoices())).toJSON(),

  // ─── AUCTION HOUSE ───
  new SlashCommandBuilder().setName('ah').setDescription('Browse the auction house').toJSON(),
  new SlashCommandBuilder().setName('ah-sell').setDescription('List a card on the auction house')
    .addStringOption(opt => opt.setName('card').setDescription('Card to sell').setRequired(true).addChoices(...getAllCardChoices()))
    .addIntegerOption(opt => opt.setName('price').setDescription('Instant buy price in gems').setRequired(true).setMinValue(1))
    .addIntegerOption(opt => opt.setName('bidstart').setDescription('Starting bid (optional)').setMinValue(1)).toJSON(),
  new SlashCommandBuilder().setName('ah-search').setDescription('Search the auction house').addStringOption(opt => opt.setName('card').setDescription('Card to search').setRequired(true).addChoices(...getAllCardChoices())).toJSON(),

  new SlashCommandBuilder().setName('jointournament').setDescription('Join the upcoming tournament!').toJSON(),

  // ════ OP COMMANDS ════
  new SlashCommandBuilder().setName('op').setDescription('[OP] Grant another user OP permissions').addUserOption(opt => opt.setName('user').setDescription('User to grant OP').setRequired(true)).toJSON(),

  new SlashCommandBuilder().setName('makecard').setDescription('[OP] Create a custom card')
    .addStringOption(opt => opt.setName('name').setDescription('Card name').setRequired(true))
    .addIntegerOption(opt => opt.setName('hp').setDescription('HP').setRequired(true).setMinValue(1).setMaxValue(9999))
    .addStringOption(opt => opt.setName('type').setDescription('Type').setRequired(true))
    .addStringOption(opt => opt.setName('rarity').setDescription('Rarity').setRequired(true))
    .addStringOption(opt => opt.setName('emoji').setDescription('Emoji for the card').setRequired(true))
    .addStringOption(opt => opt.setName('move1').setDescription('Move 1 name').setRequired(true))
    .addIntegerOption(opt => opt.setName('move1dmg').setDescription('Move 1 damage').setRequired(true))
    .addIntegerOption(opt => opt.setName('move1cost').setDescription('Move 1 energy cost (default 2)').setMinValue(1).setMaxValue(7))
    .addStringOption(opt => opt.setName('move2').setDescription('Move 2 name').setRequired(true))
    .addIntegerOption(opt => opt.setName('move2dmg').setDescription('Move 2 damage').setRequired(true))
    .addIntegerOption(opt => opt.setName('move2cost').setDescription('Move 2 energy cost (default 4)').setMinValue(1).setMaxValue(7))
    .addStringOption(opt => opt.setName('move3').setDescription('Move 3 name (optional)'))
    .addIntegerOption(opt => opt.setName('move3dmg').setDescription('Move 3 damage'))
    .addIntegerOption(opt => opt.setName('move3cost').setDescription('Move 3 energy cost').setMinValue(1).setMaxValue(7))
    .addIntegerOption(opt => opt.setName('gemcost').setDescription('Gem shop price (default 500)').setMinValue(1))
    .addUserOption(opt => opt.setName('giveto').setDescription('Give to player immediately'))
    .toJSON(),

  new SlashCommandBuilder().setName('editcard').setDescription('[OP] Edit an existing card\'s stats')
    .addStringOption(opt => opt.setName('card').setDescription('Card ID to edit').setRequired(true))
    .addIntegerOption(opt => opt.setName('hp').setDescription('New HP'))
    .addStringOption(opt => opt.setName('name').setDescription('New name'))
    .addStringOption(opt => opt.setName('rarity').setDescription('New rarity'))
    .addStringOption(opt => opt.setName('emoji').setDescription('New emoji'))
    .toJSON(),

  new SlashCommandBuilder().setName('setrarity').setDescription('[OP] Set the rarity of any card')
    .addStringOption(opt => opt.setName('card').setDescription('Card ID').setRequired(true))
    .addStringOption(opt => opt.setName('rarity').setDescription('New rarity').setRequired(true).addChoices(
      { name: 'Common', value: 'Common' },
      { name: 'Uncommon', value: 'Uncommon' },
      { name: 'Rare', value: 'Rare' },
      { name: 'EX', value: 'EX' },
      { name: 'LEGENDARY', value: 'LEGENDARY' },
    )).toJSON(),

  new SlashCommandBuilder().setName('setgems').setDescription('[OP] Set a player\'s gems to an exact amount')
    .addUserOption(opt => opt.setName('user').setDescription('Player').setRequired(true))
    .addIntegerOption(opt => opt.setName('amount').setDescription('New gem amount').setRequired(true).setMinValue(0)).toJSON(),

  new SlashCommandBuilder().setName('givegems').setDescription('[OP] Give gems to a player').addUserOption(opt => opt.setName('user').setDescription('Player').setRequired(true)).addIntegerOption(opt => opt.setName('amount').setDescription('Amount').setRequired(true).setMinValue(1)).toJSON(),
  new SlashCommandBuilder().setName('takegems').setDescription('[OP] Take gems from a player').addUserOption(opt => opt.setName('user').setDescription('Player').setRequired(true)).addIntegerOption(opt => opt.setName('amount').setDescription('Amount').setRequired(true).setMinValue(1)).toJSON(),
  new SlashCommandBuilder().setName('givecard').setDescription('[OP] Give a card to a player').addUserOption(opt => opt.setName('user').setDescription('Player').setRequired(true)).addStringOption(opt => opt.setName('card').setDescription('Card').setRequired(true).addChoices(...getAllCardChoices())).toJSON(),
  new SlashCommandBuilder().setName('kill').setDescription('[OP] Wipe a player\'s deck').addUserOption(opt => opt.setName('user').setDescription('Player').setRequired(true)).toJSON(),

  new SlashCommandBuilder().setName('wipeall').setDescription('[OP] ⚠️ Wipe ALL player data (full reset)').toJSON(),

  new SlashCommandBuilder().setName('clonecard').setDescription('[OP] Clone a card and give the copy to a player')
    .addStringOption(opt => opt.setName('card').setDescription('Card ID to clone').setRequired(true))
    .addUserOption(opt => opt.setName('user').setDescription('Player to receive clone').setRequired(true)).toJSON(),

  new SlashCommandBuilder().setName('banplayer').setDescription('[OP] Ban a player from using the bot')
    .addUserOption(opt => opt.setName('user').setDescription('Player to ban').setRequired(true))
    .addStringOption(opt => opt.setName('reason').setDescription('Ban reason (optional)')).toJSON(),

  new SlashCommandBuilder().setName('unbanplayer').setDescription('[OP] Unban a player')
    .addUserOption(opt => opt.setName('user').setDescription('Player to unban').setRequired(true)).toJSON(),

  new SlashCommandBuilder().setName('setarenacholder').setDescription('[OP] Manually set the holder of an arena')
    .addStringOption(opt => opt.setName('arena').setDescription('Arena').setRequired(true).addChoices(...ARENA_CHOICES))
    .addUserOption(opt => opt.setName('user').setDescription('New holder').setRequired(true)).toJSON(),

  new SlashCommandBuilder().setName('broadcast').setDescription('[OP] Send a fancy broadcast embed with title + message')
    .addStringOption(opt => opt.setName('title').setDescription('Embed title').setRequired(true))
    .addStringOption(opt => opt.setName('message').setDescription('Message body').setRequired(true))
    .addStringOption(opt => opt.setName('color').setDescription('Hex color (e.g. ff0000)').setMaxLength(6)).toJSON(),

  new SlashCommandBuilder().setName('resetarena').setDescription('[OP] Reset an arena holder').addStringOption(opt => opt.setName('arena').setDescription('Arena').setRequired(true).addChoices(...ARENA_CHOICES)).toJSON(),
  new SlashCommandBuilder().setName('announce').setDescription('[OP] Send a TFCImon announcement').addStringOption(opt => opt.setName('message').setDescription('Message').setRequired(true)).toJSON(),
  new SlashCommandBuilder().setName('doublegems').setDescription('[OP] Toggle double gems event').toJSON(),
  new SlashCommandBuilder().setName('tournament').setDescription('[OP] Open/start a tournament').toJSON(),
  new SlashCommandBuilder().setName('listcards').setDescription('[OP] List all cards including custom ones').toJSON(),

  // ─── BOUNTY (OP) ───
  new SlashCommandBuilder().setName('setbounty').setDescription('[OP] Place a gem bounty on a player')
    .addUserOption(opt => opt.setName('user').setDescription('Target player').setRequired(true))
    .addIntegerOption(opt => opt.setName('amount').setDescription('Bounty gem reward').setRequired(true).setMinValue(50)).toJSON(),

  new SlashCommandBuilder().setName('removebounty').setDescription('[OP] Remove a bounty from a player')
    .addUserOption(opt => opt.setName('user').setDescription('Target player').setRequired(true)).toJSON(),

  // ════ NEW OP COMMANDS ════

  // /addmove — add a custom move to any existing card
  new SlashCommandBuilder().setName('addmove').setDescription('[OP] Add a new move to any existing card')
    .addStringOption(opt => opt.setName('card').setDescription('Card ID to add the move to').setRequired(true))
    .addStringOption(opt => opt.setName('movename').setDescription('Name of the new move').setRequired(true))
    .addIntegerOption(opt => opt.setName('damage').setDescription('Damage of the move').setRequired(true).setMinValue(1))
    .addIntegerOption(opt => opt.setName('cost').setDescription('Energy cost (1-7)').setRequired(true).setMinValue(1).setMaxValue(7))
    .addStringOption(opt => opt.setName('emoji').setDescription('Emoji for the move').setRequired(false))
    .addBooleanOption(opt => opt.setName('isex').setDescription('Is this an EX move? (red button, special power)').setRequired(false))
    .toJSON(),

  // /removemove — remove a move from a card by index
  new SlashCommandBuilder().setName('removemove').setDescription('[OP] Remove a move from a card by its index (0 = first move)')
    .addStringOption(opt => opt.setName('card').setDescription('Card ID').setRequired(true))
    .addIntegerOption(opt => opt.setName('index').setDescription('Move index to remove (0, 1, 2...)').setRequired(true).setMinValue(0).setMaxValue(9))
    .toJSON(),

  // /masspacks — give packs to all registered players
  new SlashCommandBuilder().setName('masspacks').setDescription('[OP] Give a pack drop event — give every player X free packs!')
    .addIntegerOption(opt => opt.setName('packs').setDescription('Number of packs to give each player (default 1)').setMinValue(1).setMaxValue(10))
    .toJSON(),

  // /massgems — give gems to everyone
  new SlashCommandBuilder().setName('massgems').setDescription('[OP] Give gems to every registered player')
    .addIntegerOption(opt => opt.setName('amount').setDescription('Gems to give each player').setRequired(true).setMinValue(1))
    .toJSON(),

  // /setbio — set lore/bio text on a card
  new SlashCommandBuilder().setName('setbio').setDescription('[OP] Set flavor lore text on a card')
    .addStringOption(opt => opt.setName('card').setDescription('Card ID').setRequired(true))
    .addStringOption(opt => opt.setName('lore').setDescription('Lore / bio text (max 200 chars)').setRequired(true).setMaxLength(200))
    .toJSON(),

  // /freeze / /unfreeze — lock a player out of battles and gambling
  new SlashCommandBuilder().setName('freeze').setDescription('[OP] Freeze a player — they can\'t battle or gamble')
    .addUserOption(opt => opt.setName('user').setDescription('Player to freeze').setRequired(true))
    .addStringOption(opt => opt.setName('reason').setDescription('Reason (optional)'))
    .toJSON(),

  new SlashCommandBuilder().setName('unfreeze').setDescription('[OP] Unfreeze a player')
    .addUserOption(opt => opt.setName('user').setDescription('Player to unfreeze').setRequired(true))
    .toJSON(),

  // /ahdelist — force-remove any AH listing by ID
  new SlashCommandBuilder().setName('ahdelist').setDescription('[OP] Force-remove an auction house listing by ID')
    .addIntegerOption(opt => opt.setName('id').setDescription('Listing ID to remove').setRequired(true).setMinValue(1))
    .addBooleanOption(opt => opt.setName('refund').setDescription('Return the card to the seller? (default: true)'))
    .toJSON(),

  // /xpboost — toggle XP boost event (level up twice as fast)
  new SlashCommandBuilder().setName('xpboost').setDescription('[OP] Toggle XP Boost event — cards level up in half the wins!').toJSON(),

  // /oplist — see who has OP
  new SlashCommandBuilder().setName('oplist').setDescription('[OP] View all users with OP permissions').toJSON(),

  // /revoke — remove OP from a user
  new SlashCommandBuilder().setName('revoke').setDescription('[OP] Revoke OP permissions from a user')
    .addUserOption(opt => opt.setName('user').setDescription('User to revoke OP from').setRequired(true))
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
  console.log(`✅ TFCImon bot online as ${client.user.tag}!`);
  client.user.setActivity('TFCImon — /openpack to start!');
});

process.on('SIGINT', () => { saveData(); console.log('💾 Saved!'); process.exit(0); });
process.on('SIGTERM', () => { saveData(); process.exit(0); });

// ─── INTERACTIONS ─────────────────────────────────────────────────────────────

client.on('interactionCreate', async (interaction) => {

  if (interaction.isChatInputCommand()) {
    const { commandName } = interaction;
    const userId = interaction.user.id;

    const opCommandsList = ['op','makecard','editcard','setrarity','setgems','givegems','takegems','givecard','kill','wipeall','clonecard','banplayer','unbanplayer','setarenacholder','broadcast','resetarena','announce','doublegems','tournament','listcards','setbounty','removebounty','addmove','removemove','masspacks','massgems','setbio','freeze','unfreeze','ahdelist','xpboost','oplist','revoke'];

    if (isBanned(userId) && !opCommandsList.includes(commandName)) {
      return interaction.reply({ content: '🚫 You are banned from TFCImon.', ephemeral: true });
    }

    // Frozen players can't battle or gamble
    const freezeBlockedCommands = ['battle', 'challenge', 'gamble', 'coinflip', 'slots', 'dice'];
    if (isFrozen(userId) && freezeBlockedCommands.includes(commandName)) {
      return interaction.reply({ content: '🧊 You are frozen and cannot battle or gamble right now.', ephemeral: true });
    }

    const player = getPlayer(userId);

    // /openpack
    if (commandName === 'openpack') {
      await interaction.deferReply();
      const pulled = openPack(3);
      for (const id of pulled) id === 'energy' ? player.energyCards++ : player.deck.push(id);
      const earned = 10 * gemMultiplier();
      player.gems += earned;
      saveData();

      const embed = new EmbedBuilder().setTitle('📦 Pack Opened!').setDescription(`${interaction.user.displayName} tore open a TFCImon pack!\n*+${earned}💎*${doubleGemsEvent ? ' 🎉 DOUBLE GEMS!' : ''}`).setColor(0xf39c12).setFooter({ text: `${player.deck.length} cards | 💎 ${player.gems} gems` });
      embed.addFields({ name: '🎴 You got:', value: pulled.map((id, i) => {
        if (id === 'energy') return `**${i+1}:** ⚡ **Energy Card** — +2 battle energy!`;
        const c = CARDS[id]; const tag = c.rarity === 'LEGENDARY' ? ' 🌟 LEGENDARY!!' : c.rarity === 'EX' ? ' ✨ EX!' : '';
        return `**${i+1}:** ${c.emoji} **${c.name}**${tag} — ${c.hp}HP`;
      }).join('\n') });
      await interaction.editReply({ embeds: [embed] });
    }

    // /deck
    else if (commandName === 'deck') {
      await interaction.reply({ embeds: [buildDeckEmbed(userId, player, interaction.user.displayName)] });
    }

    // /inspect
    else if (commandName === 'inspect') {
      const target = interaction.options.getUser('user');
      const tp = getPlayer(target.id);
      await interaction.reply({ embeds: [buildDeckEmbed(target.id, tp, target.displayName)] });
    }

    // /cardinfo
    else if (commandName === 'cardinfo') {
      const cardId = interaction.options.getString('card');
      const card = CARDS[cardId];
      if (!card) return interaction.reply({ content: '❌ Card not found.', ephemeral: true });
      await interaction.reply({ embeds: [buildCardInfoEmbed(card)] });
    }

    // /builddeck
    else if (commandName === 'builddeck') {
      if (player.deck.length === 0) return interaction.reply({ content: '❌ You have no cards! Open packs first.', ephemeral: true });
      const uniqueIds = [...new Set(player.deck)].filter(id => CARDS[id]);
      if (uniqueIds.length === 0) return interaction.reply({ content: '❌ No valid cards found.', ephemeral: true });
      buildDeckSessions.set(userId, { selected: [] });
      const options = uniqueIds.slice(0, 25).map(id => {
        const c = CARDS[id]; const lvl = getCardLevel(player, id);
        return { label: `${c.name} Lv${lvl}`, description: `${c.hp}HP | ${c.rarity} | ${c.type}`, value: id, emoji: c.emoji };
      });
      const select = new StringSelectMenuBuilder()
        .setCustomId(`builddeck_select_${userId}`)
        .setPlaceholder('Pick up to 3 cards for your active battle deck')
        .setMinValues(1).setMaxValues(Math.min(3, options.length))
        .addOptions(options);
      await interaction.reply({ content: '🎯 **Build Your Active Deck**\nPick 1-3 cards. These will be the cards used in battles.', components: [new ActionRowBuilder().addComponents(select)] });
    }

    // /cleardeck
    else if (commandName === 'cleardeck') {
      player.activeDeck = []; saveData();
      await interaction.reply({ embeds: [new EmbedBuilder().setTitle('🗑️ Active Deck Cleared!').setDescription('Random cards from your full deck will be used in battles.').setColor(0x636e72)] });
    }

    // /order
    else if (commandName === 'order') {
      const by = interaction.options.getString('by');
      const uniqueIds = [...new Set(player.deck)].filter(id => CARDS[id]);
      const RARITY_ORDER = { 'Common': 0, 'Uncommon': 1, 'Rare': 2, 'EX': 3, 'LEGENDARY': 4 };
      let sorted;
      if (by === 'rarity') sorted = uniqueIds.sort((a, b) => (RARITY_ORDER[CARDS[b].rarity] || 0) - (RARITY_ORDER[CARDS[a].rarity] || 0));
      else if (by === 'hp') sorted = uniqueIds.sort((a, b) => CARDS[b].hp - CARDS[a].hp);
      else if (by === 'name') sorted = uniqueIds.sort((a, b) => CARDS[a].name.localeCompare(CARDS[b].name));
      else if (by === 'wins') sorted = uniqueIds.sort((a, b) => (player.cardWins[b] || 0) - (player.cardWins[a] || 0));
      else if (by === 'level') sorted = uniqueIds.sort((a, b) => getCardLevel(player, b) - getCardLevel(player, a));
      const lines = sorted.map(id => {
        const c = CARDS[id]; const lvl = getCardLevel(player, id); const wins = player.cardWins[id] || 0;
        const inActive = player.activeDeck && player.activeDeck.includes(id) ? ' 🎯' : '';
        return `${c.emoji} **${c.name}**${inActive} — ${c.hp}HP | ${c.rarity} | Lv${lvl} | ${wins}W`;
      });
      const labels = { rarity: '⭐ Rarity', hp: '❤️ HP', name: '🔤 Name', wins: '🏆 Wins', level: '⬆️ Level' };
      await interaction.reply({ embeds: [new EmbedBuilder().setTitle(`📋 Your Cards — Sorted by ${labels[by]}`).setDescription(lines.join('\n') || 'No cards!').setColor(0x9b59b6).setFooter({ text: `💎 ${player.gems} gems | ${player.deck.length} total cards` })] });
    }

    // /gems
    else if (commandName === 'gems') {
      await interaction.reply({ embeds: [new EmbedBuilder().setTitle('💎 Your Gems').setDescription(`You have **${player.gems} gems**!\n\n• Opening packs: +${10 * gemMultiplier()}💎\n• Win PvP: +${25 * gemMultiplier()}💎\n• Conquer arena: +${50 * gemMultiplier()}💎\n• Daily reward: up to 200💎\n• Gambling 🎰\n• Selling cards 💰${doubleGemsEvent ? '\n\n🎉 **DOUBLE GEMS EVENT ACTIVE!**' : ''}${xpBoostEvent ? '\n⚡ **XP BOOST EVENT ACTIVE!**' : ''}`).setColor(0xf1c40f)] });
    }

    // /daily
    else if (commandName === 'daily') {
      const now = Date.now(); const cooldown = 24 * 60 * 60 * 1000;
      if (player.lastDaily && now - player.lastDaily < cooldown) {
        const remaining = cooldown - (now - player.lastDaily);
        const h = Math.floor(remaining / 3600000); const m = Math.floor((remaining % 3600000) / 60000);
        return interaction.reply({ content: `⏰ Come back in **${h}h ${m}m**.`, ephemeral: true });
      }
      const reward = Math.floor(Math.random() * 151) + 50;
      const total = reward * gemMultiplier();
      player.gems += total; player.lastDaily = now; saveData();
      await interaction.reply({ embeds: [new EmbedBuilder().setTitle('🎁 Daily Reward!').setDescription(`+**${total}💎 gems**${doubleGemsEvent ? ' (×2!)' : ''}\nTotal: **${player.gems}💎**`).setColor(0x00b894)] });
    }

    // /leaderboard /top
    else if (commandName === 'leaderboard' || commandName === 'top') {
      const players = [...playerData.entries()].map(([id, p]) => ({ id, ...p }));
      const byWins = [...players].sort((a, b) => (b.wins || 0) - (a.wins || 0)).slice(0, 5);
      const byGems = [...players].sort((a, b) => (b.gems || 0) - (a.gems || 0)).slice(0, 5);
      const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];
      const embed = new EmbedBuilder().setTitle('🏆 TFCImon Leaderboard').setColor(0xf1c40f);
      embed.addFields(
        { name: '⚔️ Top Battlers', value: byWins.map((p, i) => `${medals[i]} <@${p.id}> — **${p.wins || 0}W** ${p.losses || 0}L`).join('\n') || 'No battles yet!' },
        { name: '💎 Top Gem Holders', value: byGems.map((p, i) => `${medals[i]} <@${p.id}> — **${p.gems || 0}💎**`).join('\n') || 'No data!' },
      );
      const holders = Object.values(ARENAS).filter(a => a.holder).map(a => `${a.emoji} **${a.name}** → ${a.holderName}`).join('\n');
      if (holders) embed.addFields({ name: '🏟️ Arena Holders', value: holders });
      if (bounties.size > 0) {
        const bList = [...bounties.entries()].map(([, b]) => `🎯 **${b.targetName}** — **${b.amount}💎**`).join('\n');
        embed.addFields({ name: '🎯 Active Bounties', value: bList });
      }
      if (doubleGemsEvent) embed.addFields({ name: '🎉 Events', value: `Double Gems is ON!${xpBoostEvent ? '\n⚡ XP Boost is ON!' : ''}` });
      else if (xpBoostEvent) embed.addFields({ name: '⚡ Events', value: 'XP Boost is ON!' });
      await interaction.reply({ embeds: [embed] });
    }

    // /stats
    else if (commandName === 'stats') {
      const embed = new EmbedBuilder().setTitle(`📊 ${interaction.user.displayName}'s Stats`).setColor(0x3498db)
        .addFields(
          { name: '⚔️ Battles', value: `${player.wins}W / ${player.losses}L`, inline: true },
          { name: '💎 Gems', value: `${player.gems}`, inline: true },
          { name: '🃏 Cards', value: `${player.deck.length}`, inline: true },
          { name: '⚡ Energy Cards', value: `${player.energyCards}`, inline: true },
        );
      if (Object.keys(player.cardWins).length > 0) {
        const best = Object.entries(player.cardWins).sort((a, b) => b[1] - a[1])[0];
        const bc = CARDS[best[0]];
        if (bc) embed.addFields({ name: '🌟 Best Card', value: `${bc.emoji} ${bc.name} (${best[1]}W, Lv${getCardLevel(player, best[0])})`, inline: true });
      }
      const leveled = Object.entries(player.cardLevels || {}).filter(([, lv]) => lv > 1).map(([id, lv]) => CARDS[id] ? `${CARDS[id].emoji} ${CARDS[id].name}: Lv${lv}` : null).filter(Boolean);
      if (leveled.length) embed.addFields({ name: '⬆️ Leveled Cards', value: leveled.join('\n') });
      if (bounties.has(userId)) {
        const b = bounties.get(userId);
        embed.addFields({ name: '🎯 Bounty on You', value: `**${b.amount}💎** — set by ${b.setByName}` });
      }
      if (isFrozen(userId)) embed.addFields({ name: '🧊 Status', value: 'Frozen — cannot battle or gamble.' });
      await interaction.reply({ embeds: [embed] });
    }

    // /shop
    else if (commandName === 'shop') {
      const embed = new EmbedBuilder().setTitle('🛒 TFCImon Gem Shop').setDescription(`Balance: **${player.gems}💎**\nSell cards with \`/sell\` for ${Math.round(SELL_BACK_RATE * 100)}% back.${doubleGemsEvent ? '\n🎉 **DOUBLE GEMS EVENT!**' : ''}${xpBoostEvent ? '\n⚡ **XP BOOST EVENT!**' : ''}`).setColor(0xf1c40f).addFields({ name: '📦 Pack (150💎)', value: '3 random cards — `/buypack`' });
      for (const c of Object.values(CARDS).filter(c => !c.id.startsWith('custom_'))) {
        embed.addFields({ name: `${c.emoji} ${c.name} (${c.gemCost}💎)`, value: `${c.rarity} | ${c.hp}HP`, inline: true });
      }
      await interaction.reply({ embeds: [embed] });
    }

    // /sell
    else if (commandName === 'sell') {
      const cardId = interaction.options.getString('card'); const card = CARDS[cardId];
      if (!card) return interaction.reply({ content: '❌ Card not found.', ephemeral: true });
      if (!player.deck.includes(cardId)) return interaction.reply({ content: `❌ You don't have **${card.name}**!`, ephemeral: true });
      const val = Math.round(card.gemCost * SELL_BACK_RATE);
      player.deck.splice(player.deck.indexOf(cardId), 1);
      if (player.activeDeck) player.activeDeck = player.activeDeck.filter(id => id !== cardId || player.deck.includes(id));
      player.gems += val; saveData();
      await interaction.reply({ embeds: [new EmbedBuilder().setTitle('💰 Card Sold!').setDescription(`Sold ${card.emoji} **${card.name}** for **${val}💎**!\nBalance: **${player.gems}💎**`).setColor(0x00b894)] });
    }

    // /buypack
    else if (commandName === 'buypack') {
      if (player.gems < PACK_GEM_COST) return interaction.reply({ content: `❌ Need ${PACK_GEM_COST}💎, have ${player.gems}💎.`, ephemeral: true });
      player.gems -= PACK_GEM_COST;
      const pulled = openPack(3);
      for (const id of pulled) id === 'energy' ? player.energyCards++ : player.deck.push(id);
      saveData();
      const embed = new EmbedBuilder().setTitle('🛒 Pack Purchased!').setColor(0xf39c12).setFooter({ text: `Remaining: ${player.gems}💎` });
      embed.addFields({ name: '🎴 You got:', value: pulled.map((id, i) => id === 'energy' ? `**${i+1}:** ⚡ Energy Card` : `**${i+1}:** ${CARDS[id].emoji} **${CARDS[id].name}**`).join('\n') });
      await interaction.reply({ embeds: [embed] });
    }

    // /name
    else if (commandName === 'name') {
      const cardId = interaction.options.getString('card'); const nickname = interaction.options.getString('nickname');
      if (!player.deck.includes(cardId)) return interaction.reply({ content: `❌ You don't have **${CARDS[cardId]?.name}** in your deck!`, ephemeral: true });
      player.nicknames[cardId] = nickname; saveData();
      const c = CARDS[cardId];
      await interaction.reply({ embeds: [new EmbedBuilder().setTitle('✏️ Nickname Set!').setDescription(`${c.emoji} **${c.name}** is now *"${nickname}"*!`).setColor(c.color)] });
    }

    // /arenas
    else if (commandName === 'arenas') {
      const embed = new EmbedBuilder().setTitle('🏟️ TFCImon Arenas').setDescription('Use `/challenge` to fight a guardian!').setColor(0x00cec9);
      for (const arena of Object.values(ARENAS)) {
        const holder = arena.holder ? `👑 **${arena.holderName}**` : '🔓 *Unclaimed!*';
        embed.addFields({ name: `${arena.emoji} ${arena.name}`, value: `${arena.description}\n${holder} | 🛡️ **${arena.guardian.name}** (${arena.guardian.hp}HP)` });
      }
      await interaction.reply({ embeds: [embed] });
    }

    // /challenge
    else if (commandName === 'challenge') {
      const arenaId = interaction.options.getString('arena'); const arena = ARENAS[arenaId];
      if (player.deck.length === 0) return interaction.reply({ content: '❌ You have no cards!', ephemeral: true });
      const cardId = getBattleCard(player); if (!cardId) return interaction.reply({ content: '❌ No valid cards!', ephemeral: true });
      const card = CARDS[cardId];
      const bonus = player.energyCards > 0 ? (player.energyCards--, 2) : 0;
      const battleId = `arena_${arenaId}_${userId}_${Date.now()}`;
      const level = getCardLevel(player, cardId);
      activeArenaBattles.set(battleId, { battleId, arenaId, userId, userName: interaction.user.displayName, cardId, playerHp: card.hp, playerEnergy: 3 + bonus, guardianHp: arena.guardian.hp, guardianEnergy: arena.guardian.energy, cardLevel: level });
      const embed = new EmbedBuilder().setTitle(`${arena.emoji} Arena Challenge: ${arena.name}`).setDescription(`**${interaction.user.displayName}** steps into the arena!\n${arena.guardian.emoji} **${arena.guardian.name}** blocks the way!${bonus > 0 ? '\n⚡ Energy card! +2 energy!' : ''}${level > 1 ? `\n⬆️ ${card.name} Lv${level}! (+${getLevelBonus(level)} bonus dmg)` : ''}`).setColor(arena.color)
        .addFields({ name: `${card.emoji} Your Card`, value: `**${card.name}** Lv${level} — ${card.hp}HP`, inline: true }, { name: '⚔️ VS', value: '──────', inline: true }, { name: `${arena.guardian.emoji} Guardian`, value: `**${arena.guardian.name}** — ${arena.guardian.hp}HP`, inline: true })
        .setFooter({ text: 'You go first!' });
      await interaction.reply({ embeds: [embed] });
      await sendArenaBattleState(interaction.channel, battleId);
    }

    // /battle
    else if (commandName === 'battle') {
      const challenger = interaction.user; const opponent = interaction.options.getUser('opponent');
      if (opponent.id === challenger.id) return interaction.reply({ content: '❌ Cannot battle yourself!', ephemeral: true });
      if (opponent.bot) return interaction.reply({ content: '❌ Cannot battle a bot!', ephemeral: true });
      if (isBanned(opponent.id)) return interaction.reply({ content: '❌ That player is banned.', ephemeral: true });
      if (isFrozen(opponent.id)) return interaction.reply({ content: `❌ **${opponent.displayName}** is frozen and cannot battle right now.`, ephemeral: true });
      const cp = getPlayer(challenger.id); const op = getPlayer(opponent.id);
      if (cp.deck.length === 0) return interaction.reply({ content: '❌ You have no cards!', ephemeral: true });
      if (op.deck.length === 0) return interaction.reply({ content: `❌ ${opponent.displayName} has no cards!`, ephemeral: true });
      const battleId = `pvp_${challenger.id}_${opponent.id}_${Date.now()}`;
      const cCardId = getBattleCard(cp); const oCardId = getBattleCard(op);
      const cCard = CARDS[cCardId]; const oCard = CARDS[oCardId];
      const cBonus = cp.energyCards > 0 ? (cp.energyCards--, 2) : 0;
      const oBonus = op.energyCards > 0 ? (op.energyCards--, 2) : 0;
      const cLevel = getCardLevel(cp, cCardId); const oLevel = getCardLevel(op, oCardId);
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

    // ─── GAMBLING ───

    // /gamble
    else if (commandName === 'gamble') {
      const amount = interaction.options.getInteger('amount');
      if (player.gems < amount) return interaction.reply({ content: `❌ You only have ${player.gems}💎!`, ephemeral: true });
      const roll = Math.random();
      let result;
      if (roll < 0.45) { player.gems += amount; result = `🎰 **YOU WIN!** +${amount}💎\nBalance: **${player.gems}💎**`; }
      else if (roll < 0.55) { const lost = Math.floor(amount / 2); player.gems -= lost; result = `🎰 **PUSH!** -${lost}💎\nBalance: **${player.gems}💎**`; }
      else { player.gems -= amount; result = `🎰 **YOU LOSE!** -${amount}💎\nBalance: **${player.gems}💎**`; }
      saveData();
      await interaction.reply({ embeds: [new EmbedBuilder().setTitle('🎰 Gem Gamble!').setDescription(`You bet **${amount}💎**\n\n${result}`).setColor(roll < 0.45 ? 0x00b894 : roll < 0.55 ? 0xf39c12 : 0xe74c3c)] });
    }

    // /coinflip
    else if (commandName === 'coinflip') {
      const amount = interaction.options.getInteger('amount');
      const call = interaction.options.getString('call');
      if (player.gems < amount) return interaction.reply({ content: `❌ You only have ${player.gems}💎!`, ephemeral: true });
      const result = Math.random() < 0.5 ? 'heads' : 'tails';
      const won = result === call;
      if (won) player.gems += amount;
      else player.gems -= amount;
      saveData();
      const emoji = result === 'heads' ? '🪙' : '🔵';
      await interaction.reply({ embeds: [new EmbedBuilder()
        .setTitle(`${emoji} Coin Flip!`)
        .setDescription(`You called **${call}** — it landed on **${result}**!\n\n${won ? `✅ **YOU WIN! +${amount}💎**` : `❌ **YOU LOSE! -${amount}💎**`}\nBalance: **${player.gems}💎**`)
        .setColor(won ? 0x00b894 : 0xe74c3c)
      ] });
    }

    // /slots
    else if (commandName === 'slots') {
      const amount = interaction.options.getInteger('amount');
      if (player.gems < amount) return interaction.reply({ content: `❌ You only have ${player.gems}💎!`, ephemeral: true });
      const reels = spinSlots();
      const multiplier = evalSlots(reels);
      let resultText;
      if (multiplier === 0) {
        player.gems -= amount;
        resultText = `❌ No match! **-${amount}💎**`;
      } else {
        const winnings = Math.floor(amount * multiplier) - amount;
        player.gems += winnings;
        resultText = `✅ **${multiplier}x multiplier!** +${winnings}💎`;
      }
      saveData();
      const payoutTable = Object.entries(SLOT_PAYOUTS).filter(([k]) => k !== 'pair').map(([k, v]) => `${k} = **${v}x**`).join(' | ');
      await interaction.reply({ embeds: [new EmbedBuilder()
        .setTitle('🎰 Slot Machine!')
        .setDescription(`\`\`\`\n[ ${reels.join(' | ')} ]\n\`\`\`\n${resultText}\nBalance: **${player.gems}💎**`)
        .addFields({ name: '📊 Payouts', value: payoutTable + '\nAny pair = **1.5x**' })
        .setColor(multiplier > 0 ? 0xf1c40f : 0xe74c3c)
      ] });
    }

    // /dice
    else if (commandName === 'dice') {
      const amount = interaction.options.getInteger('amount');
      const mode = interaction.options.getString('mode');
      if (player.gems < amount) return interaction.reply({ content: `❌ You only have ${player.gems}💎!`, ephemeral: true });

      let description = '';
      let won = false;

      if (mode === 'classic') {
        const playerRoll = Math.floor(Math.random() * 6) + 1;
        const houseRoll = Math.floor(Math.random() * 6) + 1;
        won = playerRoll > houseRoll;
        const tie = playerRoll === houseRoll;
        if (tie) {
          description = `🎲 You: **${playerRoll}** | House: **${houseRoll}**\n🤝 **TIE!** Your bet is returned.`;
        } else {
          description = `🎲 You: **${playerRoll}** | House: **${houseRoll}**\n${won ? `✅ **YOU WIN! +${amount}💎**` : `❌ **YOU LOSE! -${amount}💎**`}`;
          if (won) player.gems += amount; else player.gems -= amount;
        }
      } else if (mode === 'highstakes') {
        const d1 = Math.floor(Math.random() * 6) + 1;
        const d2 = Math.floor(Math.random() * 6) + 1;
        const total = d1 + d2;
        won = total > 7;
        const tie = total === 7;
        if (tie) {
          description = `🎲🎲 Rolled: **${d1}** + **${d2}** = **${total}**\n🤝 **EXACTLY 7 — TIE!** Bet returned.`;
        } else {
          const mult = won ? (total >= 11 ? 3 : 2) : 1;
          const change = Math.floor(amount * (mult - 1));
          description = `🎲🎲 Rolled: **${d1}** + **${d2}** = **${total}** (need >7)\n${won ? `✅ **WIN! +${change}💎** (${mult}x)` : `❌ **LOSE! -${amount}💎**`}`;
          if (won) player.gems += change; else player.gems -= amount;
        }
      } else if (mode === 'lucky21') {
        const d20 = Math.floor(Math.random() * 20) + 1;
        const d6 = Math.floor(Math.random() * 6) + 1;
        const total = d20 + d6;
        won = total === 21;
        const bust = total > 21;
        description = `🎲 d20: **${d20}** + d6: **${d6}** = **${total}**\n`;
        if (won) {
          const jackpot = amount * 5;
          player.gems += jackpot;
          description += `🎉 **LUCKY 21! JACKPOT! +${jackpot}💎 (5x)**`;
        } else if (bust) {
          player.gems -= amount;
          description += `💥 **BUST (over 21)! -${amount}💎**`;
        } else {
          player.gems -= Math.floor(amount / 2);
          description += `😬 **No 21... -${Math.floor(amount / 2)}💎** (half loss for under)`;
        }
      }

      saveData();
      await interaction.reply({ embeds: [new EmbedBuilder()
        .setTitle(`🎲 Dice — ${mode === 'classic' ? 'Classic' : mode === 'highstakes' ? 'High Stakes' : 'Lucky 21'}`)
        .setDescription(description + `\nBalance: **${player.gems}💎**`)
        .setColor(won ? 0x00b894 : 0xe74c3c)
      ] });
    }

    // /bounties
    else if (commandName === 'bounties') {
      if (bounties.size === 0) return interaction.reply({ content: '🎯 No active bounties right now!', ephemeral: false });
      const embed = new EmbedBuilder().setTitle('🎯 Active Bounties').setDescription('Defeat these players in PvP to collect the reward!').setColor(0xe17055);
      for (const [, b] of bounties.entries()) {
        embed.addFields({ name: `${b.targetName}`, value: `💰 **${b.amount}💎** — set by ${b.setByName}` });
      }
      await interaction.reply({ embeds: [embed] });
    }

    // /gift
    else if (commandName === 'gift') {
      const target = interaction.options.getUser('user'); const cardId = interaction.options.getString('card'); const card = CARDS[cardId];
      if (!player.deck.includes(cardId)) return interaction.reply({ content: `❌ You don't have **${card?.name}**!`, ephemeral: true });
      if (target.id === userId) return interaction.reply({ content: '❌ Cannot gift yourself!', ephemeral: true });
      player.deck.splice(player.deck.indexOf(cardId), 1);
      getPlayer(target.id).deck.push(cardId); saveData();
      await interaction.reply({ embeds: [new EmbedBuilder().setTitle('🎁 Card Gifted!').setDescription(`${interaction.user.displayName} gifted ${card.emoji} **${card.name}** to **${target.displayName}**!`).setColor(0x00b894)] });
    }

    // /trade
    else if (commandName === 'trade') {
      const target = interaction.options.getUser('user'); const giveId = interaction.options.getString('yougive'); const wantId = interaction.options.getString('youget');
      if (!player.deck.includes(giveId)) return interaction.reply({ content: `❌ You don't have **${CARDS[giveId]?.name}**!`, ephemeral: true });
      if (target.id === userId) return interaction.reply({ content: '❌ Cannot trade with yourself!', ephemeral: true });
      const tradeId = tradeCounter++;
      tradeOffers.set(tradeId, { tradeId, fromId: userId, fromName: interaction.user.displayName, toId: target.id, toName: target.displayName, giveId, wantId });
      const gCard = CARDS[giveId]; const wCard = CARDS[wantId];
      const embed = new EmbedBuilder().setTitle('🔄 Trade Offer!').setDescription(`**${interaction.user.displayName}** wants to trade with **${target.displayName}**!`).setColor(0x6c5ce7)
        .addFields({ name: '📤 They offer', value: `${gCard.emoji} **${gCard.name}**`, inline: true }, { name: '📥 They want', value: `${wCard.emoji} **${wCard.name}**`, inline: true })
        .setFooter({ text: `Trade #${tradeId} — ${target.displayName}, do you accept?` });
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId(`trade_accept_${tradeId}`).setLabel('✅ Accept Trade').setStyle(ButtonStyle.Success),
        new ButtonBuilder().setCustomId(`trade_decline_${tradeId}`).setLabel('❌ Decline').setStyle(ButtonStyle.Danger),
      );
      await interaction.reply({ embeds: [embed], components: [row] });
    }

    // /ah
    else if (commandName === 'ah') {
      const listings = [...auctionListings.values()];
      if (listings.length === 0) return interaction.reply({ content: '🏪 Auction house is empty! Use `/ah-sell`.' });
      const embed = new EmbedBuilder().setTitle('🏪 Auction House').setColor(0xe17055);
      for (const l of listings.slice(0, 10)) {
        const card = CARDS[l.cardId];
        embed.addFields({ name: `#${l.id} ${card?.emoji} ${card?.name} — ${l.sellerName}`, value: `💰 Buy Now: **${l.price}💎**${l.bidPrice ? `\n🏷️ Bid: ${l.currentBid || l.bidPrice}💎 (${l.highestBidderName || 'nobody'})` : ''}` });
      }
      const row = new ActionRowBuilder();
      for (const l of listings.slice(0, 5)) row.addComponents(new ButtonBuilder().setCustomId(`ah_buy_${l.id}`).setLabel(`Buy #${l.id} ${CARDS[l.cardId]?.emoji || ''}`).setStyle(ButtonStyle.Success));
      await interaction.reply({ embeds: [embed], components: [row] });
    }

    // /ah-sell
    else if (commandName === 'ah-sell') {
      const cardId = interaction.options.getString('card'); const price = interaction.options.getInteger('price'); const bidStart = interaction.options.getInteger('bidstart');
      if (!player.deck.includes(cardId)) return interaction.reply({ content: `❌ You don't have **${CARDS[cardId]?.name}**!`, ephemeral: true });
      player.deck.splice(player.deck.indexOf(cardId), 1);
      const id = listingCounter++;
      auctionListings.set(id, { id, sellerId: userId, sellerName: interaction.user.displayName, cardId, price, bidPrice: bidStart || null, currentBid: null, highestBidder: null, highestBidderName: null });
      saveData();
      const card = CARDS[cardId];
      await interaction.reply({ embeds: [new EmbedBuilder().setTitle('🏪 Card Listed!').setDescription(`${card?.emoji} **${card?.name}** listed!\n💰 Buy Now: **${price}💎**${bidStart ? `\n🏷️ Bidding from: **${bidStart}💎**` : ''}`).setColor(0xe17055)] });
    }

    // /ah-search
    else if (commandName === 'ah-search') {
      const cardId = interaction.options.getString('card'); const card = CARDS[cardId];
      const results = [...auctionListings.values()].filter(l => l.cardId === cardId);
      if (results.length === 0) return interaction.reply({ content: `🔍 No listings for **${card?.name}**.` });
      const embed = new EmbedBuilder().setTitle(`🔍 ${card?.emoji} ${card?.name}`).setColor(card?.color || 0x9b59b6);
      for (const l of results) embed.addFields({ name: `#${l.id} — ${l.sellerName}`, value: `💰 **${l.price}💎**${l.bidPrice ? `\n🏷️ Bid: ${l.currentBid || l.bidPrice}💎 (${l.highestBidderName || 'nobody'})` : ''}` });
      const row = new ActionRowBuilder();
      for (const l of results.slice(0, 3)) {
        row.addComponents(new ButtonBuilder().setCustomId(`ah_buy_${l.id}`).setLabel(`Buy #${l.id}`).setStyle(ButtonStyle.Success));
        if (l.bidPrice) row.addComponents(new ButtonBuilder().setCustomId(`ah_bid_${l.id}`).setLabel(`Bid #${l.id}`).setStyle(ButtonStyle.Primary));
      }
      await interaction.reply({ embeds: [embed], components: [row] });
    }

    // /jointournament
    else if (commandName === 'jointournament') {
      if (!activeTournament.running) return interaction.reply({ content: '❌ No tournament open right now!', ephemeral: true });
      if (activeTournament.bracket.length > 0) return interaction.reply({ content: '❌ Tournament already started!', ephemeral: true });
      if (activeTournament.players.find(p => p.id === userId)) return interaction.reply({ content: '❌ Already joined!', ephemeral: true });
      if (player.deck.length === 0) return interaction.reply({ content: '❌ You need cards to join!', ephemeral: true });
      activeTournament.players.push({ id: userId, name: interaction.user.displayName });
      await interaction.reply({ embeds: [new EmbedBuilder().setTitle('🏆 Joined Tournament!').setDescription(`**${interaction.user.displayName}** joined! (${activeTournament.players.length} players)`).setColor(0xf1c40f)] });
    }

    // ════ OP COMMANDS ════

    // /op
    else if (commandName === 'op') {
      if (!isOp(interaction)) return interaction.reply({ content: '❌ No permission.', ephemeral: true });
      const target = interaction.options.getUser('user');
      if (opUsers.includes(target.id)) return interaction.reply({ content: `❌ **${target.displayName}** is already OP!`, ephemeral: true });
      opUsers.push(target.id); saveData();
      await interaction.reply({ embeds: [new EmbedBuilder().setTitle('👑 OP Granted!').setDescription(`**${target.displayName}** has been granted OP permissions by **${interaction.user.displayName}**!\n\nThey now have access to all OP commands.`).setColor(0xf1c40f).setFooter({ text: `Granted by ${interaction.user.displayName}` })] });
    }

    // /revoke
    else if (commandName === 'revoke') {
      if (!isOp(interaction)) return interaction.reply({ content: '❌ No permission.', ephemeral: true });
      const target = interaction.options.getUser('user');
      if (target.username === OP_USER) return interaction.reply({ content: `❌ Cannot revoke the original OP user!`, ephemeral: true });
      if (!opUsers.includes(target.id)) return interaction.reply({ content: `❌ **${target.displayName}** does not have OP.`, ephemeral: true });
      opUsers = opUsers.filter(id => id !== target.id); saveData();
      await interaction.reply({ embeds: [new EmbedBuilder().setTitle('🔒 OP Revoked').setDescription(`**${target.displayName}**'s OP permissions have been revoked by **${interaction.user.displayName}**.`).setColor(0xe74c3c)] });
    }

    // /oplist
    else if (commandName === 'oplist') {
      if (!isOp(interaction)) return interaction.reply({ content: '❌ No permission.', ephemeral: true });
      const lines = [`👑 **${OP_USER}** (original OP — permanent)`];
      for (const id of opUsers) lines.push(`🔑 <@${id}>`);
      await interaction.reply({ embeds: [new EmbedBuilder().setTitle('👑 TFCImon OP Users').setDescription(lines.join('\n')).setColor(0xf1c40f).setFooter({ text: `${opUsers.length + 1} total OP users` })], ephemeral: true });
    }

    // /makecard
    else if (commandName === 'makecard') {
      if (!isOp(interaction)) return interaction.reply({ content: '❌ No permission.', ephemeral: true });
      const name = interaction.options.getString('name');
      const hp = interaction.options.getInteger('hp');
      const type = interaction.options.getString('type');
      const rarity = interaction.options.getString('rarity');
      const emoji = interaction.options.getString('emoji');
      const m1 = interaction.options.getString('move1'); const m1d = interaction.options.getInteger('move1dmg'); const m1c = interaction.options.getInteger('move1cost') || 2;
      const m2 = interaction.options.getString('move2'); const m2d = interaction.options.getInteger('move2dmg'); const m2c = interaction.options.getInteger('move2cost') || 4;
      const m3 = interaction.options.getString('move3'); const m3d = interaction.options.getInteger('move3dmg'); const m3c = interaction.options.getInteger('move3cost') || 5;
      const gemCost = interaction.options.getInteger('gemcost') || 500;
      const giveToUser = interaction.options.getUser('giveto');
      const newId = `custom_${Date.now()}`;
      const moves = [
        { name: m1, damage: m1d, cost: m1c, emoji: '⚔️' },
        { name: m2, damage: m2d, cost: m2c, emoji: '💥' },
      ];
      if (m3 && m3d) moves.push({ name: m3, damage: m3d, cost: m3c, emoji: '🌟' });
      CARDS[newId] = { id: newId, name, hp, type, rarity, emoji, color: 0x6c5ce7, description: `Custom card created by ${interaction.user.displayName}.`, gemCost, moves };
      if (giveToUser) getPlayer(giveToUser.id).deck.push(newId);
      saveData();
      const movesText = moves.map(m => `${m.emoji} **${m.name}**: ${m.damage}dmg (${m.cost}⚡)`).join('\n');
      await interaction.reply({ embeds: [new EmbedBuilder()
        .setTitle(`${emoji} Custom Card Created: ${name}`)
        .setDescription(`**${hp}HP | ${type} | ${rarity}**\n\n${movesText}${giveToUser ? `\n\n✅ Given to **${giveToUser.displayName}**!` : ''}`)
        .setColor(0x6c5ce7).setFooter({ text: `Card ID: ${newId} | Shop price: ${gemCost}💎` })
      ] });
    }

    // /addmove
    else if (commandName === 'addmove') {
      if (!isOp(interaction)) return interaction.reply({ content: '❌ No permission.', ephemeral: true });
      const cardId = interaction.options.getString('card');
      const card = CARDS[cardId];
      if (!card) return interaction.reply({ content: `❌ Card with ID **${cardId}** not found! Use \`/listcards\` to find card IDs.`, ephemeral: true });
      if (card.moves.length >= 6) return interaction.reply({ content: `❌ **${card.name}** already has 6 moves (max). Remove one first with \`/removemove\`.`, ephemeral: true });
      const moveName = interaction.options.getString('movename');
      const damage = interaction.options.getInteger('damage');
      const cost = interaction.options.getInteger('cost');
      const moveEmoji = interaction.options.getString('emoji') || '⚔️';
      const isEx = interaction.options.getBoolean('isex') || false;
      const newMove = { name: moveName, damage, cost, emoji: moveEmoji, ...(isEx ? { isEx: true } : {}) };
      card.moves.push(newMove);
      saveData();
      await interaction.reply({ embeds: [new EmbedBuilder()
        .setTitle(`${card.emoji} Move Added to ${card.name}!`)
        .setDescription(`**New Move:** ${moveEmoji} **${moveName}**\n💥 Damage: **${damage}** | ⚡ Cost: **${cost}**${isEx ? ' | ✨ EX Move' : ''}\n\n**All Moves:**\n${card.moves.map((m, i) => `${i}: ${m.emoji} **${m.name}** — ${m.damage}dmg (${m.cost}⚡)${m.isEx ? ' ✨EX' : ''}`).join('\n')}`)
        .setColor(card.color || 0x6c5ce7)
      ] });
    }

    // /removemove
    else if (commandName === 'removemove') {
      if (!isOp(interaction)) return interaction.reply({ content: '❌ No permission.', ephemeral: true });
      const cardId = interaction.options.getString('card');
      const card = CARDS[cardId];
      if (!card) return interaction.reply({ content: `❌ Card **${cardId}** not found!`, ephemeral: true });
      const index = interaction.options.getInteger('index');
      if (index >= card.moves.length) return interaction.reply({ content: `❌ **${card.name}** only has ${card.moves.length} moves (indices 0–${card.moves.length - 1}).`, ephemeral: true });
      if (card.moves.length <= 1) return interaction.reply({ content: `❌ **${card.name}** must have at least 1 move!`, ephemeral: true });
      const removed = card.moves.splice(index, 1)[0];
      saveData();
      await interaction.reply({ embeds: [new EmbedBuilder()
        .setTitle(`${card.emoji} Move Removed from ${card.name}`)
        .setDescription(`Removed: ${removed.emoji} **${removed.name}** (${removed.damage}dmg, ${removed.cost}⚡)\n\n**Remaining Moves:**\n${card.moves.map((m, i) => `${i}: ${m.emoji} **${m.name}** — ${m.damage}dmg (${m.cost}⚡)`).join('\n')}`)
        .setColor(0xe74c3c)
      ] });
    }

    // /masspacks
    else if (commandName === 'masspacks') {
      if (!isOp(interaction)) return interaction.reply({ content: '❌ No permission.', ephemeral: true });
      const packCount = interaction.options.getInteger('packs') || 1;
      await interaction.deferReply();
      let count = 0;
      for (const [, p] of playerData) {
        for (let i = 0; i < packCount; i++) {
          const pulled = openPack(3);
          for (const id of pulled) id === 'energy' ? p.energyCards++ : p.deck.push(id);
        }
        count++;
      }
      saveData();
      await interaction.editReply({ embeds: [new EmbedBuilder()
        .setTitle('🎁 Mass Pack Drop!')
        .setDescription(`**${interaction.user.displayName}** gifted **${packCount} pack${packCount > 1 ? 's' : ''}** to every registered player!\n\n📦 **${count} players** received their packs.\n*${packCount * 3 * count} total cards distributed!*`)
        .setColor(0x00b894)
        .setFooter({ text: 'Check your deck with /deck!' })
      ] });
    }

    // /massgems
    else if (commandName === 'massgems') {
      if (!isOp(interaction)) return interaction.reply({ content: '❌ No permission.', ephemeral: true });
      const amount = interaction.options.getInteger('amount');
      let count = 0;
      for (const [, p] of playerData) { p.gems += amount; count++; }
      saveData();
      await interaction.reply({ embeds: [new EmbedBuilder()
        .setTitle('💎 Mass Gem Drop!')
        .setDescription(`**${interaction.user.displayName}** dropped **${amount}💎** into everyone's wallet!\n\n✅ **${count} players** each received **${amount}💎**.\n*Total distributed: ${amount * count}💎*`)
        .setColor(0xf1c40f)
      ] });
    }

    // /setbio
    else if (commandName === 'setbio') {
      if (!isOp(interaction)) return interaction.reply({ content: '❌ No permission.', ephemeral: true });
      const cardId = interaction.options.getString('card');
      const lore = interaction.options.getString('lore');
      const card = CARDS[cardId];
      if (!card) return interaction.reply({ content: `❌ Card **${cardId}** not found!`, ephemeral: true });
      card.lore = lore; saveData();
      await interaction.reply({ embeds: [new EmbedBuilder()
        .setTitle(`📖 Lore Set — ${card.emoji} ${card.name}`)
        .setDescription(`> *${lore}*`)
        .setColor(card.color || 0x9b59b6)
        .setFooter({ text: 'View it with /cardinfo' })
      ] });
    }

    // /freeze
    else if (commandName === 'freeze') {
      if (!isOp(interaction)) return interaction.reply({ content: '❌ No permission.', ephemeral: true });
      const target = interaction.options.getUser('user');
      const reason = interaction.options.getString('reason') || 'No reason given.';
      if (frozenUsers.includes(target.id)) return interaction.reply({ content: `❌ **${target.displayName}** is already frozen.`, ephemeral: true });
      frozenUsers.push(target.id); saveData();
      await interaction.reply({ embeds: [new EmbedBuilder()
        .setTitle('🧊 Player Frozen!')
        .setDescription(`**${target.displayName}** has been frozen.\nThey cannot battle or gamble.\n**Reason:** ${reason}`)
        .setColor(0x74b9ff)
        .setFooter({ text: `Use /unfreeze to lift.` })
      ] });
    }

    // /unfreeze
    else if (commandName === 'unfreeze') {
      if (!isOp(interaction)) return interaction.reply({ content: '❌ No permission.', ephemeral: true });
      const target = interaction.options.getUser('user');
      if (!frozenUsers.includes(target.id)) return interaction.reply({ content: `❌ **${target.displayName}** is not frozen.`, ephemeral: true });
      frozenUsers = frozenUsers.filter(id => id !== target.id); saveData();
      await interaction.reply({ embeds: [new EmbedBuilder()
        .setTitle('🌡️ Player Unfrozen!')
        .setDescription(`**${target.displayName}** can battle and gamble again.`)
        .setColor(0x00b894)
      ] });
    }

    // /ahdelist
    else if (commandName === 'ahdelist') {
      if (!isOp(interaction)) return interaction.reply({ content: '❌ No permission.', ephemeral: true });
      const listingId = interaction.options.getInteger('id');
      const refund = interaction.options.getBoolean('refund') ?? true;
      const listing = auctionListings.get(listingId);
      if (!listing) return interaction.reply({ content: `❌ Listing **#${listingId}** not found.`, ephemeral: true });
      const card = CARDS[listing.cardId];
      // Refund the highest bidder if there was a bid
      if (listing.highestBidder && listing.currentBid) {
        getPlayer(listing.highestBidder).gems += listing.currentBid;
      }
      // Return card to seller if refund=true
      if (refund) {
        getPlayer(listing.sellerId).deck.push(listing.cardId);
      }
      auctionListings.delete(listingId); saveData();
      await interaction.reply({ embeds: [new EmbedBuilder()
        .setTitle('🏪 Listing Removed!')
        .setDescription(`Listing **#${listingId}** (${card?.emoji} **${card?.name}** — ${listing.sellerName}) has been removed.\n${refund ? `✅ Card returned to **${listing.sellerName}**.` : '⚠️ Card NOT returned (refund=false).'}${listing.highestBidder ? `\n💎 Bid of **${listing.currentBid}💎** returned to <@${listing.highestBidder}>.` : ''}`)
        .setColor(0xe74c3c)
      ] });
    }

    // /xpboost
    else if (commandName === 'xpboost') {
      if (!isOp(interaction)) return interaction.reply({ content: '❌ No permission.', ephemeral: true });
      xpBoostEvent = !xpBoostEvent; saveData();
      await interaction.reply({ embeds: [new EmbedBuilder()
        .setTitle(xpBoostEvent ? '⚡ XP Boost STARTED!' : '⏹️ XP Boost ENDED!')
        .setDescription(xpBoostEvent ? `Cards now level up every **${xpThreshold()} wins** instead of 3!\nGrind those battles! 💪` : 'Back to normal — 3 wins per level up.')
        .setColor(xpBoostEvent ? 0xfdcb6e : 0x636e72)
      ] });
    }

    // /editcard
    else if (commandName === 'editcard') {
      if (!isOp(interaction)) return interaction.reply({ content: '❌ No permission.', ephemeral: true });
      const cardId = interaction.options.getString('card'); const card = CARDS[cardId];
      if (!card) return interaction.reply({ content: `❌ Card with ID **${cardId}** not found!`, ephemeral: true });
      const newHp = interaction.options.getInteger('hp'); const newName = interaction.options.getString('name');
      const newRarity = interaction.options.getString('rarity'); const newEmoji = interaction.options.getString('emoji');
      if (newHp) card.hp = newHp; if (newName) card.name = newName; if (newRarity) card.rarity = newRarity; if (newEmoji) card.emoji = newEmoji;
      saveData();
      await interaction.reply({ embeds: [new EmbedBuilder().setTitle('✏️ Card Edited!').setDescription(`${card.emoji} **${card.name}** updated!\nHP: ${card.hp} | Rarity: ${card.rarity}`).setColor(0x6c5ce7)] });
    }

    // /setrarity
    else if (commandName === 'setrarity') {
      if (!isOp(interaction)) return interaction.reply({ content: '❌ No permission.', ephemeral: true });
      const cardId = interaction.options.getString('card'); const rarity = interaction.options.getString('rarity');
      const card = CARDS[cardId];
      if (!card) return interaction.reply({ content: `❌ Card **${cardId}** not found!`, ephemeral: true });
      const old = card.rarity; card.rarity = rarity; saveData();
      await interaction.reply({ embeds: [new EmbedBuilder().setTitle('⭐ Rarity Updated!').setDescription(`${card.emoji} **${card.name}**: ${old} → **${rarity}**`).setColor(0xf1c40f)] });
    }

    // /setgems
    else if (commandName === 'setgems') {
      if (!isOp(interaction)) return interaction.reply({ content: '❌ No permission.', ephemeral: true });
      const target = interaction.options.getUser('user'); const amount = interaction.options.getInteger('amount');
      const tp = getPlayer(target.id); tp.gems = amount; saveData();
      await interaction.reply({ embeds: [new EmbedBuilder().setTitle('💎 Gems Set!').setDescription(`**${target.displayName}**'s gems set to **${amount}💎**.`).setColor(0xf1c40f)] });
    }

    // /givegems
    else if (commandName === 'givegems') {
      if (!isOp(interaction)) return interaction.reply({ content: '❌ No permission.', ephemeral: true });
      const target = interaction.options.getUser('user'); const amount = interaction.options.getInteger('amount');
      const tp = getPlayer(target.id); tp.gems += amount; saveData();
      await interaction.reply({ embeds: [new EmbedBuilder().setTitle('💎 Gems Given!').setDescription(`Gave **${amount}💎** to **${target.displayName}**!\nThey now have **${tp.gems}💎**.`).setColor(0xf1c40f)] });
    }

    // /takegems
    else if (commandName === 'takegems') {
      if (!isOp(interaction)) return interaction.reply({ content: '❌ No permission.', ephemeral: true });
      const target = interaction.options.getUser('user'); const amount = interaction.options.getInteger('amount');
      const tp = getPlayer(target.id); tp.gems = Math.max(0, tp.gems - amount); saveData();
      await interaction.reply({ embeds: [new EmbedBuilder().setTitle('💎 Gems Taken!').setDescription(`Took **${amount}💎** from **${target.displayName}**!\nThey now have **${tp.gems}💎**.`).setColor(0xe74c3c)] });
    }

    // /givecard
    else if (commandName === 'givecard') {
      if (!isOp(interaction)) return interaction.reply({ content: '❌ No permission.', ephemeral: true });
      const target = interaction.options.getUser('user'); const cardId = interaction.options.getString('card');
      const tp = getPlayer(target.id); tp.deck.push(cardId); saveData();
      const card = CARDS[cardId];
      await interaction.reply({ embeds: [new EmbedBuilder().setTitle('🎴 Card Given!').setDescription(`Gave ${card?.emoji} **${card?.name}** to **${target.displayName}**!`).setColor(card?.color || 0x9b59b6)] });
    }

    // /kill
    else if (commandName === 'kill') {
      if (!isOp(interaction)) return interaction.reply({ content: '❌ No permission.', ephemeral: true });
      const target = interaction.options.getUser('user');
      const tp = getPlayer(target.id); tp.deck = []; tp.energyCards = 0; tp.activeDeck = []; saveData();
      await interaction.reply({ embeds: [new EmbedBuilder().setTitle('💀 Player Wiped!').setDescription(`**${target.displayName}**'s deck wiped. 💀`).setColor(0xe74c3c)] });
    }

    // /wipeall
    else if (commandName === 'wipeall') {
      if (!isOp(interaction)) return interaction.reply({ content: '❌ No permission.', ephemeral: true });
      const confirm = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('wipeall_confirm').setLabel('⚠️ CONFIRM WIPE ALL').setStyle(ButtonStyle.Danger),
        new ButtonBuilder().setCustomId('wipeall_cancel').setLabel('Cancel').setStyle(ButtonStyle.Secondary),
      );
      await interaction.reply({ content: '⚠️ **WARNING:** This will wipe ALL player data. Are you sure?', components: [confirm], ephemeral: true });
    }

    // /clonecard
    else if (commandName === 'clonecard') {
      if (!isOp(interaction)) return interaction.reply({ content: '❌ No permission.', ephemeral: true });
      const cardId = interaction.options.getString('card'); const target = interaction.options.getUser('user');
      const card = CARDS[cardId];
      if (!card) return interaction.reply({ content: `❌ Card **${cardId}** not found!`, ephemeral: true });
      getPlayer(target.id).deck.push(cardId); saveData();
      await interaction.reply({ embeds: [new EmbedBuilder().setTitle('🔁 Card Cloned!').setDescription(`Gave a copy of ${card.emoji} **${card.name}** to **${target.displayName}**!`).setColor(card.color || 0x9b59b6)] });
    }

    // /banplayer
    else if (commandName === 'banplayer') {
      if (!isOp(interaction)) return interaction.reply({ content: '❌ No permission.', ephemeral: true });
      const target = interaction.options.getUser('user'); const reason = interaction.options.getString('reason') || 'No reason given.';
      if (bannedUsers.includes(target.id)) return interaction.reply({ content: `❌ **${target.displayName}** is already banned.`, ephemeral: true });
      bannedUsers.push(target.id); saveData();
      await interaction.reply({ embeds: [new EmbedBuilder().setTitle('🔨 Player Banned!').setDescription(`**${target.displayName}** has been banned from TFCImon.\n**Reason:** ${reason}`).setColor(0xe74c3c)] });
    }

    // /unbanplayer
    else if (commandName === 'unbanplayer') {
      if (!isOp(interaction)) return interaction.reply({ content: '❌ No permission.', ephemeral: true });
      const target = interaction.options.getUser('user');
      if (!bannedUsers.includes(target.id)) return interaction.reply({ content: `❌ **${target.displayName}** is not banned.`, ephemeral: true });
      bannedUsers = bannedUsers.filter(id => id !== target.id); saveData();
      await interaction.reply({ embeds: [new EmbedBuilder().setTitle('✅ Player Unbanned!').setDescription(`**${target.displayName}** can use TFCImon again.`).setColor(0x00b894)] });
    }

    // /setarenacholder
    else if (commandName === 'setarenacholder') {
      if (!isOp(interaction)) return interaction.reply({ content: '❌ No permission.', ephemeral: true });
      const arenaId = interaction.options.getString('arena'); const target = interaction.options.getUser('user');
      const arena = ARENAS[arenaId];
      arena.holder = target.id; arena.holderName = target.displayName; saveData();
      await interaction.reply({ embeds: [new EmbedBuilder().setTitle('👑 Arena Holder Set!').setDescription(`**${target.displayName}** is now the holder of **${arena.emoji} ${arena.name}**!`).setColor(arena.color)] });
    }

    // /broadcast
    else if (commandName === 'broadcast') {
      if (!isOp(interaction)) return interaction.reply({ content: '❌ No permission.', ephemeral: true });
      const title = interaction.options.getString('title');
      const message = interaction.options.getString('message');
      const colorStr = interaction.options.getString('color');
      const color = colorStr ? parseInt(colorStr, 16) : 0xfdcb6e;
      await interaction.reply({ embeds: [new EmbedBuilder().setTitle(`📢 ${title}`).setDescription(message).setColor(color).setFooter({ text: `TFCImon • Broadcast by ${interaction.user.displayName}` }).setTimestamp()] });
    }

    // /resetarena
    else if (commandName === 'resetarena') {
      if (!isOp(interaction)) return interaction.reply({ content: '❌ No permission.', ephemeral: true });
      const arenaId = interaction.options.getString('arena'); const arena = ARENAS[arenaId];
      arena.holder = null; arena.holderName = null; saveData();
      await interaction.reply({ embeds: [new EmbedBuilder().setTitle('🏟️ Arena Reset!').setDescription(`**${arena.name}** is unclaimed again!`).setColor(arena.color)] });
    }

    // /announce
    else if (commandName === 'announce') {
      if (!isOp(interaction)) return interaction.reply({ content: '❌ No permission.', ephemeral: true });
      const message = interaction.options.getString('message');
      await interaction.reply({ embeds: [new EmbedBuilder().setTitle('📢 TFCImon Announcement').setDescription(message).setColor(0xfdcb6e).setFooter({ text: `From: ${interaction.user.displayName}` })] });
    }

    // /doublegems
    else if (commandName === 'doublegems') {
      if (!isOp(interaction)) return interaction.reply({ content: '❌ No permission.', ephemeral: true });
      doubleGemsEvent = !doubleGemsEvent; saveData();
      await interaction.reply({ embeds: [new EmbedBuilder().setTitle(doubleGemsEvent ? '🎉 Double Gems STARTED!' : '⏹️ Double Gems ENDED!').setDescription(doubleGemsEvent ? 'All gem rewards doubled!' : 'Back to normal.').setColor(doubleGemsEvent ? 0xf1c40f : 0x636e72)] });
    }

    // /tournament
    else if (commandName === 'tournament') {
      if (!isOp(interaction)) return interaction.reply({ content: '❌ No permission.', ephemeral: true });
      if (!activeTournament.running) {
        activeTournament.running = true; activeTournament.players = []; activeTournament.bracket = [];
        return interaction.reply({ embeds: [new EmbedBuilder().setTitle('🏆 Tournament Open!').setDescription('Use `/jointournament` to enter!\nRun this command again to start the bracket.').setColor(0xf1c40f)] });
      }
      if (activeTournament.players.length < 2) {
        activeTournament.running = false; activeTournament.players = [];
        return interaction.reply({ content: '❌ Tournament cancelled — not enough players.' });
      }
      const shuffled = [...activeTournament.players].sort(() => Math.random() - 0.5);
      activeTournament.bracket = shuffled;
      const matchups = [];
      for (let i = 0; i < shuffled.length - 1; i += 2) matchups.push(`⚔️ **${shuffled[i].name}** vs **${shuffled[i+1]?.name || 'BYE'}**`);
      await interaction.reply({ embeds: [new EmbedBuilder().setTitle('🏆 Tournament Bracket!').setDescription(matchups.join('\n') + '\n\nUse `/battle` to challenge your opponent!').setColor(0xf1c40f)] });
    }

    // /listcards
    else if (commandName === 'listcards') {
      if (!isOp(interaction)) return interaction.reply({ content: '❌ No permission.', ephemeral: true });
      const allCards = Object.values(CARDS);
      const custom = allCards.filter(c => c.id.startsWith('custom_'));
      const base = allCards.filter(c => !c.id.startsWith('custom_'));
      let desc = `**Base Cards (${base.length}):**\n${base.map(c => `${c.emoji} ${c.name} — ID: \`${c.id}\` | ${c.moves.length} moves`).join('\n')}`;
      if (custom.length > 0) desc += `\n\n**Custom Cards (${custom.length}):**\n${custom.map(c => `${c.emoji} ${c.name} — ID: \`${c.id}\` | ${c.moves.length} moves`).join('\n')}`;
      await interaction.reply({ embeds: [new EmbedBuilder().setTitle('📋 All TFCImon Cards').setDescription(desc).setColor(0x6c5ce7)], ephemeral: true });
    }

    // /setbounty
    else if (commandName === 'setbounty') {
      if (!isOp(interaction)) return interaction.reply({ content: '❌ No permission.', ephemeral: true });
      const target = interaction.options.getUser('user'); const amount = interaction.options.getInteger('amount');
      if (target.id === userId) return interaction.reply({ content: '❌ Cannot bounty yourself!', ephemeral: true });
      bounties.set(target.id, { amount, setBy: userId, setByName: interaction.user.displayName, targetName: target.displayName });
      saveData();
      await interaction.reply({ embeds: [new EmbedBuilder()
        .setTitle('🎯 Bounty Placed!')
        .setDescription(`A **${amount}💎** bounty has been placed on **${target.displayName}**!\nFirst player to defeat them in PvP collects the reward!`)
        .setColor(0xe17055)
      ] });
    }

    // /removebounty
    else if (commandName === 'removebounty') {
      if (!isOp(interaction)) return interaction.reply({ content: '❌ No permission.', ephemeral: true });
      const target = interaction.options.getUser('user');
      if (!bounties.has(target.id)) return interaction.reply({ content: `❌ No bounty on **${target.displayName}**.`, ephemeral: true });
      bounties.delete(target.id); saveData();
      await interaction.reply({ embeds: [new EmbedBuilder().setTitle('🎯 Bounty Removed').setDescription(`Bounty on **${target.displayName}** has been removed.`).setColor(0x636e72)] });
    }
  }

  // ── SELECT MENUS ──
  else if (interaction.isStringSelectMenu()) {
    const userId = interaction.user.id;
    if (interaction.customId === `builddeck_select_${userId}`) {
      const player = getPlayer(userId);
      const selected = interaction.values;
      player.activeDeck = selected; saveData();
      const names = selected.map(id => { const c = CARDS[id]; return c ? `${c.emoji} **${c.name}**` : id; }).join(', ');
      await interaction.reply({ embeds: [new EmbedBuilder().setTitle('🎯 Active Deck Set!').setDescription(`Your battle deck is now:\n${names}\n\nUse \`/cleardeck\` to reset to random.`).setColor(0x00b894)] });
    }
  }

  // ── BUTTONS ──
  else if (interaction.isButton()) {
    const customId = interaction.customId;
    const userId = interaction.user.id;
    const player = getPlayer(userId);

    // Wipe all confirm/cancel
    if (customId === 'wipeall_confirm') {
      if (!opUsers.includes(userId) && interaction.user.username !== OP_USER) return interaction.reply({ content: '❌ No permission.', ephemeral: true });
      playerData.clear(); saveData();
      await interaction.update({ content: '💀 **All player data wiped.**', components: [] });
    } else if (customId === 'wipeall_cancel') {
      await interaction.update({ content: '✅ Wipe cancelled.', components: [] });
    }

    // Trade
    else if (customId.startsWith('trade_accept_') || customId.startsWith('trade_decline_')) {
      const tradeId = parseInt(customId.replace('trade_accept_', '').replace('trade_decline_', ''));
      const trade = tradeOffers.get(tradeId);
      if (!trade) return interaction.reply({ content: '❌ Trade expired.', ephemeral: true });
      if (interaction.user.id !== trade.toId) return interaction.reply({ content: '❌ Not your trade!', ephemeral: true });
      if (customId.startsWith('trade_decline_')) { tradeOffers.delete(tradeId); return interaction.update({ content: '❌ Trade declined.', embeds: [], components: [] }); }
      const fp = getPlayer(trade.fromId); const tp = getPlayer(trade.toId);
      if (!fp.deck.includes(trade.giveId)) { tradeOffers.delete(tradeId); return interaction.update({ content: '❌ Trader no longer has that card!', embeds: [], components: [] }); }
      if (!tp.deck.includes(trade.wantId)) { tradeOffers.delete(tradeId); return interaction.update({ content: '❌ You no longer have that card!', embeds: [], components: [] }); }
      fp.deck.splice(fp.deck.indexOf(trade.giveId), 1); tp.deck.splice(tp.deck.indexOf(trade.wantId), 1);
      fp.deck.push(trade.wantId); tp.deck.push(trade.giveId);
      tradeOffers.delete(tradeId); saveData();
      const gCard = CARDS[trade.giveId]; const wCard = CARDS[trade.wantId];
      await interaction.update({ embeds: [new EmbedBuilder().setTitle('🔄 Trade Complete!').setDescription(`**${trade.fromName}** got ${wCard.emoji} **${wCard.name}**\n**${trade.toName}** got ${gCard.emoji} **${gCard.name}**`).setColor(0x00b894)], components: [] });
    }

    // AH Buy
    else if (customId.startsWith('ah_buy_')) {
      const listingId = parseInt(customId.replace('ah_buy_', ''));
      const listing = auctionListings.get(listingId);
      if (!listing) return interaction.reply({ content: '❌ Listing no longer exists.', ephemeral: true });
      if (listing.sellerId === userId) return interaction.reply({ content: "❌ Can't buy your own listing!", ephemeral: true });
      if (player.gems < listing.price) return interaction.reply({ content: `❌ Need ${listing.price}💎, have ${player.gems}💎.`, ephemeral: true });
      player.gems -= listing.price; player.deck.push(listing.cardId);
      getPlayer(listing.sellerId).gems += listing.price;
      auctionListings.delete(listingId); saveData();
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
      if (player.gems < minBid) return interaction.reply({ content: `❌ Min bid is ${minBid}💎, have ${player.gems}💎.`, ephemeral: true });
      if (listing.highestBidder) getPlayer(listing.highestBidder).gems += listing.currentBid;
      player.gems -= minBid; listing.currentBid = minBid; listing.highestBidder = userId; listing.highestBidderName = interaction.user.displayName;
      saveData();
      await interaction.reply({ embeds: [new EmbedBuilder().setTitle('🏷️ Bid Placed!').setDescription(`You bid **${minBid}💎** — highest bidder!`).setColor(0x6c5ce7)] });
    }

    // PvP accept/decline
    else if (customId.startsWith('accept_') || customId.startsWith('decline_')) {
      const battleId = customId.replace('accept_', '').replace('decline_', '');
      const battle = activeBattles.get(battleId);
      if (!battle) return interaction.reply({ content: '❌ Battle expired.', ephemeral: true });
      if (interaction.user.id !== battle.opponent.id) return interaction.reply({ content: '❌ Only the challenged player can respond!', ephemeral: true });
      if (customId.startsWith('decline_')) { activeBattles.delete(battleId); return interaction.update({ content: `❌ ${battle.opponent.name} declined.`, embeds: [], components: [] }); }
      battle.accepted = true;
      await interaction.update({ components: [] });
      await sendBattleState(interaction.channel, battle, CARDS[battle.challenger.cardId], CARDS[battle.opponent.cardId], battleId);
    }

    // PvP moves
    else if (customId.startsWith('move_pvp_')) {
      const parts = customId.split('_'); const moveIndex = parseInt(parts[parts.length - 1]);
      const battleId = parts.slice(2, parts.length - 1).join('_');
      const battle = activeBattles.get(battleId);
      if (!battle) return interaction.reply({ content: '❌ Battle not found.', ephemeral: true });
      if (interaction.user.id !== battle.turn) return interaction.reply({ content: "❌ Not your turn!", ephemeral: true });
      const isChallenger = interaction.user.id === battle.challenger.id;
      const attacker = isChallenger ? battle.challenger : battle.opponent;
      const defender = isChallenger ? battle.opponent : battle.challenger;
      const aCard = CARDS[attacker.cardId]; const move = aCard.moves[moveIndex];
      if (!move) return interaction.reply({ content: '❌ Invalid move.', ephemeral: true });
      if (attacker.energy < move.cost) return interaction.reply({ content: `❌ Need ${move.cost}⚡, have ${attacker.energy}⚡.`, ephemeral: true });
      const bonus = getLevelBonus(attacker.level || 1); const totalDmg = move.damage + bonus;
      attacker.energy -= move.cost; defender.hp = Math.max(0, defender.hp - totalDmg);
      attacker.energy = Math.min(attacker.energy + 1, 6); defender.energy = Math.min(defender.energy + 1, 6);
      battle.turn = defender.id;
      await interaction.update({ components: [] });

      if (defender.hp <= 0) {
        activeBattles.delete(battleId);
        const atkP = getPlayer(attacker.id); const defP = getPlayer(defender.id);
        const gemGain = 25 * gemMultiplier();
        atkP.wins++; atkP.gems += gemGain;
        atkP.cardWins[attacker.cardId] = (atkP.cardWins[attacker.cardId] || 0) + 1;
        defP.losses++; defP.cardLosses[defender.cardId] = (defP.cardLosses[defender.cardId] || 0) + 1;
        const cWins = atkP.cardWins[attacker.cardId];
        const threshold = xpThreshold();
        if (cWins % threshold === 0) atkP.cardLevels[attacker.cardId] = (atkP.cardLevels[attacker.cardId] || 1) + 1;
        const lvlMsg = cWins % threshold === 0 ? `\n⬆️ **${aCard.name}** leveled up to Lv${atkP.cardLevels[attacker.cardId]}!${xpBoostEvent ? ' *(XP Boost!)*' : ''}` : '';

        let bountyMsg = '';
        if (bounties.has(defender.id)) {
          const b = bounties.get(defender.id);
          atkP.gems += b.amount;
          bountyMsg = `\n🎯 **BOUNTY COLLECTED!** +${b.amount}💎 for defeating ${defender.name}!`;
          bounties.delete(defender.id);
        }

        saveData();
        return interaction.channel.send({ embeds: [new EmbedBuilder().setTitle('🏆 Battle Over!').setDescription(`**${attacker.name}** wins! +${gemGain}💎${lvlMsg}${bountyMsg}\n${move.emoji} **${move.name}** dealt **${totalDmg}** as the finishing blow!`).setColor(0xf1c40f)] });
      }
      await sendBattleState(interaction.channel, battle, CARDS[battle.challenger.cardId], CARDS[battle.opponent.cardId], battleId, `${move.emoji} **${attacker.name}** used **${move.name}** → **${totalDmg}** damage!${bonus > 0 ? ` *(+${bonus} level bonus)*` : ''}`);
    }

    // Arena moves
    else if (customId.startsWith('move_arena_')) {
      const parts = customId.split('_'); const moveIndex = parseInt(parts[parts.length - 1]);
      const battleId = parts.slice(2, parts.length - 1).join('_');
      const ab = activeArenaBattles.get(battleId);
      if (!ab) return interaction.reply({ content: '❌ Arena battle not found.', ephemeral: true });
      if (interaction.user.id !== ab.userId) return interaction.reply({ content: '❌ Not your battle!', ephemeral: true });
      const card = CARDS[ab.cardId]; const arena = ARENAS[ab.arenaId]; const move = card.moves[moveIndex];
      if (!move) return interaction.reply({ content: '❌ Invalid move.', ephemeral: true });
      if (ab.playerEnergy < move.cost) return interaction.reply({ content: `❌ Need ${move.cost}⚡, have ${ab.playerEnergy}⚡.`, ephemeral: true });
      const bonus = getLevelBonus(ab.cardLevel || 1); const totalDmg = move.damage + bonus;
      ab.playerEnergy -= move.cost; ab.guardianHp = Math.max(0, ab.guardianHp - totalDmg);
      ab.playerEnergy = Math.min(ab.playerEnergy + 1, 6); ab.guardianEnergy = Math.min(ab.guardianEnergy + 1, 6);
      await interaction.update({ components: [] });
      const pLog = `${move.emoji} **${ab.userName}** used **${move.name}** → **${totalDmg}** damage!${bonus > 0 ? ` *(+${bonus} level bonus)*` : ''}`;
      if (ab.guardianHp <= 0) {
        activeArenaBattles.delete(battleId);
        const prevHolder = arena.holderName; arena.holder = ab.userId; arena.holderName = ab.userName;
        const gemGain = 50 * gemMultiplier();
        const wp = getPlayer(ab.userId); wp.gems += gemGain; wp.wins++;
        wp.cardWins[ab.cardId] = (wp.cardWins[ab.cardId] || 0) + 1;
        const threshold = xpThreshold();
        if (wp.cardWins[ab.cardId] % threshold === 0) wp.cardLevels[ab.cardId] = (wp.cardLevels[ab.cardId] || 1) + 1;
        saveData();
        return interaction.channel.send({ embeds: [new EmbedBuilder().setTitle(`${arena.emoji} Arena Conquered!`).setDescription(`👑 **${ab.userName}** defeated **${arena.guardian.name}** and claimed **${arena.name}**! +${gemGain}💎\n${prevHolder ? `*${prevHolder} lost the arena.*` : '*First claim ever!*'}`).setColor(0xf1c40f)] });
      }
      const gMove = aiPickMove(arena.guardian, ab.guardianEnergy);
      ab.guardianEnergy -= gMove.cost; ab.playerHp = Math.max(0, ab.playerHp - gMove.damage);
      ab.guardianEnergy = Math.min(ab.guardianEnergy + 1, 6); ab.playerEnergy = Math.min(ab.playerEnergy + 1, 6);
      const gLog = `${gMove.emoji} **${arena.guardian.name}** used **${gMove.name}** → **${gMove.damage}** damage!`;
      if (ab.playerHp <= 0) {
        activeArenaBattles.delete(battleId);
        const lp = getPlayer(ab.userId); lp.losses++; saveData();
        return interaction.channel.send({ embeds: [new EmbedBuilder().setTitle(`${arena.emoji} Defeated!`).setDescription(`💀 **${ab.userName}** was defeated by **${arena.guardian.name}**!`).setColor(0xe74c3c)] });
      }
      await sendArenaBattleState(interaction.channel, battleId, `${pLog}\n${gLog}`);
    }
  }
});

// ─── BATTLE STATE HELPERS ─────────────────────────────────────────────────────

async function sendBattleState(channel, battle, cCard, oCard, battleId, lastAction = null) {
  const cur = battle.turn === battle.challenger.id ? battle.challenger : battle.opponent;
  const curCard = CARDS[cur.cardId];
  const embed = new EmbedBuilder().setTitle('⚔️ TFCImon Battle!').setColor(0x2ecc71)
    .addFields(
      { name: `${cCard.emoji} ${battle.challenger.name} — ${cCard.name} Lv${battle.challenger.level || 1}`, value: `❤️ ${hpBar(battle.challenger.hp, cCard.hp)}\n⚡ ${battle.challenger.energy}` },
      { name: `${oCard.emoji} ${battle.opponent.name} — ${oCard.name} Lv${battle.opponent.level || 1}`, value: `❤️ ${hpBar(battle.opponent.hp, oCard.hp)}\n⚡ ${battle.opponent.energy}` },
    ).setFooter({ text: `🎮 ${cur.name}'s turn!` });
  if (lastAction) embed.setDescription(lastAction);
  const level = cur.level || 1; const bonus = getLevelBonus(level);
  const row = new ActionRowBuilder();
  for (let i = 0; i < curCard.moves.length; i++) {
    const m = curCard.moves[i]; const totalDmg = m.damage + bonus;
    row.addComponents(new ButtonBuilder().setCustomId(`move_pvp_${battleId}_${i}`).setLabel(`${m.emoji} ${m.name} (${m.cost}⚡, ${totalDmg}dmg)`).setStyle(m.isEx ? ButtonStyle.Danger : ButtonStyle.Primary).setDisabled(cur.energy < m.cost));
  }
  await channel.send({ embeds: [embed], components: [row] });
}

async function sendArenaBattleState(channel, battleId, lastAction = null) {
  const ab = activeArenaBattles.get(battleId); if (!ab) return;
  const card = CARDS[ab.cardId]; const arena = ARENAS[ab.arenaId];
  const level = ab.cardLevel || 1; const bonus = getLevelBonus(level);
  const embed = new EmbedBuilder().setTitle(`${arena.emoji} ${arena.name} — Arena Battle!`).setColor(arena.color)
    .addFields(
      { name: `${card.emoji} ${ab.userName} — ${card.name} Lv${level}`, value: `❤️ ${hpBar(ab.playerHp, card.hp)}\n⚡ ${ab.playerEnergy}` },
      { name: `${arena.guardian.emoji} ${arena.guardian.name}`, value: `❤️ ${hpBar(ab.guardianHp, arena.guardian.hp)}\n⚡ ${ab.guardianEnergy}` },
    ).setFooter({ text: `Your turn, ${ab.userName}!` });
  if (lastAction) embed.setDescription(lastAction);
  const row = new ActionRowBuilder();
  for (let i = 0; i < card.moves.length; i++) {
    const m = card.moves[i]; const totalDmg = m.damage + bonus;
    row.addComponents(new ButtonBuilder().setCustomId(`move_arena_${battleId}_${i}`).setLabel(`${m.emoji} ${m.name} (${m.cost}⚡, ${totalDmg}dmg)`).setStyle(m.isEx ? ButtonStyle.Danger : ButtonStyle.Primary).setDisabled(ab.playerEnergy < m.cost));
  }
  await channel.send({ embeds: [embed], components: [row] });
}

// ─── START ────────────────────────────────────────────────────────────────────

(async () => {
  await registerCommands();
  await client.login(BOT_TOKEN);
})();
