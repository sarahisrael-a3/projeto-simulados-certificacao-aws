# Product UI Layer - Simulador De Certificacoes AWS

Atualizado em: 2026-06-18

Status: needs-review.

Este documento orienta a camada visual do produto. Ele nao substitui o manual de marca da A3Data; apenas adapta a linguagem visual para o simulador.

## Intencao

O simulador deve parecer um produto educacional profissional:

- claro;
- confiavel;
- analitico;
- orientado a estudo;
- alinhado com cloud e dados;
- com gamificacao moderada.

## Estado Real Do Produto

- Frontend principal em `src/frontend/`.
- CSS fonte em `src/frontend/styles/`.
- Build copia estilos para `public/css/`.
- Tema claro/escuro existe.
- Gamificacao, dashboard, quiz, flashcards e validacao ja existem.
- Antes de mudar visual, preserve comportamento e fallback offline.

## Paleta

Use apenas tokens documentados ou registre como `needs-review`.

| Token | Hex | Uso |
| --- | --- | --- |
| Deep Sea | `#001863` | Base institucional, header, dark theme |
| Tech Blue | `#0033FF` | Acao primaria, links, estado ativo |
| Pink Nic | `#F53199` | Acento pequeno |
| Summer Time | `#FFEE00` | Conquista e destaque pontual |
| Amethyst Velvet | `#7B4AAF` | Trilha, contexto avancado |
| Sky Frost | `#39D0FF` | Info, cloud/data |
| Background Light | `#F5F5F5` | Fundo claro |
| Surface | `#FFFFFF` | Cards e paineis |
| Text on Light | `#00083D` | Texto principal |
| Text on Dark | `#F5F7FF` | Texto no tema escuro |
| Border Default | `#EBEBEB` | Bordas e divisores |
| Success | `#35B769` | Correto, concluido |
| Danger | `#F91C1C` | Erro, incorreto |
| Warning | `#FF822E` | Atencao, dominio fraco |

## Regras De Cor

- Deep Sea e base institucional.
- Tech Blue e acao principal.
- Pink Nic e acento, nao fundo dominante.
- Summer Time deve ser raro.
- Cores semanticas devem representar estado real.
- Nunca dependa so de cor para comunicar status.
- Evite adicionar novas cores sem registrar.

## Composicao

Use:

- layout limpo;
- cards de certificacao com hierarquia clara;
- quiz focado e legivel;
- dashboard com linguagem de produto de dados;
- badges compactos;
- feedback correto/incorreto com texto e cor.

Evite:

- gradientes excessivos;
- visual infantil;
- animacoes pesadas;
- fundos decorativos atras de perguntas;
- cores fora do sistema.

## Quiz

Prioridades:

- leitura da pergunta;
- alternativas com espacamento suficiente;
- estado selecionado evidente;
- feedback acessivel;
- explicacao facil de ler.

Mapeamento:

- selecionado: Tech Blue;
- correto: Success;
- incorreto: Danger;
- revisar: Warning;
- informacao: Sky Frost ou superficie neutra.

## Dashboard E Resultados

Use padroes de DataViz:

- cards KPI;
- valores destacados;
- labels curtos;
- graficos limpos;
- dominio fraco como Warning;
- prontidao/certificacao como indicador principal.

## Validacao

O painel de validacao agora usa API real por padrao. A UI deve:

- mostrar status real das questoes;
- diferenciar pendente, aprovado e rejeitado;
- exigir ou destacar motivo em rejeicoes;
- nao ocultar erros de API;
- manter layout denso e revisavel.

## Tipografia E Espacamento

- Fonte padrao: Segoe UI ou fallback do sistema.
- Use escala simples e legivel.
- Base de espacamento: 8px.
- Evite textos pequenos demais em quiz e validacao.

## Regras Para Implementacao

- Edite `src/frontend/styles/` como fonte.
- Rode `npm run build` depois de mudancas visuais.
- Preserve PWA/offline.
- Nao altere quiz, dados, API ou seed em tarefa puramente visual.
- Rode testes relevantes.
- Reporte qualquer decisao marcada como `needs-review`.

## Criterios De Aceite Visual

- Home comunica produto AWS/A3Data com clareza.
- Cards de certificacao sao consistentes.
- Quiz e legivel.
- Feedback de resposta nao depende so de cor.
- Dashboard parece analitico, nao decorativo.
- Gamificacao e profissional.
- Temas claro e escuro seguem legiveis.
- Painel de validacao comunica estado real.
