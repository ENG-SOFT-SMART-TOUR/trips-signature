package com.signaturetrips.api.domain.entity;

import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;

class RoteiroTest {

    private Roteiro roteiroComDatas(LocalDate ida, LocalDate volta) {
        Roteiro roteiro = new Roteiro();
        roteiro.setDataIda(ida);
        roteiro.setDataVolta(volta);
        return roteiro;
    }

    @Test
    void singleDayTripCountsAsOneDay() {
        LocalDate date = LocalDate.of(2026, 6, 10);
        assertEquals(1, roteiroComDatas(date, date).calcularTotalDias());
    }

    @Test
    void weekTripCountsAsSevenDays() {
        Roteiro roteiro = roteiroComDatas(LocalDate.of(2026, 6, 10), LocalDate.of(2026, 6, 16));
        assertEquals(7, roteiro.calcularTotalDias());
    }

    @Test
    void crossMonthTripIsCalculatedCorrectly() {
        Roteiro roteiro = roteiroComDatas(LocalDate.of(2026, 6, 28), LocalDate.of(2026, 7, 5));
        assertEquals(8, roteiro.calcularTotalDias());
    }
}
