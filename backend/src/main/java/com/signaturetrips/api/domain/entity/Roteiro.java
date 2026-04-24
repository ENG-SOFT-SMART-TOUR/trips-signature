package com.signaturetrips.api.domain.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "roteiros", indexes = {
    @Index(name = "idx_roteiro_usuario", columnList = "usuario_id")
})
@Getter
@Setter
@NoArgsConstructor
public class Roteiro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @ManyToOne(optional = false)
    @JoinColumn(name = "destino_id")
    private Destino destino;

    @Column(nullable = false)
    private LocalDate dataIda;

    @Column(nullable = false)
    private LocalDate dataVolta;

    @Column(nullable = false)
    private LocalDateTime criadoEm = LocalDateTime.now();
}
