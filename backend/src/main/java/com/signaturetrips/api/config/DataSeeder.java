package com.signaturetrips.api.config;

import com.signaturetrips.api.domain.entity.Atividade;
import com.signaturetrips.api.domain.entity.Destino;
import com.signaturetrips.api.domain.repository.AtividadeRepository;
import com.signaturetrips.api.domain.repository.DestinoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.text.Normalizer;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

@Component
public class DataSeeder implements CommandLineRunner {

    // Coordenadas sinteticas de demo: centro aproximado e dispersao deterministica por atividade.
    private static final double RAIO_DISPERSAO = 0.012;

    // Centro de cada destino seedado (lat, lng). Chave = codigo estavel, independente do nome exibido.
    private static final Map<String, double[]> COORDENADAS = Map.ofEntries(
        Map.entry("florianopolis", new double[]{-27.5949, -48.5482}),
        Map.entry("gramado", new double[]{-29.3747, -50.8764}),
        Map.entry("fernando-de-noronha", new double[]{-3.8549, -32.4297}),
        Map.entry("chapada-diamantina", new double[]{-12.5630, -41.3907}),
        Map.entry("dubai", new double[]{25.2048, 55.2708}),
        Map.entry("buenos-aires", new double[]{-34.6037, -58.3816}),
        Map.entry("cartagena", new double[]{10.3910, -75.4794}),
        Map.entry("cusco", new double[]{-13.5320, -71.9675}),
        Map.entry("new-york-city", new double[]{40.7128, -74.0060}),
        Map.entry("hudson-valley", new double[]{41.7004, -73.9210}),
        Map.entry("san-francisco", new double[]{37.7749, -122.4194}),
        Map.entry("big-sur", new double[]{36.2704, -121.8081}),
        Map.entry("los-angeles", new double[]{34.0522, -118.2437}),
        Map.entry("austin", new double[]{30.2672, -97.7431}),
        Map.entry("paris", new double[]{48.8566, 2.3522}),
        Map.entry("amalfi-coast", new double[]{40.6340, 14.6027}),
        Map.entry("barcelona", new double[]{41.3874, 2.1686}),
        Map.entry("santorini", new double[]{36.3932, 25.4615}),
        Map.entry("swiss-alps", new double[]{46.6863, 7.8632})
    );

    private final DestinoRepository destinoRepository;
    private final AtividadeRepository atividadeRepository;

    public DataSeeder(DestinoRepository destinoRepository, AtividadeRepository atividadeRepository) {
        this.destinoRepository = destinoRepository;
        this.atividadeRepository = atividadeRepository;
    }

    @Override
    public void run(String... args) {
        if (destinoRepository.count() == 0) {
            seedDestinos();
        }
        if (atividadeRepository.count() == 0) {
            seedAtividades();
        } else {
            preencherCoordenadasFaltantes();
        }
    }

    // Bancos populados antes do RF07 ja tinham atividades, mas sem lat/lng,
    // e o seed completo só roda com a tabela vazia. Preenche o que falta
    // reaplicando a mesma dispersao deterministica do seed.
    private void preencherCoordenadasFaltantes() {
        for (Destino destino : destinoRepository.findAll()) {
            preencherCodigoSeedLegado(destino);
            List<Atividade> atividades = atividadeRepository.findByDestinoId(destino.getId());
            boolean faltaCoordenada = atividades.stream()
                .anyMatch(a -> a.getLatitude() == null || a.getLongitude() == null);
            if (!faltaCoordenada) {
                continue;
            }
            atividades.sort(Comparator.comparing(Atividade::getId));
            aplicarCoordenadas(destino, atividades);
            atividadeRepository.saveAll(atividades);
        }
    }

    private void preencherCodigoSeedLegado(Destino destino) {
        if (destino.getCodigoSeed() != null && !destino.getCodigoSeed().isBlank()) {
            return;
        }
        destino.setCodigoSeed(normalizarCodigoSeed(destino.getNome()));
        destinoRepository.save(destino);
    }

    private String normalizarCodigoSeed(String nome) {
        return Normalizer.normalize(nome, Normalizer.Form.NFD)
            .replaceAll("\\p{M}", "")
            .toLowerCase(Locale.ROOT)
            .replaceAll("[^a-z0-9]+", "-")
            .replaceAll("(^-|-$)", "");
    }

