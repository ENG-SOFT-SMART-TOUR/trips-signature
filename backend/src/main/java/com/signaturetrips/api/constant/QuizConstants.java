package com.signaturetrips.api.constant;

import com.signaturetrips.api.dto.OpcaoDto;
import com.signaturetrips.api.dto.PerguntaDto;

import java.util.List;

public final class QuizConstants {

    private QuizConstants() {}

    public static final List<PerguntaDto> PERGUNTAS = List.of(
            new PerguntaDto(1, "Where do you feel most alive?", List.of(
                    new OpcaoDto("Beach", "beach"),
                    new OpcaoDto("Mountains", "mountains"),
                    new OpcaoDto("City", "city"),
                    new OpcaoDto("Countryside", "countryside")
            )),
            new PerguntaDto(2, "What moves your soul?", List.of(
                    new OpcaoDto("Adventure", "adventure"),
                    new OpcaoDto("Culture", "culture"),
                    new OpcaoDto("Relaxation", "relaxation"),
                    new OpcaoDto("Gastronomy", "gastronomy")
            )),
            new PerguntaDto(3, "Your comfort zone?", List.of(
                    new OpcaoDto("Budget", "budget"),
                    new OpcaoDto("Moderate", "moderate"),
                    new OpcaoDto("Comfortable", "comfortable"),
                    new OpcaoDto("Luxury", "luxury")
            )),
            new PerguntaDto(4, "Who shares the journey?", List.of(
                    new OpcaoDto("Solo", "solo"),
                    new OpcaoDto("Couple", "couple"),
                    new OpcaoDto("Family", "family"),
                    new OpcaoDto("Friends", "friends")
            )),
            new PerguntaDto(5, "Your rhythm of discovery?", List.of(
                    new OpcaoDto("Slow & deep", "slow"),
                    new OpcaoDto("Balanced", "balanced"),
                    new OpcaoDto("Fast & packed", "fast")
            ))
    );
}
