package com.signaturetrips.api.domain.enums;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class CategoriaConverter implements AttributeConverter<Categoria, String> {

    @Override
    public String convertToDatabaseColumn(Categoria attribute) {
        return attribute == null ? null : attribute.getValue();
    }

    @Override
    public Categoria convertToEntityAttribute(String dbData) {
        return dbData == null ? null : Categoria.fromValue(dbData);
    }
}
