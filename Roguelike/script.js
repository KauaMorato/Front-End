// ==========================================
// ESTADO GLOBAL DO JOGO
// ==========================================
let player = {
    classe: "",
    hp: 0,
    maxHp: 0,
    atk: 0,
    almas: 0,
    upgradesHp: 0,
    upgradesAtk: 0,
    maxRoundReached: 1
};

const classTemplates = {
    "Guerreiro": { hp: 200, atk: 10, attackSpeed: 2000 }, 
    "Arqueiro":  { hp: 150, atk: 12, attackSpeed: 1000 }, 
    "Mago":      { hp: 90,  atk: 20, attackSpeed: 1500 }  
};

const mapBiomes = {
    floresta: {
        name: "🌲 Floresta Encantada",
        startRound: 1,
        monsters: ["Fada Corrompida", "Grifo Jovem", "Lobo da Floresta", "Ent Ancião", "Aranha Gigante"],
        boss: "👑 Rei dos Grifos"
    },
    deserto: {
        name: "🏜️ Deserto Escaldante",
        startRound: 101,
        monsters: ["Escorpião Rei", "Cobra Cascavel", "Hiena Faminta", "Múmia Esquecida", "Espírito da Areia"],
        boss: "👑 Verme Sombrio do Deserto"
    },
    neve: {
        name: "❄️ Picos Nevados",
        startRound: 201,
        monsters: ["Urso Polar", "Boneco de Neve Assassino", "Lobo Invernal", "Golem de Gelo", "Yeti Jovem"],
        boss: "👑 Abominável Homem das Neves"
    },
    vazio: {
        name: "🌌 Vazio Cósmico (Infinito)",
        startRound: 301,
        monsters: ["Aberração Estelar", "Devorador de Planetas", "Sombra do Caos"],
        boss: "👑 Titã do Vazio"
    }
};

let enemy = { name: "NPC", hp: 0, maxHp: 0, atk: 0 };
let currentRound = 1;
let isAutoAttacking = false;
let autoAttackInterval = null;
let skillReady = true;

// ==========================================
// FLUXO DE TELAS E INICIALIZAÇÃO
// ==========================================
function changeScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.add('hidden');
    });
    document.getElementById(screenId).classList.remove('hidden');
}

function openLoadMenu() {
    document.getElementById('load-area').classList.toggle('hidden');
}

function selectClass(className) {
    player.classe = className;
    
    let base = classTemplates[className];
    player.maxHp = base.hp + (player.upgradesHp * 20);
    player.atk = base.atk + (player.upgradesAtk * 5);
    player.hp = player.maxHp;

    document.getElementById('hud-class').innerText = className;
    document.getElementById('hero-name').innerText = className;
    
    startCombatLoop(1);
}

function startCombatLoop(targetRound) {
    currentRound = targetRound;
    document.getElementById('battle-log').innerHTML = "O combate vai começar...";
    
    setupRound();
    changeScreen('game-screen');
}

function setupRound() {
    document.getElementById('hud-round').innerText = currentRound;
    
    if (currentRound > player.maxRoundReached) {
        player.maxRoundReached = currentRound;
    }

    let currentBiome;
    if (currentRound <= 100) {
        currentBiome = mapBiomes.floresta;
    } else if (currentRound <= 200) {
        currentBiome = mapBiomes.deserto;
    } else if (currentRound <= 300) {
        currentBiome = mapBiomes.neve;
    } else {
        currentBiome = mapBiomes.vazio;
    }

    document.getElementById('hud-map').innerText = currentBiome.name;

    if (currentRound % 10 === 0) {
        enemy.name = ` ${currentBiome.boss} `;
        enemy.maxHp = 100 + (currentRound * 22); 
        enemy.atk = 10 + (currentRound * 2.8);
    } else {
        let randomMonster = currentBiome.monsters[Math.floor(Math.random() * currentBiome.monsters.length)];
        enemy.name = `${randomMonster} (lv.${currentRound})`;
        enemy.maxHp = 25 + (currentRound * 8);
        enemy.atk = 4 + (currentRound * 1.4);
    }
    
    enemy.hp = enemy.maxHp;
    
    let base = classTemplates[player.classe];
    player.maxHp = base.hp + (player.upgradesHp * 20);
    player.atk = base.atk + (player.upgradesAtk * 5);
    player.hp = player.maxHp; 
    
    skillReady = true;
    document.getElementById('btn-skill').disabled = false;
    
    logMessage(`--- Entrando em ${currentBiome.name} | Rodada ${currentRound} ---`);
    updateUI();
}

function updateUI() {
    document.getElementById('hero-hp').innerText = Math.max(0, Math.floor(player.hp));
    document.getElementById('hero-max-hp').innerText = player.maxHp;
    document.getElementById('enemy-name').innerText = enemy.name;
    document.getElementById('enemy-hp').innerText = Math.max(0, Math.floor(enemy.hp));
    document.getElementById('enemy-max-hp').innerText = enemy.maxHp;

    document.querySelectorAll('.soul-count').forEach(el => el.innerText = player.almas);
    
    document.getElementById('stat-bought-hp').innerText = player.upgradesHp * 20;
    document.getElementById('stat-bought-atk').innerText = player.upgradesAtk * 5;
}

function logMessage(text) {
    const logBox = document.getElementById('battle-log');
    logBox.innerHTML += `<br>${text}`;
    logBox.scrollTop = logBox.scrollHeight;
}

