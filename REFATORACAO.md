# Relatório de Refatoração - Wizard Duel

## 1. Problemas Encontrados (Code Smells)
- **Números Mágicos:** Diversos valores literais espalhados pelo código (como os status de ataque, limites matemáticos no embaralhamento e strings soltas).
- **Nomenclatura Obscura:** Presença de variáveis genéricas como `tmp`, `c`, `r`, `pw`, `mg`, que dificultavam a leitura e manutenção do fluxo de dados.
- **Múltiplas Responsabilidades e Duplicação (Violação do DRY e SRP):** O arquivo `index.js` servia como um monolito, lidando com a inicialização do servidor, requisições HTTP, cálculos lógicos e embaralhamento das cartas simultaneamente. A mesma lógica matemática era repetida nos endpoints `/api/pack` e `/api/cpu-deck`.

## 2. Decisões Tomadas Durante a Refatoração
- **Isolamento de Constantes:** Criação do arquivo `constants.js` para centralizar objetos literais e regras do jogo, mapeando atributos por casa, espécie e ancestralidade. 
- **Separação em Módulos (Arquitetura de Pastas):**
  - **`routes/`:** O Express.js foi modularizado. As rotas foram divididas de acordo com suas entidades (`characters.js`, `spells.js`, `game.js`).
  - **`services/`:** A lógica de negócio foi isolada em `statsCalculator.js` e a comunicação com a API (e o método genérico de `shuffle`) levada para `potterApi.js`.
- **Nomenclatura e Sintaxe Moderna:** Variáveis de iteração foram renomeadas para seus significados reais (ex: `c` para `characterData`). O método `forEach` com *push* externo (que gerava code smell de estado mutável em arrays) foi substituído por uma cadeia de `.map().filter()`, seguindo padrões funcionais do JS.
- **Aderência ao ESLint:** O código foi alinhado ao *style guide* definido nas configurações (`.eslintrc.json`), respeitando a indentação de 4 espaços e as aspas duplas exigidas localmente, com o uso de comentários `eslint-disable` focados apenas onde o padrão ES6 entrava em conflito com o ambiente nativo CommonJS.