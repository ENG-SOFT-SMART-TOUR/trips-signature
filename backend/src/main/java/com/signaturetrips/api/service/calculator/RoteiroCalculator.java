package com.signaturetrips.api.service.calculator;

import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class RoteiroCalculator {

    public int calculateTotalDays(LocalDate dataIda, LocalDate dataVolta) {
        return (int) (dataVolta.toEpochDay() - dataIda.toEpochDay()) + 1;
    }
}
