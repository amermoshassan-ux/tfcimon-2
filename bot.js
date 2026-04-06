// TFCImon Discord Bot — Full Version
require('dotenv').config();
const { Client, GatewayIntentBits, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, REST, Routes } = require('discord.js');

const BOT_TOKEN = process.env.BOT_TOKEN || 'YOUR_BOT_TOKEN_HERE';
const CLIENT_ID = process.env.CLIENT_ID || 'YOUR_CLIENT_ID_HERE';
const OP_USER = 'haxiii7'; // OP admin username

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
};

// Energy card — not a battle card, gives bonus energy
const ENERGY_CARD = {
  id: 'energy', name: 'Energy Card', emoji: '⚡', rarity: 'Common',
  description: 'Gives +2 bonus energy at the start of your next battle!',
};

const PACK_WEIGHTS = {
  celestia: 28, flame: 28, isy: 22, spk_iii: 13, michael: 1, energy: 8,
};

const PACK_GEM_COST = 150;
const CARD_CHOICES = [
  { name: 'Celestia (300💎)', value: 'celestia' },
  { name: 'Flame (300💎)', value: 'flame' },
  { name: 'Isy EX (500💎)', value: 'isy' },
  { name: 'SPK_III (200💎)', value: 'spk_iii' },
  { name: 'Michael the Keeper (2000💎)', value: 'michael' },
];

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
// Auction house: listingId -> { sellerId, sellerName, cardId, price, bidPrice, highestBidder, highestBidderName, type: 'instant'|'bid'|'both', expiresAt }
const auctionListings = new Map();
let listingCounter = 1;

function getPlayer(userId) {
  if (!playerData.has(userId)) {
    playerData.set(userId, { deck: [], energyCards: 0, gems: 100, nicknames: {} });
  }
  const p = playerData.get(userId);
  if (p.gems === undefined) p.gems = 100;
  if (p.energyCards === undefined) p.energyCards = 0;
  if (p.nicknames === undefined) p.nicknames = {};
  return p;
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
  const filled = Math.round((hp / maxHp) * 10);
  return '█'.repeat(Math.max(0, filled)) + '░'.repeat(Math.max(0, 10 - filled)) + ` ${hp}/${maxHp}`;
}

function aiPickMove(guardian, energy) {
  const affordable = guardian.moves.filter(m => m.cost <= energy);
  if (affordable.length === 0) return guardian.moves.reduce((a, b) => a.cost < b.cost ? a : b);
  return affordable.reduce((best, m) => m.damage > best.damage ? m : best);
}

function isOp(interaction) {
  return interaction.user.username === OP_USER;
}

function buildDeckEmbed(userId, player) {
  const embed = new EmbedBuilder()
    .setTitle('📦 Your TFCImon Deck')
    .setColor(0x9b59b6)
    .setFooter({ text: `💎 Gems: ${player.gems} | ⚡ Energy Cards: ${player.energyCards}` });

  if (player.deck.length === 0) {
    embed.setDescription('Your deck is empty! Use `/openpack` to get cards.');
    return embed;
  }

  const counts = {};
  for (const id of player.deck) counts[id] = (counts[id] || 0) + 1;

  const lines = Object.entries(counts).map(([id, count]) => {
    const card = CARDS[id];
    const nickname = player.nicknames[id] ? ` *"${player.nicknames[id]}"*` : '';
    return `${card.emoji} **${card.name}**${nickname} ×${count} — ${card.hp}HP | ${card.type} | ${card.rarity}`;
  });

  embed.setDescription(lines.join('\n'));
  embed.addFields({ name: '🃏 Total Cards', value: `${player.deck.length}`, inline: true });
  return embed;
}

// ─── SLASH COMMANDS ───────────────────────────────────────────────────────────

