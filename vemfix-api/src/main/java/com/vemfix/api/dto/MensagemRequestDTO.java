package com.vemfix.api.dto;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record MensagemRequestDTO(
                @NotBlank(message = "O tipo do remetente é obrigatório (CLIENTE ou PRESTADOR)") String remetenteTipo,

                @Size(max = 1000, message = "A mensagem deve ter no máximo 1000 caracteres") String conteudo,

                @Size(max = 2048, message = "A URL do anexo deve ter no máximo 2048 caracteres") String anexo) {

        @AssertTrue(message = "A mensagem deve conter pelo menos um texto ou um anexo")
        public boolean isValido() {
                boolean temConteudo = conteudo != null && !conteudo.isBlank();
                boolean temAnexo = anexo != null && !anexo.isBlank();

                return temConteudo || temAnexo;
        }
}
