import { fetchPack, fetchSpells, fetchCpuDeck } from './api.js';
import { renderCard, renderDeckBadges, logMessage, setStatusMessage, showScreen } from './render.js';

// Estado Global
const state = {
    pack: [],
    selectedCards: [],
    playerDeck: [],
    cpuDeck: [],
    spells: [],
    playerSpells: [],
    round: 1,
    scoreP: 0,
    scoreC: 0,
    waiting: false
};

// ── LOADING E CONFIGURAÇÃO ──
async function loadGame() {
    const bar = document.getElementById('loadBar');
    const msg = document.getElementById('loadMsg');

    msg.textContent = 'Invocando personagens...';
    bar.style.width = '20%';

    const packData = await fetchPack();
    state.pack = packData.cards;

    bar.style.width = '55%';
    msg.textContent = 'Consultando o livro de feitiços...';

    const spellData = await fetchSpells();
    state.spells = spellData.spells;

    bar.style.width = '85%';
    msg.textContent = 'Preparando o adversário...';

    const cpuData = await fetchCpuDeck();
    state.cpuDeck = cpuData.deck;

    const shuffled = [...state.spells].sort(() => 0.5 - Math.random());
    state.playerSpells = shuffled.slice(0, 5);

    bar.style.width = '100%';
    msg.textContent = 'Pronto!';

    setTimeout(() => {
        document.getElementById('screen-loading').classList.add('fade-out');
        setTimeout(() => {
            document.getElementById('screen-loading').style.display = 'none';
            showScreen('screen-draft');
            renderPackGrid();
        }, 600);
    }, 400);
}

// ── DRAFT (SELEÇÃO) ──
function renderPackGrid() {
    const grid = document.getElementById('packGrid');
    grid.innerHTML = '';
    
    state.pack.forEach((char, i) => {
        const isSelected = state.selectedCards.includes(i);
        const div = document.createElement('div');
        div.className = `card ${isSelected ? 'selected' : ''}`;
        div.innerHTML = renderCard(char);
        div.onclick = () => toggleDraftCard(i);
        grid.appendChild(div);
    });

    document.getElementById('draftCount').textContent = state.selectedCards.length;
    document.getElementById('btnConfirmDraft').disabled = state.selectedCards.length < 2;
}

function toggleDraftCard(idx) {
    const pos = state.selectedCards.indexOf(idx);
    if (pos >= 0) {
        state.selectedCards.splice(pos, 1);
    } else if (state.selectedCards.length < 2) {
        state.selectedCards.push(idx);
    }
    renderPackGrid();
}

async function rerollPack() {
    state.selectedCards = [];
    document.getElementById('packGrid').innerHTML = '<div style="text-align:center;padding:40px;color:var(--parchment-dark);grid-column:1/-1">Invocando novos bruxos...</div>';
    const data = await fetchPack();
    state.pack = data.cards;
    renderPackGrid();
}

function confirmDraft() {
    if (state.selectedCards.length < 2) return;
    state.playerDeck = [state.pack[state.selectedCards[0]], state.pack[state.selectedCards[1]]];
    startBattle();
}

// ── BATALHA ──
function getActiveIdx(deck) {
    return deck.findIndex(char => char.hp > 0);
}

function startBattle() {
    state.round = 1;
    state.scoreP = 0;
    state.scoreC = 0;
    state.waiting = false;

    document.getElementById('scoreP').textContent = '0';
    document.getElementById('scoreC').textContent = '0';
    document.getElementById('roundNum').textContent = '1';
    document.getElementById('battleLog').innerHTML = '';
    document.getElementById('btnNext').style.display = 'none';

    showScreen('screen-battle');
    renderBattleState();
    logMessage('⚔ O duelo começou! Escolha um feitiço para atacar.', 'info');
    setStatusMessage('Escolha um feitiço para atacar!');
}

function renderBattleState() {
    const pIdx = getActiveIdx(state.playerDeck);
    const cIdx = getActiveIdx(state.cpuDeck);

    if (pIdx < 0 || cIdx < 0) {
        endGame();
        return;
    }

    const pChar = state.playerDeck[pIdx];
    const cChar = state.cpuDeck[cIdx];

    document.getElementById('playerActiveName').textContent = pChar.name;
    document.getElementById('cpuActiveName').textContent = cChar.name;

    const pSlot = document.getElementById('playerCardSlot');
    pSlot.innerHTML = `<div class="card battle-card" id="battleCardP">${renderCard(pChar)}</div>`;

    const cSlot = document.getElementById('cpuCardSlot');
    cSlot.innerHTML = `<div class="card battle-card" id="battleCardC">${renderCard(cChar)}</div>`;

    renderDeckBadges(state.playerDeck, pIdx, 'playerDeckBadges');
    renderDeckBadges(state.cpuDeck, cIdx, 'cpuDeckBadges');
    renderSpellList(!state.waiting);
}

function renderSpellList(enabled) {
    const el = document.getElementById('spellList');
    let html = '';
    state.playerSpells.forEach((sp, i) => {
        const isHeal = sp.damage < 0;
        const dmgLabel = isHeal ? `💚 +${Math.abs(sp.damage)} HP` : `💀 ${sp.damage} dmg`;
        const dmgClass = isHeal ? 'spell-dmg heal' : 'spell-dmg attack';
        const dis = enabled ? '' : 'disabled';
        
        html += `
            <button class="spell-btn" ${dis} data-index="${i}">
                <div><span class="spell-name">${sp.name}</span><span class="spell-effect">${sp.effect}</span></div>
                <span class="${dmgClass}">${dmgLabel}</span>
            </button>`;
    });
    
    el.innerHTML = html;
    
    // Adiciona os eventos de clique dinamicamente (Prática recomendada em invés de onclick no HTML)
    document.querySelectorAll('.spell-btn').forEach(btn => {
        btn.addEventListener('click', (e) => castSpell(e.currentTarget.dataset.index));
    });
}

