export const activityTemplates: Record<string, { names: string[]; descriptions: string[]; coords: [number, number][] }> = {
  'd1': {
    names: ['Praia da Joaquina', 'Lagoa da Conceição', 'Mercado Público', 'Trilha da Lagoinha do Leste', 'Ribeirão da Ilha', 'Santo Antônio de Lisboa', 'Barra da Lagoa', 'Jurerê Internacional'],
    descriptions: [
      'Famous surf beach with massive dunes and golden sand.',
      'A stunning lagoon perfect for windsurfing and waterside dining.',
      'Historic market with fresh seafood and local crafts.',
      'Challenging trail leading to one of the most beautiful hidden beaches.',
      'Historic fishing village famous for oyster farms.',
      'Charming Azorean village with art galleries and sunset views.',
      'Fishing village with a natural canal and boat rides.',
      'Upscale beach district with beach clubs and nightlife.',
    ],
    coords: [[-27.6308,-48.4753],[-27.5934,-48.4832],[-27.5969,-48.5495],[-27.7756,-48.4897],[-27.7142,-48.5669],[-27.5092,-48.5189],[-27.5734,-48.4226],[-27.4362,-48.4933]],
  },
  'd2': {
    names: ['Lago Negro', 'Rua Coberta', 'Mundo de Chocolate', 'Vinícola Ravanello', 'Mini Mundo', 'Snowland', 'Le Jardin Parque de Lavanda', 'Café Colonial'],
    descriptions: [
      'A romantic dark-water lake surrounded by European-style gardens.',
      'Covered street with restaurants, shops and live music performances.',
      'Interactive chocolate museum with tastings and factory tours.',
      'Award-winning winery with tastings and vineyard walks.',
      'Miniature park recreating famous world landmarks.',
      'South America\'s first indoor snow park with skiing and snowboarding.',
      'Lavender fields with panoramic views of the Serra Gaúcha.',
      'Traditional colonial-style afternoon tea with dozens of pastries.',
    ],
    coords: [[-29.3833,-50.8773],[-29.3749,-50.8760],[-29.3721,-50.8742],[-29.1647,-51.1538],[-29.3745,-50.8714],[-29.3701,-50.8619],[-29.3567,-50.8487],[-29.3682,-50.8798]],
  },
  'd3': {
    names: ['Baía do Sancho', 'Mirante dos Golfinhos', 'Mergulho no Sueste', 'Forte de Nossa Senhora', 'Praia do Leão', 'Trilha do Atalaia', 'Praia da Conceição', 'Passeio de Barco'],
    descriptions: [
      'Consistently voted one of the world\'s most beautiful beaches.',
      'Viewpoint where you can watch spinner dolphins at sunrise.',
      'Snorkeling spot teeming with sea turtles and tropical fish.',
      'Historic fortress with panoramic views of the archipelago.',
      'Turtle nesting beach with dramatic rock formations.',
      'Guided trail to natural tide pools with marine life.',
      'Long golden beach perfect for sunset contemplation.',
      'Boat tour around the islands with dolphin sightings.',
    ],
    coords: [[-3.8552,-32.4440],[-3.8636,-32.4456],[-3.8571,-32.4109],[-3.8393,-32.4116],[-3.8649,-32.4098],[-3.8669,-32.4224],[-3.8412,-32.4274],[-3.8489,-32.4330]],
  },
  'd4': {
    names: ['Cachoeira da Fumaça', 'Gruta da Lapa Doce', 'Poço Azul', 'Vale do Paty', 'Morro do Pai Inácio', 'Poço Encantado', 'Cachoeira do Buracão', 'Igatu'],
    descriptions: [
      'Brazil\'s tallest waterfall plunging 380 meters into the valley.',
      'Massive limestone cave with stunning stalactite formations.',
      'Underground cave pool with ethereal blue water lit by sunlight.',
      'Multi-day trek through one of Brazil\'s most scenic valleys.',
      'Iconic tabletop mountain with 360-degree panoramic views.',
      'Crystal-clear cave pool that glows blue in the morning light.',
      'Spectacular canyon waterfall reached via a river hike.',
      'Ghost town turned open-air art gallery in the mountains.',
    ],
    coords: [[-12.5833,-41.6167],[-12.3667,-41.5667],[-12.7506,-41.3367],[-12.4833,-41.4333],[-12.4519,-41.6056],[-12.7497,-41.3364],[-13.1531,-41.1142],[-12.5853,-41.3264]],
  },
  'd5': {
    names: ['Rio da Prata', 'Gruta do Lago Azul', 'Boia Cross', 'Aquário Natural', 'Abismo Anhumas', 'Buraco das Araras', 'Estância Mimosa', 'Rio Sucuri'],
    descriptions: [
      'Crystal-clear river snorkeling with schools of colorful fish.',
      'Blue-hued underground lake inside a massive cave.',
      'Thrilling river tubing through rapids and calm stretches.',
      'Natural spring aquarium with incredible underwater visibility.',
      'Rappel into a cave with an underground lake — for the bold.',
      'A giant natural sinkhole home to red macaw colonies.',
      'Waterfall trail through private ecological reserve.',
      'Peaceful float down one of the clearest rivers on Earth.',
    ],
    coords: [[-21.2489,-56.5272],[-21.1208,-56.5873],[-21.1569,-56.4731],[-21.2547,-56.4506],[-21.1317,-56.5731],[-21.4939,-56.5772],[-21.2011,-56.5036],[-21.2572,-56.4142]],
  },
  'd6': {
    names: ['La Boca & Caminito', 'Recoleta Cemetery', 'San Telmo Market', 'Teatro Colón', 'Puerto Madero', 'Parrilla Experience', 'MALBA Museum', 'Tango Show'],
    descriptions: [
      'Colorful neighborhood with street art, tango, and Italian heritage.',
      'Ornate mausoleum-filled cemetery where Evita rests.',
      'Sunday antique market with tango dancers and street performers.',
      'World-renowned opera house with stunning architecture.',
      'Modern waterfront district with excellent restaurants.',
      'Traditional Argentine steakhouse experience with Malbec wine.',
      'Latin American art museum with rotating contemporary exhibits.',
      'Authentic dinner tango show in a historic milonga venue.',
    ],
    coords: [[-34.6345,-58.3631],[-34.5882,-58.3939],[-34.6215,-58.3718],[-34.6011,-58.3833],[-34.6117,-58.3617],[-34.5996,-58.3750],[-34.5769,-58.4028],[-34.6150,-58.3800]],
  },
  'd7': {
    names: ['Ciudad Amurallada', 'Castillo San Felipe', 'Islas del Rosario', 'Getsemaní', 'Bazurto Market', 'Café del Mar', 'Playa Blanca', 'Chiva Party Bus'],
    descriptions: [
      'Walk the colorful colonial streets inside the walled old city.',
      'Massive hilltop fortress with tunnels and panoramic views.',
      'Island day trip with snorkeling and fresh seafood.',
      'Bohemian neighborhood with street art and lively nightlife.',
      'Authentic local market with tropical fruits and street food.',
      'Sunset cocktails on the ancient city walls.',
      'White-sand beach escape on the Barú peninsula.',
      'Iconic open-air party bus tour through the city at night.',
    ],
    coords: [[10.4236,-75.5503],[10.4225,-75.5373],[10.1764,-75.7536],[10.4199,-75.5492],[10.4000,-75.5133],[10.4267,-75.5483],[10.1742,-75.6122],[10.4150,-75.5400]],
  },
  'd8': {
    names: ['Machu Picchu Day Trip', 'Sacred Valley Tour', 'San Pedro Market', 'Sacsayhuamán', 'Rainbow Mountain', 'Chocolate Museum', 'Plaza de Armas', 'Pisco Sour Workshop'],
    descriptions: [
      'Train journey to the legendary Inca citadel in the clouds.',
      'Full-day tour of Ollantaytambo, Pisac, and Moray terraces.',
      'Bustling market with exotic fruits, fresh juices, and local dishes.',
      'Massive Inca stone fortress overlooking Cusco.',
      'High-altitude hike to the famous Vinicunca rainbow slopes.',
      'Learn about cacao and craft your own Peruvian chocolate.',
      'The grand central plaza flanked by colonial architecture.',
      'Hands-on cocktail class making Peru\'s national drink.',
    ],
    coords: [[-13.1631,-72.5450],[-13.3319,-72.1553],[-13.5186,-71.9786],[-13.5089,-71.9822],[-13.8700,-71.3028],[-13.5150,-71.9781],[-13.5170,-71.9785],[-13.5200,-71.9750]],
  },

  // ── New York City ──
  'd9': {
    names: ['Central Park', 'Statue of Liberty', 'Metropolitan Museum', 'Times Square & Broadway', 'Brooklyn Bridge Walk', 'Chelsea Market & High Line', 'Top of the Rock', 'DUMBO & Jane\'s Carousel'],
    descriptions: [
      'An 843-acre urban oasis with lakes, gardens, and iconic bridges in the heart of Manhattan.',
      'The enduring symbol of freedom — ferry ride, crown climb, and Ellis Island history.',
      'One of the world\'s greatest art museums with over 5,000 years of masterpieces.',
      'The neon-drenched crossroads of the world, gateway to legendary Broadway theaters.',
      'Walk the iconic 1883 suspension bridge with sweeping skyline views.',
      'Artisanal food hall below a stunning elevated park built on old rail tracks.',
      'Rockefeller Center\'s observation deck with panoramic views of the entire city.',
      'Cobblestone waterfront neighborhood with Manhattan Bridge views and vintage carousel.',
    ],
    coords: [[40.7829,-73.9654],[40.6892,-74.0445],[40.7794,-73.9632],[40.7580,-73.9855],[40.7061,-73.9969],[40.7425,-74.0061],[40.7587,-73.9787],[40.7033,-73.9893]],
  },

  // ── Hudson Valley ──
  'd10': {
    names: ['Storm King Art Center', 'Dia:Beacon', 'Walkway Over the Hudson', 'Mohonk Preserve', 'Hudson Valley Wine Trail', 'Kykuit – Rockefeller Estate', 'Bear Mountain State Park', 'Cold Spring Village'],
    descriptions: [
      'Massive open-air sculpture park set in rolling hills with monumental works.',
      'Former Nabisco factory turned contemporary art museum on the river.',
      'The world\'s longest elevated pedestrian bridge spanning the Hudson.',
      'Cliff trails and rock scrambles through pristine Shawangunk Ridge.',
      'Tour boutique wineries and cideries through scenic countryside.',
      'The Rockefeller family estate with stunning gardens and river views.',
      'Hike to panoramic views of the Hudson Highlands and beyond.',
      'Charming riverside village with antique shops and farm-to-table dining.',
    ],
    coords: [[41.4194,-74.0597],[41.5026,-73.9690],[41.7143,-73.9437],[41.7350,-74.1900],[41.7400,-73.9300],[41.0950,-73.8364],[41.3126,-74.0029],[41.4201,-73.9551]],
  },

  // ── San Francisco ──
  'd11': {
    names: ['Golden Gate Bridge', 'Alcatraz Island', 'Fisherman\'s Wharf', 'Chinatown', 'Mission District Murals', 'Golden Gate Park', 'Ferry Building Marketplace', 'Cable Car Ride'],
    descriptions: [
      'Walk or bike across the world\'s most photographed bridge with bay views.',
      'Eerie former federal prison on an island — book the night tour for chills.',
      'Waterfront hub with sea lions at Pier 39, chowder bowls, and bay cruises.',
      'The oldest and most vibrant Chinatown in North America.',
      'Colorful street art, taquerias, and the creative soul of the city.',
      'A 1,017-acre park with botanical gardens, bison paddock, and museums.',
      'Artisan food market with local vendors, oyster bars, and bay views.',
      'Ride the historic cable cars up and down San Francisco\'s famous hills.',
    ],
    coords: [[37.8199,-122.4783],[37.8267,-122.4230],[37.8080,-122.4177],[37.7941,-122.4078],[37.7583,-122.4148],[37.7694,-122.4862],[37.7955,-122.3937],[37.7946,-122.4119]],
  },

  // ── Big Sur ──
  'd12': {
    names: ['Bixby Creek Bridge', 'McWay Falls', 'Pfeiffer Beach', 'Julia Pfeiffer Burns SP', 'Point Lobos Reserve', 'Big Sur Bakery', 'Limekiln State Park', 'Nepenthe Restaurant'],
    descriptions: [
      'Iconic concrete arch bridge perched 260 feet above the Pacific — the most photographed spot on Highway 1.',
      'An 80-foot waterfall plunging directly onto a pristine beach cove.',
      'Hidden beach famous for its purple sand and dramatic keyhole rock arch.',
      'Coastal redwood trails with stunning ocean overlooks.',
      'The "Crown Jewel of the State Park System" with tide pools and sea otters.',
      'Rustic-chic bakery with wood-fired pizzas and pastries among the redwoods.',
      'Secluded park with towering redwoods, waterfalls, and historic kilns.',
      'Legendary cliff-side restaurant with panoramic coastline views.',
    ],
    coords: [[36.3714,-121.9016],[36.1582,-121.6726],[36.2380,-121.8152],[36.1580,-121.6720],[36.5220,-121.9468],[36.2597,-121.7900],[36.0061,-121.5179],[36.2378,-121.7747]],
  },

  // ── Los Angeles ──
  'd13': {
    names: ['Griffith Observatory', 'Santa Monica Pier', 'The Getty Center', 'Hollywood Walk of Fame', 'Venice Beach Boardwalk', 'Grand Central Market', 'LACMA & La Brea Tar Pits', 'Runyon Canyon Hike'],
    descriptions: [
      'Iconic observatory with free telescopes and the best city views in LA.',
      'Classic pier with Pacific Park amusement rides and ocean sunsets.',
      'World-class art museum with stunning architecture and city panoramas.',
      'Star-studded sidewalk through the heart of Hollywood.',
      'Eclectic boardwalk with street performers, skate parks, and muscle beach.',
      'Historic downtown food hall with diverse vendors since 1917.',
      'Art museum row next to prehistoric fossil site — LA culture at its best.',
      'Popular urban hike with sweeping views of the Hollywood sign and downtown.',
    ],
    coords: [[34.1184,-118.3004],[34.0095,-118.4973],[34.0780,-118.4741],[34.1016,-118.3267],[33.9850,-118.4695],[34.0508,-118.2489],[34.0639,-118.3592],[34.1060,-118.3485]],
  },

  // ── Austin ──
  'd14': {
    names: ['South Congress Avenue', 'Barton Springs Pool', 'Live Music on 6th Street', 'Lady Bird Lake Kayaking', 'Franklin Barbecue', 'Texas State Capitol', 'Mount Bonnell', 'Rainey Street District'],
    descriptions: [
      'Austin\'s most iconic strip with boutiques, food trailers, and "I Love You So Much" mural.',
      'Spring-fed natural swimming pool kept at a constant 68°F year-round.',
      'Legendary live-music district — the beating heart of Austin\'s sound.',
      'Paddle the downtown lake with skyline views and wildlife.',
      'James Beard award-winning BBQ — the line is part of the experience.',
      'The largest state capitol building in the US with free guided tours.',
      'Short hike to Austin\'s highest point with panoramic Lake Austin views.',
      'Converted bungalow bar district with craft cocktails and string lights.',
    ],
    coords: [[30.2488,-97.7497],[30.2640,-97.7710],[30.2672,-97.7388],[30.2620,-97.7420],[30.2702,-97.7312],[30.2747,-97.7403],[30.3215,-97.7733],[30.2567,-97.7393]],
  },

  // ── Big Bend National Park ──
  'd15': {
    names: ['Santa Elena Canyon', 'Emory Peak Summit', 'Hot Springs Trail', 'Window Trail', 'Ross Maxwell Scenic Drive', 'Boquillas Crossing', 'Lost Mine Trail', 'Stargazing at Chisos Basin'],
    descriptions: [
      '1,500-foot limestone canyon walls along the Rio Grande — hike right into the gap.',
      'The highest point in the park at 7,832 feet with 360-degree desert views.',
      'Soak in natural hot springs right on the banks of the Rio Grande.',
      'Follow a desert creek to a dramatic "window" framing the desert valley.',
      'Scenic drive through volcanic landscapes to Santa Elena Canyon.',
      'Cross the Rio Grande by rowboat to visit a tiny Mexican village.',
      'Steep switchback trail rewarded with expansive Chisos Mountain panoramas.',
      'One of the darkest skies in North America — the Milky Way blazes overhead.',
    ],
    coords: [[29.1675,-103.6089],[29.2456,-103.3006],[29.1785,-103.0117],[29.2700,-103.3100],[29.1800,-103.5000],[29.1900,-102.9400],[29.2750,-103.2800],[29.2700,-103.3000]],
  },

  // ── Paris ──
  'd16': {
    names: ['Eiffel Tower', 'Louvre Museum', 'Montmartre & Sacré-Cœur', 'Le Marais Quarter', 'Musée d\'Orsay', 'Seine River Cruise', 'Saint-Germain-des-Prés', 'Palace of Versailles'],
    descriptions: [
      'The iron lady of Paris — summit views at sunset are pure magic.',
      'Home to the Mona Lisa and 35,000 other works spanning millennia.',
      'Bohemian hilltop village with street artists, cafés, and basilica views.',
      'Medieval streets packed with concept stores, falafel joints, and galleries.',
      'Impressionist masterpieces in a breathtaking former railway station.',
      'Glide past illuminated monuments on an evening boat cruise.',
      'Literary cafés, jazz clubs, and boutiques in Paris\'s intellectual heart.',
      'The Sun King\'s palace with the legendary Hall of Mirrors and gardens.',
    ],
    coords: [[48.8584,2.2945],[48.8606,2.3376],[48.8867,2.3431],[48.8566,2.3622],[48.8600,2.3266],[48.8566,2.3522],[48.8539,2.3338],[48.8049,2.1204]],
  },

  // ── Amalfi Coast ──
  'd17': {
    names: ['Positano', 'Path of the Gods', 'Ravello\'s Villa Rufolo', 'Amalfi Cathedral', 'Capri Day Trip', 'Limoncello Tasting', 'Furore Fjord', 'Sunset from Praiano'],
    descriptions: [
      'Pastel-colored village cascading down cliffs to a pebble beach — Italy\'s most photographed town.',
      'Cliffside hiking trail with breathtaking panoramas 500 meters above the sea.',
      'Medieval villa with terraced gardens and sweeping coastal views.',
      'Stunning 9th-century cathedral with a dramatic staircase and cloister.',
      'Ferry to the glamorous island with the Blue Grotto and designer shopping.',
      'Visit a family-run lemon grove and taste authentic Amalfi limoncello.',
      'Hidden natural fjord with a dramatic stone bridge and turquoise water.',
      'The best sunset vantage point on the entire coast.',
    ],
    coords: [[40.6281,14.4850],[40.6350,14.5380],[40.6492,14.6118],[40.6340,14.6027],[40.5533,14.2224],[40.6400,14.6000],[40.6183,14.5508],[40.6150,14.5300]],
  },

  // ── Barcelona ──
  'd18': {
    names: ['La Sagrada Familia', 'Park Güell', 'La Boqueria Market', 'Gothic Quarter', 'Barceloneta Beach', 'Casa Batlló', 'Montjuïc Hill', 'El Born Cultural Center'],
    descriptions: [
      'Gaudí\'s unfinished masterpiece — a basilica that redefines what architecture can be.',
      'Whimsical mosaic park with city views and Gaudí\'s gingerbread houses.',
      'La Rambla\'s legendary food market with fresh juices, jamón, and seafood.',
      'Medieval labyrinth of narrow streets, hidden plazas, and Roman ruins.',
      'Golden sand beach minutes from the city center with seafood chiringuitos.',
      'Gaudí\'s surreal apartment building with a dragon-spine rooftop.',
      'Hilltop fortress, botanical gardens, and panoramic port views.',
      'Cultural hub in a medieval market building with exhibitions and tapas.',
    ],
    coords: [[41.4036,2.1744],[41.4145,2.1527],[41.3816,2.1719],[41.3833,2.1761],[41.3784,2.1925],[41.3916,2.1649],[41.3636,2.1586],[41.3854,2.1830]],
  },

  // ── Santorini ──
  'd19': {
    names: ['Oia Sunset', 'Red Beach', 'Akrotiri Archaeological Site', 'Fira to Oia Hike', 'Santo Wines Tasting', 'Amoudi Bay', 'Perissa Black Beach', 'Caldera Boat Tour'],
    descriptions: [
      'The world\'s most famous sunset from the blue-domed village perched on the caldera.',
      'Dramatic crimson volcanic cliffs meeting the deep blue Aegean.',
      'Preserved Minoan Bronze Age city buried by volcanic eruption 3,600 years ago.',
      'Stunning 10km clifftop trail connecting the island\'s two most beautiful towns.',
      'Wine tasting on a volcanic terrace overlooking the caldera.',
      'Tiny fishing port at the base of Oia\'s cliffs with tavernas and swimming.',
      'Long black volcanic sand beach with beach bars and crystal-clear water.',
      'Sail the caldera, swim in hot springs, and watch the sunset from the water.',
    ],
    coords: [[36.4613,25.3756],[36.3475,25.3930],[36.3519,25.4035],[36.4200,25.4300],[36.3700,25.4600],[36.4620,25.3700],[36.3530,25.4730],[36.4000,25.4300]],
  },

  // ── Swiss Alps ──
  'd20': {
    names: ['Jungfraujoch', 'Lauterbrunnen Valley', 'Lake Lucerne Cruise', 'Zermatt & Matterhorn', 'Grindelwald First', 'Interlaken Paragliding', 'Glacier Express Leg', 'Swiss Cheese & Chocolate Tour'],
    descriptions: [
      'The "Top of Europe" — a train ride to 3,454m with ice palace and Aletsch Glacier views.',
      'Valley of 72 waterfalls framed by sheer rock walls — Tolkien\'s inspiration for Rivendell.',
      'Scenic steamer cruise across Switzerland\'s most beautiful lake with alpine panoramas.',
      'Iconic pyramid peak viewed from the car-free mountain village.',
      'Cliff walk, First Flyer zipline, and alpine meadow hikes above Grindelwald.',
      'Tandem paragliding over turquoise lakes with snow-capped peaks all around.',
      'The world\'s most scenic rail journey through 91 tunnels and 291 bridges.',
      'Visit alpine dairies and chocolate factories in the Emmental and Broc regions.',
    ],
    coords: [[46.5474,7.9853],[46.5936,7.9081],[47.0502,8.3093],[46.0207,7.7491],[46.6590,8.0630],[46.6863,7.8632],[46.6500,8.6000],[46.6300,7.2500]],
  },
};
