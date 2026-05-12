package com.signaturetrips.api.service.validator;

import com.signaturetrips.api.dto.RoteiroRequest;
import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class RoteiroValidatorTest {

    private final RoteiroValidator validator = new RoteiroValidator();

    @Test
    void acceptsTripWithReturnAfterDeparture() {
        RoteiroRequest request = new RoteiroRequest(
                1L, 1L,
                LocalDate.of(2026, 6, 10),
                LocalDate.of(2026, 6, 17));

        assertDoesNotThrow(() -> validator.validate(request));
    }

    @Test
    void rejectsSameDayReturn() {
        RoteiroRequest request = new RoteiroRequest(
                1L, 1L,
                LocalDate.of(2026, 6, 10),
                LocalDate.of(2026, 6, 10));

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> validator.validate(request));
        assertEquals(400, ex.getStatusCode().value());
    }

    @Test
    void rejectsReturnBeforeDeparture() {
        RoteiroRequest request = new RoteiroRequest(
                1L, 1L,
                LocalDate.of(2026, 6, 10),
                LocalDate.of(2026, 6, 9));

        assertThrows(ResponseStatusException.class, () -> validator.validate(request));
    }
}
