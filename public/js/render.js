// Funções Utilitárias Visuais
function getHouseColor(h) {
    if (h === 'Gryffindor') return '#6b1010';
    if (h === 'Slytherin') return '#0a3018';
    if (h === 'Hufflepuff') return '#3a2800';
    if (h === 'Ravenclaw') return '#0a1a3a';
    return '#1e1040';
}

function getHouseEmoji(h) {
    if (h === 'Gryffindor') return '🦁';
    if (h === 'Slytherin') return '🐍';
    if (h === 'Hufflepuff') return '🦡';
    if (h === 'Ravenclaw') return '🦅';
    return '✦';
}

function hpColor(pct) {
    if (pct > 0.6) return 'linear-gradient(90deg,#0a4a2a,#22cc77)';
    if (pct > 0.3) return 'linear-gradient(90deg,#4a3a00,#ccaa22)';
    return 'linear-gradient(90deg,#4a0a0a,#cc2222)';
}

// Funções de Renderização DOM
export function renderCard(char) {
    const pct = char.hp / char.maxHp;
    const houseColor = getHouseColor(char.house);
    const houseEmoji = getHouseEmoji(char.house);

    return `
        <div class="card-img">
            <img src="${char.image}" alt="${char.name}" onerror="this.src='https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png'">
            <div class="house-badge" style="background:${houseColor}">${houseEmoji}</div>
        </div>
        <div class="card-body">
            <div class="card-name">${char.name}</div>
            <div class="card-meta">${char.species} · ${char.house}</div>
            <div class="hp-bar-wrap">
                <span class="hp-label">HP</span>
                <div class="hp-track"><div class="hp-fill" style="width:${Math.max(0, pct * 100)}%;background:${hpColor(pct)}"></div></div>
                <span class="hp-val">${Math.max(0, char.hp)}/${char.maxHp}</span>
            </div>
            <div class="mini-stats">
                <div class="mini-stat"><span class="mini-stat-icon">⚡</span><span class="mini-stat-val">${char.power}</span><span class="mini-stat-lbl">Poder</span></div>
                <div class="mini-stat"><span class="mini-stat-icon">🔮</span><span class="mini-stat-val">${char.magic}</span><span class="mini-stat-lbl">Magia</span></div>
                <div class="mini-stat"><span class="mini-stat-icon">🛡</span><span class="mini-stat-val">${char.defense}</span><span class="mini-stat-lbl">Defesa</span></div>
            </div>
        </div>`;
}

export function renderDeckBadges(deck, activeIdx, elId) {
    const el = document.getElementById(elId);
    let html = '';
    for (let i = 0; i < deck.length; i++) {
        const cls = deck[i].hp <= 0 ? 'deck-thumb dead' : (i === activeIdx ? 'deck-thumb active' : 'deck-thumb');
        html += `<div class="${cls}"><img src="${deck[i].image}" onerror="this.src='https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png'"></div>`;
    }
    el.innerHTML = html;
}

export function logMessage(msg, type = 'info') {
    const el = document.getElementById('battleLog');
    const span = document.createElement('span');
    span.className = `log-entry ${type}`;
    span.textContent = msg;
    el.appendChild(span);
    el.scrollTop = el.scrollHeight;
}

export function setStatusMessage(msg) {
    document.getElementById('battleStatus').textContent = msg;
}

export function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const el = document.getElementById(id);
    if (el) el.classList.add('active');
}