    private void seedDestinos() {
        destinoRepository.save(destino("florianopolis", "Florianópolis", "Brasil", "A tropical island paradise with pristine beaches, lush Atlantic Forest trails, and a vibrant surf culture.", "https://images.unsplash.com/photo-1675726674424-c0a7ac0ecd01?w=800&h=600&fit=crop", "beach", Set.of("beach", "nature", "adventure", "moderate")));
        destinoRepository.save(destino("gramado", "Gramado", "Brasil", "A charming European-inspired mountain town known for its artisanal chocolate, fine dining, and cozy winter festivals.", "https://images.unsplash.com/photo-1628682711021-e1c1666ec089?w=800&h=600&fit=crop", "mountains", Set.of("mountains", "culture", "gastronomy", "comfortable")));
        destinoRepository.save(destino("fernando-de-noronha", "Fernando de Noronha", "Brasil", "An exclusive volcanic archipelago with crystalline waters, world-class diving, and protected marine life.", "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=800&h=600&fit=crop", "beach", Set.of("beach", "nature", "adventure", "luxury")));
        destinoRepository.save(destino("chapada-diamantina", "Chapada Diamantina", "Brasil", "Dramatic table-top mountains, hidden caves, thundering waterfalls, and endless trekking routes.", "https://images.unsplash.com/photo-1616379528184-8657a731f24f?w=800&h=600&fit=crop", "mountains", Set.of("mountains", "nature", "adventure", "budget")));
        destinoRepository.save(destino("dubai", "Dubai", "United Arab Emirates", "A futuristic metropolis rising from the desert — record-breaking skyscrapers and luxury shopping.", "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop", "city", Set.of("city", "luxury", "culture")));
        destinoRepository.save(destino("buenos-aires", "Buenos Aires", "Argentina", "A cosmopolitan capital pulsing with tango, world-class steakhouses, and a thriving arts scene.", "https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=800&h=600&fit=crop", "city", Set.of("city", "culture", "gastronomy", "comfortable")));
        destinoRepository.save(destino("cartagena", "Cartagena", "Colômbia", "A walled colonial gem on the Caribbean coast with colorful streets, rich history, and vibrant nightlife.", "https://images.unsplash.com/photo-1714686495394-73e2bb1bbd39?w=800&h=600&fit=crop", "beach", Set.of("beach", "city", "culture", "moderate")));
        destinoRepository.save(destino("cusco", "Cusco", "Peru", "The ancient Inca capital surrounded by sacred valleys and the gateway to Machu Picchu.", "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800&h=600&fit=crop", "mountains", Set.of("mountains", "culture", "adventure", "moderate")));
        destinoRepository.save(destino("new-york-city", "New York City", "United States", "The city that never sleeps — iconic skyline, world-class museums, Broadway, and an unmatched culinary scene.", "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=600&fit=crop", "city", Set.of("city", "culture", "gastronomy", "luxury")));
        destinoRepository.save(destino("hudson-valley", "Hudson Valley", "United States", "Rolling hills, historic estates, farm-to-table dining, and autumn foliage just an hour north of Manhattan.", "https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=800&h=600&fit=crop", "nature", Set.of("nature", "culture", "gastronomy", "comfortable")));
        destinoRepository.save(destino("san-francisco", "San Francisco", "United States", "A fog-kissed gem on the bay with the Golden Gate, Victorian charm, and cutting-edge cuisine.", "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=600&fit=crop", "city", Set.of("city", "culture", "gastronomy", "moderate")));
        destinoRepository.save(destino("big-sur", "Big Sur", "United States", "Jaw-dropping Pacific coastline, towering redwoods, and one of the most scenic highway stretches on the planet.", "https://images.unsplash.com/photo-1577940800897-c082cd6790f1?w=800&h=600&fit=crop", "nature", Set.of("nature", "adventure", "luxury")));
        destinoRepository.save(destino("los-angeles", "Los Angeles", "United States", "Sun-soaked sprawl where Hollywood glamour meets beach culture, world-class art, and diverse food scenes.", "https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?w=800&h=600&fit=crop", "city", Set.of("city", "culture", "beach", "luxury")));
        destinoRepository.save(destino("austin", "Austin", "United States", "The live-music capital of the world, with thriving food-truck culture and a Keep It Weird spirit.", "https://images.unsplash.com/photo-1531218150217-54595bc2b934?w=800&h=600&fit=crop", "city", Set.of("city", "culture", "gastronomy", "moderate")));
        destinoRepository.save(destino("paris", "Paris", "France", "The City of Light — timeless architecture, legendary museums, Michelin-starred dining, and romance.", "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=600&fit=crop", "city", Set.of("city", "culture", "gastronomy", "luxury")));
        destinoRepository.save(destino("amalfi-coast", "Amalfi Coast", "Italy", "Pastel villages clinging to dramatic cliffs above the turquoise Tyrrhenian Sea.", "https://images.unsplash.com/photo-1561956021-947f09ae0101?w=800&h=600&fit=crop", "beach", Set.of("beach", "culture", "gastronomy", "luxury")));
        destinoRepository.save(destino("barcelona", "Barcelona", "Spain", "Gaudí's surreal architecture, golden Mediterranean beaches, vibrant tapas bars, and nightlife until dawn.", "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&h=600&fit=crop", "city", Set.of("city", "beach", "culture", "gastronomy", "moderate")));
        destinoRepository.save(destino("santorini", "Santorini", "Greece", "Whitewashed villages perched on volcanic cliffs overlooking the caldera — sunsets, wine, and Aegean blue.", "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&h=600&fit=crop", "beach", Set.of("beach", "culture", "luxury")));
        destinoRepository.save(destino("swiss-alps", "Swiss Alps", "Switzerland", "Snow-capped peaks, emerald valleys, scenic rail journeys, and chocolate-box villages.", "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800&h=600&fit=crop", "mountains", Set.of("mountains", "nature", "adventure", "luxury")));
    }