const commands = [
  new SlashCommandBuilder().setName('openpack').setDescription('Open a TFCImon pack! (Free or buy with gems)').toJSON(),
  new SlashCommandBuilder().setName('deck').setDescription('View your TFCImon card deck').toJSON(),
  new SlashCommandBuilder().setName('gems').setDescription('Check your gem balance').toJSON(),
  new SlashCommandBuilder().setName('shop').setDescription('Buy packs or cards with gems').toJSON(),

  new SlashCommandBuilder()
    .setName('buycard')
    .setDescription('Buy a specific card with gems')
    .addStringOption(opt =>
      opt.setName('card').setDescription('Which card to buy').setRequired(true).addChoices(...CARD_CHOICES)
    ).toJSON(),

  new SlashCommandBuilder()
    .setName('buypack')
    .setDescription(`Buy a pack for ${PACK_GEM_COST} gems`)
    .toJSON(),

  new SlashCommandBuilder()
    .setName('battle')
    .setDescription('Challenge another member to a TFCImon battle!')
    .addUserOption(opt => opt.setName('opponent').setDescription('The member you want to battle').setRequired(true))
    .toJSON(),

  new SlashCommandBuilder()
    .setName('name')
    .setDescription('Give a nickname to a TFCImon card in your deck!')
    .addStringOption(opt =>
      opt.setName('card').setDescription('Which card to rename').setRequired(true)
        .addChoices(
          { name: 'Celestia', value: 'celestia' },
          { name: 'Flame', value: 'flame' },
          { name: 'Isy EX', value: 'isy' },
          { name: 'SPK_III', value: 'spk_iii' },
          { name: 'Michael the Keeper', value: 'michael' },
        )
    )
    .addStringOption(opt => opt.setName('nickname').setDescription('The nickname').setRequired(true).setMaxLength(32))
    .toJSON(),

  new SlashCommandBuilder().setName('arenas').setDescription('View all TFCImon arenas and holders').toJSON(),

  new SlashCommandBuilder()
    .setName('challenge')
    .setDescription('Challenge an arena guardian!')
    .addStringOption(opt =>
      opt.setName('arena').setDescription('Which arena to challenge').setRequired(true)
        .addChoices(
          { name: '🏝️ 100 Player Island', value: '100_player_island' },
          { name: '💞 Mingle', value: 'mingle' },
          { name: '🚦 RLGL', value: 'rlgl' },
          { name: '🪢 Jumprope', value: 'jumprope' },
          { name: '🌪️ Spinner', value: 'spinner' },
          { name: '⚔️ Red vs Blue Island', value: 'red_vs_blue' },
          { name: '🪙 Pick a Side', value: 'pick_a_side' },
        )
    ).toJSON(),

  // Auction House
  new SlashCommandBuilder().setName('ah').setDescription('Browse the auction house').toJSON(),

  new SlashCommandBuilder()
    .setName('ah-sell')
    .setDescription('List a card on the auction house')
    .addStringOption(opt =>
      opt.setName('card').setDescription('Which card to sell').setRequired(true).addChoices(...CARD_CHOICES)
    )
    .addIntegerOption(opt => opt.setName('price').setDescription('Instant buy price in gems').setRequired(true).setMinValue(1))
    .addIntegerOption(opt => opt.setName('bidstart').setDescription('Starting bid price (optional — enables bidding)').setMinValue(1))
    .toJSON(),

  new SlashCommandBuilder()
    .setName('ah-search')
    .setDescription('Search the auction house for a specific card')
    .addStringOption(opt =>
      opt.setName('card').setDescription('Which card to search for').setRequired(true).addChoices(...CARD_CHOICES)
    ).toJSON(),

  // OP COMMANDS (haxiii7 only)
  new SlashCommandBuilder()
    .setName('makecard')
    .setDescription('[OP] Create a custom card')
    .addStringOption(opt => opt.setName('name').setDescription('Card name').setRequired(true))
    .addIntegerOption(opt => opt.setName('hp').setDescription('Card HP').setRequired(true).setMinValue(1).setMaxValue(9999))
    .addStringOption(opt => opt.setName('type').setDescription('Card type').setRequired(true))
    .addStringOption(opt => opt.setName('rarity').setDescription('Card rarity').setRequired(true))
    .addStringOption(opt => opt.setName('move1').setDescription('Move 1 name').setRequired(true))
    .addIntegerOption(opt => opt.setName('move1dmg').setDescription('Move 1 damage').setRequired(true))
    .addStringOption(opt => opt.setName('move2').setDescription('Move 2 name').setRequired(true))
    .addIntegerOption(opt => opt.setName('move2dmg').setDescription('Move 2 damage').setRequired(true))
    .addUserOption(opt => opt.setName('giveto').setDescription('Give this card to a player').setRequired(false))
    .toJSON(),

  new SlashCommandBuilder()
    .setName('givegems')
    .setDescription('[OP] Give gems to a player')
    .addUserOption(opt => opt.setName('user').setDescription('Player to give gems to').setRequired(true))
    .addIntegerOption(opt => opt.setName('amount').setDescription('Amount of gems').setRequired(true).setMinValue(1))
    .toJSON(),

  new SlashCommandBuilder()
    .setName('givecard')
    .setDescription('[OP] Give any card to a player')
    .addUserOption(opt => opt.setName('user').setDescription('Player').setRequired(true))
    .addStringOption(opt =>
      opt.setName('card').setDescription('Card to give').setRequired(true).addChoices(...CARD_CHOICES)
    ).toJSON(),

  new SlashCommandBuilder()
    .setName('kill')
    .setDescription('[OP] Remove all cards from a player')
    .addUserOption(opt => opt.setName('user').setDescription('Player to wipe').setRequired(true))
    .toJSON(),

  new SlashCommandBuilder()
    .setName('resetarena')
    .setDescription('[OP] Reset an arena holder')
    .addStringOption(opt =>
      opt.setName('arena').setDescription('Which arena to reset').setRequired(true)
        .addChoices(
          { name: '🏝️ 100 Player Island', value: '100_player_island' },
          { name: '💞 Mingle', value: 'mingle' },
          { name: '🚦 RLGL', value: 'rlgl' },
          { name: '🪢 Jumprope', value: 'jumprope' },
          { name: '🌪️ Spinner', value: 'spinner' },
          { name: '⚔️ Red vs Blue Island', value: 'red_vs_blue' },
          { name: '🪙 Pick a Side', value: 'pick_a_side' },
        )
    ).toJSON(),

  new SlashCommandBuilder()
    .setName('announce')
    .setDescription('[OP] Send a TFCImon announcement')
    .addStringOption(opt => opt.setName('message').setDescription('The announcement').setRequired(true))
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

// ─── INTERACTION HANDLER ──────────────────────────────────────────────────────

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
      player.gems += 10; // earn 10 gems per pack opened

      const embed = new EmbedBuilder()
        .setTitle('📦 Pack Opened!')
        .setDescription(`${interaction.user.displayName} tore open a TFCImon pack...\n*+10💎 gems earned!*`)
        .setColor(0xf39c12)
        .setFooter({ text: `You now have ${player.deck.length} cards | 💎 ${player.gems} gems` });

      const cardLines = pulled.map((id, i) => {
        if (id === 'energy') return `**Card ${i + 1}:** ⚡ **Energy Card** — +2 battle energy!`;
        const card = CARDS[id];
        const tag = card.rarity === 'LEGENDARY' ? ' 🌟 LEGENDARY!!' : card.rarity === 'EX' ? ' ✨ EX!' : '';
        return `**Card ${i + 1}:** ${card.emoji} **${card.name}**${tag} — ${card.hp}HP`;
      });
      embed.addFields({ name: '🎴 You got:', value: cardLines.join('\n') });
      await interaction.editReply({ embeds: [embed] });
    }

    // ── /deck ──
    else if (commandName === 'deck') {
      await interaction.reply({ embeds: [buildDeckEmbed(userId, player)] });
    }

    // ── /gems ──
    else if (commandName === 'gems') {
      const embed = new EmbedBuilder()
        .setTitle('💎 Your Gems')
        .setDescription(`You have **${player.gems} gems**!\n\nEarn gems by opening packs (+10 each), winning battles (+25), or conquering arenas (+50).\nSpend gems in the shop with \`/shop\`.`)
        .setColor(0x00cec9);
      await interaction.reply({ embeds: [embed] });
    }

    // ── /shop ──
    else if (commandName === 'shop') {
      const embed = new EmbedBuilder()
        .setTitle('🛒 TFCImon Gem Shop')
        .setDescription(`Your balance: **${player.gems}💎**`)
        .setColor(0xf1c40f)
        .addFields(
          { name: '📦 Pack (150💎)', value: '3 random cards — use `/buypack`', inline: false },
          ...Object.values(CARDS).map(c => ({
            name: `${c.emoji} ${c.name} (${c.gemCost}💎)`,
            value: `${c.rarity} | ${c.hp}HP — use \`/buycard\``,
            inline: true,
          }))
        );
      await interaction.reply({ embeds: [embed] });
    }

    // ── /buypack ──
    else if (commandName === 'buypack') {
      if (player.gems < PACK_GEM_COST)
        return interaction.reply({ content: `❌ Not enough gems! You need ${PACK_GEM_COST}💎 but have ${player.gems}💎.`, ephemeral: true });

      player.gems -= PACK_GEM_COST;
      const pulled = openPack(3);
      for (const cardId of pulled) {
        if (cardId === 'energy') player.energyCards++;
        else player.deck.push(cardId);
      }

      const embed = new EmbedBuilder()
        .setTitle('🛒 Pack Purchased!')
        .setColor(0xf39c12)
        .setFooter({ text: `Remaining gems: ${player.gems}💎` });
      const lines = pulled.map((id, i) => {
        if (id === 'energy') return `**Card ${i + 1}:** ⚡ **Energy Card**`;
        const card = CARDS[id];
        return `**Card ${i + 1}:** ${card.emoji} **${card.name}** — ${card.hp}HP`;
      });
      embed.addFields({ name: '🎴 You got:', value: lines.join('\n') });
      await interaction.reply({ embeds: [embed] });
    }

    // ── /buycard ──
    else if (commandName === 'buycard') {
      const cardId = interaction.options.getString('card');
      const card = CARDS[cardId];
      if (player.gems < card.gemCost)
        return interaction.reply({ content: `❌ Not enough gems! ${card.name} costs ${card.gemCost}💎 but you have ${player.gems}💎.`, ephemeral: true });

      player.gems -= card.gemCost;
      player.deck.push(cardId);

      const embed = new EmbedBuilder()
        .setTitle('🛒 Card Purchased!')
        .setDescription(`${card.emoji} **${card.name}** has been added to your deck!`)
        .setColor(card.color)
        .setFooter({ text: `Remaining gems: ${player.gems}💎` });
      await interaction.reply({ embeds: [embed] });
    }

    // ── /name ──
    else if (commandName === 'name') {
      const cardId = interaction.options.getString('card');
      const nickname = interaction.options.getString('nickname');
      if (!player.deck.includes(cardId))
        return interaction.reply({ content: `❌ You don't have **${CARDS[cardId].name}** in your deck!`, ephemeral: true });
      player.nicknames[cardId] = nickname;
      const card = CARDS[cardId];
      await interaction.reply({ embeds: [new EmbedBuilder().setTitle('✏️ Nickname Set!').setDescription(`${card.emoji} **${card.name}** is now nicknamed **"${nickname}"**!`).setColor(card.color)] });
    }

    // ── /arenas ──
    else if (commandName === 'arenas') {
      const embed = new EmbedBuilder().setTitle('🏟️ TFCImon Arenas').setDescription('Use `/challenge` to fight a guardian and claim an arena!').setColor(0x00cec9);
      for (const arena of Object.values(ARENAS)) {
        const holder = arena.holder ? `👑 **Holder:** ${arena.holderName}` : '🔓 *Unclaimed!*';
        embed.addFields({ name: `${arena.emoji} ${arena.name}`, value: `${arena.description}\n${holder}\n🛡️ Guardian: **${arena.guardian.name}** (${arena.guardian.hp}HP)` });
      }
      await interaction.reply({ embeds: [embed] });
    }

    // ── /challenge ──
    else if (commandName === 'challenge') {
      const arenaId = interaction.options.getString('arena');
      const arena = ARENAS[arenaId];
      if (player.deck.length === 0)
        return interaction.reply({ content: '❌ You have no cards! Use `/openpack` first.', ephemeral: true });

      const cardId = player.deck[Math.floor(Math.random() * player.deck.length)];
      const card = CARDS[cardId];
      const bonusEnergy = player.energyCards > 0 ? 2 : 0;
      if (bonusEnergy > 0) player.energyCards--;
      const battleId = `arena_${arenaId}_${userId}_${Date.now()}`;

      activeArenaBattles.set(battleId, {
        battleId, arenaId, userId, userName: interaction.user.displayName,
        cardId, playerHp: card.hp, playerEnergy: 3 + bonusEnergy,
        guardianHp: arena.guardian.hp, guardianEnergy: arena.guardian.energy,
      });

      const embed = new EmbedBuilder()
        .setTitle(`${arena.emoji} Arena Challenge: ${arena.name}`)
        .setDescription(`**${interaction.user.displayName}** steps into the arena...\n\n${arena.guardian.emoji} **${arena.guardian.name}** blocks the way!${bonusEnergy > 0 ? '\n⚡ *Energy card activated! +2 bonus energy!*' : ''}`)
        .setColor(arena.color)
        .addFields(
          { name: `${card.emoji} Your Card`, value: `**${card.name}** — ${card.hp}HP`, inline: true },
          { name: '⚔️ VS', value: '──────', inline: true },
          { name: `${arena.guardian.emoji} Guardian`, value: `**${arena.guardian.name}** — ${arena.guardian.hp}HP`, inline: true },
        ).setFooter({ text: 'You go first!' });

      await interaction.reply({ embeds: [embed] });
      await sendArenaBattleState(interaction.channel, battleId);
    }

    // ── /ah ──
    else if (commandName === 'ah') {
      const listings = [...auctionListings.values()];
      if (listings.length === 0)
        return interaction.reply({ content: '🏪 The auction house is empty! Use `/ah-sell` to list a card.', ephemeral: false });

      const embed = new EmbedBuilder().setTitle('🏪 Auction House').setColor(0xe17055).setDescription('Use the listing ID to buy or bid!');
      for (const l of listings.slice(0, 10)) {
        const card = CARDS[l.cardId];
        const bidInfo = l.bidPrice ? `\n🏷️ Bid from: ${l.bidPrice}💎 (Current: ${l.currentBid || l.bidPrice}💎 by ${l.highestBidderName || 'nobody'})` : '';
        embed.addFields({
          name: `#${l.id} ${card.emoji} ${card.name} — by ${l.sellerName}`,
          value: `💰 Buy Now: **${l.price}💎**${bidInfo}`,
        });
      }
      const row = new ActionRowBuilder();
      for (const l of listings.slice(0, 5)) {
        const card = CARDS[l.cardId];
        row.addComponents(
          new ButtonBuilder().setCustomId(`ah_buy_${l.id}`).setLabel(`Buy #${l.id} ${card.emoji}`).setStyle(ButtonStyle.Success)
        );
      }
      await interaction.reply({ embeds: [embed], components: listings.length > 0 ? [row] : [] });
    }

    // ── /ah-sell ──
    else if (commandName === 'ah-sell') {
      const cardId = interaction.options.getString('card');
      const price = interaction.options.getInteger('price');
      const bidStart = interaction.options.getInteger('bidstart');

      if (!player.deck.includes(cardId))
        return interaction.reply({ content: `❌ You don't have **${CARDS[cardId].name}** in your deck!`, ephemeral: true });

      // Remove card from deck
      const idx = player.deck.indexOf(cardId);
      player.deck.splice(idx, 1);

      const id = listingCounter++;
      auctionListings.set(id, {
        id, sellerId: userId, sellerName: interaction.user.displayName,
        cardId, price, bidPrice: bidStart || null, currentBid: null, highestBidder: null, highestBidderName: null,
      });

      const card = CARDS[cardId];
      const embed = new EmbedBuilder()
        .setTitle('🏪 Card Listed!')
        .setDescription(`${card.emoji} **${card.name}** listed on the auction house!\n💰 Buy Now: **${price}💎**${bidStart ? `\n🏷️ Bidding starts at: **${bidStart}💎**` : ''}`)
        .setColor(0xe17055);
      await interaction.reply({ embeds: [embed] });
    }

    // ── /ah-search ──
    else if (commandName === 'ah-search') {
      const cardId = interaction.options.getString('card');
      const card = CARDS[cardId];
      const results = [...auctionListings.values()].filter(l => l.cardId === cardId);

      if (results.length === 0)
        return interaction.reply({ content: `🔍 No listings found for **${card.name}**.`, ephemeral: false });

      const embed = new EmbedBuilder().setTitle(`🔍 Search: ${card.emoji} ${card.name}`).setColor(card.color);
      for (const l of results) {
        const bidInfo = l.bidPrice ? `\n🏷️ Bid from: ${l.bidPrice}💎 (Current: ${l.currentBid || l.bidPrice}💎 by ${l.highestBidderName || 'nobody'})` : '';
        embed.addFields({ name: `#${l.id} — by ${l.sellerName}`, value: `💰 Buy Now: **${l.price}💎**${bidInfo}` });
      }

      const row = new ActionRowBuilder();
      for (const l of results.slice(0, 5)) {
        row.addComponents(
          new ButtonBuilder().setCustomId(`ah_buy_${l.id}`).setLabel(`Buy #${l.id} (${l.price}💎)`).setStyle(ButtonStyle.Success),
        );
        if (l.bidPrice) {
          row.addComponents(
            new ButtonBuilder().setCustomId(`ah_bid_${l.id}`).setLabel(`Bid #${l.id}`).setStyle(ButtonStyle.Primary),
          );
        }
      }
      await interaction.reply({ embeds: [embed], components: [row] });
    }

    // ── /battle ──
    else if (commandName === 'battle') {
      const challenger = interaction.user;
      const opponent = interaction.options.getUser('opponent');
      if (opponent.id === challenger.id) return interaction.reply({ content: '❌ You cannot battle yourself!', ephemeral: true });
      if (opponent.bot) return interaction.reply({ content: '❌ You cannot battle a bot!', ephemeral: true });

      const cp = getPlayer(challenger.id);
      const op = getPlayer(opponent.id);
      if (cp.deck.length === 0) return interaction.reply({ content: '❌ You have no cards!', ephemeral: true });
      if (op.deck.length === 0) return interaction.reply({ content: `❌ ${opponent.displayName} has no cards!`, ephemeral: true });

      const battleId = `${challenger.id}-${opponent.id}-${Date.now()}`;
      const cCardId = cp.deck[Math.floor(Math.random() * cp.deck.length)];
      const oCardId = op.deck[Math.floor(Math.random() * op.deck.length)];
      const cCard = CARDS[cCardId]; const oCard = CARDS[oCardId];
      const cBonus = cp.energyCards > 0 ? (cp.energyCards--, 2) : 0;
      const oBonus = op.energyCards > 0 ? (op.energyCards--, 2) : 0;

      activeBattles.set(battleId, {
        battleId,
        challenger: { id: challenger.id, name: challenger.displayName, cardId: cCardId, hp: cCard.hp, energy: 3 + cBonus },
        opponent: { id: opponent.id, name: opponent.displayName, cardId: oCardId, hp: oCard.hp, energy: 3 + oBonus },
        turn: challenger.id, accepted: false,
      });

      const embed = new EmbedBuilder().setTitle('⚔️ TFCImon Battle Challenge!').setDescription(`${challenger.displayName} challenges ${opponent} to a battle!`).setColor(0xe74c3c)
        .addFields(
          { name: `${cCard.emoji} ${challenger.displayName}`, value: `**${cCard.name}** — ${cCard.hp}HP${cBonus ? ' ⚡+2' : ''}`, inline: true },
          { name: '⚔️ VS', value: '─────', inline: true },
          { name: `${oCard.emoji} ${opponent.displayName}`, value: `**${oCard.name}** — ${oCard.hp}HP${oBonus ? ' ⚡+2' : ''}`, inline: true },
        ).setFooter({ text: `${opponent.displayName}, do you accept?` });

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId(`accept_${battleId}`).setLabel('✅ Accept').setStyle(ButtonStyle.Success),
        new ButtonBuilder().setCustomId(`decline_${battleId}`).setLabel('❌ Decline').setStyle(ButtonStyle.Danger),
      );
      await interaction.reply({ embeds: [embed], components: [row] });
    }

    // ════════════════════════════════════════
    // OP COMMANDS (haxiii7 only)
    // ════════════════════════════════════════

    else if (commandName === 'makecard') {
      if (!isOp(interaction)) return interaction.reply({ content: '❌ You do not have permission to use this command.', ephemeral: true });

      const name = interaction.options.getString('name');
      const hp = interaction.options.getInteger('hp');
      const type = interaction.options.getString('type');
      const rarity = interaction.options.getString('rarity');
      const move1 = interaction.options.getString('move1');
      const move1dmg = interaction.options.getInteger('move1dmg');
      const move2 = interaction.options.getString('move2');
      const move2dmg = interaction.options.getInteger('move2dmg');
      const giveToUser = interaction.options.getUser('giveto');

      const newId = `custom_${Date.now()}`;
      CARDS[newId] = {
        id: newId, name, hp, type, rarity, emoji: '🃏', color: 0x6c5ce7, description: `Custom card created by ${interaction.user.displayName}.`, gemCost: 9999,
        moves: [
          { name: move1, damage: move1dmg, cost: 2, emoji: '⚔️' },
          { name: move2, damage: move2dmg, cost: 4, emoji: '💥' },
        ],
      };

      if (giveToUser) {
        const targetPlayer = getPlayer(giveToUser.id);
        targetPlayer.deck.push(newId);
      }

      const embed = new EmbedBuilder()
        .setTitle('🃏 Custom Card Created!')
        .setDescription(`**${name}** — ${hp}HP | ${type} | ${rarity}\n⚔️ ${move1}: ${move1dmg}dmg\n💥 ${move2}: ${move2dmg}dmg${giveToUser ? `\n\nGiven to **${giveToUser.displayName}**!` : ''}`)
        .setColor(0x6c5ce7);
      await interaction.reply({ embeds: [embed] });
    }

    else if (commandName === 'givegems') {
      if (!isOp(interaction)) return interaction.reply({ content: '❌ No permission.', ephemeral: true });
      const target = interaction.options.getUser('user');
      const amount = interaction.options.getInteger('amount');
      const tp = getPlayer(target.id);
      tp.gems += amount;
      await interaction.reply({ embeds: [new EmbedBuilder().setTitle('💎 Gems Given!').setDescription(`Gave **${amount}💎** to **${target.displayName}**!\nThey now have **${tp.gems}💎**.`).setColor(0xf1c40f)] });
    }

    else if (commandName === 'givecard') {
      if (!isOp(interaction)) return interaction.reply({ content: '❌ No permission.', ephemeral: true });
      const target = interaction.options.getUser('user');
      const cardId = interaction.options.getString('card');
      const tp = getPlayer(target.id);
      tp.deck.push(cardId);
      const card = CARDS[cardId];
      await interaction.reply({ embeds: [new EmbedBuilder().setTitle('🎴 Card Given!').setDescription(`Gave ${card.emoji} **${card.name}** to **${target.displayName}**!`).setColor(card.color)] });
    }

    else if (commandName === 'kill') {
      if (!isOp(interaction)) return interaction.reply({ content: '❌ No permission.', ephemeral: true });
      const target = interaction.options.getUser('user');
      const tp = getPlayer(target.id);
      tp.deck = [];
      tp.energyCards = 0;
      await interaction.reply({ embeds: [new EmbedBuilder().setTitle('💀 Player Wiped!').setDescription(`**${target.displayName}**'s deck has been completely wiped. 💀`).setColor(0xe74c3c)] });
    }

    else if (commandName === 'resetarena') {
      if (!isOp(interaction)) return interaction.reply({ content: '❌ No permission.', ephemeral: true });
      const arenaId = interaction.options.getString('arena');
      const arena = ARENAS[arenaId];
      arena.holder = null; arena.holderName = null;
      await interaction.reply({ embeds: [new EmbedBuilder().setTitle('🏟️ Arena Reset!').setDescription(`**${arena.name}** is now unclaimed again!`).setColor(arena.color)] });
    }

    else if (commandName === 'announce') {
      if (!isOp(interaction)) return interaction.reply({ content: '❌ No permission.', ephemeral: true });
      const message = interaction.options.getString('message');
      const embed = new EmbedBuilder().setTitle('📢 TFCImon Announcement').setDescription(message).setColor(0xfdcb6e).setFooter({ text: `From: ${interaction.user.displayName}` });
      await interaction.reply({ embeds: [embed] });
    }
  }

  // ─── BUTTONS ─────────────────────────────────────────────────────────────────

  else if (interaction.isButton()) {
    const customId = interaction.customId;
    const userId = interaction.user.id;
    const player = getPlayer(userId);

    // AH Buy button
    if (customId.startsWith('ah_buy_')) {
      const listingId = parseInt(customId.replace('ah_buy_', ''));
      const listing = auctionListings.get(listingId);
      if (!listing) return interaction.reply({ content: '❌ This listing no longer exists.', ephemeral: true });
      if (listing.sellerId === userId) return interaction.reply({ content: "❌ You can't buy your own listing!", ephemeral: true });
      if (player.gems < listing.price) return interaction.reply({ content: `❌ Not enough gems! Need ${listing.price}💎, you have ${player.gems}💎.`, ephemeral: true });

      player.gems -= listing.price;
      player.deck.push(listing.cardId);
      const sellerPlayer = getPlayer(listing.sellerId);
      sellerPlayer.gems += listing.price;
      auctionListings.delete(listingId);

      const card = CARDS[listing.cardId];
      await interaction.reply({ embeds: [new EmbedBuilder().setTitle('🏪 Purchase Complete!').setDescription(`${card.emoji} **${card.name}** bought for **${listing.price}💎**!\n**${listing.sellerName}** received the gems.`).setColor(0x00b894)] });
    }

    // AH Bid button
    else if (customId.startsWith('ah_bid_')) {
      const listingId = parseInt(customId.replace('ah_bid_', ''));
      const listing = auctionListings.get(listingId);
      if (!listing) return interaction.reply({ content: '❌ Listing not found.', ephemeral: true });
      if (listing.sellerId === userId) return interaction.reply({ content: "❌ You can't bid on your own listing!", ephemeral: true });

      const minBid = (listing.currentBid || listing.bidPrice) + 1;
      if (player.gems < minBid) return interaction.reply({ content: `❌ Minimum bid is ${minBid}💎, you have ${player.gems}💎.`, ephemeral: true });

      // Refund previous bidder
      if (listing.highestBidder) {
        const prevBidder = getPlayer(listing.highestBidder);
        prevBidder.gems += listing.currentBid;
      }

      player.gems -= minBid;
      listing.currentBid = minBid;
      listing.highestBidder = userId;
      listing.highestBidderName = interaction.user.displayName;

      const card = CARDS[listing.cardId];
      await interaction.reply({ embeds: [new EmbedBuilder().setTitle('🏷️ Bid Placed!').setDescription(`You bid **${minBid}💎** on ${card.emoji} **${card.name}**!\nYou are now the highest bidder.`).setColor(0x6c5ce7)] });
    }

    // PvP accept/decline
    else if (customId.startsWith('accept_') || customId.startsWith('decline_')) {
      const battleId = customId.replace('accept_', '').replace('decline_', '');
      const battle = activeBattles.get(battleId);
      if (!battle) return interaction.reply({ content: '❌ This battle expired.', ephemeral: true });
      if (interaction.user.id !== battle.opponent.id) return interaction.reply({ content: '❌ Only the challenged player can respond!', ephemeral: true });

      if (customId.startsWith('decline_')) {
        activeBattles.delete(battleId);
        return interaction.update({ content: `❌ ${battle.opponent.name} declined the battle.`, embeds: [], components: [] });
      }
      battle.accepted = true;
      await interaction.update({ components: [] });
      await sendBattleState(interaction.channel, battle, CARDS[battle.challenger.cardId], CARDS[battle.opponent.cardId], battleId);
    }

    // PvP move buttons
    else if (customId.startsWith('move_') && !customId.includes('arena')) {
      const parts = customId.split('_');
      const moveIndex = parseInt(parts[parts.length - 1]);
      const battleId = parts.slice(1, parts.length - 1).join('_');
      const battle = activeBattles.get(battleId);
      if (!battle) return interaction.reply({ content: '❌ Battle not found.', ephemeral: true });
      if (interaction.user.id !== battle.turn) return interaction.reply({ content: "❌ It's not your turn!", ephemeral: true });

      const isChallenger = interaction.user.id === battle.challenger.id;
      const attacker = isChallenger ? battle.challenger : battle.opponent;
      const defender = isChallenger ? battle.opponent : battle.challenger;
      const move = CARDS[attacker.cardId].moves[moveIndex];
      if (!move) return interaction.reply({ content: '❌ Invalid move.', ephemeral: true });
      if (attacker.energy < move.cost) return interaction.reply({ content: `❌ Need ${move.cost}⚡, have ${attacker.energy}⚡.`, ephemeral: true });

      attacker.energy -= move.cost;
      defender.hp = Math.max(0, defender.hp - move.damage);
      attacker.energy = Math.min(attacker.energy + 1, 6);
      defender.energy = Math.min(defender.energy + 1, 6);
      battle.turn = defender.id;

      await interaction.update({ components: [] });

      if (defender.hp <= 0) {
        activeBattles.delete(battleId);
        const wp = getPlayer(attacker.id);
        wp.gems += 25;
        return interaction.channel.send({ embeds: [new EmbedBuilder().setTitle('🏆 Battle Over!').setDescription(`**${attacker.name}** wins! +25💎 gems!\n${move.emoji} **${move.name}** dealt **${move.damage}** as the finishing blow!`).setColor(0xf1c40f)] });
      }

      await sendBattleState(interaction.channel, battle, CARDS[battle.challenger.cardId], CARDS[battle.opponent.cardId], battleId,
        `${move.emoji} **${attacker.name}** used **${move.name}** → **${move.damage}** damage!`);
    }

    // Arena move buttons
    else if (customId.includes('arena')) {
      const parts = customId.split('_');
      const moveIndex = parseInt(parts[parts.length - 1]);
      const battleId = parts.slice(1, parts.length - 1).join('_');
      const ab = activeArenaBattles.get(battleId);
      if (!ab) return interaction.reply({ content: '❌ Arena battle not found.', ephemeral: true });
      if (interaction.user.id !== ab.userId) return interaction.reply({ content: '❌ Not your battle!', ephemeral: true });

      const card = CARDS[ab.cardId];
      const arena = ARENAS[ab.arenaId];
      const move = card.moves[moveIndex];
      if (!move) return interaction.reply({ content: '❌ Invalid move.', ephemeral: true });
      if (ab.playerEnergy < move.cost) return interaction.reply({ content: `❌ Need ${move.cost}⚡, have ${ab.playerEnergy}⚡.`, ephemeral: true });

      ab.playerEnergy -= move.cost;
      ab.guardianHp = Math.max(0, ab.guardianHp - move.damage);
      ab.playerEnergy = Math.min(ab.playerEnergy + 1, 6);
      ab.guardianEnergy = Math.min(ab.guardianEnergy + 1, 6);

      await interaction.update({ components: [] });
      const playerLog = `${move.emoji} **${ab.userName}** used **${move.name}** → **${move.damage}** damage!`;

      if (ab.guardianHp <= 0) {
        activeArenaBattles.delete(battleId);
        const wasHolderName = arena.holderName;
        arena.holder = ab.userId; arena.holderName = ab.userName;
        const wp = getPlayer(ab.userId); wp.gems += 50;
        return interaction.channel.send({ embeds: [new EmbedBuilder().setTitle(`${arena.emoji} Arena Conquered!`).setDescription(`👑 **${ab.userName}** defeated **${arena.guardian.name}** and claimed **${arena.name}**! +50💎\n${wasHolderName ? `*${wasHolderName} has lost their arena.*` : '*First time claimed!*'}`).setColor(0xf1c40f)] });
      }

      const guardianMove = aiPickMove(arena.guardian, ab.guardianEnergy);
      ab.guardianEnergy -= guardianMove.cost;
      ab.playerHp = Math.max(0, ab.playerHp - guardianMove.damage);
      ab.guardianEnergy = Math.min(ab.guardianEnergy + 1, 6);
      ab.playerEnergy = Math.min(ab.playerEnergy + 1, 6);
      const guardianLog = `${guardianMove.emoji} **${arena.guardian.name}** used **${guardianMove.name}** → **${guardianMove.damage}** damage!`;

      if (ab.playerHp <= 0) {
        activeArenaBattles.delete(battleId);
        return interaction.channel.send({ embeds: [new EmbedBuilder().setTitle(`${arena.emoji} Defeated!`).setDescription(`💀 **${ab.userName}** was defeated by **${arena.guardian.name}**!\n*${arena.holder ? `Arena stays with **${arena.holderName}**` : 'Arena stays unclaimed'}.*`).setColor(0xe74c3c)] });
      }

      await sendArenaBattleState(interaction.channel, battleId, `${playerLog}\n${guardianLog}`);
    }
  }
});

