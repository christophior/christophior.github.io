// Catalog for the Quie Collectibles redesign prototype.
// Prices, set codes and copy come from the design boards; placeholder answers
// in brackets are still waiting on Mario.

window.QUIE = (function () {
	const FREE_SHIP = 100;

	const LANGS = {
		japanese: {
			key: 'japanese', name: 'Japanese', short: 'Japanese', native: '日本語', cls: 'jp',
			dot: '#D3262E', navDot: '#E0383F', mDot: '#FF6B70', text: '#D3262E', tint: '#FCE9EA', tintText: '#A11D24',
			tile: 'eevee-starter', label: 'Japanese', blurb: 'Factory-sealed Japanese decks and premium sets. Every listing shows the set, what is inside and the box condition.'
		},
		korean: {
			key: 'korean', name: 'Korean', short: 'Korean', native: '한국어', cls: 'kr',
			dot: '#1D5FD1', navDot: '#3B7BEA', mDot: '#7BA6FF', text: '#1D5FD1', tint: '#E7EEFC', tintText: '#1D5FD1',
			tile: 'mega-inferno-x', label: 'Korean', blurb: 'Factory-sealed Korean booster boxes from the MEGA series. Every listing shows the set, the pack count and the box condition.'
		},
		chinese: {
			key: 'chinese', name: 'Simplified Chinese', short: 'S. Chinese', native: '简体中文', cls: 'sc',
			dot: '#F2A900', navDot: '#F2A900', mDot: '#F2A900', text: '#A66B00', tint: '#FDF3D9', tintText: '#7A4F00',
			tile: 'gem-pack-6', label: 'S. Chinese', blurb: 'Simplified Chinese boxes, including China-only sets like Gem Pack. Every listing shows the set, the pack count and the box condition.'
		},
		english: {
			key: 'english', name: 'English', short: 'English', native: 'English', cls: 'disp',
			dot: '#2FB344', navDot: '#2FB344', mDot: '#2FB344', text: '#1C7F2E', tint: '#E3F5E6', tintText: '#1C7F2E',
			tile: 'english', label: 'English prints', blurb: 'English prints for players and collectors who want cards they can read at a glance.'
		}
	};

	const TYPES = {
		booster: 'Booster box',
		decks: 'Starter & premium decks',
		blisters: 'Blisters & portfolios',
		comics: 'Comics',
		funko: 'Funko & figures',
		quie: 'Made by Quie',
		sleeves: 'Card sleeves',
		toploaders: 'Toploaders'
	};

	const PRICES = {
		under60: { label: 'Under $60', test: (p) => p < 60 },
		'60to80': { label: '$60 – $80', test: (p) => p >= 60 && p <= 80 },
		over80: { label: '$80 and up', test: (p) => p > 80 }
	};

	const CONDITIONS = {
		sealed: 'Sealed, mint box',
		dented: 'Dented box, sealed packs'
	};

	const CATEGORIES = {
		pokemon: { title: 'Pokémon TCG', blurb: 'Factory-sealed booster boxes and decks in four languages.' },
		collectibles: { title: 'Comics & collectibles', blurb: 'Comic variants, Funko and card-art magnets made by Quie.' },
		supplies: { title: 'Supplies', blurb: 'Sleeves and toploaders to protect the pulls. Everything counts toward free shipping.' },
		new: { title: 'New this week', blurb: 'Just landed in Plano. Japanese, Korean and Chinese boxes go fast.' },
		all: { title: 'Shop everything', blurb: 'Every sealed box, deck and collectible in the shop.' },
		saved: { title: 'Saved items', blurb: 'Products you hearted. Saved in this browser.' },
		search: { title: 'Search', blurb: '' }
	};

	const PRODUCTS = [
		{
			id: 'crystal-gathering', name: 'Crystal Gathering Booster Box', short: 'Crystal Gathering',
			lang: 'chinese', cat: 'pokemon', type: 'booster', price: 74.99, condition: 'sealed', isNew: true,
			setCode: 'CSV9.5C', set: 'Crystal Gathering', sub: 'CSV9.5C · 10 packs × 10 cards', contents: '10 booster packs · 10 cards per pack',
			img: 'crystal-gathering', gallery: ['crystal-gathering-lg', 'crystal-gathering-cards-1', 'crystal-gathering-cards-2'],
			galleryAlt: ['Crystal Gathering booster box with the exclusive Sylveon ex card', 'Example cards from Crystal Gathering, part 1', 'Example cards from Crystal Gathering, part 2'],
			desc: 'A Simplified Chinese set built around Eevee and its evolutions. Ten sealed packs, ten cards each.',
			pullNote: 'The exclusive Sylveon ex SAR is a possible pull. It isn\'t guaranteed in any box.',
			relatedTitle: 'More Eevee, more languages', related: ['eevee-starter', 'premium-deck-set', 'chasing-glory', 'gem-pack-6']
		},
		{
			id: 'premium-deck-set', name: '30th Celebration Premium Deck Set: Espeon & Umbreon', short: 'Premium Deck Set',
			lang: 'japanese', cat: 'pokemon', type: 'decks', price: 189.99, condition: 'sealed', isNew: true,
			setCode: null, set: '30th Celebration', sub: '2 decks · tin case · playmat', contents: '2 decks · tin case · playmat',
			img: 'premium-deck-set', gallery: ['premium-deck-set-lg'],
			desc: 'A 30th Celebration premium set with Espeon and Umbreon decks, a tin case and a playmat.'
		},
		{
			id: 'mega-dream', name: 'MEGA Dream ex Booster Box', short: 'MEGA Dream ex',
			lang: 'korean', cat: 'pokemon', type: 'booster', price: 109.99, condition: 'sealed', isNew: true,
			setCode: 'M2a', set: 'MEGA Dream ex', sub: 'M2a · 10 packs × 10 cards', contents: '10 booster packs · 10 cards per pack',
			img: 'mega-dream', gallery: ['mega-dream-lg'],
			desc: 'Korean MEGA Dream ex booster box. Ten sealed packs, ten cards each.'
		},
		{
			id: 'gem-pack-6', name: 'Gem Pack Vol. 6 Booster Box', short: 'Gem Pack Vol. 6',
			lang: 'chinese', cat: 'pokemon', type: 'booster', price: 32.99, condition: 'dented', isNew: true,
			setCode: 'CBB6C', set: 'Gem Pack Vol. 6', sub: 'CBB6C · 18 packs × 4 foils', contents: '18 packs · 4 foils per pack',
			img: 'gem-pack-6',
			desc: 'A Simplified Chinese Gem Pack box. Eighteen sealed packs, four foils each.',
			conditionNote: 'The outer box is dented. All 18 packs are factory sealed. [Photo of the dent]'
		},
		{
			id: 'mega-inferno-x', name: 'MEGA Inferno X Booster Box', short: 'MEGA Inferno X',
			lang: 'korean', cat: 'pokemon', type: 'booster', price: 74.99, condition: 'sealed',
			setCode: null, set: 'MEGA Inferno X', sub: 'MEGA series · booster box', contents: '[Pack count]',
			img: 'mega-inferno-x', desc: 'Korean MEGA series booster box. [Set notes]'
		},
		{
			id: 'mega-storm-emeralda', name: 'MEGA Storm Emeralda Booster Box', short: 'MEGA Storm Emeralda',
			lang: 'korean', cat: 'pokemon', type: 'booster', price: 69.99, condition: 'sealed',
			setCode: null, set: 'MEGA Storm Emeralda', sub: 'MEGA series · booster box', contents: '[Pack count]',
			img: 'mega-storm-emeralda', desc: 'Korean MEGA series booster box. [Set notes]'
		},
		{
			id: 'mega-symphonia', name: 'MEGA Mega Symphonia Booster Box', short: 'MEGA Mega Symphonia',
			lang: 'korean', cat: 'pokemon', type: 'booster', price: 64.99, condition: 'sealed',
			setCode: null, set: 'Mega Symphonia', sub: 'MEGA series · booster box', contents: '[Pack count]',
			img: 'mega-symphonia', desc: 'Korean MEGA series booster box. [Set notes]'
		},
		{
			id: 'mega-abyss-eye', name: 'MEGA Abyss Eye Booster Box', short: 'MEGA Abyss Eye',
			lang: 'korean', cat: 'pokemon', type: 'booster', price: 59.99, condition: 'sealed',
			setCode: null, set: 'Abyss Eye', sub: 'MEGA series · booster box', contents: '[Pack count]',
			img: 'mega-abyss-eye', desc: 'Korean MEGA series booster box. [Set notes]'
		},
		{
			id: 'mega-ninja-spinner', name: 'MEGA Ninja Spinner Booster Box', short: 'MEGA Ninja Spinner',
			lang: 'korean', cat: 'pokemon', type: 'booster', price: 54.99, condition: 'sealed',
			setCode: null, set: 'Ninja Spinner', sub: 'MEGA series · booster box', contents: '[Pack count]',
			img: 'mega-ninja-spinner', desc: 'Korean MEGA series booster box. [Set notes]'
		},
		{
			id: 'eevee-starter', name: 'MEGA Starter Set ex: Eevee ex', short: 'Eevee ex starter set',
			lang: 'japanese', cat: 'pokemon', type: 'decks', price: 34.99, condition: 'sealed',
			setCode: null, set: 'MEGA Starter Set ex', sub: 'Starter deck · ready to play', contents: '[Deck contents]',
			img: 'eevee-starter', desc: 'A Japanese MEGA starter set built around Eevee ex. [Deck notes]'
		},
		{
			id: 'chasing-glory', name: 'Chasing Glory Together Slim Box', short: 'Chasing Glory Together',
			lang: 'chinese', cat: 'pokemon', type: 'booster', price: 34.99, condition: 'sealed',
			setCode: null, set: 'Chasing Glory Together', sub: 'Slim booster box', contents: '[Pack count]',
			img: 'chasing-glory', desc: 'A Simplified Chinese slim booster box. [Set notes]'
		},
		{
			id: 'english-blister', name: 'Blister Pack with Promo Cards', short: 'Promo blister',
			lang: 'english', cat: 'pokemon', type: 'blisters', price: 14.99, condition: 'sealed',
			setCode: null, set: '[Set name]', sub: 'Blister with promo cards', contents: '[Pack count] · promo cards',
			img: 'english', desc: 'English blister with promo cards on display. [Set notes]'
		},
		{
			id: 'comic-batman-superman', name: 'Batman / Superman, Legion of Collectors variant', short: 'Batman / Superman comic',
			lang: null, cat: 'collectibles', type: 'comics', price: 4.99, condition: 'sealed',
			sub: 'Legion of Collectors variant', contents: '1 comic · bagged and boarded',
			img: 'comics', desc: 'Legion of Collectors variant cover. Bagged and boarded.'
		},
		{
			id: 'funko-dorbz-flash', name: 'Dorbz: The Flash, chase edition', short: 'Dorbz Flash chase',
			lang: null, cat: 'collectibles', type: 'funko', price: 7.99, condition: 'sealed',
			sub: 'Limited chase edition', contents: '1 vinyl figure · window box',
			img: 'funko', desc: 'Limited chase edition Dorbz in the original window box.'
		},
		{
			id: 'magnet', name: 'Card-art magnet', short: 'Card-art magnet',
			lang: null, cat: 'collectibles', type: 'quie', price: 4.99, condition: 'sealed', madeByQuie: true,
			sub: 'Made by Quie · assorted art', contents: '1 magnet · art picked at random',
			img: 'magnet', desc: 'Magnets made by Quie from card art. [Art selection details]'
		},
		{
			id: 'sleeves', name: 'Standard sleeves, 1,000 ct', short: 'Sleeves',
			lang: null, cat: 'supplies', type: 'sleeves', price: 9.99, condition: 'sealed',
			sub: '1,000 count · standard size', contents: '1,000 penny sleeves',
			img: 'sleeves', desc: 'Clear penny sleeves for standard-size cards.'
		},
		{
			id: 'toploaders', name: 'Toploaders + penny sleeves', short: 'Toploaders',
			lang: null, cat: 'supplies', type: 'toploaders', price: 16.99, condition: 'sealed',
			sub: '100 count each', contents: '100 toploaders · 100 penny sleeves',
			img: 'toploaders', desc: 'Rigid toploaders with matching penny sleeves for your best pulls.'
		}
	];

	const byId = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]));

	return { FREE_SHIP, LANGS, TYPES, PRICES, CONDITIONS, CATEGORIES, PRODUCTS, byId };
})();
