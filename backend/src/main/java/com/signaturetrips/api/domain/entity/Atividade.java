package com.signaturetrips.api.domain.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "atividades", indexes = {
    @Index(name = "idx_atividade_destino", columnList = "destino_id")
})
@Getter
@Setter
@NoArgsConstructor
public class Atividade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "destino_id", nullable = false)
    private Destino destino;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private String categoria;

    @Column(nullable = false)
    private String duracao;

    @Column(nullable = false)
    private String turno;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    private String foto;

    private Double latitude;

    private Double longitude;
}
