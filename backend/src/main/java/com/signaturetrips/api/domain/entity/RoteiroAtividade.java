package com.signaturetrips.api.domain.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "roteiro_atividades", uniqueConstraints = {
    @UniqueConstraint(name = "uk_roteiro_atividade_dia", columnNames = {"roteiro_id", "atividade_id", "dia_numero"})
}, indexes = {
    @Index(name = "idx_roteiro_atividade_roteiro", columnList = "roteiro_id")
})
@Getter
@Setter
@NoArgsConstructor
public class RoteiroAtividade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "roteiro_id", nullable = false)
    private Roteiro roteiro;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "atividade_id", nullable = false)
    private Atividade atividade;

    @Column(name = "dia_numero", nullable = false)
    private int diaNumero;
}
