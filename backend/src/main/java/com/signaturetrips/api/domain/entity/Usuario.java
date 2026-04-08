package com.signaturetrips.api.domain.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "usuarios")
@Getter
@Setter
@NoArgsConstructor
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String senha;

    private boolean quizCompleto = false;

    @ElementCollection
    @CollectionTable(name = "usuario_tags", joinColumns = @JoinColumn(name = "usuario_id"))
    @Column(name = "tag")
    private Set<String> tags = new HashSet<>();
}
