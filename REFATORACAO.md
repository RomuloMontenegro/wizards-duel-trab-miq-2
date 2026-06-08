Relatório de Refatoração - Wizard Duel
1. Problemas Encontrados (Code Smells)
Números Mágicos: Diversos valores literais espalhados pelo código (como os status de ataque, limites matemáticos no embaralhamento e strings soltas).

Nomenclatura Obscura: Presença de variáveis genéricas como tmp, c, r, pw, mg, que dificultavam a leitura e manutenção do fluxo de dados.

Múltiplas Responsabilidades e Duplicação (Violação do DRY e SRP no Back-end): O arquivo index.js servia como um monolito, lidando com a inicialização do servidor, requisições HTTP, cálculos lógicos e embaralhamento das cartas simultaneamente. A mesma lógica matemática era repetida nos endpoints /api/pack e /api/cpu-deck.

Monolito de Interface (Acoplamento no Front-end): O arquivo index.html concentrava toda a marcação (HTML), estilização (CSS) e lógica de estado/requisições (JavaScript) em um único documento, dificultando a manutenção e violando a separação de conceitos.

2. Decisões Tomadas Durante a Refatoração
Isolamento de Constantes: Criação do arquivo constants.js para centralizar objetos literais e regras do jogo, mapeando atributos por casa, espécie e ancestralidade.

Separação em Módulos no Back-end:

routes/: O Express.js foi modularizado. As rotas foram divididas de acordo com suas entidades (characters.js, spells.js, game.js).

services/: A lógica de negócio foi isolada em statsCalculator.js e a comunicação com a API (e o método genérico de shuffle) levada para potterApi.js.

Modularização do Front-end (Arquitetura Cliente): A pasta public/ foi reestruturada isolando responsabilidades:

css/style.css: Separação de todas as regras visuais.

js/api.js: Camada exclusiva para as chamadas assíncronas (Fetch) ao back-end.

js/render.js: Isolamento das funções utilitárias visuais e manipulação do DOM.

js/game.js: Controlador principal (type="module") responsável por gerenciar o estado do duelo e importar os demais módulos.

Nomenclatura e Sintaxe Moderna: Variáveis de iteração foram renomeadas para seus significados reais (ex: c para characterData). O método forEach com push externo (que gerava code smell de estado mutável em arrays) foi substituído por uma cadeia de .map().filter(), seguindo padrões funcionais do JS.

Aderência ao ESLint: O código foi alinhado ao style guide definido nas configurações (.eslintrc.json), respeitando a indentação de 4 espaços e as aspas duplas exigidas localmente. Foi adicionado o arquivo .eslintignore para garantir que as regras estritas de Node.js não gerassem falsos positivos nos arquivos estáticos do navegador (public/).