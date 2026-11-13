# Perfil Técnico e Contexto do Usuário (Ryan Dias da Silva)

> **Instrução para a IA:** Este documento resume a bagagem consolidada, estilo de trabalho, perfil de aprendizado e projetos práticos do usuário. Use essas informações para calibrar o nível das explicações, sugerir boas práticas alinhadas ao seu momento e respeitar suas preferências de estudo.

---

## 1. Informações Pessoais, Acadêmicas e Profissionais

* **Idade:** 18 anos | **Localidade:** Indaiatuba/SP (período da tarde livre para estágio).
* **Formação Atual:** Graduação em Desenvolvimento de Software Multiplataforma (DSM) — Fatec Indaiatuba (2º semestre, turno matutino; previsão de conclusão: 2028).
* **Formação Concluída:** Técnico em Informática — Instituto Federal de São Paulo (IFSP), Campus Salto (concluído em 2025; duração de 1 ano e meio).
* **Experiência Profissional Atual:** Supermercados Pague Menos (Loja 11, Indaiatuba/SP) — admitido em Agosto/2025.
  * Trajetória de 2 promoções internas em ~1 ano: *Empacotador (6 meses) → Operador de Caixa (6 meses) → Recepcionista (atual)*.
  * Forte desenvoltura com atendimento ao público, triagem de demandas operacionais, comunicação assertiva e confiabilidade.

---

## 2. Idioma (Inglês)

* **Nível Geral:** Intermediário.
* **Leitura e Escrita Técnica:** Nível bom/avançado com autonomia (lê documentações oficiais, especificações de APIs e mensagens de erro com facilidade; pesquisa pontualmente termos de contexto).
* **Escuta e Fala:** Nível intermediário (compreende áudios e vídeos técnicos em ritmo natural; cursando na escola Black & White).

---

## 3. Conhecimentos Técnicos Consolidados (Pontos Fortes)

* **Lógica de Programação:** Base muito sólida e madura. Histórico de 40h de lógica em Portugol (Gustavo Guanabara) e ampla prática aplicada em algoritmos.
* **Orientação a Objetos (POO):** Domínio conceitual e prático forte. Compreensão clara de: Classes, Objetos, Atributos, Encapsulamento, Métodos, Elementos Estáticos, Classes Abstratas, Construtores com `super()`, Herança e Polimorfismo.
* **Backend com Java & Spring Boot:**
  * **Java 21:** Sintaxe afiada, uso de `record` para DTOs, coleções, lambdas e Streams (`.map()`, `.toList()`), `Optional` (`.orElseThrow()`).
  * **Spring Boot 3.4:** Autoconfiguração, injeção de dependências via construtor (Controller → Service → Repository), controle transacional (`@Transactional`), perfis de ambiente (`application-mysql.properties` e `application-h2.properties`) e configuração de CORS.
  * **Spring Data JPA:** Mapeamento ORM de entidades (`@Entity`, `@Id`, `@GeneratedValue`, `@Column`), interfaces estendendo `JpaRepository` e criação de *derived queries* (`existsByTitulo`, `existsByNome`).
  * **Bean Validation (`jakarta.validation`):** Validação declarativa com `@Valid`, `@NotBlank`, `@Size`, `@NotNull`, `@Min` e regras condicionais cruzadas com `@AssertTrue` + `@JsonIgnore`.
  * **APIs RESTful:** Modelagem semântica de recursos, verbos HTTP (`GET`, `POST`, `PATCH`, `DELETE`) e retornos explícitos com `ResponseEntity` (`201 Created`, `200 OK`, `204 No Content`).
  * **Documentação com Swagger/OpenAPI:** Configuração de `springdoc-openapi` e exploração interativa de rotas via `/swagger-ui.html`.
* **Banco de Dados (SQL & Relacional):**
  * Criação de tabelas com chaves primárias e auto-incremento (`CREATE TABLE`, `PRIMARY KEY`, `AUTO_INCREMENT`).
  * Inserção e consultas estruturadas (`INSERT`, `SELECT`, `WHERE`, `ORDER BY`).
  * Relacionamentos 1:N com chave estrangeira (`FOREIGN KEY`) e cruzamento de tabelas via `INNER JOIN` e `LEFT JOIN`.
  * Prática com **MySQL 8** e banco em memória **H2 Database** integrado ao Spring.
