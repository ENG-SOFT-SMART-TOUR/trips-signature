package com.signaturetrips.api.domain.entity;

import com.signaturetrips.api.domain.enums.Categoria;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "destinos")
@Getter
@Setter
@NoArgsConstructor
public class Destino {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    private String foto;

    private String pais;

    private Categoria categoria;

    @ElementCollection
    @CollectionTable(name = "destino_tags", joinColumns = @JoinColumn(name = "destino_id"))
    @Column(name = "tag")
    private Set<String> tags = new HashSet<>();
}
