// Quie growth playbook (part 2, 11 Oct 2026), rendered at #/growth-playbook.
// Growth playbook, part 2 (11 Oct 2026).

window.QUIE_PLAYBOOK = {
	sections: [
		['review', '01', 'Design review'],
		['overlays', '02', 'Photo overlays'],
		['seo', '03', 'Search'],
		['social', '04', 'Social series'],
		['engage', '05', 'Engagement'],
		['bets', '06', 'Growth bets'],
		['calendar', '07', 'First 30 days']
	],

	html: `
<header class="pb-hero">
	<div class="wrap">
		<div class="pb-meta">
			<span class="eyebrow">Growth playbook · Part 2</span>
			<span class="mono pb-date">11 Oct 2026</span>
		</div>
		<p class="pb-for"><strong>Quie Collectibles</strong> · quiecollectibles.com · follows the launch audit</p>
		<p class="pb-topics mono">Design review · SEO · social series · growth bets</p>
		<span class="pb-core"><span class="mono">Core play</span>Own the translation</span>
		<h1 class="disp">Collectors can't read the box. <em>Quie can be the shop that explains it.</em></h1>
		<p class="pb-lede">Chinese and Korean sets go by three or four names each, and no single page maps them. That confusion is Quie's opening. The site, the search plan and the social series below all push the same idea: Quie is where an English-speaking collector learns what a non-English box is, then buys it.</p>
	</div>
</header>

<div class="wrap pb-layout">
<nav class="pb-toc" aria-label="Playbook sections" id="pbToc"></nav>
<article class="pb-body">

<section class="pb-sec" id="pb-review">
	<div class="pb-head"><span class="pb-num mono">01</span><div><h2 class="disp">Design and copy review</h2><p class="pb-sub">What two independent reviews found</p></div></div>
	<p>The redesign went through two independent reviews, one for design and one for e-commerce copy, each done without context on how it was built. Both said language-first navigation is the right backbone. Both also found the same weak spots.</p>

	<h3>Already fixed in the redesign</h3>
	<ul class="pb-list pb-list--check">
		<li><strong>Product photos.</strong> The removed frames had left specks and lighter boxes behind. Backgrounds are now flattened to the exact tile color.</li>
		<li><strong>Language labels.</strong> Faint white pills became filled chips in each language's color, with native script plus a two-letter code. English is now black, so green only means "act" (buttons, in stock).</li>
		<li><strong>One name per thing.</strong> "English", "EN" and "S. Chinese" everywhere; "New this week" became "Just in", which can't go stale.</li>
		<li><strong>Collection page.</strong> Korean was announced seven ways. The sidebar, the filter pill and the per-card chips are gone; price filters sit in one row; the FAQ banner moved above the grid.</li>
		<li><strong>Product page.</strong> Title in Figtree at 32px, native set name and code under the chip (<span class="sc">太晶盛聚</span> · CSV9.5C), a caption saying the chase card is a possible pull, and the four FAQ questions buyers actually ask.</li>
		<li><strong>Mobile.</strong> All four languages in a header grid, a shorter hero so products appear sooner, 44px tap targets, language toggles on the drop-alert form.</li>
		<li><strong>Copy.</strong> Search shows that set codes work ("Try Eevee or CSV9.5C"), the cart nudge reads "Add $8.02 for free US shipping", and the drop alert drops the Instagram-only framing.</li>
	</ul>

	<div class="pb-callout pb-callout--warn">
		<h3>Still open, and only Mario can close them</h3>
		<ul class="pb-list">
			<li><strong>Confirm the promises</strong> before they go live: free US shipping over $100, ships in 1–2 business days, alerts a day before Instagram.</li>
			<li><strong>Fill the FAQ facts</strong> marked in brackets: where boxes come from, what he checks before listing, and the refund or replace rule for authenticity problems.</li>
			<li><strong>Set codes and pack counts</strong> for the five Korean boxes that don't list them yet. The card meta line promises them.</li>
		</ul>
	</div>

	<h3>Voice rules for every caption and listing</h3>
	<div class="pb-table"><table>
		<thead><tr><th>Rule</th><th>Sounds like</th></tr></thead>
		<tbody>
			<tr><td><strong>Facts first, adjectives rarely</strong></td><td class="pb-quote">"Crystal Gathering (CSV9.5C), Simplified Chinese. 10 packs × 10 cards. $74.99."</td></tr>
			<tr><td><strong>Say the catch before they ask</strong></td><td class="pb-quote">"Dent on the box. Shrink intact, packs sealed. Priced lower for it."</td></tr>
			<tr><td><strong>Mario, first person, one idea per sentence</strong></td><td class="pb-quote">"I check the shrink and the set code before I list a box." <span class="pb-note">Use only if true.</span></td></tr>
		</tbody>
	</table></div>
</section>

<section class="pb-sec" id="pb-overlays">
	<div class="pb-head"><span class="pb-num mono">02</span><div><h2 class="disp">Product photo overlays</h2><p class="pb-sub">Keep the frames, but move them off the product photos</p></div></div>
	<p class="pb-pull disp">On the site: clean. <em>Shared off the site: framed.</em></p>
	<p>The framed photos are the most recognizable thing Quie has made, and the big colored language label is the best scan cue in the store. The problem is where they live. Shopify sends product images to Google Shopping, and Google's image rules reject photos with superimposed logos, borders or overlay text. On a grid, the logo also repeats on every tile.</p>
	<ul class="pb-list">
		<li><strong>Product media:</strong> clean packshots only, because these feed Google free listings. The language label lives in the page as a colored chip (the design file shows options A, B and C side by side).</li>
		<li><strong>Link previews:</strong> use the framed photo as each product's share image. That is the OG image in the design file, and it is what people see when a product link lands in iMessage, Discord or Reddit.</li>
		<li><strong>Instagram, TikTok and story posts:</strong> framed, always. Reposted screenshots then carry the logo and the language.</li>
		<li><strong>How to wire it:</strong> add a file metafield such as <code>custom.share_image</code> to products, upload the framed version there, and change the theme's social-meta snippet to use it when present. It's about 10 lines of Liquid.</li>
		<li><strong>Collection images:</strong> the Korean and Chinese collections currently use national flags. Swap them for the native-script cards from the design file. Languages aren't countries, and the script is more specific.</li>
	</ul>
</section>

<section class="pb-sec" id="pb-seo">
	<div class="pb-head"><span class="pb-num mono">03</span><div><h2 class="disp">Search</h2><p class="pb-sub">Keep the URLs, rewrite the words, build one hub nobody else has</p></div></div>
	<p>The live store gets more right than most day-one Shopify stores. Product pages already output Product data with price, stock, SKU and barcode. The gaps are in titles, descriptions, collection pages and one brand field.</p>

	<h3>Keep or change</h3>
	<div class="pb-table"><table class="pb-table--wide">
		<thead><tr><th>Item</th><th>Live today</th><th>Verdict</th><th>Do this</th></tr></thead>
		<tbody>
			<tr><td><strong>URLs</strong></td><td><code>/products/pokemon-tcg-crystal-gathering-booster-box-simplified-chinese</code>, <code>/collections/pokemon-tcg-korean</code></td><td><span class="verdict verdict--keep">Keep</span></td><td>Descriptive already. Changing handles breaks links for no gain.</td></tr>
			<tr><td><strong>Product data</strong></td><td>Product + Offer with price, InStock, SKU and GTIN (e.g. 6978372718882)</td><td><span class="verdict verdict--keep">Keep</span></td><td>Barcodes are entered, which clears Google's identifier requirement.</td></tr>
			<tr><td><strong>Brand field</strong></td><td>Brand reads "Quie Collectibles" on every product</td><td><span class="verdict verdict--change">Change</span></td><td>Set the Shopify Vendor to "Pokémon" on Pokémon products so the brand matches the barcode. Keep "Quie Collectibles" only on Quie-made magnets and keychains.</td></tr>
			<tr><td><strong>Home title and meta</strong></td><td>"Pokémon TCG, Comics &amp; Collectibles"; description promises Spanish</td><td><span class="verdict verdict--change">Change</span></td><td>Title: <em>Japanese, Korean &amp; Chinese Pokémon Cards | Quie Collectibles</em>. Remove Spanish until it's stocked.</td></tr>
			<tr><td><strong>Collection pages</strong></td><td>Title "Pokémon TCG (Korean)", no description, no intro text</td><td><span class="verdict verdict--change">Change</span></td><td>Title: <em>Korean Pokémon Cards &amp; Booster Boxes | Quie Collectibles</em>. Add a 100–150 word intro: what's stocked, playability, authenticity, link to the FAQ.</td></tr>
			<tr><td><strong>Product titles</strong></td><td>"Pokémon TCG Crystal Gathering Booster Box (Simplified Chinese)"</td><td><span class="verdict verdict--adjust">Adjust</span></td><td>On-page: <em>Crystal Gathering Booster Box (Simplified Chinese)</em>. SEO title field: <em>Crystal Gathering Booster Box, Simplified Chinese Pokémon TCG CSV9.5C</em>. The code goes last so truncation cuts it first.</td></tr>
			<tr><td><strong>Meta descriptions</strong></td><td>Auto-made from the body: "Explore… Product Details Product: Crystal…"</td><td><span class="verdict verdict--change">Change</span></td><td>Write one per product: <em>Sealed Simplified Chinese Crystal Gathering box (CSV9.5C), 10 packs × 10 cards. Eevee set; Sylveon ex SAR is a possible pull. Ships from Plano, TX.</em></td></tr>
			<tr><td><strong>Share images</strong></td><td>Home uses the logo on white; collections use square flag images</td><td><span class="verdict verdict--adjust">Adjust</span></td><td>Use the four 1200×630 OG designs in the design file: home, collection, product (framed), guide.</td></tr>
			<tr><td><strong>Organization data</strong></td><td>Name and logo only</td><td><span class="verdict verdict--adjust">Adjust</span></td><td>Add <code>sameAs</code> links to Instagram, TikTok, YouTube, X and Facebook, plus a contact email.</td></tr>
			<tr><td><strong>FAQ markup</strong></td><td>None</td><td><span class="verdict verdict--skip">Skip</span></td><td>Google stopped showing FAQ rich results in May 2026. Write the FAQs for people anyway; that copy still ranks and gets quoted.</td></tr>
			<tr><td><strong>Search Console</strong></td><td>Unknown</td><td><span class="verdict verdict--change">Change</span></td><td>Verify the domain in Google Search Console and Bing Webmaster Tools, then submit <code>/sitemap.xml</code>.</td></tr>
		</tbody>
	</table></div>

	<div class="pb-callout pb-callout--green">
		<h3>The lopsided SEO bet: a set decoder</h3>
		<p>Collectors search the same box under several names. Crystal Gathering is also sold as Terastal Gathering and Great Crystal Grand Gathering, its Chinese name is <span class="sc">太晶盛聚</span>, its code is CSV9.5C, and its Japanese source set is Terastal Festival ex. Gem Pack Vol. 6 is also listed as Gemstone Volume 6. TCG Collector and Bulbapedia cover pieces of this, but no indexable page joins native name, English names, code, source set and the sealed product for both Chinese and Korean sets. A shop that publishes that table becomes the answer, and every row links to a product.</p>
	</div>

	<div class="pb-table"><table>
		<thead><tr><th>Page</th><th>Why it can rank</th><th>Links to</th></tr></thead>
		<tbody>
			<tr><td><strong>Set decoder hub</strong><span class="pb-cellsub">Chinese and Korean set names, codes and English equivalents</span></td><td>Unserved gap; forum threads end with "no easy way" to line up releases across languages.</td><td>Every product and collection</td></tr>
			<tr><td><strong>One page per set</strong><span class="pb-cellsub">"Crystal Gathering, Terastal Gathering or CSV9.5C? One set, five names"</span></td><td>New sets rank on social posts and card lists at first; a fast, complete page can take the slot.</td><td>That set's box</td></tr>
			<tr><td><strong>Gem Pack Vol. 1–6 (CBB1C–CBB6C)</strong></td><td>The best existing guide stops at Vol. 5 and gives no codes.</td><td>Gem Pack boxes</td></tr>
			<tr><td><strong>Are Chinese Pokémon cards real?</strong></td><td>Small shops' own guides win this query today.</td><td>S. Chinese collection</td></tr>
			<tr><td><strong>Can you play Japanese, Korean or Chinese cards at US tournaments? (2026)</strong></td><td>A clear, sourced answer: the May 2026 handbook lists English only for the US.</td><td>All language collections</td></tr>
			<tr><td><strong>Pull rates from our own openings</strong></td><td>Chinese pull-rate data comes from tiny samples; every box Mario opens on camera adds real numbers.</td><td>The opened set</td></tr>
		</tbody>
	</table></div>
	<p class="pb-aside">Skip "Japanese vs English Pokémon cards" for now. Established import shops and forums own it.</p>
</section>

<section class="pb-sec" id="pb-social">
	<div class="pb-head"><span class="pb-num mono">04</span><div><h2 class="disp">Social series</h2><p class="pb-sub">Seven formats Mario can make from one box a week</p></div></div>
	<p>Each series has a template in the design file. The rule that keeps it sustainable: open one box on camera each week, and cut everything else from that session.</p>
	<div class="pb-table"><table>
		<thead><tr><th>Series</th><th>Format</th><th>Cadence</th><th>Made from</th></tr></thead>
		<tbody>
			<tr><td><strong>What's in the box?</strong></td><td>Reel, 30–45s, episode numbered</td><td>Weekly</td><td>The weekly opening</td></tr>
			<tr><td><strong>Set decoder</strong></td><td>Carousel, 5–7 slides</td><td>Weekly</td><td>The decoder page rows</td></tr>
			<tr><td><strong>You pick, we rip</strong></td><td>Post + story poll</td><td>Weekly, before the opening</td><td>Two product photos</td></tr>
			<tr><td><strong>Just landed</strong></td><td>Framed product post</td><td>Every new listing</td><td>The framed product photo</td></tr>
			<tr><td><strong>Pull of the week</strong></td><td>Customer photo repost</td><td>Weekly</td><td>Tags from buyers</td></tr>
			<tr><td><strong>Dented box deal</strong></td><td>Post</td><td>When one comes in</td><td>A photo of the dent</td></tr>
			<tr><td><strong>Drop alert</strong></td><td>Story with countdown sticker</td><td>Before each drop</td><td>Product photos</td></tr>
		</tbody>
	</table></div>

	<div class="pb-cards">
		<div class="pb-card">
			<span class="pb-format mono">Reel · TikTok · Shorts</span>
			<h3>What's in the box?</h3>
			<p>Hook in the first two seconds: hold the box to camera and say the price and the language. Open in order, flip every holo slowly, end on the best pull. Cross-post the same file to all three platforms.</p>
			<div class="pb-caption"><span class="mono">Caption</span>EP 01: what's in a Korean MEGA Dream ex box? 10 packs, 10 cards each, $109.99. Best pull at the end. Which language should EP 02 be? Comment JP, KR or CN.</div>
		</div>
		<div class="pb-card">
			<span class="pb-format mono">Carousel · saves and shares</span>
			<h3>Set decoder</h3>
			<p>Slide 1: native name huge. Slide 2: the four other names. Slides 3–5: three chase cards with English names. Last slide: the box and price. Carousels are the format people save, and saves tell you a post was useful.</p>
			<div class="pb-caption"><span class="mono">Caption</span><span class="sc">太晶盛聚</span> is Crystal Gathering is Terastal Gathering is CSV9.5C. Same box, five names. The Japanese source set is Terastal Festival ex. Save this for the next time a listing confuses you. Comment DECODER and I'll send the full table.</div>
		</div>
		<div class="pb-card">
			<span class="pb-format mono">Post + story poll</span>
			<h3>You pick, we rip</h3>
			<p>Two boxes, numbered. The comments pick what gets opened in this week's reel, so the poll feeds the main series and gives people a reason to come back.</p>
			<div class="pb-caption"><span class="mono">Caption</span>Which one do I open Friday? Comment 1 or 2. 1: MEGA Dream ex, Korean. 2: Espeon &amp; Umbreon Premium Deck, Japanese. Winner gets opened on camera, every pack.</div>
		</div>
		<div class="pb-card">
			<span class="pb-format mono">Framed post · tag the product</span>
			<h3>Just landed</h3>
			<p>Use the framed photo, tag the product once the Instagram catalog is connected, and post within an hour of listing.</p>
			<div class="pb-caption"><span class="mono">Caption</span>Just landed: Crystal Gathering, Simplified Chinese (CSV9.5C). 10 packs × 10 cards, $74.99. Eevee set. The Sylveon ex SAR is a possible pull, never a promise. Link in bio.</div>
		</div>
		<div class="pb-card">
			<span class="pb-format mono">UGC repost</span>
			<h3>Pull of the week</h3>
			<p>Put a small card in every order: "Pulled something good? Tag @quiecollectibles. Pull of the week gets [store credit]." Repost the best one every week, with permission.</p>
			<div class="pb-caption"><span class="mono">Caption</span>Pull of the week: @[handle] opened a Gem Pack Vol. 6 and got [card]. Congrats. Tag @quiecollectibles to be next.</div>
		</div>
		<div class="pb-card">
			<span class="pb-format mono">Post · honesty as the hook</span>
			<h3>Dented box deal</h3>
			<p>Show the dent up close. Collectors who open boxes don't care about the outer carton, and saying it plainly builds the trust the authenticity FAQ depends on.</p>
			<div class="pb-caption"><span class="mono">Caption</span>Dented box. Sealed packs. Same odds. Gem Pack Vol. 6, Simplified Chinese, $32.99. Dent photos are in the listing.</div>
		</div>
	</div>

	<h3>Weekly rhythm</h3>
	<ul class="pb-list">
		<li><strong>Sunday:</strong> film one opening, photograph new stock framed and clean, take two candidate boxes for the poll.</li>
		<li><strong>Mon–Fri:</strong> one reel, one carousel, one poll or just-landed post; stories daily from the same footage.</li>
		<li><strong>Hashtags:</strong> 3–5, specific, e.g. <code>#koreanpokemon</code> <code>#chinesepokemoncards</code> <code>#pokemonpulls</code> <code>#dfwpokemon</code>.</li>
		<li><strong>Accounts:</strong> Instagram and TikTok only. Park YouTube, X, Facebook, Bluesky and Twitch with a pinned "find us on Instagram" note until the main two are working.</li>
	</ul>
</section>

<section class="pb-sec" id="pb-engage">
	<div class="pb-head"><span class="pb-num mono">05</span><div><h2 class="disp">Engagement</h2><p class="pb-sub">Give people a job, then reward them for doing it</p></div></div>
	<ul class="pb-list pb-list--grid">
		<li><strong>Comment to choose.</strong> The rip vote and "which language next" turn followers into the people deciding the content.</li>
		<li><strong>Guess the best pull.</strong> Before an opening, people guess the best card. Closest guess wins [store credit]. Cheap, and every guess is a comment.</li>
		<li><strong>Keyword DMs.</strong> "Comment DECODER and I'll send the table." Automate it with a DM tool if replies pile up; it trades a comment for a list signup.</li>
		<li><strong>Answer every comment in the first hour.</strong> Small accounts grow on conversation, and early replies keep a post alive.</li>
		<li><strong>Order insert with a QR code.</strong> One side: drop alerts signup. Other side: tag us for pull of the week.</li>
		<li><strong>A weekly live opening</strong> once the reels have an audience, on Instagram or Whatnot (below).</li>
	</ul>
</section>

<section class="pb-sec" id="pb-bets">
	<div class="pb-head"><span class="pb-num mono">06</span><div><h2 class="disp">Growth bets</h2><p class="pb-sub">Small cost, big upside if it hits</p></div></div>
	<p>Ordered by cost. Each one either builds the email list, earns links to the decoder, or puts boxes in front of collectors who haven't heard of Quie.</p>
	<div class="pb-table"><table class="pb-table--wide">
		<thead><tr><th>Bet</th><th>Cost</th><th>Why it could work</th><th>First move</th></tr></thead>
		<tbody>
			<tr><td><strong>Interest list before buying stock</strong></td><td><span class="cost">$0</span></td><td>Collect emails for an upcoming Chinese set before ordering. Zero inventory risk, and it sizes the order. TCG Collector shows the Chinese release calendar.</td><td>Add a "Tell me when [set] lands" form to the next set's decoder page.</td></tr>
			<tr><td><strong>Reddit, value first</strong></td><td><span class="cost">$0</span></td><td>r/PokemonTCG has a weekly self-promo thread; r/PKMNTCGDeals has a weekly local-store megathread; r/askDFW allows business mentions in comments when someone asks. Most other rules are unverified.</td><td>Read each sidebar. Post decoder tables with no link; answer questions; link only where a thread allows it.</td></tr>
			<tr><td><strong>Local store partners</strong></td><td><span class="cost">1 box</span></td><td>Lord Rush Collectibles (Frisco) runs a free monthly trade night; Common Ground Games (Dallas) runs Thursday league; Final Form Cards (Carrollton) runs monthly trade nights.</td><td>Offer a Korean box as league prize support, or co-host an "international pack night".</td></tr>
			<tr><td><strong>Creator seeding</strong></td><td><span class="cost">$60–110 / box</span></td><td>One honest opening video reaches more collectors than a month of posts. DK Cards (YouTube, about 40.7k, Irving TX) is local; tavscollects (TikTok, about 11k) lists paid TikToks at $100.</td><td>Send three boxes with an affiliate code. Ask for an honest opening, no script.</td></tr>
			<tr><td><strong>Card show table</strong></td><td><span class="cost">table fee</span></td><td>Collectors at shows buy sealed product and sign up for lists. Collect-A-Con's extra tables were listed at $150; other shows book through their own pages.</td><td>Attend one show as a buyer first, then table at Card Con in Plano (Nov 28) with dented boxes, magnets and a QR to drop alerts.</td></tr>
			<tr><td><strong>Asian community crossovers</strong></td><td><span class="cost">booth fee</span></td><td>Families who read Korean or Chinese are an audience English-only shops can't speak to. Carrollton's Koreatown, Plano's Mitsuwa and Richardson's DFW Chinatown are all near; Lunar New Year 2027 is Saturday, Feb 6.</td><td>Apply for a booth at a Lunar New Year festival; Richardson's 2026 one had outdoor booths.</td></tr>
			<tr><td><strong>Whatnot live breaks</strong></td><td><span class="cost">~11% fees</span></td><td>Live selling is where a lot of sealed Pokémon moves. Pokémon is on Whatnot's approved list, and checklists must state the language.</td><td>Apply as a seller and ask support whether non-English sealed counts under "Pokémon".</td></tr>
			<tr><td><strong>Referral credit</strong></td><td><span class="cost">$10 / order</span></td><td>Collectors buy in friend groups. A give-$10, get-$10 app costs nothing until it works.</td><td>Install a Shopify referral app after the first 20 orders.</td></tr>
		</tbody>
	</table></div>

	<div class="pb-pair">
		<div class="pb-callout pb-callout--warn"><p><strong>Keep supplier invoices.</strong> In August 2026 eBay pulled 30th Celebration listings sold before release over sourcing concerns. Quie sells a 30th Celebration product. Invoices protect the listing and give the authenticity FAQ its real answer.</p></div>
		<div class="pb-callout"><p><strong>Know the overlap.</strong> OneStopTCG in Addison sells Japanese and Simplified Chinese sealed, and Zenith TCG in Plano stocks Japanese. None of the DFW stores we checked advertised Korean sealed, so Korean is the clearest local opening.</p></div>
	</div>

	<h3>DFW events on the calendar</h3>
	<div class="pb-table"><table>
		<thead><tr><th>Date</th><th>Event</th><th>Where</th><th>Use it for</th></tr></thead>
		<tbody>
			<tr><td class="mono pb-nowrap">Oct 17</td><td><strong>NTX Pokémon &amp; TCG Card Show</strong></td><td>Fort Worth</td><td>Scout as a buyer</td></tr>
			<tr><td class="mono pb-nowrap">Oct 24–25</td><td><strong>Collect-A-Con Dallas</strong></td><td>KBHCC, Dallas</td><td>Scout; Hall B was sold out</td></tr>
			<tr><td class="mono pb-nowrap">Nov 7–8</td><td><strong>Collect-A-Con Fort Worth</strong></td><td>Fort Worth</td><td>Scout or table</td></tr>
			<tr><td class="mono pb-nowrap">Nov 14–15</td><td><strong>NTX Pokémon &amp; TCG Card Show</strong></td><td>Lewisville</td><td>Pokémon-focused crowd</td></tr>
			<tr><td class="mono pb-nowrap">Nov 21</td><td><strong>PokéNostalgia Card Show</strong></td><td>NTX Arena, Lewisville</td><td>Pokémon-focused crowd</td></tr>
			<tr class="pb-hl"><td class="mono pb-nowrap">Nov 28</td><td><strong>Card Con</strong></td><td>Plano Event Center</td><td>First table: closest show to home</td></tr>
			<tr><td class="mono pb-nowrap">Dec 4–6</td><td><strong>Anime Frontier</strong></td><td>Fort Worth Convention Center</td><td>Exhibitor form; bans counterfeits</td></tr>
			<tr><td class="mono pb-nowrap">Dec 5</td><td><strong>Swap Con Dallas (Pokémon &amp; TCG)</strong></td><td>Dallas Market Hall</td><td>Pokémon-focused crowd</td></tr>
			<tr><td class="mono pb-nowrap">Jan 20–24, 2027</td><td><strong>TCG National Convention</strong></td><td>KBHCC, Dallas</td><td>Large; meet creators and stores</td></tr>
			<tr><td class="mono pb-nowrap">Feb 6, 2027</td><td><strong>Lunar New Year</strong></td><td>Richardson, Plano, Frisco</td><td>Community booth</td></tr>
		</tbody>
	</table></div>
</section>

<section class="pb-sec" id="pb-calendar">
	<div class="pb-head"><span class="pb-num mono">07</span><div><h2 class="disp">First 30 days</h2><p class="pb-sub">In order</p></div></div>
	<ol class="pb-timeline">
		<li><span class="pb-step mono">1</span><div><span class="pb-when mono">Oct 12–18</span><h3>Plumbing</h3><p>Tracking from the audit (GA4, Meta pixel, Merchant Center). Vendor field set to Pokémon. New titles and descriptions for home and the four language collections. Share images live. Order insert printed.</p><span class="pb-effort">~1 day · nothing else works without it</span></div></li>
		<li><span class="pb-step mono">2</span><div><span class="pb-when mono">Oct 19–25</span><h3>The decoder</h3><p>Decoder hub with every set Quie stocks, plus the Crystal Gathering page. First "What's in the box?" reel and first decoder carousel. Reddit: two value posts, no links.</p><span class="pb-effort">~2 days · the long-term traffic asset</span></div></li>
		<li><span class="pb-step mono">3</span><div><span class="pb-when mono">Oct 26–Nov 1</span><h3>People</h3><p>Seed three creators. Pitch Lord Rush, Common Ground and Final Form on prize support. Start "You pick, we rip" and "Pull of the week".</p><span class="pb-effort">~3 boxes · first outside audiences</span></div></li>
		<li><span class="pb-step mono">4</span><div><span class="pb-when mono">Nov 2–8</span><h3>Review and commit</h3><p>Read the Monday numbers: which posts sent visitors, which pages converted, what people searched for. Book the Card Con table for Nov 28 if the list is growing.</p><span class="pb-effort">1 hour · decide with data</span></div></li>
	</ol>
</section>

<footer class="pb-sources">
	<p>Prepared 11 Oct 2026 from a review of the live store, two independent reviews of the redesign, and market research. Event dates, store programs and creator follower counts come from the sources below and will change; check each before acting. Subreddit rules change often; any we couldn't confirm are marked unverified.</p>
	<ul>
		<li><a href="https://support.google.com/merchants/answer/6324350" target="_blank" rel="noopener">Google Merchant Center: image requirements</a> · <a href="https://developers.google.com/search/updates" target="_blank" rel="noopener">Google Search Central: FAQ rich results change</a></li>
		<li><a href="https://mcdn.pokemon.com/pokemon-prod/raw/upload/v1/live/static-assets/content-assets/cms2/pdf/play-pokemon/rules/play-pokemon-tcg-tournament-handbook-en.pdf" target="_blank" rel="noopener">Play! Pokémon Tournament Handbook (May 2026)</a></li>
		<li><a href="https://bulbapedia.bulbagarden.net/wiki/Terastal_Gathering_%28ATCG%29" target="_blank" rel="noopener">Bulbapedia: Terastal Gathering</a> · <a href="https://www.tcgcollector.com/sets/cn" target="_blank" rel="noopener">TCG Collector: Chinese sets</a> · <a href="https://www.elitefourum.com/t/is-there-a-list-of-expansions-and-cards-released-in-korean-thai-indonesian-t-chinese-s-chinese/48232" target="_blank" rel="noopener">Elite Fourum thread on cross-language set lists</a></li>
		<li><a href="https://thecardshopfinder.com/events/tx/" target="_blank" rel="noopener">Card Shop Finder: Texas events</a> · <a href="https://www.collectaconusa.com/dfw-vendors" target="_blank" rel="noopener">Collect-A-Con vendors</a> · <a href="https://thecardshopfinder.com/event/card-con-plano-2026-11/" target="_blank" rel="noopener">Card Con Plano</a> · <a href="https://animefrontier.com/exhibitor-info/" target="_blank" rel="noopener">Anime Frontier exhibitors</a></li>
		<li><a href="https://communityimpact.com/frisco/business/lord-rush-collectibles-offers-pokemon-other-card-games-in-frisco/" target="_blank" rel="noopener">Lord Rush Collectibles</a> · <a href="https://www.boardgamesdallas.com/pages/pokemon-league" target="_blank" rel="noopener">Common Ground Games league</a> · <a href="https://www.finalformcards.com/" target="_blank" rel="noopener">Final Form Cards</a> · <a href="https://onestoptcg.com/collections/simplified-chinese-pokemon" target="_blank" rel="noopener">OneStopTCG</a> · <a href="https://zenithtcg.com/" target="_blank" rel="noopener">Zenith TCG</a></li>
		<li><a href="https://www.axios.com/local/dallas/2023/05/18/carrollton-texas-koreatown" target="_blank" rel="noopener">Axios: Carrollton Koreatown</a> · <a href="https://richardsontoday.com/?p=24735" target="_blank" rel="noopener">Richardson Lunar New Year festival</a></li>
		<li><a href="https://help.whatnot.com/hc/en-us/articles/39618879679757-Professionally-Sealed-Surprise-Products" target="_blank" rel="noopener">Whatnot: sealed surprise products</a> · <a href="https://www.dexerto.com/pokemon/pokemon-cracks-down-on-early-30th-anniversary-card-sales-over-stolen-property-concerns-3402079/" target="_blank" rel="noopener">Dexerto: early 30th Celebration listings pulled</a> · <a href="https://collabstr.com/tavscollects" target="_blank" rel="noopener">tavscollects on Collabstr</a></li>
	</ul>
</footer>

</article>
</div>`
};
