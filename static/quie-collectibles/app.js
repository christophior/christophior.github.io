// Quie Collectibles redesign prototype.
// Hash-routed so it runs on GitHub Pages without server rewrites:
//   #/                      home
//   #/shop/<lang|category>  collection (filters live in the query string)
//   #/product/<id>          product page
//   #/search?q=…            search results
//   #/saved                 wishlist

(function () {
	const { FREE_SHIP, LANGS, TYPES, PRICES, CONDITIONS, CATEGORIES, PRODUCTS, byId } = window.QUIE;

	// ---------- helpers ----------
	const $ = (s, r = document) => r.querySelector(s);
	const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
	const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
	const money = (n) => '$' + n.toFixed(2);
	const img = (name) => `assets/${name}.${name === 'logo' ? 'png' : 'jpg'}`;
	const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;

	const P = {
		search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
		user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',
		heart: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
		bag: '<path d="M5 8h14l-1 12H6L5 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
		chev: '<path d="m6 9 6 6 6-6"/>',
		arrow: '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
		truck: '<path d="M3 6h11v10H3z"/><path d="M14 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
		shield: '<path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3z"/><path d="m9 12 2 2 4-4"/>',
		chat: '<path d="M4 5h16v11H8l-4 4V5z"/><path d="M8 9h8"/><path d="M8 12h5"/>',
		minus: '<path d="M5 12h14"/>',
		plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
		faq: '<path d="M5 12h14"/><path class="vbar" d="M12 5v14"/>',
		x: '<path d="M6 6l12 12"/><path d="M18 6 6 18"/>',
		menu: '<path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h10"/>',
		info: '<circle cx="12" cy="12" r="9"/><path d="M12 8h.01"/><path d="M11 12h1v5h1"/>',
		check: '<path d="m5 12 5 5 9-10"/>',
		left: '<path d="m15 6-6 6 6 6"/>',
		right: '<path d="m9 6 6 6-6 6"/>',
		filter: '<path d="M4 6h16"/><path d="M7 12h10"/><path d="M10 18h4"/>'
	};
	const ic = (name, size = 18, sw = 2, attrs = '') =>
		`<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${attrs}>${P[name]}</svg>`;

	const store = {
		get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
		set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* private mode */ } },
		clear() { try { localStorage.removeItem('quie.cart'); localStorage.removeItem('quie.saved'); } catch (e) { /* ignore */ } }
	};

	// Re-rendering swaps DOM nodes; data-fkey lets focus land back on the equivalent control.
	function keepFocus(fn) {
		const key = document.activeElement && document.activeElement.dataset ? document.activeElement.dataset.fkey : null;
		fn();
		if (key) { const n = document.querySelector(`[data-fkey="${CSS.escape(key)}"]`); if (n) n.focus({ preventScroll: true }); }
	}

	// ---------- state ----------
	let cart = store.get('quie.cart', []).filter((l) => byId[l.id] && l.qty > 0);
	const saved = new Set(store.get('quie.saved', []).filter((id) => byId[id]));
	let route = null;
	let collection = null; // current collection state, when on a collection page
	let homeLang = 'all';
	let pqty = 1;
	let gIndex = 0;

	const cartCount = () => cart.reduce((n, l) => n + l.qty, 0);
	const subtotal = () => cart.reduce((s, l) => s + byId[l.id].price * l.qty, 0);
	const freeShipPct = (total) => Math.min(100, Math.round((total / FREE_SHIP) * 100));

	function saveCart() {
		store.set('quie.cart', cart);
		updateBadges(true);
		keepFocus(renderCart);
		if (route && route.name === 'product') updateShipbox();
	}

	function addToCart(id, qty = 1) {
		const line = cart.find((l) => l.id === id);
		if (line) line.qty = Math.min(line.qty + qty, 9);
		else cart.push({ id, qty });
		saveCart();
	}

	function setQty(id, qty) {
		if (qty <= 0) cart = cart.filter((l) => l.id !== id);
		else { const line = cart.find((l) => l.id === id); if (line) line.qty = Math.min(qty, 9); }
		saveCart();
	}

	function toggleSaved(id) {
		if (saved.has(id)) saved.delete(id); else saved.add(id);
		store.set('quie.saved', Array.from(saved));
		$$(`.heart[data-id="${id}"]`).forEach((b) => {
			b.setAttribute('aria-pressed', saved.has(id));
			b.setAttribute('aria-label', `${saved.has(id) ? 'Remove' : 'Save'} ${byId[id].short} ${saved.has(id) ? 'from' : 'to'} wishlist`);
		});
		updateBadges();
		toast(saved.has(id) ? `Saved ${byId[id].short}` : `Removed ${byId[id].short}`, saved.has(id) ? { label: 'View saved', href: '#/saved' } : null);
		if (route && route.name === 'saved') renderRoute(false);
	}

	// ---------- search ----------
	function haystack(p) {
		const L = p.lang ? LANGS[p.lang] : null;
		return [p.name, p.sub, p.setCode, p.set, TYPES[p.type], CATEGORIES[p.cat].title, L && L.name, L && L.native, L && L.short, p.lang === 'chinese' ? 'chinese china' : '']
			.filter(Boolean).join(' ').toLowerCase();
	}
	function searchProducts(q) {
		const terms = q.toLowerCase().trim().split(/\s+/).filter(Boolean);
		if (!terms.length) return [];
		return PRODUCTS.filter((p) => { const h = haystack(p); return terms.every((t) => h.includes(t)); });
	}

	// ---------- shared bits ----------
	function langChip(p, extra = '') {
		if (p.lang) { const L = LANGS[p.lang]; return `<span class="chip ${extra}"><span class="dot" style="background:${L.dot}"></span>${L.short}</span>`; }
		if (p.madeByQuie) return `<span class="chip chip--dark ${extra}">Made by Quie</span>`;
		return '';
	}

	function heartBtn(p) {
		const on = saved.has(p.id);
		return `<button class="heart" type="button" data-action="save" data-id="${p.id}" data-fkey="save:${p.id}" aria-pressed="${on}" aria-label="${on ? 'Remove' : 'Save'} ${esc(p.short)} ${on ? 'from' : 'to'} wishlist">${ic('heart', 18)}</button>`;
	}

	function addBtn(p) {
		return `<button class="add" type="button" data-action="add" data-id="${p.id}" aria-label="Add ${esc(p.short)} to cart"><span class="lbl">Add</span><span class="ico" style="display:none">${ic('plus', 16, 2.4)}</span></button>`;
	}

	function card(p) {
		return `<div class="card">
			<div class="card-media">
				<a href="#/product/${p.id}" tabindex="-1" aria-hidden="true"><img src="${img(p.img)}" alt="" loading="lazy"></a>
				${langChip(p)}
				${p.condition === 'dented' ? '<span class="chip chip--dark chip--cond">Dented box · sealed packs</span>' : ''}
				${heartBtn(p)}
			</div>
			<div class="card-body">
				<a class="card-title" href="#/product/${p.id}">${esc(p.name)}</a>
				<span class="card-sub mono">${esc(p.sub)}</span>
				<div class="card-row"><span class="price">${money(p.price)}</span>${addBtn(p)}</div>
			</div>
		</div>`;
	}

	const langCount = (k) => PRODUCTS.filter((p) => p.lang === k).length;

	// ---------- header / footer ----------
	function renderHeader() {
		const navLang = (k) => { const L = LANGS[k]; return `<a class="navlink" href="#/shop/${k}" data-nav="${k}" style="--accent:${L.navDot}"><span class="dot" style="background:${L.navDot}"></span>${L.short}</a>`; };
		const lchip = (k, label) => { const L = LANGS[k]; return `<a class="lchip" href="#/shop/${k}" data-nav="${k}" style="--accent:${L.mDot}">${label}</a>`; };
		$('#hdr').innerHTML = `
			<div class="wrap hdr-top">
				<button class="ibtn m-only m-menu" type="button" data-action="open-menu" aria-label="Open menu">${ic('menu', 24)}</button>
				<a class="logo" href="#/" aria-label="Quie Collectibles home"><img src="${img('logo')}" alt="Quie Collectibles" width="86" height="48"></a>
				<div class="search" id="search">
					<label for="q">
						${ic('search', 18)}
						<input id="q" type="search" placeholder="Search sets, set codes or languages" autocomplete="off" role="combobox" aria-expanded="false" aria-controls="searchPop" aria-autocomplete="list">
						<span class="kbd mono d-only" aria-hidden="true">/</span>
						<button class="search-x" type="button" data-action="close-search" aria-label="Close search">${ic('x', 18, 2.2)}</button>
					</label>
					<div class="search-pop" id="searchPop" role="listbox" hidden></div>
				</div>
				<nav class="hdr-actions" aria-label="Account">
					<button class="ibtn d-only" type="button" data-action="soon" data-what="Accounts" aria-label="Account">${ic('user', 22, 1.8)}</button>
					<a class="ibtn d-only" href="#/saved" id="savedBtn" aria-label="Saved items">${ic('heart', 22, 1.8)}<span class="badge" id="savedBadge" hidden></span></a>
					<button class="ibtn" type="button" data-action="open-cart" id="cartBtn" aria-label="Cart">${ic('bag', 22, 1.8)}<span class="badge" id="cartBadge" hidden></span></button>
				</nav>
			</div>
			<div class="navrow">
				<nav class="wrap shopnav" aria-label="Shop">
					<button class="navlink" type="button" id="shopBtn" data-action="toggle-mega" aria-expanded="false" aria-controls="mega">Shop ${ic('chev', 14, 2.4)}</button>
					<span class="navsep" aria-hidden="true"></span>
					${Object.keys(LANGS).map(navLang).join('')}
					<span class="navsep" aria-hidden="true"></span>
					<a class="navlink" href="#/shop/collectibles" data-nav="collectibles">Comics &amp; collectibles</a>
					<a class="navlink" href="#/shop/supplies" data-nav="supplies">Supplies</a>
					<a class="navlink navlink--new" href="#/shop/new" data-nav="new">New this week</a>
				</nav>
			</div>
			<nav class="lchips m-only" aria-label="Shop by language">
				${lchip('japanese', '<span class="jp" style="color:#FF6B70">日本語</span>Japanese')}
				${lchip('korean', '<span class="kr" style="color:#7BA6FF">한국어</span>Korean')}
				${lchip('chinese', '<span class="sc" style="color:#F2A900">简体中文</span>Chinese')}
				${lchip('english', '<span style="color:#2FB344;font-weight:800">EN</span>English')}
			</nav>
			<div class="mega" id="mega" hidden>${megaMenu()}</div>`;
	}

	function langRow(k) {
		const L = LANGS[k];
		const native = k === 'english'
			? `<span class="native disp" style="font-size:13px;font-weight:700;color:${L.text}">ENG</span>`
			: `<span class="native ${L.cls}" style="color:${L.text};${k === 'chinese' ? 'font-size:18px' : ''}">${L.native}</span>`;
		return `<a class="langrow" href="#/shop/${k}">${native}<span class="nm">${L.name}</span><span class="mono">${langCount(k)}</span></a>`;
	}

	function megaMenu() {
		const cat = (c, t) => PRODUCTS.filter((p) => p.cat === c && (!t || p.type === t)).length;
		const justIn = byId['crystal-gathering'];
		return `<div class="wrap"><div class="mega-panel" role="region" aria-label="Shop menu">
			<div class="mcol"><span class="colhead">By language</span><div class="mlinks" style="gap:8px">${Object.keys(LANGS).map(langRow).join('')}</div></div>
			<div class="mcol"><span class="colhead">Pokémon TCG</span><div class="mlinks">
				<a class="mlink" href="#/shop/pokemon?type=booster">Booster boxes</a>
				<a class="mlink" href="#/shop/pokemon?type=decks">Starter &amp; premium decks</a>
				<a class="mlink" href="#/shop/pokemon?type=blisters">Blisters &amp; portfolios</a>
				<a class="mlink" href="#/shop/pokemon?cond=dented">Dented box deals</a>
				<a class="mlink mlink--all" href="#/shop/pokemon">All Pokémon ${ic('arrow', 16, 2.2)}</a>
			</div></div>
			<div class="mcol"><span class="colhead">Beyond the cards</span><div class="mlinks">
				<a class="mlink" href="#/shop/collectibles?type=comics">Comics <span class="mono">${cat('collectibles', 'comics')}</span></a>
				<a class="mlink" href="#/shop/collectibles?type=funko">Funko &amp; figures <span class="mono">${cat('collectibles', 'funko')}</span></a>
				<a class="mlink" href="#/shop/collectibles?type=quie">Made by Quie: magnets &amp; keychains</a>
			</div></div>
			<div class="mcol mcol--supplies"><span class="colhead">Supplies</span><div class="mlinks">
				<a class="mlink" href="#/shop/supplies?type=sleeves">Card sleeves</a>
				<a class="mlink" href="#/shop/supplies?type=toploaders">Toploaders</a>
				<a class="mlink mlink--all" href="#/shop/supplies">All supplies ${ic('arrow', 16, 2.2)}</a>
			</div></div>
			<a class="justin" href="#/product/${justIn.id}">
				<span class="eyebrow" style="font-size:11px">Just in</span>
				<div style="display:flex;gap:14px;align-items:center">
					<img src="${img(justIn.img)}" alt="">
					<div style="display:flex;flex-direction:column;gap:6px;min-width:0">
						<span style="font:700 16px/1.3 Figtree,sans-serif">${esc(justIn.name)}</span>
						<span style="display:inline-flex;align-items:center;gap:6px;font:600 13px Figtree,sans-serif;color:#CFCFCF"><span class="dot" style="background:${LANGS[justIn.lang].dot}"></span>${LANGS[justIn.lang].name}</span>
						<span style="font:800 17px Figtree,sans-serif">${money(justIn.price)}</span>
					</div>
				</div>
			</a>
		</div></div>`;
	}

	function renderMobileMenu() {
		$('#mmenu').innerHTML = `
			<div class="sheet-head">
				<img src="${img('logo')}" alt="Quie Collectibles" style="height:36px;width:auto;background:#141414;border-radius:8px;padding:2px 6px">
				<button class="ibtn" type="button" data-action="close-sheets" aria-label="Close menu">${ic('x', 22, 2.2)}</button>
			</div>
			<div class="sheet-body"><div class="mmenu">
				<div class="mcol"><span class="colhead">By language</span><div class="mlinks" style="gap:8px">${Object.keys(LANGS).map(langRow).join('')}</div></div>
				<div class="mcol"><span class="colhead">Pokémon TCG</span><div class="mlinks">
					<a class="mlink" href="#/shop/new">New this week</a>
					<a class="mlink" href="#/shop/pokemon?type=booster">Booster boxes</a>
					<a class="mlink" href="#/shop/pokemon?type=decks">Starter &amp; premium decks</a>
					<a class="mlink" href="#/shop/pokemon?cond=dented">Dented box deals</a>
				</div></div>
				<div class="mcol"><span class="colhead">Beyond the cards</span><div class="mlinks">
					<a class="mlink" href="#/shop/collectibles">Comics &amp; collectibles</a>
					<a class="mlink" href="#/shop/supplies">Supplies</a>
				</div></div>
				<div class="mcol"><span class="colhead">You</span><div class="mlinks">
					<a class="mlink" href="#/saved">Saved items <span class="mono" id="mSavedCount"></span></a>
					<button class="mlink" type="button" data-action="soon" data-what="Accounts" style="border:0;background:none;padding:0;cursor:pointer;text-align:left">Account</button>
				</div></div>
				<div class="mcol"><span class="colhead">Help</span><div class="mlinks">
					${['Shipping', 'Damage claims', 'Cards FAQ', 'Contact'].map((t) => `<button class="mlink" type="button" data-action="soon" data-what="${t}" style="border:0;background:none;padding:0;cursor:pointer;text-align:left">${t}</button>`).join('')}
				</div></div>
				<div class="mcol"><span class="colhead" style="color:var(--green-ink)">Prototype</span><div class="mlinks">
					<button class="mlink" type="button" data-action="reset-demo" style="border:0;background:none;padding:0;cursor:pointer;text-align:left">Reset demo (clear cart &amp; saved)</button>
				</div></div>
			</div></div>`;
	}

	// One footer on every page. Link columns are accordions on mobile and
	// always open on desktop.
	function renderFooter(isHome) {
		const soon = (t) => `<a href="#" data-action="soon" data-what="${esc(t)}">${esc(t)}</a>`;
		const mobile = window.matchMedia('(max-width: 860px)').matches;
		const col = (title, links) => `<details class="fcol" ${mobile ? '' : 'open'}><summary class="colhead">${title}<span class="fcol-ic" aria-hidden="true">${ic('plus', 16, 2.2)}</span></summary><div class="fcol-links">${links}</div></details>`;
		const social = (label, icon) => `<a class="social" href="#" data-action="soon" data-what="${label}" aria-label="Quie on ${label}">${icon}</a>`;
		const IG = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/></svg>';
		const TT = '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6 0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64 0 3.33 2.76 5.7 5.69 5.7 3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48z"/></svg>';
		const iconLink = (label, icon) => `<a class="ilink" href="#" data-action="soon" data-what="${label}">${icon}<span>${label}</span></a>`;
		const pay = ['Shop Pay', 'PayPal', 'Apple Pay', 'G Pay', 'Visa', 'Mastercard', 'Amex'];
		$('#foot').innerHTML = `<div class="foot">
			<div class="wrap foot-top">
				<p class="foot-tag disp">Collecting speaks <em>every language.</em></p>
				<nav class="foot-langs" aria-label="Shop by language">
					${Object.keys(LANGS).map((k) => { const L = LANGS[k]; return `<a class="flang" href="#/shop/${k}"><span class="${k === 'english' ? '' : L.cls}" style="color:${L.mDot}">${k === 'english' ? 'EN' : L.native}</span>${L.short}</a>`; }).join('')}
				</nav>
			</div>
			<div class="wrap foot-main">
				<div class="foot-brand">
					<a href="#/" aria-label="Quie Collectibles home"><img src="${img('logo')}" alt="Quie Collectibles" width="100" height="56"></a>
					<p class="foot-blurb">Factory-sealed Pokémon TCG from Japan, Korea and China, plus comics and collectibles. Packed and shipped from Plano, Texas.</p>
					${isHome ? '' : `<form class="foot-form" id="footForm" novalidate>
						<label for="footEmail" class="colhead">Drop alerts</label>
						<div class="foot-form-row">
							<input id="footEmail" type="email" placeholder="you@email.com" autocomplete="email" required>
							<button type="submit" class="btn btn--green">Notify me</button>
						</div>
					</form>`}
					<div class="socials">
						${social('Instagram', IG)}
						${social('TikTok', TT)}
					</div>
				</div>
				${col('Shop', `${Object.keys(LANGS).map((k) => `<a href="#/shop/${k}">${LANGS[k].name}</a>`).join('')}<a href="#/shop/new">New this week</a><a href="#/shop/collectibles">Comics &amp; collectibles</a><a href="#/shop/supplies">Supplies</a>`)}
				${col('Help', soon('Shipping & delivery') + soon('Damage claims & returns') + soon('International cards FAQ') + soon('Track an order') + soon('Contact us'))}
				${col('Quie', soon('About Mario & Quie') + '<a href="#/saved">Saved items</a>' + iconLink('Instagram', IG) + iconLink('TikTok', TT))}
			</div>
			<div class="wrap foot-base">
				<div class="foot-legal"><span>© 2026 Quie Collectibles · Plano, TX</span>${soon('Privacy')}${soon('Terms')}${soon('Refund policy')}<button class="foot-reset" type="button" data-action="reset-demo">Reset prototype</button></div>
				<ul class="pays" aria-label="Accepted payment methods">${pay.map((p) => `<li>${p}</li>`).join('')}</ul>
			</div>
		</div>`;
	}

	let footIO = null;
	function watchFooter() {
		if (!('IntersectionObserver' in window)) return;
		if (footIO) footIO.disconnect();
		const pill = $('.proto');
		footIO = new IntersectionObserver(([e]) => pill.classList.toggle('is-hidden', e.isIntersecting));
		footIO.observe($('.foot-base'));
	}

	function updateBadges(bump) {
		const n = cartCount();
		const b = $('#cartBadge');
		b.textContent = n; b.hidden = n === 0;
		$('#cartBtn').setAttribute('aria-label', `Cart, ${plural(n, 'item')}`);
		if (bump && n) { b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); }
		const s = $('#savedBadge');
		s.textContent = saved.size; s.hidden = saved.size === 0;
		const m = $('#mSavedCount'); if (m) m.textContent = saved.size || '';
	}

	function updateNavCurrent() {
		let cur = null;
		if (route.name === 'collection') {
			const s = collection;
			cur = s.base === 'pokemon' && s.f.lang.size === 1 ? Array.from(s.f.lang)[0] : s.base;
		} else if (route.name === 'product') {
			const p = byId[route.id]; cur = p ? (p.lang || p.cat) : null;
		}
		$$('[data-nav]').forEach((a) => { if (a.dataset.nav === cur) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
	}

	// ---------- home ----------
	function renderHome() {
		const tile = (k) => {
			const L = LANGS[k];
			const native = k === 'english' ? `<span class="native disp" style="color:${L.text}">English</span>` : `<span class="native ${L.cls}" style="color:${L.text}">${L.native}</span>`;
			return `<a class="ltile" href="#/shop/${k}">
				<div class="ltile-copy">${native}<span class="nm">${k === 'chinese' ? '<span class="d-only">Simplified Chinese</span><span class="m-only">S. Chinese</span>' : L.label}</span><span class="ct mono">${plural(langCount(k), 'product')}</span></div>
				<img src="${img(L.tile)}" alt="" loading="lazy">
				<span class="go">${ic('arrow', 18, 2.2)}</span>
			</a>`;
		};
		const fromPrice = (filter) => money(Math.min(...PRODUCTS.filter(filter).map((p) => p.price)));
		$('#app').innerHTML = `
			<section class="hero"><div class="wrap">
				<div class="hero-copy">
					<span class="eyebrow">Sealed Pokémon TCG · 4 languages</span>
					<h1 class="disp">Pokémon from Japan, Korea and China. <em>Shipped from Texas.</em></h1>
					<p><span class="d-only">Factory-sealed booster boxes and decks in the languages most US shops skip, plus comics and collectibles.</span><span class="m-only">Factory-sealed boxes and decks in the languages most US shops skip.</span></p>
					<div class="hero-ctas">
						<a class="btn btn--green" href="#/shop/pokemon">Shop by language ${ic('arrow', 18, 2.2)}</a>
						<a class="btn btn--ghost" href="#/shop/new">New this week</a>
					</div>
					<div class="hero-trust">
						<span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2FB344" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P.truck}</svg>Ships in 1–2 business days</span>
						<span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2FB344" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P.shield}</svg>Factory sealed, condition noted</span>
					</div>
				</div>
				<div class="hero-art" role="img" aria-label="The Quie robot mascot with comics, Japanese Pokémon booster boxes and a Star Wars Funko figure"></div>
				<a class="btn btn--green m-cta" href="#/shop/pokemon">Shop by language ${ic('arrow', 18, 2.2)}</a>
			</div></section>

			<section class="wrap sec sec--first sec--langs">
				<div class="sec-head"><div><h2 class="disp">Shop by language</h2><p>Every listing says exactly what's printed on the cards.</p></div></div>
				<div class="ltiles">${Object.keys(LANGS).map(tile).join('')}</div>
			</section>

			<section class="wrap sec sec--new">
				<div class="sec-head" style="align-items:center">
					<h2 class="disp">New this week</h2>
					<div class="pills" role="group" aria-label="Filter by language" id="homePills"></div>
					<a class="morelink m-only" href="#/shop/new">See all</a>
				</div>
				<div class="grid" id="homeNew"></div>
			</section>

			<section class="wrap sec sec--promises"><div class="promises">
				<div class="promise"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2FB344" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P.truck}</svg><div><h3>Ships from Plano, TX</h3><p>Packed in 1–2 business days with tracking. Free US shipping over $100.</p></div></div>
				<div class="promise"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2FB344" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P.shield}</svg><div><h3>Sealed, and honest about it</h3><p>Dents and creases are listed on the page. Chase cards are never promised.</p></div></div>
				<div class="promise"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2FB344" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P.chat}</svg><div><h3>Ask before you buy</h3><p>Not sure which language or set fits your collection? Message us and get a straight answer.</p></div></div>
			</div></section>

			<section class="wrap sec sec--beyond">
				<div class="sec-head"><h2 class="disp">Beyond the cards</h2><a class="morelink" href="#/shop/collectibles">Comics &amp; collectibles ${ic('arrow', 16, 2.2)}</a></div>
				<div class="beyond">
					<a class="btile" href="#/shop/collectibles?type=comics"><div style="display:flex;flex-direction:column;gap:8px;min-width:0"><span class="t">Comics</span><span class="s">Legion of Collectors variants</span><span class="mono">from ${fromPrice((p) => p.type === 'comics')}</span></div><img src="${img('comics')}" alt="" loading="lazy"></a>
					<a class="btile" href="#/shop/collectibles?type=funko"><div style="display:flex;flex-direction:column;gap:8px;min-width:0"><span class="t">Funko</span><span class="s">Dorbz, Pops and chase editions</span><span class="mono">from ${fromPrice((p) => p.type === 'funko')}</span></div><img src="${img('funko')}" alt="" loading="lazy"></a>
					<a class="btile btile--dark" href="#/shop/collectibles?type=quie"><div style="display:flex;flex-direction:column;gap:8px;min-width:0"><span class="eyebrow" style="font-size:11px">Made by Quie</span><span class="t">Card-art magnets</span><span class="mono" style="color:#CFCFCF">from ${fromPrice((p) => p.type === 'quie')}</span></div><img src="${img('magnet')}" alt="" loading="lazy"></a>
				</div>
			</section>

			<section class="wrap sec sec--alerts" style="padding-bottom:96px"><div class="alerts" id="alerts">
				<div class="alerts-copy"><h2 class="disp">Drop alerts</h2><p>New Japanese, Korean and Chinese boxes by email, a day before they hit Instagram.</p></div>
				<form id="alertsForm" novalidate>
					<fieldset><legend>Tell me about</legend>
						${Object.keys(LANGS).map((k, i) => `<label class="tog"><input type="checkbox" name="lang" value="${k}" ${i < 2 ? 'checked' : ''}>${LANGS[k].short}</label>`).join('')}
					</fieldset>
					<div class="alerts-row">
						<label for="email" class="sr">Email address</label>
						<input id="email" name="email" type="email" placeholder="you@email.com" autocomplete="email" required>
						<button class="btn btn--ink" type="submit">Notify me</button>
					</div>
					<span class="fine">One email per drop. Unsubscribe anytime.</span>
				</form>
			</div></section>`;
		renderHomeNew();
	}

	function renderHomeNew() {
		const opts = [['all', 'All']].concat(Object.keys(LANGS).map((k) => [k, LANGS[k].short]));
		$('#homePills').innerHTML = opts.map(([k, label]) =>
			`<button class="pill" type="button" data-action="home-lang" data-lang="${k}" data-fkey="hl:${k}" aria-pressed="${homeLang === k}">${k !== 'all' ? `<span class="dot" style="background:${LANGS[k].dot}"></span>` : ''}${label}</button>`).join('');
		const items = PRODUCTS.filter((p) => p.isNew && (homeLang === 'all' || p.lang === homeLang));
		$('#homeNew').innerHTML = items.length
			? items.map(card).join('')
			: `<div class="noresults" style="grid-column:1/-1"><h2>Nothing new in ${LANGS[homeLang].name} this week</h2><p>Drop alerts get you the next one first.</p><a class="btn btn--ink" href="#/shop/${homeLang}">See all ${LANGS[homeLang].name}</a></div>`;
	}

	// ---------- collection ----------
	const FACETS = [
		{ key: 'lang', label: 'Language', opts: (base) => Object.keys(LANGS).filter((k) => base.some((p) => p.lang === k)), name: (k) => LANGS[k].name, test: (p, k) => p.lang === k },
		{ key: 'type', label: 'Product type', opts: (base) => Object.keys(TYPES).filter((t) => base.some((p) => p.type === t)), name: (k) => TYPES[k], test: (p, k) => p.type === k },
		{ key: 'price', label: 'Price', opts: () => Object.keys(PRICES), name: (k) => PRICES[k].label, test: (p, k) => PRICES[k].test(p.price) },
		{ key: 'cond', label: 'Condition', opts: (base) => (base.some((p) => p.cat === 'pokemon') ? Object.keys(CONDITIONS) : []), name: (k) => CONDITIONS[k], test: (p, k) => p.condition === k }
	];
	const SORTS = { featured: 'Featured', newest: 'Newest', 'price-asc': 'Price, low to high', 'price-desc': 'Price, high to low' };

	function parseCollection(r) {
		const split = (v) => new Set(v ? v.split(',').filter(Boolean) : []);
		let base = r.base, preset = [];
		if (LANGS[base]) { preset = [base]; base = 'pokemon'; }
		if (!CATEGORIES[base]) return null;
		return {
			base,
			q: r.query.get('q') || '',
			sort: SORTS[r.query.get('sort')] ? r.query.get('sort') : 'featured',
			f: { lang: r.query.get('lang') ? split(r.query.get('lang')) : new Set(preset), type: split(r.query.get('type')), price: split(r.query.get('price')), cond: split(r.query.get('cond')) }
		};
	}

	function collectionHash(s) {
		const singleLang = s.base === 'pokemon' && s.f.lang.size === 1;
		const path = s.base === 'search' ? '/search' : s.base === 'saved' ? '/saved' : '/shop/' + (singleLang ? Array.from(s.f.lang)[0] : s.base);
		const parts = [];
		if (s.base === 'search') parts.push('q=' + encodeURIComponent(s.q));
		if (s.f.lang.size && !singleLang) parts.push('lang=' + Array.from(s.f.lang).join(','));
		['type', 'price', 'cond'].forEach((k) => { if (s.f[k].size) parts.push(k + '=' + Array.from(s.f[k]).join(',')); });
		if (s.sort !== 'featured') parts.push('sort=' + s.sort);
		return '#' + path + (parts.length ? '?' + parts.join('&') : '');
	}

	function baseItems(s) {
		switch (s.base) {
			case 'pokemon': case 'collectibles': case 'supplies': return PRODUCTS.filter((p) => p.cat === s.base);
			case 'new': return PRODUCTS.filter((p) => p.isNew);
			case 'saved': return PRODUCTS.filter((p) => saved.has(p.id));
			case 'search': return searchProducts(s.q);
			default: return PRODUCTS.slice();
		}
	}

	const passes = (p, s, except) => FACETS.every((F) => F.key === except || !s.f[F.key].size || Array.from(s.f[F.key]).some((k) => F.test(p, k)));

	function sorted(items, sort) {
		const out = items.slice();
		if (sort === 'price-asc') out.sort((a, b) => a.price - b.price);
		if (sort === 'price-desc') out.sort((a, b) => b.price - a.price);
		if (sort === 'newest') out.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
		return out;
	}

	function activeFilterCount(s) {
		const singleLangPage = s.base === 'pokemon' && s.f.lang.size === 1;
		return FACETS.reduce((n, F) => n + s.f[F.key].size, 0) - (singleLangPage ? 1 : 0);
	}

	function renderCollection() {
		const s = collection;
		$('#app').innerHTML = `
			<section class="wrap" style="padding-top:28px" id="chead"></section>
			<section class="wrap cbody">
				<aside class="filters" id="filters" aria-label="Filters">
					<div class="filters-head"><h2 class="disp">Filters</h2><button class="ibtn" type="button" data-action="close-filters" aria-label="Close filters">${ic('x', 22, 2.2)}</button></div>
					<div id="facets" style="display:flex;flex-direction:column;gap:28px"></div>
					<div class="filters-foot"><button class="btn btn--ink" type="button" data-action="close-filters" id="filtersDone">Show results</button></div>
				</aside>
				<div class="cmain">
					<div class="ctools" id="ctools"></div>
					<div id="cgrid"></div>
				</div>
			</section>
			${s.base === 'pokemon' || s.base === 'new' ? `<section class="wrap" style="padding-top:24px;padding-bottom:80px"><div class="helper">
				<div style="display:flex;flex-direction:column;gap:8px;min-width:0;flex:1 1 420px"><span class="t">New to international sets?</span><span class="s">Authenticity, playability and how Korean, Japanese and Chinese prints differ, answered in one page.</span></div>
				<button class="btn btn--green" type="button" data-action="soon" data-what="The international cards FAQ">Read the FAQ ${ic('arrow', 18, 2.2)}</button>
			</div></section>` : '<div style="height:48px"></div>'}`;
		updateCollection();
	}

	function updateCollection() {
		const s = collection;
		const base = baseItems(s);
		const items = sorted(base.filter((p) => passes(p, s)), s.sort);
		const singleLang = s.base === 'pokemon' && s.f.lang.size === 1 ? LANGS[Array.from(s.f.lang)[0]] : null;

		// header
		const cat = CATEGORIES[s.base];
		const crumbs = [`<a href="#/">Home</a>`];
		if (s.base === 'pokemon') crumbs.push(singleLang ? `<a href="#/shop/pokemon">Pokémon TCG</a>` : `<span aria-current="page">Pokémon TCG</span>`);
		if (singleLang) crumbs.push(`<span aria-current="page">${singleLang.name}</span>`);
		if (s.base !== 'pokemon') crumbs.push(`<span aria-current="page">${s.base === 'search' ? 'Search' : cat.title}</span>`);
		let title = cat.title, blurb = cat.blurb, native = '';
		if (singleLang) {
			title = `${singleLang.name} Pokémon TCG`; blurb = singleLang.blurb;
			native = singleLang.key === 'english' ? `<span class="native disp" style="color:${singleLang.text}">English</span>` : `<span class="native ${singleLang.cls}" style="color:${singleLang.text}">${singleLang.native}</span>`;
		}
		if (s.base === 'search') { title = s.q ? `Results for “${esc(s.q)}”` : 'Search'; blurb = s.q ? `${plural(base.length, 'match')} across every language.` : 'Type a set name, set code or language.'; }
		const seg = s.base === 'pokemon'
			? `<div class="seg" role="group" aria-label="Switch language">
				<a href="#/shop/pokemon" ${!s.f.lang.size ? 'aria-current="page"' : ''}>All <span class="mono">${PRODUCTS.filter((p) => p.cat === 'pokemon').length}</span></a>
				${Object.keys(LANGS).map((k) => `<a href="#/shop/${k}" ${singleLang && singleLang.key === k ? 'aria-current="page"' : ''}><span class="dot" style="background:${LANGS[k].navDot}"></span>${LANGS[k].short} <span class="mono">${langCount(k)}</span></a>`).join('')}
			</div>` : '';
		$('#chead').innerHTML = `
			<nav class="crumbs" aria-label="Breadcrumb">${crumbs.join('<span aria-hidden="true">/</span>')}</nav>
			<div class="chero"><div class="chero-copy">${native}<h1 class="disp">${title}</h1>${blurb ? `<p>${blurb}</p>` : ''}</div>${seg}</div>`;

		// facets
		const empty = !base.length;
		$('#filters').style.display = empty ? 'none' : '';
		$('#facets').innerHTML = FACETS.map((F) => {
			const opts = F.opts(base);
			if (!opts.length || (F.key === 'type' && opts.length < 2 && !s.f.type.size)) return '';
			const pool = base.filter((p) => passes(p, s, F.key));
			return `<fieldset><legend class="fhead">${F.label}</legend>${opts.map((k) => {
				const n = pool.filter((p) => F.test(p, k)).length;
				const on = s.f[F.key].has(k);
				return `<label class="fopt ${!n && !on ? 'is-zero' : ''}"><input type="checkbox" data-facet="${F.key}" value="${k}" data-fkey="f:${F.key}:${k}" ${on ? 'checked' : ''}>${F.name(k)}<span class="fcount">${n}</span></label>`;
			}).join('')}</fieldset>`;
		}).join('');
		const done = $('#filtersDone'); if (done) done.textContent = `Show ${plural(items.length, 'product')}`;

		// toolbar
		const chips = [];
		FACETS.forEach((F) => s.f[F.key].forEach((k) => {
			const L = F.key === 'lang' ? LANGS[k] : null;
			chips.push(`<button class="fchip" type="button" data-action="remove-filter" data-facet="${F.key}" data-value="${k}" style="${L ? `--tint:${L.tint};--tint-ink:${L.tintText}` : ''}" aria-label="Remove ${esc(F.name(k))} filter">${F.key === 'lang' ? L.short : esc(F.name(k))} ${ic('x', 14, 2.4)}</button>`);
		}));
		const nActive = activeFilterCount(s);
		$('#ctools').innerHTML = empty ? '' : `
			<div class="ctools-l">
				<button class="fbtn" type="button" data-action="open-filters">${ic('filter', 16, 2.2)} Filters${nActive > 0 ? ` <span class="n">${nActive}</span>` : ''}</button>
				<span class="ccount">${plural(items.length, 'product')}</span>
				${chips.join('')}
				${chips.length > 1 ? '<button class="clearall" type="button" data-action="clear-filters">Clear all</button>' : ''}
			</div>
			<label class="sort"><span>Sort</span>
				<select id="sort" data-fkey="sort">${Object.entries(SORTS).map(([k, v]) => `<option value="${k}" ${s.sort === k ? 'selected' : ''}>${v}</option>`).join('')}</select>
			</label>`;

		// grid
		let body;
		if (empty && s.base === 'saved') body = `<div class="noresults"><h2>Nothing saved yet</h2><p>Tap the heart on any product to keep it here.</p><a class="btn btn--ink" href="#/shop/new">See what's new</a></div>`;
		else if (empty && s.base === 'search') body = `<div class="noresults"><h2>${s.q ? `No matches for “${esc(s.q)}”` : 'Search the shop'}</h2><p>Try a set name like “Crystal Gathering”, a set code like “M2a”, or a language.</p><div class="pills" style="justify-content:center">${Object.keys(LANGS).map((k) => `<a class="pill" href="#/shop/${k}"><span class="dot" style="background:${LANGS[k].dot}"></span>${LANGS[k].short}</a>`).join('')}</div></div>`;
		else if (!items.length) body = `<div class="noresults"><h2>Nothing matches those filters</h2><p>Try removing one, or clear them all.</p><button class="btn btn--ink" type="button" data-action="clear-filters">Clear filters</button></div>`;
		else body = `<div class="grid">${items.map(card).join('')}</div>`;
		$('#cgrid').innerHTML = body;

		updateNavCurrent();
		document.title = `${singleLang ? singleLang.name + ' Pokémon' : s.base === 'search' ? 'Search' : cat.title} · Quie Collectibles`;
	}

	function applyCollection() {
		history.replaceState(null, '', collectionHash(collection));
		keepFocus(updateCollection);
	}

	// ---------- product ----------
	function renderProduct(p) {
		const L = p.lang ? LANGS[p.lang] : null;
		const gallery = p.gallery || [p.img];
		const galleryAlt = p.galleryAlt || gallery.map((_, i) => (i === 0 ? p.name : `${p.name}, image ${i + 1}`));
		gIndex = 0; pqty = 1;
		const pull = p.pullNote || (p.type === 'booster' ? 'Chase cards are possible pulls. They aren\'t guaranteed in any box.' : null);
		const adj = L ? (L.key === 'chinese' ? 'Chinese' : L.name) : '';
		const faqs = L
			? [['Is it authentic?', `[Mario: where Quie sources ${L.name} boxes, and how each one is checked before it's listed.]`], [`Can I play with ${L.name} cards?`, '[Mario\'s answer]'], [`Why buy the ${adj} version?`, '[Mario\'s answer]'], ['Shipping, duties and damage claims', '[Mario\'s answer]']]
			: [['Shipping, duties and damage claims', '[Mario\'s answer]'], ['Returns', '[Mario\'s answer]']];
		const addons = p.cat === 'pokemon' ? ['sleeves', 'toploaders', 'magnet'].map((id) => byId[id]) : [];
		let related = (p.related || []).map((id) => byId[id]);
		if (!related.length) related = PRODUCTS.filter((x) => x.id !== p.id && (L ? x.lang === p.lang : x.cat === p.cat)).slice(0, 4);
		if (related.length < 4) related = related.concat(PRODUCTS.filter((x) => x.id !== p.id && x.cat === p.cat && !related.includes(x)).slice(0, 4 - related.length));
		const relatedTitle = p.relatedTitle || (L ? `More ${L.name}` : 'You might also like');
		const crumbs = [`<a href="#/">Home</a>`, L ? `<a href="#/shop/${L.key}">${L.name}</a>` : `<a href="#/shop/${p.cat}">${CATEGORIES[p.cat].title}</a>`, `<span aria-current="page">${esc(p.short)}</span>`];

		$('#app').innerHTML = `
			<section class="wrap pwrap">
				<nav class="crumbs" aria-label="Breadcrumb">${crumbs.join('<span aria-hidden="true">/</span>')}</nav>
				<div class="pgrid">
					<div class="gallery">
						<div class="gmain" id="gmain">
							<img id="gimg" src="${img(gallery[0])}" alt="${esc(galleryAlt[0])}">
							${langChip(p)}
							${gallery.length > 1 ? `<span class="gcount mono" id="gcount">1 / ${gallery.length}</span>
								<button class="gnav gnav--prev" type="button" data-action="gal" data-dir="-1" aria-label="Previous image">${ic('left', 20, 2.2)}</button>
								<button class="gnav gnav--next" type="button" data-action="gal" data-dir="1" aria-label="Next image">${ic('right', 20, 2.2)}</button>` : ''}
						</div>
						${gallery.length > 1 ? `<div class="thumbs" role="group" aria-label="Product images">${gallery.map((g, i) => `<button type="button" data-action="thumb" data-i="${i}" aria-label="Show image ${i + 1}" ${i === 0 ? 'aria-current="true"' : ''}><img src="${img(g)}" alt=""></button>`).join('')}</div>` : ''}
					</div>
					<div class="pinfo">
						<div class="ptop">
							<div class="pmeta">
								${L ? `<span class="lpill" style="background:${L.tint};color:${L.tintText}"><span class="dot" style="background:${L.dot}"></span>${L.key !== 'english' ? `<span class="${L.cls}">${L.native}</span> ` : ''}${L.name}</span>` : `<span class="lpill" style="background:var(--tile)">${TYPES[p.type]}</span>`}
								${p.setCode ? `<span class="mono" style="font-size:12.5px;color:var(--muted)">Set ${esc(p.setCode)}</span>` : ''}
							</div>
							<h1 class="disp">${esc(p.name)}</h1>
							<p class="lede">${esc(p.desc)}</p>
						</div>
						<div class="pprice"><span class="price">${money(p.price)}</span><span class="stock"><span class="dot" style="background:var(--green)"></span>In stock</span></div>
						${p.conditionNote ? `<div class="note note--warn">${ic('info', 20, 1.8)}<span><strong>Condition note.</strong> ${esc(p.conditionNote)}</span></div>` : ''}
						${pull ? `<div class="note">${ic('info', 20, 1.8)}<span><strong>Pull note.</strong> ${esc(pull)}</span></div>` : ''}
						<div class="buy" id="buy">
							<div class="qty qty--lg" role="group" aria-label="Quantity">
								<button type="button" data-action="pqty" data-d="-1" data-fkey="pqty:-1" aria-label="Decrease quantity" disabled>${ic('minus', 16, 2.4)}</button>
								<span id="pqty" aria-live="polite">1</span>
								<button type="button" data-action="pqty" data-d="1" data-fkey="pqty:1" aria-label="Increase quantity">${ic('plus', 16, 2.4)}</button>
							</div>
							<button class="addbig" type="button" data-action="add-product" data-id="${p.id}">Add to cart</button>
							<button class="shoppay" type="button" data-action="buy-now" data-id="${p.id}">Buy with Shop Pay</button>
						</div>
						<div class="shipbox">
							<div class="shipbox-row"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1C7F2E" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="flex:none">${P.truck}</svg>Ships from Plano, TX in 1–2 business days</div>
							<div style="display:flex;flex-direction:column;gap:8px"><span class="msg" id="shipmsg"></span>
								<div class="progress progress--light" role="progressbar" aria-label="Progress to free shipping" aria-valuemin="0" aria-valuemax="100" id="shipbar"><div></div></div>
							</div>
						</div>
						<dl class="specs">
							${p.set ? `<div class="spec"><dt>Set</dt><dd>${esc(p.set)}${p.setCode ? ' · ' + esc(p.setCode) : ''}</dd></div>` : `<div class="spec"><dt>Type</dt><dd>${TYPES[p.type]}</dd></div>`}
							<div class="spec"><dt>Contents</dt><dd>${esc(p.contents)}</dd></div>
							${L ? `<div class="spec"><dt>Language</dt><dd>${L.name}</dd></div>` : ''}
							<div class="spec"><dt>Condition</dt><dd>${p.condition === 'dented' ? 'Dented box, packs factory sealed' : 'New, factory sealed'}</dd></div>
						</dl>
						<div>${faqs.map(([q, a], i) => `<details ${i === 0 ? 'open' : ''}><summary>${esc(q)}${ic('faq', 18, 2.2)}</summary><p>${esc(a)}</p></details>`).join('')}</div>
					</div>
				</div>
			</section>
			${addons.length ? `<section class="wrap" style="padding-bottom:56px"><div class="addons">
				<div class="addons-head"><h2>Protect the pulls</h2><span>Everything here counts toward free shipping.</span></div>
				<div class="addon-grid">${addons.map((a) => `<div class="addon"><img src="${img(a.img)}" alt=""><div class="addon-copy"><a class="t" href="#/product/${a.id}">${esc(a.name)}${a.madeByQuie ? ' <span class="mono quietag">MADE BY QUIE</span>' : ''}</a><span class="p">${money(a.price)}</span></div>${addBtn(a)}</div>`).join('')}</div>
			</div></section>` : ''}
			<section class="wrap related" style="padding-bottom:80px">
				<h2 class="disp">${esc(relatedTitle)}</h2>
				<div class="grid">${related.map(card).join('')}</div>
			</section>
			<div class="stickybuy" id="stickybuy" aria-hidden="true">
				<div class="t"><span>${esc(p.name)}</span><span>${money(p.price)}</span></div>
				<button type="button" data-action="add-product" data-id="${p.id}" tabindex="-1">Add to cart</button>
			</div>`;

		updateShipbox();
		document.title = `${p.name} · Quie Collectibles`;

		if ('IntersectionObserver' in window) {
			const sticky = $('#stickybuy');
			const io = new IntersectionObserver(([e]) => sticky.classList.toggle('is-on', !e.isIntersecting && e.boundingClientRect.top < 0));
			io.observe($('#buy'));
			cleanup.push(() => io.disconnect());
		}

		const gm = $('#gmain'); let x0 = null;
		gm.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
		gm.addEventListener('touchend', (e) => { if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 40) showImage(gIndex + (dx < 0 ? 1 : -1)); x0 = null; });
	}

	function showImage(i) {
		const p = byId[route.id];
		const gallery = p.gallery || [p.img];
		if (gallery.length < 2) return;
		gIndex = (i + gallery.length) % gallery.length;
		const im = $('#gimg');
		im.src = img(gallery[gIndex]);
		im.alt = (p.galleryAlt && p.galleryAlt[gIndex]) || p.name;
		$('#gcount').textContent = `${gIndex + 1} / ${gallery.length}`;
		$$('.thumbs button').forEach((b, j) => (j === gIndex ? b.setAttribute('aria-current', 'true') : b.removeAttribute('aria-current')));
	}

	function updateShipbox() {
		const p = byId[route.id];
		const msg = $('#shipmsg'); if (!msg) return;
		const inCart = cart.some((l) => l.id === p.id);
		const total = subtotal() + (inCart ? 0 : p.price * pqty);
		const rem = FREE_SHIP - total;
		msg.innerHTML = rem > 0
			? `Add <strong>${money(rem)}</strong> more for free US shipping`
			: `<strong>This order ships free</strong> in the US`;
		const pct = freeShipPct(total);
		$('#shipbar').setAttribute('aria-valuenow', pct);
		$('#shipbar > div').style.width = pct + '%';
	}

	// ---------- cart ----------
	function renderCart() {
		const n = cartCount(), sub = subtotal(), rem = Math.max(0, FREE_SHIP - sub);
		const head = `<div class="sheet-head"><h2 class="disp" id="cartTitle">Your cart <span class="mono">${plural(n, 'item')}</span></h2><button class="ibtn" type="button" data-action="close-sheets" aria-label="Close cart">${ic('x', 22, 2.2)}</button></div>`;
		if (!n) {
			$('#cart').innerHTML = head + `<div class="cempty">
				<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#BDBDBD" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P.bag}</svg>
				<p>Your cart is empty. Free US shipping kicks in at ${money(FREE_SHIP)}.</p>
				<a class="btn btn--green" href="#/shop/new">See what's new</a>
				<a class="morelink" href="#/shop/pokemon" style="font-size:14px">Shop by language</a>
			</div>`;
			return;
		}
		const upsell = ['sleeves', 'toploaders', 'magnet'].map((id) => byId[id]).find((x) => !cart.some((l) => l.id === x.id));
		$('#cart').innerHTML = head + `
			<div class="sheet-body">
				<div class="shipbar">
					<span>${rem > 0 ? `You're <strong>${money(rem)}</strong> away from free US shipping` : `<strong>Free US shipping</strong> unlocked`}</span>
					<div class="progress" role="progressbar" aria-label="Progress to free shipping" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${freeShipPct(sub)}"><div style="width:${freeShipPct(sub)}%"></div></div>
				</div>
				<ul class="citems">${cart.map((l) => {
					const p = byId[l.id], L = p.lang ? LANGS[p.lang] : null;
					return `<li class="citem">
						<a href="#/product/${p.id}" tabindex="-1" aria-hidden="true"><img src="${img(p.img)}" alt=""></a>
						<div class="citem-main">
							<div class="citem-top"><a href="#/product/${p.id}">${esc(p.name)}</a><span class="pr">${money(p.price * l.qty)}</span></div>
							<span class="citem-meta">${L ? `<span class="dot" style="background:${L.dot}"></span>${L.name}${p.setCode ? ' · ' + esc(p.setCode) : ''}` : esc(p.sub)}</span>
							<div class="citem-row">
								<div class="qty" role="group" aria-label="Quantity for ${esc(p.short)}">
									<button type="button" data-action="cqty" data-id="${p.id}" data-d="-1" data-fkey="cqty:${p.id}:-1" aria-label="Decrease quantity">${ic(l.qty === 1 ? 'x' : 'minus', 14, 2.4)}</button>
									<span>${l.qty}</span>
									<button type="button" data-action="cqty" data-id="${p.id}" data-d="1" data-fkey="cqty:${p.id}:1" aria-label="Increase quantity" ${l.qty >= 9 ? 'disabled' : ''}>${ic('plus', 14, 2.4)}</button>
								</div>
								<button class="linkbtn" type="button" data-action="remove" data-id="${p.id}">Remove</button>
							</div>
						</div>
					</li>`;
				}).join('')}</ul>
				${upsell ? `<div class="upsell">
					<img src="${img(upsell.img)}" alt="">
					<div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:3px">
						<span class="t">${rem > 0 && upsell.price >= rem ? `Add ${upsell.short.toLowerCase()} and ship free` : 'Protect the pulls'}</span>
						<span class="s">${esc(upsell.name)} · ${money(upsell.price)}</span>
					</div>
					<button class="add" type="button" data-action="add" data-id="${upsell.id}" data-fkey="upsell" style="min-height:40px">Add</button>
				</div>` : ''}
				<div style="height:16px"></div>
			</div>
			<div class="cfoot">
				<div class="sub"><span>Subtotal</span><span>${money(sub)}</span></div>
				<span class="cnote">Shipping and any duties calculated at checkout.</span>
				<button class="checkout" type="button" data-action="checkout" data-method="checkout">Check out</button>
				<div class="express">
					<button class="xp-shop" type="button" data-action="checkout" data-method="Shop Pay">Shop Pay</button>
					<button class="xp-paypal" type="button" data-action="checkout" data-method="PayPal">PayPal</button>
					<button class="xp-apple" type="button" data-action="checkout" data-method="Apple Pay">Apple Pay</button>
				</div>
				<span class="shipnote"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1C7F2E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P.truck}</svg>Ships from Plano, TX in 1–2 business days</span>
			</div>`;
	}

	// ---------- checkout modal ----------
	let checkoutLines = null; // null = whole cart; array = buy-now
	function openCheckout(method, lines) {
		checkoutLines = lines || null;
		const items = lines || cart;
		const sub = items.reduce((s, l) => s + byId[l.id].price * l.qty, 0);
		const label = method === 'checkout' ? 'Shopify checkout' : method;
		$('#modal').innerHTML = `<div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="coTitle">
			<div style="display:flex;align-items:center;justify-content:space-between;gap:12px"><h2 class="disp" id="coTitle">Checkout</h2><button class="ibtn" type="button" data-action="close-modal" aria-label="Close">${ic('x', 22, 2.2)}</button></div>
			<p>In the live store this hands off to <strong>${esc(label)}</strong>. The prototype stops here so you can test the flow without paying.</p>
			<ul class="osum">${items.map((l) => { const p = byId[l.id]; return `<li><img src="${img(p.img)}" alt=""><span class="n">${esc(p.name)}${l.qty > 1 ? ` × ${l.qty}` : ''}</span><span class="p">${money(p.price * l.qty)}</span></li>`; }).join('')}</ul>
			<div class="otot">
				<div><span>Subtotal</span><span>${money(sub)}</span></div>
				<div><span>US shipping</span><span>${sub >= FREE_SHIP ? 'Free' : 'Calculated at checkout'}</span></div>
				<div class="big"><span>Total</span><span>${money(sub)}${sub >= FREE_SHIP ? '' : ' + shipping'}</span></div>
			</div>
			<button class="checkout" type="button" data-action="place-order">Place test order</button>
		</div>`;
		openModal();
	}

	function placeOrder() {
		const wasCart = !checkoutLines;
		if (wasCart) { cart = []; saveCart(); closeSheets(); }
		$('#modal').innerHTML = `<div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="okTitle" style="align-items:center;text-align:center">
			<span style="width:56px;height:56px;border-radius:50%;background:var(--green);display:inline-flex;align-items:center;justify-content:center">${ic('check', 28, 2.6)}</span>
			<h2 class="disp" id="okTitle">Test order placed</h2>
			<p>Nothing was charged.${wasCart ? ' Your cart has been cleared.' : ''} In the live store this is the Shopify thank-you page with tracking to follow.</p>
			<button class="btn btn--ink" type="button" data-action="close-modal" style="width:100%">Keep shopping</button>
		</div>`;
		$('#modal button').focus();
	}

	// ---------- overlays ----------
	let lastFocus = null;
	function openSheet(id) {
		closeMega();
		lastFocus = document.activeElement;
		const el = $('#' + id);
		el.classList.add('is-open');
		$('#sheetScrim').classList.add('is-on');
		document.body.classList.add('lock');
		setTimeout(() => { const b = el.querySelector('button, a'); if (b) b.focus(); }, 30);
	}
	function closeSheets() {
		const wasOpen = $$('.sheet.is-open, .filters.is-open').length > 0;
		$$('.sheet.is-open, .filters.is-open').forEach((s) => s.classList.remove('is-open'));
		$('#sheetScrim').classList.remove('is-on');
		if ($('#modal').hidden) document.body.classList.remove('lock');
		if (wasOpen && lastFocus && document.contains(lastFocus)) lastFocus.focus({ preventScroll: true });
	}
	function openModal() {
		$('#modal').hidden = false;
		document.body.classList.add('lock');
		setTimeout(() => { const b = $('#modal .checkout') || $('#modal button'); if (b) b.focus(); }, 30);
	}
	function closeModal() {
		$('#modal').hidden = true;
		if (!$('.sheet.is-open')) document.body.classList.remove('lock');
	}

	let megaHover = false, megaTimer = null;
	function openMega(byHover) {
		if (window.matchMedia('(max-width: 860px)').matches) return;
		closeSearch();
		megaHover = byHover;
		$('#mega').hidden = false;
		$('#shopBtn').setAttribute('aria-expanded', 'true');
		$('#scrim').classList.add('is-on');
	}
	function closeMega() {
		clearTimeout(megaTimer);
		const m = $('#mega'); if (!m || m.hidden) return;
		m.hidden = true;
		$('#shopBtn').setAttribute('aria-expanded', 'false');
		$('#scrim').classList.remove('is-on');
	}

	let toastTimer = null;
	function toast(msg, action) {
		const t = $('#toast');
		t.innerHTML = `<span>${esc(msg)}</span>${action ? `<button type="button" data-action="${action.action || 'go'}" ${action.href ? `data-href="${action.href}"` : ''}>${esc(action.label)}</button>` : ''}`;
		t.classList.add('is-on');
		clearTimeout(toastTimer);
		toastTimer = setTimeout(() => t.classList.remove('is-on'), 3200);
	}

	function flashAdded(btn) {
		if (!btn || !btn.classList.contains('add')) return;
		btn.classList.add('is-added');
		const lbl = btn.querySelector('.lbl'), ico = btn.querySelector('.ico');
		if (lbl) lbl.textContent = 'Added';
		if (ico) ico.innerHTML = ic('check', 16, 2.6);
		setTimeout(() => {
			btn.classList.remove('is-added');
			if (lbl) lbl.textContent = 'Add';
			if (ico) ico.innerHTML = ic('plus', 16, 2.4);
		}, 1400);
	}

	// ---------- search UI ----------
	let srActive = -1;
	function srCard(p, i) {
		const L = p.lang ? LANGS[p.lang] : null;
		return `<a class="sr-item ${i === srActive ? 'is-active' : ''}" role="option" id="sr-${i}" aria-selected="${i === srActive}" href="#/product/${p.id}">
			<span class="sr-media"><img src="${img(p.img)}" alt="">${L ? `<span class="chip"><span class="dot" style="background:${L.dot}"></span>${L.short}</span>` : ''}</span>
			<span class="t">${esc(p.name)}</span>
			<span class="p">${money(p.price)}</span>
		</a>`;
	}

	// Mirrors the live store: focusing the search opens a panel with product
	// suggestions right away, then narrows to matches as you type.
	function renderSearchPop() {
		const input = $('#q'), pop = $('#searchPop');
		const q = input.value.trim();
		const res = q ? searchProducts(q) : PRODUCTS.filter((p) => p.isNew);
		const shown = res.slice(0, q ? 8 : 4);
		srActive = Math.min(srActive, shown.length - 1);
		pop.innerHTML = `<div class="sr-head colhead">${q && res.length ? plural(res.length, 'product') : 'Products'}</div>`
			+ (shown.length
				? `<div class="sr-grid">${shown.map(srCard).join('')}</div>`
				: `<div class="sr-empty">No matches for “${esc(q)}”. Try a set code like M2a or a language like Korean.</div>`)
			+ (q ? `<a class="sr-all" href="#/search?q=${encodeURIComponent(q)}">See all results for “${esc(q)}” ${ic('arrow', 16, 2.2)}</a>` : '');
		if (pop.hidden) {
			closeMega();
			pop.hidden = false;
			$('#search').classList.add('is-open');
			$('#scrim').classList.add('is-on');
		}
		input.setAttribute('aria-expanded', 'true');
		if (srActive >= 0) input.setAttribute('aria-activedescendant', 'sr-' + srActive); else input.removeAttribute('aria-activedescendant');
	}
	function closeSearch() {
		const pop = $('#searchPop');
		if (!pop || pop.hidden) return;
		pop.hidden = true;
		srActive = -1;
		$('#search').classList.remove('is-open');
		$('#scrim').classList.remove('is-on');
		$('#q').setAttribute('aria-expanded', 'false');
		$('#q').removeAttribute('aria-activedescendant');
	}

	// ---------- router ----------
	let cleanup = [];
	function parseRoute() {
		const h = location.hash.replace(/^#/, '') || '/';
		const [path, qs = ''] = h.split('?');
		const parts = path.split('/').filter(Boolean);
		const query = new URLSearchParams(qs);
		if (!parts.length) return { name: 'home' };
		if (parts[0] === 'shop') return { name: 'collection', base: parts[1] || 'all', query };
		if (parts[0] === 'search') return { name: 'collection', base: 'search', query };
		if (parts[0] === 'saved') return { name: 'collection', base: 'saved', query };
		if (parts[0] === 'product') return { name: 'product', id: parts[1] };
		return { name: '404' };
	}

	function renderRoute(scroll = true) {
		cleanup.forEach((fn) => fn()); cleanup = [];
		closeMega(); closeSheets(); closeSearch();
		route = parseRoute();
		collection = null;
		if (route.name === 'collection') {
			collection = parseCollection(route);
			if (!collection) route = { name: '404' };
		}

		if (route.name === 'home') { homeLang = 'all'; renderHome(); document.title = 'Quie Collectibles · Redesign prototype'; }
		else if (route.name === 'collection') renderCollection();
		else if (route.name === 'product' && byId[route.id]) renderProduct(byId[route.id]);
		else {
			$('#app').innerHTML = `<section class="wrap" style="padding:80px var(--gutter)"><div class="noresults"><h2>That page isn't in the prototype</h2><p>Head back to the shop.</p><a class="btn btn--ink" href="#/">Home</a></div></section>`;
			document.title = 'Not found · Quie Collectibles';
		}
		if (route.name === 'collection' && collection.base === 'search') $('#q').value = collection.q;
		renderFooter(route.name === 'home');
		watchFooter();
		updateNavCurrent();
		if (scroll) { window.scrollTo(0, 0); $('#app').focus({ preventScroll: true }); }
	}

	// ---------- events ----------
	document.addEventListener('click', (e) => {
		const t = e.target.closest('[data-action]');
		if (!t) {
			if (!e.target.closest('#search')) closeSearch();
			return;
		}
		const a = t.dataset.action, id = t.dataset.id;
		switch (a) {
			case 'add': {
				addToCart(id, 1);
				flashAdded(t);
				if (!$('#cart').classList.contains('is-open')) toast(`Added ${byId[id].short}`, { action: 'open-cart', label: 'View cart' });
				break;
			}
			case 'add-product': addToCart(id, pqty); openSheet('cart'); break;
			case 'buy-now': openCheckout('Shop Pay', [{ id, qty: pqty }]); break;
			case 'save': toggleSaved(id); break;
			case 'open-cart': $('#toast').classList.remove('is-on'); openSheet('cart'); break;
			case 'open-menu': openSheet('mmenu'); break;
			case 'close-sheets': closeSheets(); break;
			case 'close-search': e.preventDefault(); closeSearch(); $('#q').blur(); break;
			case 'cqty': { const l = cart.find((x) => x.id === id); setQty(id, l.qty + Number(t.dataset.d)); break; }
			case 'remove': setQty(id, 0); break;
			case 'checkout': openCheckout(t.dataset.method); break;
			case 'place-order': placeOrder(); break;
			case 'close-modal': closeModal(); break;
			case 'toggle-mega': {
				const open = !$('#mega').hidden;
				if (open && !megaHover) closeMega(); else openMega(false);
				break;
			}
			case 'pqty': {
				pqty = Math.max(1, Math.min(9, pqty + Number(t.dataset.d)));
				$('#pqty').textContent = pqty;
				$$('[data-action="pqty"]').forEach((b) => { b.disabled = (b.dataset.d === '-1' && pqty === 1) || (b.dataset.d === '1' && pqty === 9); });
				updateShipbox();
				break;
			}
			case 'gal': showImage(gIndex + Number(t.dataset.dir)); break;
			case 'thumb': showImage(Number(t.dataset.i)); break;
			case 'home-lang': homeLang = t.dataset.lang; keepFocus(renderHomeNew); break;
			case 'open-filters': lastFocus = t; $('#filters').classList.add('is-open'); $('#sheetScrim').classList.add('is-on'); document.body.classList.add('lock'); break;
			case 'close-filters': closeSheets(); break;
			case 'remove-filter': collection.f[t.dataset.facet].delete(t.dataset.value); applyCollection(); break;
			case 'clear-filters': Object.keys(collection.f).forEach((k) => collection.f[k].clear()); applyCollection(); break;
			case 'go': $('#toast').classList.remove('is-on'); location.hash = t.dataset.href; break;
			case 'soon': e.preventDefault(); toast(`${t.dataset.what || 'That'} isn't part of this prototype yet`); break;
			case 'reset-demo': {
				store.clear(); cart = []; saved.clear(); homeLang = 'all';
				renderCart(); updateBadges(); renderRoute(false);
				toast('Demo reset: cart and saved items cleared');
				break;
			}
		}
	});

	document.addEventListener('change', (e) => {
		const t = e.target;
		if (t.dataset.facet && collection) {
			const set = collection.f[t.dataset.facet];
			if (t.checked) set.add(t.value); else set.delete(t.value);
			applyCollection();
		} else if (t.id === 'sort' && collection) {
			collection.sort = t.value;
			applyCollection();
		}
	});

	document.addEventListener('submit', (e) => {
		if (e.target.id === 'footForm') {
			e.preventDefault();
			const input = e.target.querySelector('input');
			if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(input.value.trim())) { input.focus(); toast('Enter a valid email address'); return; }
			e.target.outerHTML = `<p class="foot-done" role="status">${ic('check', 18, 2.6)} You're on the list for drop alerts. (Prototype: nothing was sent.)</p>`;
			return;
		}
		if (e.target.id !== 'alertsForm') return;
		e.preventDefault();
		const f = e.target, email = f.email.value.trim();
		if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { f.email.focus(); f.email.style.boxShadow = 'inset 0 0 0 2px #D3262E'; toast('Enter a valid email address'); return; }
		const langs = $$('input[name="lang"]:checked', f).map((i) => LANGS[i.value].short);
		f.outerHTML = `<div class="alerts-done" role="status"><span style="width:40px;height:40px;border-radius:50%;background:var(--green);color:var(--ink);display:inline-flex;align-items:center;justify-content:center;flex:none">${ic('check', 20, 2.6)}</span><span>You're on the list. We'll email <strong>${esc(email)}</strong> about ${langs.length ? esc(langs.join(', ')) + ' drops' : 'every drop'}. (Prototype: nothing was sent.)</span></div>`;
	});

	document.addEventListener('input', (e) => {
		if (e.target.id === 'q') { srActive = -1; renderSearchPop(); }
		if (e.target.id === 'email') e.target.style.boxShadow = '';
	});

	document.addEventListener('focusin', (e) => { if (e.target.id === 'q') renderSearchPop(); });
	document.addEventListener('pointerdown', (e) => { if (e.target.id === 'q' && $('#searchPop').hidden) renderSearchPop(); });

	document.addEventListener('keydown', (e) => {
		const input = $('#q');
		if (e.target === input) {
			const items = $$('#searchPop .sr-item');
			if (e.key === 'ArrowDown' && items.length) { e.preventDefault(); srActive = (srActive + 1) % items.length; renderSearchPop(); }
			else if (e.key === 'ArrowUp' && items.length) { e.preventDefault(); srActive = srActive <= 0 ? items.length - 1 : srActive - 1; renderSearchPop(); }
			else if (e.key === 'Enter') {
				e.preventDefault();
				const q = input.value.trim(); if (!q) return;
				location.hash = srActive >= 0 && items[srActive] ? items[srActive].getAttribute('href') : '#/search?q=' + encodeURIComponent(q);
				input.blur();
			} else if (e.key === 'Escape') { closeSearch(); input.blur(); }
			return;
		}
		if (e.key === 'Escape') {
			if (!$('#modal').hidden) closeModal();
			else if ($('.sheet.is-open, .filters.is-open')) closeSheets();
			else closeMega();
			return;
		}
		const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName);
		if (e.key === '/' && !typing && !e.metaKey && !e.ctrlKey) { e.preventDefault(); input.focus(); }
	});

	document.addEventListener('mouseover', (e) => {
		if (e.target.closest('#shopBtn') && $('#mega').hidden) { clearTimeout(megaTimer); megaTimer = setTimeout(() => openMega(true), 140); }
	});
	document.addEventListener('mouseout', (e) => {
		if (e.target.closest('#shopBtn') && $('#mega').hidden) clearTimeout(megaTimer);
	});

	$('#scrim').addEventListener('click', () => { closeMega(); closeSearch(); });
	$('#sheetScrim').addEventListener('click', closeSheets);
	$('#modal').addEventListener('click', (e) => { if (e.target.id === 'modal') closeModal(); });
	window.addEventListener('hashchange', () => renderRoute(true));
	window.matchMedia('(max-width: 860px)').addEventListener('change', () => { renderFooter(route && route.name === 'home'); watchFooter(); });

	// ---------- boot ----------
	renderHeader();
	renderMobileMenu();
	renderCart();
	$('#hdr').addEventListener('mouseleave', () => { if (megaHover) { megaTimer = setTimeout(closeMega, 220); } });
	$('#hdr').addEventListener('mouseenter', () => { if (megaHover) clearTimeout(megaTimer); });
	updateBadges();
	renderRoute(false);
})();