// ─── BATTLE STATE HELPERS ─────────────────────────────────────────────────────

async function sendBattleState(channel, battle, cCard, oCard, battleId, lastAction = null) {
  const cur = battle.turn === battle.challenger.id ? battle.challenger : battle.opponent;
  const curCard = CARDS[cur.cardId];
  const embed = new EmbedBuilder().setTitle('⚔️ TFCImon Battle!').setColor(0x2ecc71)
    .addFields(
      { name: `${cCard.emoji} ${battle.challenger.name} — ${cCard.name}`, value: `❤️ \`${hpBar(battle.challenger.hp, cCard.hp)}\`\n⚡ ${battle.challenger.energy}` },
      { name: `${oCard.emoji} ${battle.opponent.name} — ${oCard.name}`, value: `❤️ \`${hpBar(battle.opponent.hp, oCard.hp)}\`\n⚡ ${battle.opponent.energy}` },
    ).setFooter({ text: `🎮 ${cur.name}'s turn!` });
  if (lastAction) embed.setDescription(lastAction);

  const row = new ActionRowBuilder();
  for (let i = 0; i < curCard.moves.length; i++) {
    const m = curCard.moves[i];
    row.addComponents(new ButtonBuilder().setCustomId(`move_${battleId}_${i}`).setLabel(`${m.emoji} ${m.name} (${m.cost}⚡, ${m.damage}dmg)`).setStyle(m.isEx ? ButtonStyle.Danger : ButtonStyle.Primary).setDisabled(cur.energy < m.cost));
  }
  await channel.send({ embeds: [embed], components: [row] });
}

