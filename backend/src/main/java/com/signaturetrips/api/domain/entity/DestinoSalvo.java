package com.signaturetrips.api.domain.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "destinos_salvos", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"usuario_id", "destino_id"})
})
@Getter
@Setter
@NoArgsConstructor
public class DestinoSalvo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "destino_id", nullable = false)
    private Destino destino;
}
