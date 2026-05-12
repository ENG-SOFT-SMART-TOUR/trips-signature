package com.signaturetrips.api.domain.enums;

import java.util.Arrays;

public enum Categoria {

    BEACH("beach"),
    MOUNTAINS("mountains"),
    CITY("city"),
    COUNTRYSIDE("countryside"),
    NATURE("nature");

    private final String value;

    Categoria(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public static Categoria fromValue(String value) {
        if (value == null) return null;
        return Arrays.stream(values())
                .filter(c -> c.value.equalsIgnoreCase(value))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Categoria desconhecida: " + value));
    }
}
