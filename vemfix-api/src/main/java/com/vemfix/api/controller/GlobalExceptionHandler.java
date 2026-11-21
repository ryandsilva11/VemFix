package com.vemfix.api.controller;

import java.util.Map;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidation(MethodArgumentNotValidException ex) {
        String msg = "Dados inválidos.";
        if (ex.getBindingResult().getFieldError() != null) {
            String defaultMsg = ex.getBindingResult().getFieldError().getDefaultMessage();
            if (defaultMsg != null && !defaultMsg.isBlank()) {
                msg = defaultMsg;
            }
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", msg));
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, String>> handleDataIntegrity(DataIntegrityViolationException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("message", "CPF ou E-mail já cadastrado no sistema."));
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException ex) {
        HttpStatus status = HttpStatus.BAD_REQUEST;
        String msg = ex.getMessage() != null ? ex.getMessage() : "Ocorreu um erro ao processar a requisição.";

        if ("E-mail ou senha inválidos.".equals(msg)) {
            status = HttpStatus.UNAUTHORIZED;
        }

        return ResponseEntity.status(status).body(Map.of("message", msg));
    }
}
