package iff.tcc.preliminar.config;

import iff.tcc.preliminar.entity.dto.ErrorDTO;
import iff.tcc.preliminar.exception.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(NaoEncontradoException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ResponseEntity<Object> handleNaoEncontradoException(NaoEncontradoException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ErrorDTO.builder().message(e.getMessage()).build());
    }

    @ExceptionHandler(NaoAutorizadoException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public ResponseEntity<Object> handleNaoAutorizadoException(NaoAutorizadoException e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ErrorDTO.builder().message(e.getMessage()).build());
    }

    @ExceptionHandler(EmailOuSenhaInvalidoException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<Object> handleEmailOuSenhaInvalidoException(EmailOuSenhaInvalidoException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ErrorDTO.builder().message(e.getMessage()).build());
    }

    @ExceptionHandler(NaoPermitidoException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public ResponseEntity<Object> handleNaoPermitidoException(NaoPermitidoException e) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ErrorDTO.builder().message(e.getMessage()).build());
    }

    @ExceptionHandler(RegistroInvalidoException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public ResponseEntity<Object> handleRegistroInvalidoException(RegistroInvalidoException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ErrorDTO.builder().message(e.getMessage()).build());
    }
}
