def build_prompt(cpu: str, placa_mae: str, ram: str, gpu: str,
                  armazenamento: str, cooler: str, objetivo: str) -> str:
    """
    Gera um prompt balanceado para o Gemini analisar o setup e recomendar upgrades.
    Estruturado para retornar diagnóstico + 3 upgrades detalhados + prioridade.
    """
    return f"""Você é um especialista sênior em hardware de alto desempenho. Seja direto, técnico e preciso.

Setup do usuário:
• CPU: {cpu}
• Placa Mãe: {placa_mae or "Não informada"}
• RAM: {ram or "Não informada"}
• GPU: {gpu}
• Armazenamento: {armazenamento or "Não informado"}
• Cooler: {cooler or "Não informado"}
• Objetivo: {objetivo}

Analise os gargalos e responda EXATAMENTE neste formato (sem texto extra antes ou depois):

## 🔍 Diagnóstico
[2-3 frases identificando os gargalos reais deste setup para o objetivo informado. Seja específico sobre qual componente limita o desempenho e por quê.]

## 🔧 Upgrade 1 — [Nome do componente]
- **Atual:** [peça atual do usuário]
- **Recomendado:** [modelo específico com preço estimado em R$]
- **Impacto:** [como esse upgrade elimina o gargalo, com dado concreto de melhoria]

## 🔧 Upgrade 2 — [Nome do componente]
- **Atual:** [peça atual do usuário]
- **Recomendado:** [modelo específico com preço estimado em R$]
- **Impacto:** [como esse upgrade elimina o gargalo, com dado concreto de melhoria]

## 🔧 Upgrade 3 — [Nome do componente]
- **Atual:** [peça atual do usuário]
- **Recomendado:** [modelo específico com preço estimado em R$]
- **Impacto:** [como esse upgrade elimina o gargalo, com dado concreto de melhoria]

## ✅ Prioridade de Compra
[Uma frase indicando por qual upgrade começar e por que ele trará o maior retorno imediato.]"""
