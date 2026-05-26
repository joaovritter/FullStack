import streamlit as st
from google import genai
from google.genai import types
import os
from dotenv import load_dotenv

from utils.prompt import build_prompt
from utils.feedback import save_feedback

# ── Setup ─────────────────────────────────────────────────────────────────────
load_dotenv()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

st.set_page_config(
    page_title="PC da NASA — Upgrade Inteligente",
    page_icon="🚀",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ── CSS ───────────────────────────────────────────────────────────────────────
def load_css(path: str) -> None:
    with open(path, encoding="utf-8") as f:
        st.markdown(f"<style>{f.read()}</style>", unsafe_allow_html=True)

load_css("assets/style.css")

# ── Sidebar ───────────────────────────────────────────────────────────────────
with st.sidebar:
    st.markdown("""
    <div class="sidebar-header">
        <div class="sidebar-logo">🚀 PC da NASA</div>
        <p class="sidebar-sub">Upgrade inteligente de hardware</p>
    </div>
    """, unsafe_allow_html=True)

    cpu          = st.text_input("🖥️ Processador",       placeholder="Ex: Intel Xeon E5-2699 v3")
    placa_mae    = st.text_input("🔌 Placa Mãe",          placeholder="Ex: Machinist X99-RS9")
    ram          = st.text_input("🧠 Memória RAM",         placeholder="Ex: 32GB DDR4 2400MHz")
    gpu          = st.text_input("🎮 Placa de Vídeo (GPU)", placeholder="Ex: NVIDIA RTX 3060 12GB")
    armazenamento = st.text_input("💾 Armazenamento",      placeholder="Ex: SSD 480GB + HDD 1TB")
    cooler       = st.text_input("❄️ Cooler",              placeholder="Ex: Cooler Master Hyper 212")

    st.markdown("<div style='margin-top:6px'></div>", unsafe_allow_html=True)
    objetivo = st.text_area(
        "🎯 Objetivo de uso",
        placeholder="Ex: Rodar máquinas virtuais, Docker e jogos em 1080p",
        height=108,
    )

    st.markdown("<div style='margin-top:10px'></div>", unsafe_allow_html=True)
    buscar = st.button("⚡ Analisar Setup", use_container_width=True)

# ── Hero ──────────────────────────────────────────────────────────────────────
st.markdown("""
<div class="hero">
    <span class="hero-badge">🛸 Powered by Gemini 2.5 Flash</span>
    <h1>PC da <span class="glow">NASA</span></h1>
    <p class="hero-sub">Upgrade Inteligente — Elimine gargalos e leve seu PC ao próximo nível</p>
</div>
""", unsafe_allow_html=True)

# ── Main content ──────────────────────────────────────────────────────────────
if not buscar:
    # ─ Placeholder state ─
    st.markdown("""
    <div class="placeholder">
        <span class="float-icon">🚀</span>
        <h2>Pronto para lançar seu PC ao espaço? 🌌</h2>
        <p>Preencha as peças na barra lateral e receba uma análise técnica digna da NASA,
           com recomendações de upgrade e preços estimados em reais.</p>
        <div class="features">
            <div class="feat">🔍 Diagnóstico técnico</div>
            <div class="feat">💰 Preços estimados em R$</div>
            <div class="feat">⚡ Resposta instantânea</div>
            <div class="feat">🏆 3 upgrades rankeados</div>
        </div>
    </div>
    """, unsafe_allow_html=True)

    st.markdown("""
    <div class="steps-card">
        <h4>💡 Como funciona</h4>
        <div class="step">
            <span class="num">1</span>
            <span>Informe as peças do seu PC na barra lateral</span>
        </div>
        <div class="step">
            <span class="num">2</span>
            <span>Descreva o objetivo de uso do equipamento</span>
        </div>
        <div class="step">
            <span class="num">3</span>
            <span>Clique em <strong>Analisar Setup</strong></span>
        </div>
        <div class="step">
            <span class="num">4</span>
            <span>Receba diagnóstico de gargalos + 3 upgrades precisos</span>
        </div>
    </div>
    """, unsafe_allow_html=True)

else:
    # ─ Validation ─
    if not cpu or not gpu or not objetivo:
        st.markdown("""
        <div class="alert-warn">
            ⚠️ Preencha ao menos o <strong>Processador</strong>,
            a <strong>GPU</strong> e o <strong>Objetivo de uso</strong> para continuar.
        </div>
        """, unsafe_allow_html=True)

    else:
        # ─ AI call ─
        with st.spinner("🤖 Analisando gargalos com Gemini 2.5 Flash..."):
            prompt   = build_prompt(cpu, placa_mae, ram, gpu, armazenamento, cooler, objetivo)
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
            )
            resposta = response.text

        # ─ Results header ─
        st.markdown("""
        <div class="results-header">
            <h3>📋 Análise e Recomendações</h3>
            <span class="results-tag">IA GERADO</span>
        </div>
        """, unsafe_allow_html=True)

        # ─ AI response ─
        st.markdown(resposta)

        st.markdown("---")

        # ─ Feedback ─
        st.markdown(
            '<p style="color:#94a3b8;font-weight:600;margin-bottom:.5rem">💬 Esta análise foi útil para você?</p>',
            unsafe_allow_html=True,
        )

        col1, col2 = st.columns(2)

        with col1:
            if st.button("👍 Gostei", use_container_width=True, key="like"):
                save_feedback(cpu, gpu, objetivo, "Gostei")
                st.success("✅ Obrigado! Seu feedback nos ajuda a melhorar.")

        with col2:
            if st.button("👎 Não gostei", use_container_width=True, key="dislike"):
                save_feedback(cpu, gpu, objetivo, "Não gostei")
                st.info("📝 Anotado! Trabalharemos para melhorar.")

# ── Footer ────────────────────────────────────────────────────────────────────
st.markdown("---")
st.caption(
    "PC da NASA · Desenvolvido na disciplina de Desenvolvimento Full Stack — "
    "Sistema de Informação · Universidade Franciscana (UFN)"
)
