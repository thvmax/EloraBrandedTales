/* ─────────────────────────────────────────────────────────────────────────────
   All project content lives here. The homepage reads it directly; the
   case-study pages under /work are generated from it by `node build.mjs`.

   t      title                      a / b   tagline (b is the highlighted part)
   tags   line above the tagline     yr      label shown on the page
   img    assets/hero-<img>.jpg      cover   videos/<cover>.mp4 (+ poster)
   o / i  overview / idea            st      three headline numbers
   r      what I did                 ch      chapters: title, text, facts, films
   A film is [file, label] or [file, label, 1] for a 16:9 film.
   ───────────────────────────────────────────────────────────────────────────── */
const seq=(p,n,l)=>Array.from({length:n},(_,i)=>[`${p}-${i+1}`,`${l} ${String(i+1).padStart(2,'0')}`]);

const WORK=[
 {slug:'verdana',t:'Verdana',tags:'Beyond Takes Shape · Community',a:'From square footage to a',b:'Sense of Belonging',
  yr:'2025 · Reportage Group',client:'Reportage Group',year:'2025',role:'Social Media Strategist',img:'township',cover:'verdana-1',
  title:'Verdana: Community Real Estate Campaign | Ei Chaw Myint Mo',
  desc:'How a township launch moved from square footage to belonging: community-first social storytelling for Reportage’s Verdana, with 11M+ views.',
  o:'Verdana is Reportage’s community township. Built on the ‘Beyond Takes Shape’ platform, the content moved the conversation from square footage to belonging — so people could picture a life there, not just a purchase.',
  i:'Lifestyle-first storytelling: resident moments, neighbourhood rhythms and community activations, cut into feed-native reels with hooks in the first second.',
  r:['Developed the campaign concept on the ‘Beyond Takes Shape’ platform','Led content strategy across Instagram and YouTube','Tracked performance and reported against KPIs'],
  st:[['+11M','Views'],['+20K','Interactions'],['+5K','Followers gained']],
  ch:[{id:'films',t:'Community',s:'reels',k:'The films',m:[['Format','Vertical reels'],['Platform','Instagram']],v:seq('verdana',2,'Reel')}]},

 {slug:'luxury-launches',t:'Luxury Launches',tags:'Panorama by ELIE SAAB · Brabus',a:'Couture living meets',b:'Horsepower',
  yr:'2025 — 2026 · Reportage Group',client:'Reportage Group',year:'2025 — 2026',role:'Social Media Strategist',img:'silk-car',cover:'launch-1',
  title:'Luxury Real Estate Launch Campaigns | Ei Chaw Myint Mo',
  desc:'Five luxury real estate launches for Reportage, from Panorama by ELIE SAAB to Brabus Island: teaser, reveal, on-ground coverage and recap.',
  o:'Launch campaigns for Reportage’s luxury collaborations, four international branch openings and live exhibition coverage — each rolled out as a localised social moment: teaser, countdown, on-ground coverage and recap.',
  i:'Localise the voice, not the brand: market-specific hooks, native-language captions, and real-time stories from the exhibition floor.',
  r:['Developed the campaign concept for each launch','Planned every rollout: teaser, countdown, on-ground coverage, recap','Aligned international branch pages with group standards','Worked with creative and paid media teams across markets'],
  st:[['389K+','Exhibition views'],['10K','Followers from scratch'],['4','International branches']],
  ch:[
   {id:'panorama',t:'Panorama',s:'by ELIE SAAB',k:'Sea Breeze, Baku',p:'A couture-branded residence at Sea Breeze on the Caspian coast. The rollout ran in sequence: a quiet material teaser, the name reveal, the groundbreaking, launch night, and a destination film that sells Baku before it sells the building.',
    m:[['Market','Azerbaijan'],['Rollout','Teaser · Reveal · Event · Film']],v:[['launch-3','Launch film',1],['launch-4','Teaser & reveal'],['intl-3','Groundbreaking'],['intl-6','Launch night'],['launch-5','Sea Breeze — destination']]},
   {id:'brabus-island',t:'Brabus',s:'Island',k:'Launch night',p:'Automotive attitude applied to real estate. Coverage followed the night as it unfolded: the car on arrival, the stage reveal, the keynote and the room, cut fast enough to match the brand.',
    m:[['Format','Event recap reel'],['Rollout','Live stories · Recap']],v:[['launch-2','Launch night']]},
   {id:'abu-dhabi',t:'Project reveal,',s:'Abu Dhabi',k:'Abu Dhabi',p:'A reveal built for the phones in the room: the countdown, the model unveiling and the crowd’s first reaction, published while the event was still running.',
    m:[['Market','UAE'],['Format','On-ground coverage']],v:[['launch-1','Reveal night']]},
   {id:'markets',t:'International',s:'markets',k:'4 branches',p:'Four branch openings, one playbook. Each market got its own hook and its own language, from “Niyə Azərbaycan?” in Baku to the Africa series, while the brand stayed recognisably Reportage.',
    m:[['Markets','Azerbaijan · Africa · Albania · Europe'],['Result','10K followers from scratch']],v:[['intl-4','Niyə Azərbaycan?'],['intl-2','Reportage Heights'],['intl-1','Africa'],['intl-5','Market film']]},
   {id:'exhibitions',t:'Exhibitions:',s:'ADIS & ACRES',k:'ADIS · ACRES',p:'Real-time coverage from the exhibition floor: stand walk-throughs, visitor moments and a presenter-led recap, posted the same day.',
    m:[['Format','Live story · Recap'],['Result','389K+ exhibition views']],v:[['adis','ADIS — live story'],['acres','ACRES — recap']]}
  ]},

 {slug:'reportage-rebrand',t:'Reportage Rebrand',tags:'19 Countries · One Voice',a:'One voice,',b:'Zero drift',
  yr:'2025 — 2026 · Reportage Group',client:'Reportage Group',year:'2025 — 2026',role:'Social Media Strategist',img:'guidelines',cover:'rebrand-3',
  title:'Reportage Rebrand: 19-Country Social Rollout | Ei Chaw Myint Mo',
  desc:'Social media guidelines for HQ and 19 countries, and the rollout series that introduced the new Reportage brand with one voice in every market.',
  o:'For the brand refresh, I authored standardized social media guidelines spanning HQ and 19 countries — built on the master brand guideline to keep one voice in every market — and led the rollout series from pre-launch teasers to live event coverage.',
  i:'‘Share Your Story’ invited homeowners and partners to tell their own Reportage moments on camera — UGC cut into reels, plus a winner documentary.',
  r:['Authored the social media guidelines for HQ and 19 countries','Led the rollout series, from pre-launch teasers to live event coverage','Turned homeowner and partner stories into reels and a documentary'],
  st:[['+442K','Views'],['+1.9K','Interactions'],['19','Countries']],
  ch:[
   {id:'rollout',t:'The rollout',s:'series',k:'Rollout',p:'The new identity was introduced in stages, so every market saw the same story in the same order: pre-launch teasers, the reveal, then live coverage from the event.',
    m:[['Rollout','Teaser · Launch · Event'],['Markets','19 countries']],v:seq('rebrand',3,'Rollout')},
   {id:'share-your-story',t:'Share',s:'Your Story',k:'Campaign',p:'Homeowners and partners told their own Reportage moments on camera. The entries were cut into reels, and the winning story became a short documentary.',
    m:[['Format','UGC reels · Documentary']],v:[['goldbar-1','Documentary'],['goldbar-2','Reel']]}
  ]},

 {slug:'the-dot-series',t:'The Dot Series',tags:'Podcast · Thought Leadership',a:'Long-form thinking,',b:'Short-form living',
  yr:'2025 — 2026 · Reportage Group',client:'Reportage Group',year:'2025 — 2026',role:'Social Media Strategist',img:'mic',cover:'podcast-1',
  title:'The Dot Series: Podcast Social Strategy | Ei Chaw Myint Mo',
  desc:'A leadership podcast planned to live twice: once in full, and again as a run of short clips built to stop the scroll.',
  o:'A podcast where leaders and guests unpack real estate, ambition and the city. Every episode was planned to live twice — once in full, and again as a run of scroll-stopping clips.',
  i:'One episode, ten moments: pull the sharpest 30 seconds, add captions and a hook, then let the clips do the reach while the full episode builds the depth.',
  r:['Planned each episode for two formats: full length and clips','Chose the moments, hooks and captions for every clip','Published the clip run and reported on its reach'],
  st:[['59K','Views'],['8K','Interactions'],['1K','Followers gained']],
  ch:[{id:'films',t:'Episode',s:'clips',k:'The films',m:[['Format','Captioned clips'],['Source','Full-length podcast']],v:seq('podcast',3,'Clip')}]},

 {slug:'rangoon-tea-house',t:'Rangoon Tea House',tags:'Poke Creative Studio · TikTok',a:'Ten years of nostalgia, poured into',b:'one teacup',
  yr:'2024 — 2025 · Poke Creative Studio',client:'Rangoon Tea House',year:'2024 — 2025',role:'Social Media Manager, Poke Creative Studio',img:'tea',cover:'rth-3',
  title:'Rangoon Tea House 10th Anniversary Campaign | Ei Chaw Myint Mo',
  desc:'A 10th-anniversary TikTok campaign for Yangon’s Rangoon Tea House: nostalgia as a format, with 2.3M organic views and a 70% visibility lift.',
  o:'A Yangon icon with a decade of memories. The 10th-anniversary campaign turned the brand’s nostalgia into a TikTok series and LinkedIn recaps — content that felt like coming home, one cup at a time.',
  i:'Nostalgia as a format: familiar flavours, old-school moments and a modern edit — native to TikTok, recapped for a professional audience on LinkedIn.',
  r:['Initiated the campaign’s big idea and developed it with the team','Led campaign content, including the founder’s interview','Ran the TikTok series and the LinkedIn recaps'],
  st:[['70%','Visibility lift'],['1.8M','Organic reach'],['2.3M','Organic views']],
  ch:[{id:'films',t:'The anniversary',s:'series',k:'The films',m:[['Platform','TikTok'],['Recaps','LinkedIn']],v:seq('rth',5,'TikTok')}]},

 {slug:'rene-mattias',t:'Rene Mattias',tags:'Fashion Film · Teaser',a:'A fashion film the feed',b:'didn’t skip',
  yr:'2024 · Poke Creative Studio',client:'Rene Mattias',year:'2024',role:'Assistant Strategist, Poke Creative Studio',img:'silk',cover:'rene-1',
  title:'Rene Mattias: Fashion Film Campaign | Ei Chaw Myint Mo',
  desc:'A short-film concept for fashion brand Rene Mattias, carried by a brand mini-series and 14 short reels, with a 35% visibility lift.',
  o:'Ideated an out-of-the-box short-film concept for the fashion brand, working across production and influencer management — powered by a brand mini-series and a run of short reels.',
  i:'Plan for the edit on set: capture vertical first, grab the hooks, the details and the candid in-between moments the feed loves.',
  r:['Ideated the short-film concept','Worked with third-party production teams through the shoot','Managed influencer coordination'],
  st:[['35%','Visibility lift'],['14','Short reels'],['1','Brand mini-series']],
  ch:[{id:'films',t:'Teasers',s:'& reels',k:'The films',m:[['Format','Short film · Reels']],v:seq('rene',5,'Reel')}]}
];
WORK.forEach(w=>{ w.v=w.ch.flatMap(c=>c.v); });
if(typeof module!=='undefined') module.exports=WORK;
