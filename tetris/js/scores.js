const DEFAULT_STATS = {
    bestScore: 0,
    bestTime: Infinity,
    highestLevel: 0,
    mostLines: 0,
}

function stableStringify(obj) {
    return JSON.stringify(obj, Object.keys(obj).sort());
}

function hashString(str) {
    let hash = 2166136261;
    for (let i = 0; i < str.length; i++) {
        hash ^= str.charCodeAt(i);
        hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(16);
}

function stableHashString(obj) {
    return hashString(stableStringify(obj));
}

export function loadStats(settings) {
    let rulesetId = stableHashString(settings);
    const key = `tetris.stats.${rulesetId}.${settings.gameMode}.v1`;
    const raw = localStorage.getItem(key);

    if (!raw) return { ...DEFAULT_STATS };

    try {
        return { ...DEFAULT_STATS, ...JSON.parse(raw) };
    } catch {
        return { ...DEFAULT_STATS };
    }
}

export function saveStats(settings, runStats) {
    let rulesetId = stableHashString(settings);
    const key = `tetris.stats.${rulesetId}.${settings.gameMode}.v1`;
    const prev = loadStats(rulesetId);

    let next;
    next = {
        bestScore: Math.max(prev.bestScore, runStats.score),
        bestTime: Math.min(prev.bestTime, runStats.time),
        highestLevel: Math.max(prev.highestLevel, runStats.level),
        mostLines: Math.max(prev.mostLines, runStats.lines),
    };

    localStorage.setItem(key, JSON.stringify(next));
}