function castSpell(spellIdx) {
    if (state.waiting) return;
    state.waiting = true;
    renderSpellList(false);

    const sp = state.playerSpells[spellIdx];
    const pIdx = getActiveIdx(state.playerDeck);
    const cIdx = getActiveIdx(state.cpuDeck);
    const pChar = state.playerDeck[pIdx];
    const cChar = state.cpuDeck[cIdx];

    const pDmg = Math.floor(sp.damage * (pChar.magic / 100) * (Math.random() * 0.4 + 0.8));

    if (sp.damage < 0) {
        const heal = Math.abs(pDmg);
        pChar.hp = Math.min(pChar.maxHp, pChar.hp + heal);
        logMessage(`✨ ${sp.name} — você curou ${heal} HP!`, 'heal');
        animateCard('battleCardP', 'battling');
    } else {
        cChar.hp -= pDmg;
        logMessage(`⚡ ${sp.name} → ${cChar.name} perdeu ${pDmg} HP!`, 'win');
        animateCard('battleCardC', 'hit');
    }

    setTimeout(() => cpuTurn(pChar, cChar), 800);
}

function cpuTurn(pChar, cChar) {
    const cpuSpellIdx = Math.floor(Math.random() * state.spells.length);
    const cpuSp = state.spells[cpuSpellIdx];
    const cpuDmg = Math.floor(cpuSp.damage * (cChar.magic / 100) * (Math.random() * 0.4 + 0.8));

    if (cpuSp.damage < 0) {
        const cpuHeal = Math.abs(cpuDmg);
        cChar.hp = Math.min(cChar.maxHp, cChar.hp + cpuHeal);
        logMessage(`🧙 CPU: ${cpuSp.name} — curou ${cpuHeal} HP!`, 'heal');
        animateCard('battleCardC', 'battling');
    } else {
        pChar.hp -= cpuDmg;
        logMessage(`💀 CPU: ${cpuSp.name} → perdeu ${cpuDmg} HP!`, 'lose');
        animateCard('battleCardP', 'hit');
    }

    setTimeout(checkRoundEnd, 700);
}

function animateCard(id, className) {
    const el = document.getElementById(id);
    if (el) {
        el.classList.add(className);
        setTimeout(() => el.classList.remove(className), 600);
    }
}

function checkRoundEnd() {
    const pIdx = getActiveIdx(state.playerDeck);
    const cIdx = getActiveIdx(state.cpuDeck);
    let roundOver = false;

    // Checa se os ativos morreram no último turno e atualiza placar
    const activeP = state.playerDeck.find(c => c.hp <= 0 && c.name === document.getElementById('playerActiveName').textContent);
    const activeC = state.cpuDeck.find(c => c.hp <= 0 && c.name === document.getElementById('cpuActiveName').textContent);

    if (activeP) {
        logMessage(`💀 ${activeP.name} foi derrotado!`, 'lose');
        state.scoreC++;
        document.getElementById('scoreC').textContent = state.scoreC;
        roundOver = true;
    }
    
    if (activeC) {
        logMessage(`🏆 ${activeC.name} foi derrotado!`, 'win');
        state.scoreP++;
        document.getElementById('scoreP').textContent = state.scoreP;
        roundOver = true;
    }

    renderBattleState();

    if (getActiveIdx(state.playerDeck) < 0 || getActiveIdx(state.cpuDeck) < 0) {
        setTimeout(endGame, 800);
        return;
    }

    state.waiting = false;

    if (roundOver) {
        state.round++;
        document.getElementById('roundNum').textContent = state.round;
        logMessage(`— Rodada ${state.round} —`, 'info');
    }

    setStatusMessage('Escolha um feitiço para atacar!');
    renderSpellList(true);
}

function endGame() {
    const over = document.getElementById('screen-over');
    
    if (state.scoreP > state.scoreC) {
        document.getElementById('overGlyph').textContent = '🏆';
        document.getElementById('overTitle').textContent = 'Vitória!';
        document.getElementById('overSub').textContent = 'Você dominou o duelo!';
    } else if (state.scoreC > state.scoreP) {
        document.getElementById('overGlyph').textContent = '💀';
        document.getElementById('overTitle').textContent = 'Derrota';
        document.getElementById('overSub').textContent = 'O CPU foi mais poderoso desta vez.';
    } else {
        document.getElementById('overGlyph').textContent = '✦';
        document.getElementById('overTitle').textContent = 'Empate';
        document.getElementById('overSub').textContent = 'Bruxos igualmente poderosos.';
    }
    
    document.getElementById('overScore').textContent = `Você ${state.scoreP}  ×  ${state.scoreC} CPU`;
    over.classList.add('active');
}

// ── LISTENERS (EVITANDO ONCLICK NO HTML) ──
document.getElementById('btnConfirmDraft').addEventListener('click', confirmDraft);
document.getElementById('btnRerollPack').addEventListener('click', rerollPack);
document.getElementById('btnRestart').addEventListener('click', () => location.reload());

// Inicia o jogo
loadGame();