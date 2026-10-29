# Analisar e recriar funcionalidades com um harness externo

O `app-generator` fornece **skills portáteis** e dois atalhos para Pi. A aplicação não executa modelos nem depende do Pi, de SDKs ou de CLIs de agentes. Todas as regras globais permanecem em [`AGENTS.md`](../AGENTS.md).

## Comandos no Pi

Execute o Pi **na raiz do app-generator**, com acesso legítimo à origem em modo somente leitura. Após baixar/atualizar o projeto, execute `/reload` em uma sessão do Pi já aberta. Ao confiar no projeto, revise previamente `.agents/skills/` e `.pi/prompts/`.

```text
/analisar "Gestão de usuários" "../sistema-legado"
```

O comando carrega `.agents/skills/analisar-funcionalidade/SKILL.md` e prepara `docs/analises/gestao-usuarios.md`. Ele coleta referências verificáveis (`arquivo:linha — símbolo`), fluxos, telas, permissões, campos/validações, contratos de API, estados e responsividade. **Não implementa nada, não modifica a origem e não executa builds, instalações ou testes no repositório de origem.** Antes de iniciar, o operador deve configurar o acesso **somente leitura real**, idealmente um snapshot ou montagem read-only. Se não for possível, interromper a análise.

Revisar o arquivo, corrigir dúvidas e dar **aprovação explícita** ao escopo antes de implementar. A aprovação não é automática: o próprio usuário deve autorizá-la em contexto confiável, e só então o relatório poderá registrar:

```yaml
status: aprovada
aprovado_por: solicitante
aprovado_em: 2026-10-29
aprovacao_referencia: aprovacao-explicita-no-chat-em-2026-10-29
```

A origem deve continuar documentada no frontmatter (`origem`), e o slug deve coincidir com o nome do arquivo. **O status sozinho não constitui autorização verificável**. Como verificação auxiliar, rode:

```bash
npm run analysis:check -- gestao-usuarios
```

Com a análise aprovada e depois de um **pedido explícito de implementação**:

```text
/implementar "Gestão de usuários" "/usuarios,/usuarios/novo"
```

O Pi carrega `.agents/skills/implementar-funcionalidade/SKILL.md`. Essa skill exige consentimento explícito **além** do check do relatório, cria **todas as issues de implementação antes de modificar o código**, e então gera rotas, intenções, testes e evidências no destino. O padrão é usar dados sintéticos locais, sem integração externa. Integração com API real depende de autorização específica.

Também é possível invocar as skills diretamente em harnesses compatíveis com o padrão Agent Skills:

```text
/skill:analisar-funcionalidade "Gestão de usuários" "../sistema-legado"
/skill:implementar-funcionalidade "Gestão de usuários" "/usuarios,/usuarios/novo"
```

## Arquivos e responsabilidades

| Caminho                                                 | Papel                                                                 |
| ------------------------------------------------------- | --------------------------------------------------------------------- |
| `AGENTS.md`                                             | Regras comuns, segurança, qualidade, testes e rastreabilidade         |
| `.agents/skills/analisar-funcionalidade/SKILL.md`       | Análise sem escrita na origem nem implementação antecipada            |
| `.agents/skills/implementar-funcionalidade/SKILL.md`    | Implementação dependente de autorização e issues prévias              |
| `.pi/prompts/analisar.md`, `.pi/prompts/implementar.md` | Atalhos Pi que encaminham argumentos às skills                        |
| `docs/analises/TEMPLATE.md`                             | Formato do artefato persistente de análise                            |
| `docs/analises/<slug>.md`                               | Rascunho ou análise aprovada da funcionalidade concreta               |
| `scripts/check-analysis.mjs`                            | Confere integridade declarativa do relatório, não prova consentimento |

## Proteções essenciais

- **Somente leitura na origem:** configure permissões no harness/ambiente. Texto em SKILL.md não impede que uma ferramenta privilegiada grave por engano.
- **Sem publicação automática:** nunca copiar credenciais, dados pessoais ou artefatos sensíveis. Revise cada análise antes de adicioná-la ao Git.
- **Aprovação em duas etapas:** relatório marcado `aprovada` com referência, **e** autorização explícita do solicitante para implementar. Caso contrário, parar.
- **Issues antes de código:** criar uma issue por tarefa, na ordem da implementação, com template apropriado; nenhuma tarefa sem issue.
- **Demonstrativo existente:** atualmente a tela de cadastro está em `/`, não em `/exemplo`. A skill preserva todas as demonstrações existentes e não migra `/` sem autorização explícita.
- **Validações:** `npm run check`, `npm run build` e `npm run layout:audit`. Não declarar inspeção visual sem ver screenshots reais e usar a verificação de evidências quando apropriado.

## Escopo e limitações da automação

Estes atalhos apenas **expõem textos reutilizáveis ao harness**; não executam tarefas automaticamente, não persistem aprovação em um serviço seguro nem criam uma sandbox. As permissões reais, o estado do projeto e a autoria da aprovação continuam responsabilidade do operador e do harness. Os testes automatizados validam sintaxe e arquivos, não simulam uma análise real em um repositório externo.