* **Frontend Web (React & Chakra UI):**
  * **React 19 + Vite:** Componentização funcional, gerenciamento de estado (`useState`), efeitos colaterais e ciclo de vida (`useEffect`), iteração de listas com `.map()`, formulários controlados e renderização condicional.
  * **Chakra UI v3:** Construção de interfaces rápidas e acessíveis com mitigação de dificuldades em CSS manual.
  * **Consumo de APIs:** Requisições assíncronas com `fetch` (`async/await`) conectando frontend ao backend em operações completas de CRUD e endpoints específicos de negócio (`PATCH`).
* **Versionamento & Git/GitHub:**
  * Uso diário e autônomo de Git: *branches* de feature (`feat/...`), commits semânticos, `git merge`, resolução de conflitos em staging e organização de repositórios.
* **Game Development (C# & Unity):**
  * Prática em C# com Unity para jogos 2D (controle de física, movimentação, colisões, inteligência artificial básica de inimigos, inventário e transição de cenas).

---

## 4. Projetos de Destaque no Portfólio

1. **Quest API & UI (Projeto Fullstack Java + Spring Boot + React):**
   * *Repositório:* `github.com/ryandsilva11/backtopeak` (módulo `semana-05-06-projeto-estrela`).
   * *Backend:* API RESTful em Java 21 com Spring Boot 3, arquitetura em camadas, Spring Data JPA, DTOs em Java `record`, validação condicional com Bean Validation, Swagger/OpenAPI, perfis H2/MySQL e CORS.
   * *Frontend:* Interface web em React 19 + Chakra UI v3 para cadastro de heróis e missões, com conclusão de quests via `PATCH` e cálculo automático de XP e Level Up.
2. **Food VS Fungus - FvF (Jogo 2D em Unity / C# — TCC do Técnico):**
   * *Repositório:* `github.com/ryandsilva11/FvF`.
   * *Papel:* Programador Principal, Game Designer e Testes (equipe de 4 integrantes no IFSP, finalizado em 2024).
   * *Mecânicas:* Gameplay de plataforma 2D em Unity 6 / C# (URP, Input System), combate, sistema de vidas, inventário/equipamentos, IA de inimigos e seleção de fases.
   * *Engenharia de Software:* Game Design Document (GDD), modelagem UML (Astah), Product Backlog ágil e Histórias de Usuário.

---

## 5. Estilo de Aprendizado e Preferências de Trabalho

* **Necessidade de Entender o "Porquê":**
  * O usuário tem uma necessidade fundamental de compreender o fluxo completo e a razão arquitetural por trás de cada linha ou ferramenta. Não gosta de trabalhar "no escuro" ou apenas copiar código sem entender a causa e o efeito.
* **Memória Muscular e Digitação Própria:**
  * Prefere digitar o próprio código manualmente para fixar a sintaxe, construir memória muscular e raciocinar ativamente sobre a lógica enquanto escreve.
* **Uso da IA como Pair Programming e Mentora:**
  * Utiliza a IA para code review, explicação de conceitos complexos, depuração guiada, alinhamento de arquitetura e simulação de perguntas técnicas de entrevista — sempre com postura ativa de aprendizado.
* **Rigor com Organização:**
  * Preza por extrema organização de workspace, pastas, branches e guias do navegador, mantendo o ambiente de trabalho limpo e focado.
* **Comunicação Preventiva e Analítica:**
  * Analisa a situação com cautela antes de tomar decisões precipitadas, alinhando tarefas e sanando dúvidas para evitar retrabalho.

---

## 6. Objetivo Atual

* **Conquistar a primeira oportunidade de Estágio em TI / Desenvolvimento de Software (Backend Java ou Fullstack):**
  * Disponibilidade para estágio no período da tarde (presencial na região de Indaiatuba/Campinas, híbrido ou remoto).
  * Portfólio ativo no GitHub e currículo em PDF estruturado para filtros ATS.
* **Foco Imediato de Desenvolvimento:**
  * Construção do **Projeto Integrador (PI)** da Fatec, aplicando os conhecimentos consolidados de Java, Spring Boot, Banco de Dados, React e Git em uma solução completa.