async function sendArenaBattleState(channel, battleId, lastAction = null) {
  const ab = activeArenaBattles.get(battleId);
  if (!ab) return;
  const card = CARDS[ab.cardId];
  const arena = ARENAS[ab.arenaId];
  const embed = new EmbedBuilder().setTitle(`${arena.emoji} ${arena.name} — Arena Battle!`).setColor(arena.color)
    .addFields(
      { name: `${card.emoji} ${ab.userName} — ${card.name}`, value: `❤️ \`${hpBar(ab.playerHp, card.hp)}\`\n⚡ ${ab.playerEnergy}` },
      { name: `${arena.guardian.emoji} ${arena.guardian.name}`, value: `❤️ \`${hpBar(ab.guardianHp, arena.guardian.hp)}\`\n⚡ ${ab.guardianEnergy}` },
    ).setFooter({ text: `Your turn, ${ab.userName}!` });
  if (lastAction) embed.setDescription(lastAction);

  const row = new ActionRowBuilder();
  for (let i = 0; i < card.moves.length; i++) {
    const m = card.moves[i];
    row.addComponents(new ButtonBuilder().setCustomId(`move_${battleId}_${i}`).setLabel(`${m.emoji} ${m.name} (${m.cost}⚡, ${m.damage}dmg)`).setStyle(m.isEx ? ButtonStyle.Danger : ButtonStyle.Primary).setDisabled(ab.playerEnergy < m.cost));
  }
  await channel.send({ embeds: [embed], components: [row] });
}

// ─── START ────────────────────────────────────────────────────────────────────

(async () => {
  await registerCommands();
  await client.login(BOT_TOKEN);
})();