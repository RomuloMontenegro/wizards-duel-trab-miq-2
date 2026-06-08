// Funções que conversam com o Back-end
export async function fetchPack() {
    const res = await fetch('/api/pack');
    return res.json();
}

export async function fetchSpells() {
    const res = await fetch('/api/spells');
    return res.json();
}

export async function fetchCpuDeck() {
    const res = await fetch('/api/cpu-deck', { method: 'POST' });
    return res.json();
}