// ==========================================
// SISTEMA DE COMBATE
// ==========================================
function manualAttack() {
    if (enemy.hp <= 0 || player.hp <= 0) return;

    let damage = Math.floor(player.atk * (0.9 + Math.random() * 0.2));
    enemy.hp -= damage;
    logMessage(`Você atacou e causou ⚔️ **${damage}** de dano.`);

    if (enemy.hp <= 0) {
        winRound();
    } else {
        enemyAttack();
    }
    updateUI();
}

function enemyAttack() {
    let damage = Math.floor(enemy.atk * (0.9 + Math.random() * 0.2));
    player.hp -= damage;
    logMessage(`${enemy.name} te atacou e causou 💥 **${damage}** de dano.`);

    if (player.hp <= 0) {
        gameOver();
    }
}

function toggleAutoAttack() {
    const btn = document.getElementById('btn-auto');
    if (isAutoAttacking) {
        clearInterval(autoAttackInterval);
        isAutoAttacking = false;
        btn.innerText = "Auto: DESLIGADO";
        btn.style.backgroundColor = "#9871f5";
    } else {
        isAutoAttacking = true;
        btn.innerText = "Auto: LIGADO ⚔️";
        btn.style.backgroundColor = "#04d361";
        
        let speed = classTemplates[player.classe].attackSpeed;
        autoAttackInterval = setInterval(() => {
            if (player.hp > 0 && enemy.hp > 0) {
                manualAttack();
            }
        }, speed);
    }
}

function useSkill() {
    if (!skillReady || enemy.hp <= 0 || player.hp <= 0) return;

    if (player.classe === "Guerreiro") {
        let dmg = Math.floor(player.maxHp * 0.3);
        enemy.hp -= dmg;
        logMessage(`🛡️ **Escudo de Espinhos!** Dano baseado na vida: **${dmg}**.`);
    } else if (player.classe === "Arqueiro") {
        let dmg = player.atk * 3;
        enemy.hp -= dmg;
        logMessage(`🏹 **Tiro Preciso!** Crítico massivo de **${dmg}** de dano!`);
    } else if (player.classe === "Mago") {
        let dmg = player.atk * 4;
        enemy.hp -= dmg;
        logMessage(`🔮 **Explosão Arcana!** Dano mágico colossal de **${dmg}**!`);
    }

    skillReady = false;
    document.getElementById('btn-skill').disabled = true;

    if (enemy.hp <= 0) {
        winRound();
    } else {
        enemyAttack();
    }
    updateUI();
}

// ==========================================
// UPGRADES, REINICIALIZAÇÃO E SELEÇÃO DE MAPAS
// ==========================================
function winRound() {
    let almasGanhas = currentRound % 10 === 0 ? 20 : 3;
    player.almas += almasGanhas;
    logMessage(`🎉 ${enemy.name} derrotado! (+${almasGanhas} Almas)`);
    currentRound++;
    
    setTimeout(() => { if (player.hp > 0) setupRound(); }, 1000);
}

function gameOver() {
    if (isAutoAttacking) toggleAutoAttack();
    document.getElementById('go-round').innerText = currentRound;
    document.getElementById('go-max-round').innerText = player.maxRoundReached;
    updateUI();
    changeScreen('gameover-screen');
}

function buyUpgrade(type) {
    if (player.almas >= 10) {
        player.almas -= 10;
        document.getElementById('battle-log').innerHTML = "Upgrades modificados na base.";

        if (type === 'hp') {
            player.upgradesHp++;
        } else if (type === 'atk') {
            player.upgradesAtk++;
        }
        updateUI();
    } else {
        alert("Almas insuficientes! Cada upgrade custa 10 Almas.");
    }
}

function restartGame() {
    if (!player.classe) {
        changeScreen('class-screen');
        return;
    }

    const container = document.getElementById('map-buttons-container');
    container.innerHTML = ""; 

    const stages = [
        { name: "🌲 Começar na Floresta (Rodada 1)", minRequired: 1, start: 1 },
        { name: "🏜️ Pular para o Deserto (Rodada 101)", minRequired: 101, start: 101 },
        { name: "❄️ Pular para a Neve (Rodada 201)", minRequired: 201, start: 201 },
        { name: "🌌 Pular para o Vazio (Rodada 301)", minRequired: 301, start: 301 }
    ];

    stages.forEach(stage => {
        let btn = document.createElement('button');
        btn.innerText = stage.name;
        
        if (player.maxRoundReached >= stage.minRequired) {
            btn.onclick = () => startCombatLoop(stage.start);
        } else {
            btn.disabled = true;
            btn.innerText += " 🔒 (Bloqueado)";
            btn.style.opacity = "0.3";
            btn.style.cursor = "not-allowed";
            btn.style.backgroundColor = "#29292e";
        }
        container.appendChild(btn);
    });

    changeScreen('map-selection-screen');
}

// ==========================================
// SISTEMA DE SAVE / LOAD
// ==========================================
function exportSave() {
    let saveData = {
        almas: player.almas,
        upgradesHp: player.upgradesHp,
        upgradesAtk: player.upgradesAtk,
        maxRoundReached: player.maxRoundReached
    };
    let stringSave = btoa(JSON.stringify(saveData));
    prompt("Copie seu código de salvamento:", stringSave);
}

function loadGame() {
    let input = document.getElementById('save-input').value;
    try {
        let decoded = JSON.parse(atob(input));
        player.almas = decoded.almas;
        player.upgradesHp = decoded.upgradesHp || 0;
        player.upgradesAtk = decoded.upgradesAtk || 0;
        player.maxRoundReached = decoded.maxRoundReached || 1;
        alert("Progresso e mapas carregados!");
        updateUI();
        changeScreen('class-screen');
    } catch(err) {
        alert("Código inválido.");
    }
}

// Inicializa no Menu
changeScreen('menu-screen');