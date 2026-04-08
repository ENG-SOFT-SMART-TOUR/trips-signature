import type { Destination } from './types';

export const destinations: Destination[] = [
  // ── South America ──
  {
    id: 'd1', name: 'Florianópolis', country: 'Brasil',
    description: 'A tropical island paradise with pristine beaches, lush Atlantic Forest trails, and a vibrant surf culture that blends adventure with laid-back coastal charm.',
    tags: ['beach', 'nature', 'adventure', 'moderate'],
    image: 'https://images.unsplash.com/photo-1675726674424-c0a7ac0ecd01?w=800&h=600&fit=crop',
    latitude: -27.5954, longitude: -48.548,
  },
  {
    id: 'd2', name: 'Gramado', country: 'Brasil',
    description: 'A charming European-inspired mountain town known for its artisanal chocolate, fine dining, and cozy winter festivals nestled in the Serra Gaúcha.',
    tags: ['mountains', 'culture', 'gastronomy', 'comfortable'],
    image: 'https://images.unsplash.com/photo-1628682711021-e1c1666ec089?w=800&h=600&fit=crop',
    latitude: -29.3739, longitude: -50.8765,
  },
  {
    id: 'd3', name: 'Fernando de Noronha', country: 'Brasil',
    description: 'An exclusive volcanic archipelago with crystalline waters, world-class diving, and protected marine life — a true bucket-list destination.',
    tags: ['beach', 'nature', 'adventure', 'luxury'],
    image: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=800&h=600&fit=crop',
    latitude: -3.8547, longitude: -32.4247,
  },
  {
    id: 'd4', name: 'Chapada Diamantina', country: 'Brasil',
    description: 'Dramatic table-top mountains, hidden caves, thundering waterfalls, and endless trekking routes through Brazil\'s rugged interior.',
    tags: ['mountains', 'nature', 'adventure', 'budget'],
    image: 'https://images.unsplash.com/photo-1616379528184-8657a731f24f?w=800&h=600&fit=crop',
    latitude: -12.4292, longitude: -41.348,
  },
  {
    id: 'd5', name: 'Dubai', country: 'United Arab Emirates',
    description: 'A futuristic metropolis rising from the desert — record-breaking skyscrapers, luxury shopping, and golden dunes just minutes from the city center.',
    tags: ['city', 'luxury', 'culture', 'shopping'],
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop',
    latitude: 25.2048, longitude: 55.2708,
  },
  {
    id: 'd6', name: 'Buenos Aires', country: 'Argentina',
    description: 'A cosmopolitan capital pulsing with tango, world-class steakhouses, and a thriving arts scene.',
    tags: ['city', 'culture', 'gastronomy', 'comfortable'],
    image: 'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=800&h=600&fit=crop',
    latitude: -34.6037, longitude: -58.3816,
  },
  {
    id: 'd7', name: 'Cartagena', country: 'Colômbia',
    description: 'A walled colonial gem on the Caribbean coast with colorful streets, rich history, and vibrant nightlife.',
    tags: ['beach', 'city', 'culture', 'moderate'],
    image: 'https://images.unsplash.com/photo-1714686495394-73e2bb1bbd39?w=800&h=600&fit=crop',
    latitude: 10.391, longitude: -75.5144,
  },
  {
    id: 'd8', name: 'Cusco', country: 'Peru',
    description: 'The ancient Inca capital surrounded by sacred valleys, archaeological wonders, and the gateway to Machu Picchu.',
    tags: ['mountains', 'culture', 'history', 'adventure', 'moderate'],
    image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800&h=600&fit=crop',
    latitude: -13.532, longitude: -71.9675,
  },

  // ── New York State ──
  {
    id: 'd9', name: 'New York City', country: 'United States',
    description: 'The city that never sleeps — iconic skyline, world-class museums, Broadway, and an unmatched culinary scene across five diverse boroughs.',
    tags: ['city', 'culture', 'gastronomy', 'luxury'],
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=600&fit=crop',
    latitude: 40.7128, longitude: -74.0060,
  },
  {
    id: 'd10', name: 'Hudson Valley', country: 'United States',
    description: 'Rolling hills, historic estates, farm-to-table dining, and autumn foliage that rivals anywhere on earth — just an hour north of Manhattan.',
    tags: ['nature', 'culture', 'gastronomy', 'comfortable'],
    image: 'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=800&h=600&fit=crop',
    latitude: 41.4370, longitude: -74.0132,
  },

  // ── California ──
  {
    id: 'd11', name: 'San Francisco', country: 'United States',
    description: 'A fog-kissed gem on the bay with the Golden Gate, Victorian charm, cutting-edge cuisine, and neighborhoods bursting with creative energy.',
    tags: ['city', 'culture', 'gastronomy', 'moderate'],
    image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=600&fit=crop',
    latitude: 37.7749, longitude: -122.4194,
  },
  {
    id: 'd12', name: 'Big Sur', country: 'United States',
    description: 'Jaw-dropping Pacific coastline, towering redwoods, and one of the most scenic highway stretches on the planet — raw California beauty.',
    tags: ['nature', 'adventure', 'luxury', 'romantic'],
    image: 'https://images.unsplash.com/photo-1577940800897-c082cd6790f1?w=800&h=600&fit=crop',
    latitude: 36.2704, longitude: -121.8081,
  },
  {
    id: 'd13', name: 'Los Angeles', country: 'United States',
    description: 'Sun-soaked sprawl where Hollywood glamour meets beach culture, world-class art, and one of the most diverse food scenes on the planet.',
    tags: ['city', 'culture', 'beach', 'luxury'],
    image: 'https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?w=800&h=600&fit=crop',
    latitude: 34.0522, longitude: -118.2437,
  },

  // ── Texas ──
  {
    id: 'd14', name: 'Austin', country: 'United States',
    description: 'The live-music capital of the world, with thriving food-truck culture, tech innovation, and a "Keep It Weird" spirit all its own.',
    tags: ['city', 'culture', 'gastronomy', 'moderate'],
    image: 'https://images.unsplash.com/photo-1531218150217-54595bc2b934?w=800&h=600&fit=crop',
    latitude: 30.2672, longitude: -97.7431,
  },

  // ── Europe ──
  {
    id: 'd16', name: 'Paris', country: 'France',
    description: 'The City of Light — timeless architecture, legendary museums, Michelin-starred dining, and romance woven into every cobblestone.',
    tags: ['city', 'culture', 'gastronomy', 'luxury'],
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=600&fit=crop',
    latitude: 48.8566, longitude: 2.3522,
  },
  {
    id: 'd17', name: 'Amalfi Coast', country: 'Italy',
    description: 'Pastel villages clinging to dramatic cliffs above the turquoise Tyrrhenian Sea — Italy\'s most photogenic stretch of coastline.',
    tags: ['beach', 'culture', 'gastronomy', 'luxury'],
    image: 'https://images.unsplash.com/photo-1561956021-947f09ae0101?w=800&h=600&fit=crop',
    latitude: 40.6333, longitude: 14.6029,
  },
  {
    id: 'd18', name: 'Barcelona', country: 'Spain',
    description: 'Gaudí\'s surreal architecture, golden Mediterranean beaches, vibrant tapas bars, and a nightlife that runs until dawn.',
    tags: ['city', 'beach', 'culture', 'gastronomy', 'moderate'],
    image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&h=600&fit=crop',
    latitude: 41.3874, longitude: 2.1686,
  },
  {
    id: 'd19', name: 'Santorini', country: 'Greece',
    description: 'Whitewashed villages perched on volcanic cliffs overlooking the caldera — sunsets, wine, and Aegean blue at every turn.',
    tags: ['beach', 'culture', 'romantic', 'luxury'],
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&h=600&fit=crop',
    latitude: 36.3932, longitude: 25.4615,
  },
  {
    id: 'd20', name: 'Swiss Alps', country: 'Switzerland',
    description: 'Snow-capped peaks, emerald valleys, scenic rail journeys, and chocolate-box villages — the ultimate alpine escape.',
    tags: ['mountains', 'nature', 'adventure', 'luxury'],
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800&h=600&fit=crop',
    latitude: 46.8182, longitude: 8.2275,
  },
];
