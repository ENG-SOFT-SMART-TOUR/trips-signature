package com.signaturetrips.api.controller;

import com.signaturetrips.api.dto.PerguntaDto;
import com.signaturetrips.api.service.QuizService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quiz")
public class QuizController {

    private final QuizService quizService;

    public QuizController(QuizService quizService) {
        this.quizService = quizService;
    }

    @GetMapping("/perguntas")
    public ResponseEntity<List<PerguntaDto>> getPerguntas() {
        return ResponseEntity.ok(quizService.getPerguntas());
    }
}
