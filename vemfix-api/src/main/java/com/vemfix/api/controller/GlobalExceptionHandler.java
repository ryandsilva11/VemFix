package com.vemfix.api.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException ex) {
        HttpStatus status = HttpStatus.BAD_REQUEST;
        if ("E-mail ou senha inválidos.".equals(ex.getMessage())) {
            status = HttpStatus.UNAUTHORIZED;
        }
        return ResponseEntity.status(status).body(Map.of("message", ex.getMessage()));
    }
}
