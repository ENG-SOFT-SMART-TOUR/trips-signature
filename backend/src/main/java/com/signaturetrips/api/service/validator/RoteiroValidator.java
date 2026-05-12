package com.signaturetrips.api.service.validator;

import com.signaturetrips.api.dto.RoteiroRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

@Component
public class RoteiroValidator {

    public void validate(RoteiroRequest request) {
        if (!request.dataVolta().isAfter(request.dataIda())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A data de volta deve ser após a data de ida");
        }
    }
}