    private void seedAtividades() {
        List<Destino> destinos = destinoRepository.findAll();
        for (Destino d : destinos) {
            List<Atividade> atividades = atividadesParaDestino(d);
            aplicarCoordenadas(d, atividades);
            atividadeRepository.saveAll(atividades);
        }
    }

    // Offset deterministico por indice: re-seed produz as mesmas coordenadas sinteticas de demo.
    private void aplicarCoordenadas(Destino destino, List<Atividade> atividades) {
        double[] base = COORDENADAS.get(destino.getCodigoSeed());
        if (base == null) {
            return;
        }
        for (int i = 0; i < atividades.size(); i++) {
            double angulo = 2 * Math.PI * i / atividades.size();
            atividades.get(i).setLatitude(base[0] + RAIO_DISPERSAO * Math.cos(angulo));
            atividades.get(i).setLongitude(base[1] + RAIO_DISPERSAO * Math.sin(angulo));
        }
    }

    private List<Atividade> atividadesParaDestino(Destino d) {
        return switch (d.getCategoria()) {
            case "beach" -> List.of(
                ativ(d, "Surf Lesson", "Adventure", "3h", "morning",
                    "Learn to ride the waves with a certified instructor on the best local breaks.",
                    "https://picsum.photos/seed/surf-lesson/800/600"),
                ativ(d, "Snorkeling Tour", "Nature", "2h", "afternoon",
                    "Explore vibrant underwater life in crystal-clear waters with a guided tour.",
                    "https://picsum.photos/seed/snorkeling/800/600"),
                ativ(d, "Sunset Beach Walk", "Sightseeing", "1h", "evening",
                    "Stroll along the shore as the sun dips below the horizon in a blaze of color.",
                    "https://picsum.photos/seed/sunset-beach/800/600"),
                ativ(d, "Boat Tour", "Adventure", "4h", "morning",
                    "Explore hidden coves and sea caves aboard a traditional wooden boat.",
                    "https://picsum.photos/seed/boat-tour/800/600"),
                ativ(d, "Beachside Seafood Lunch", "Food & Drink", "2h", "afternoon",
                    "Savour the freshest catch of the day at a classic seaside restaurant.",
                    "https://picsum.photos/seed/seafood-lunch/800/600")
            );
            case "mountains" -> List.of(
                ativ(d, "Mountain Hike", "Adventure", "5h", "morning",
                    "Trek through stunning highland scenery with panoramic summit views.",
                    "https://picsum.photos/seed/mountain-hike/800/600"),
                ativ(d, "Waterfall Trek", "Nature", "3h", "morning",
                    "Follow a scenic trail to a breathtaking cascade hidden deep in the forest.",
                    "https://picsum.photos/seed/waterfall-trek/800/600"),
                ativ(d, "Valley Viewpoint", "Sightseeing", "2h", "afternoon",
                    "Take in sweeping valley views from a classic lookout point above the treeline.",
                    "https://picsum.photos/seed/valley-view/800/600"),
                ativ(d, "Local Cuisine Evening", "Food & Drink", "2h", "evening",
                    "Sample hearty mountain dishes and regional specialties at a cosy local tavern.",
                    "https://picsum.photos/seed/mountain-food/800/600"),
                ativ(d, "Cable Car Ride", "Sightseeing", "1h", "afternoon",
                    "Glide above the treetops for a bird's-eye view of the entire mountain range.",
                    "https://picsum.photos/seed/cable-car/800/600")
            );
            case "city" -> List.of(
                ativ(d, "City Walking Tour", "Sightseeing", "3h", "morning",
                    "Discover the city's most iconic landmarks and hidden gems on foot with a local guide.",
                    "https://picsum.photos/seed/city-walk/800/600"),
                ativ(d, "Museum Visit", "Culture", "2h", "afternoon",
                    "Explore world-class art and history in one of the city's premier museums.",
                    "https://picsum.photos/seed/museum-visit/800/600"),
                ativ(d, "Street Food Tour", "Food & Drink", "2h", "afternoon",
                    "Taste the city's vibrant food scene through its most beloved street-food stalls.",
                    "https://picsum.photos/seed/street-food/800/600"),
                ativ(d, "Rooftop Bar Experience", "Culture", "2h", "evening",
                    "Enjoy cocktails and breathtaking skyline views from an iconic rooftop terrace.",
                    "https://picsum.photos/seed/rooftop-bar/800/600"),
                ativ(d, "Shopping District", "Shopping", "3h", "afternoon",
                    "Browse boutiques, markets, and flagship stores in the city's finest shopping hub.",
                    "https://picsum.photos/seed/shopping-district/800/600")
            );
            default -> List.of(
                ativ(d, "Nature Trail", "Nature", "4h", "morning",
                    "Wander through pristine wilderness on well-marked trails through diverse ecosystems.",
                    "https://picsum.photos/seed/nature-trail/800/600"),
                ativ(d, "Bird Watching", "Nature", "2h", "morning",
                    "Spot rare and exotic species in their natural habitat with a local naturalist guide.",
                    "https://picsum.photos/seed/bird-watching/800/600"),
                ativ(d, "Kayaking", "Adventure", "3h", "afternoon",
                    "Paddle through calm waters surrounded by breathtaking natural scenery.",
                    "https://picsum.photos/seed/kayaking/800/600"),
                ativ(d, "Photography Walk", "Culture", "2h", "afternoon",
                    "Capture stunning landscapes and local life through a photographer's lens.",
                    "https://picsum.photos/seed/photo-walk/800/600"),
                ativ(d, "Stargazing Session", "Sightseeing", "2h", "evening",
                    "Marvel at a dazzling night sky far from city lights with an expert astronomer.",
                    "https://picsum.photos/seed/stargazing/800/600")
            );
        };
    }

    private Atividade ativ(Destino destino, String nome, String categoria,
                           String duracao, String turno, String descricao, String foto) {
        Atividade a = new Atividade();
        a.setDestino(destino);
        a.setNome(nome);
        a.setCategoria(categoria);
        a.setDuracao(duracao);
        a.setTurno(turno);
        a.setDescricao(descricao);
        a.setFoto(foto);
        return a;
    }

    private Destino destino(String codigoSeed, String nome, String pais, String descricao, String foto,
                            String categoria, Set<String> tags) {
        Destino d = new Destino();
        d.setCodigoSeed(codigoSeed);
        d.setNome(nome);
        d.setPais(pais);
        d.setDescricao(descricao);
        d.setFoto(foto);
        d.setCategoria(categoria);
        d.setTags(tags);
        return d;
    }
}
