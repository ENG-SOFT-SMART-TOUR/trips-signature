package com.signaturetrips.api.service.calculator;

import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;

class RoteiroCalculatorTest {

    private final RoteiroCalculator calculator = new RoteiroCalculator();

    @Test
    void singleDayTripCountsAsOneDay() {
        LocalDate date = LocalDate.of(2026, 6, 10);
        assertEquals(1, calculator.calculateTotalDays(date, date));
    }

    @Test
    void weekTripCountsAsSevenDays() {
        LocalDate ida = LocalDate.of(2026, 6, 10);
        LocalDate volta = LocalDate.of(2026, 6, 16);
        assertEquals(7, calculator.calculateTotalDays(ida, volta));
    }

    @Test
    void crossMonthTripIsCalculatedCorrectly() {
        LocalDate ida = LocalDate.of(2026, 6, 28);
        LocalDate volta = LocalDate.of(2026, 7, 5);
        assertEquals(8, calculator.calculateTotalDays(ida, volta));
    }
}
