// Game State Management
let gameState = {
    points: 0,
    level: 1,
    badges: 0,
    scienceProgress: 0,
    artProgress: 0,
    techProgress: 0,
    achievements: {
        firstExperiment: false,
        creativeArtist: false,
        initialProgrammer: false,
        mathMaster: false
    }
};

// Load game state from localStorage
function loadGameState() {
    const saved = localStorage.getItem('alejGameState');
    if (saved) {
        gameState = JSON.parse(saved);
        updateUI();
    }
}

// Save game state to localStorage
function saveGameState() {
    localStorage.setItem('alejGameState', JSON.stringify(gameState));
}

// Update UI with current state
function updateUI() {
    document.getElementById('total-points').textContent = gameState.points;
    document.getElementById('user-level').textContent = gameState.level;
    document.getElementById('total-badges').textContent = gameState.badges;
    
    document.getElementById('science-progress').style.width = gameState.scienceProgress + '%';
    document.getElementById('science-percent').textContent = gameState.scienceProgress + '%';
    
    document.getElementById('art-progress').style.width = gameState.artProgress + '%';
    document.getElementById('art-percent').textContent = gameState.artProgress + '%';
    
    document.getElementById('tech-progress').style.width = gameState.techProgress + '%';
    document.getElementById('tech-percent').textContent = gameState.techProgress + '%';
    
    updateAchievements();
}

// Update achievements display
function updateAchievements() {
    const achievements = document.querySelectorAll('.achievement');
    const achievementKeys = ['firstExperiment', 'creativeArtist', 'initialProgrammer', 'mathMaster'];
    
    achievements.forEach((elem, index) => {
        if (gameState.achievements[achievementKeys[index]]) {
            elem.classList.remove('locked');
            elem.classList.add('unlocked');
        }
    });
}

// Award points and update progress
function awardPoints(points, category) {
    gameState.points += points;
    
    // Update category progress
    if (category === 'science') {
        gameState.scienceProgress = Math.min(100, gameState.scienceProgress + 5);
    } else if (category === 'art') {
        gameState.artProgress = Math.min(100, gameState.artProgress + 5);
    } else if (category === 'tech') {
        gameState.techProgress = Math.min(100, gameState.techProgress + 5);
    }
    
    // Check for level up
    const newLevel = Math.floor(gameState.points / 100) + 1;
    if (newLevel > gameState.level) {
        gameState.level = newLevel;
        showNotification(`¡Nivel ${newLevel} alcanzado! 🎉`);
    }
    
    updateUI();
    saveGameState();
    showNotification(`+${points} puntos! 🏆`);
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'score-notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Unlock achievement
function unlockAchievement(achievementKey, message) {
    if (!gameState.achievements[achievementKey]) {
        gameState.achievements[achievementKey] = true;
        gameState.badges++;
        updateUI();
        saveGameState();
        showNotification(message);
    }
}

// Smooth scroll to modules
function scrollToModules() {
    document.getElementById('ciencias').scrollIntoView({ behavior: 'smooth' });
}

// Close activity modal
function closeActivity() {
    document.getElementById('activity-area').classList.add('hidden');
    document.body.style.overflow = 'auto';
}

// Show activity modal
function showActivity(title, content) {
    document.getElementById('activity-title').textContent = title;
    document.getElementById('activity-content').innerHTML = content;
    document.getElementById('activity-area').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

// Physics Simulations
function loadSimulation(type) {
    let content = '';
    
    if (type === 'pendulum') {
        content = `
            <h3>Simulación: Péndulo Simple</h3>
            <p>Observa cómo la gravedad afecta el movimiento de un péndulo.</p>
            <div class="simulation-canvas" id="pendulum-canvas">
                <canvas id="sim-canvas" width="700" height="400"></canvas>
            </div>
            <div class="controls">
                <button class="control-btn" onclick="startPendulum()">Iniciar</button>
                <button class="control-btn danger" onclick="stopPendulum()">Detener</button>
                <button class="control-btn" onclick="resetPendulum()">Reiniciar</button>
            </div>
            <div class="challenge-box">
                <p><strong>Dato interesante:</strong> El período de un péndulo simple depende de su longitud y la gravedad, pero no de su masa.</p>
            </div>
        `;
        showActivity('Péndulo Simple', content);
        setTimeout(() => initPendulum(), 100);
    } else if (type === 'projectile') {
        content = `
            <h3>Simulación: Movimiento Proyectil</h3>
            <p>Experimenta con diferentes ángulos y velocidades iniciales.</p>
            <div class="simulation-canvas" id="projectile-canvas">
                <canvas id="sim-canvas" width="700" height="400"></canvas>
            </div>
            <div class="controls">
                <label>Ángulo: <input type="range" id="angle-slider" min="0" max="90" value="45"> <span id="angle-value">45°</span></label>
                <button class="control-btn" onclick="launchProjectile()">Lanzar</button>
                <button class="control-btn" onclick="resetProjectile()">Reiniciar</button>
            </div>
        `;
        showActivity('Movimiento Proyectil', content);
        setTimeout(() => initProjectile(), 100);
    } else if (type === 'waves') {
        content = `
            <h3>Simulación: Ondas y Sonido</h3>
            <p>Explora las propiedades de las ondas: frecuencia, amplitud y longitud de onda.</p>
            <div class="simulation-canvas" id="wave-canvas">
                <canvas id="sim-canvas" width="700" height="400"></canvas>
            </div>
            <div class="controls">
                <label>Frecuencia: <input type="range" id="freq-slider" min="1" max="10" value="3"> Hz</label>
                <label>Amplitud: <input type="range" id="amp-slider" min="10" max="100" value="50"> px</label>
                <button class="control-btn" onclick="updateWave()">Actualizar</button>
            </div>
        `;
        showActivity('Ondas y Sonido', content);
        setTimeout(() => initWave(), 100);
    }
    
    awardPoints(10, 'science');
    if (!gameState.achievements.firstExperiment) {
        unlockAchievement('firstExperiment', '¡Primer Experimento Completado! 🔬');
    }
}

// Math Challenges
function loadChallenge(type) {
    let content = '';
    
    if (type === 'algebra') {
        const num1 = Math.floor(Math.random() * 20) + 1;
        const num2 = Math.floor(Math.random() * 20) + 1;
        const correctAnswer = num1 + num2;
        const wrongAnswer1 = correctAnswer + Math.floor(Math.random() * 5) + 1;
        const wrongAnswer2 = Math.max(0, correctAnswer - Math.floor(Math.random() * 5) - 1);
        
        content = `
            <h3>Reto de Álgebra</h3>
            <div class="challenge-box">
                <p class="challenge-question">¿Cuánto es ${num1} + ${num2}?</p>
                <div class="answer-options">
                    <button class="answer-btn" onclick="checkAnswer(this, true)">${correctAnswer}</button>
                    <button class="answer-btn" onclick="checkAnswer(this, false)">${wrongAnswer1}</button>
                    <button class="answer-btn" onclick="checkAnswer(this, false)">${wrongAnswer2}</button>
                </div>
            </div>
        `;
    } else if (type === 'geometry') {
        content = `
            <h3>Geometría Interactiva</h3>
            <div class="challenge-box">
                <p class="challenge-question">¿Cuántos grados suman los ángulos internos de un triángulo?</p>
                <div class="answer-options">
                    <button class="answer-btn" onclick="checkAnswer(this, false)">90°</button>
                    <button class="answer-btn" onclick="checkAnswer(this, true)">180°</button>
                    <button class="answer-btn" onclick="checkAnswer(this, false)">360°</button>
                </div>
            </div>
            <div class="simulation-canvas">
                <canvas id="sim-canvas" width="700" height="300"></canvas>
            </div>
        `;
        showActivity('Geometría Interactiva', content);
        setTimeout(() => drawTriangle(), 100);
        return;
    } else if (type === 'calculus') {
        content = `
            <h3>Cálculo Visual</h3>
            <div class="challenge-box">
                <p class="challenge-question">¿Qué representa la derivada de una función?</p>
                <div class="answer-options">
                    <button class="answer-btn" onclick="checkAnswer(this, false)">El área bajo la curva</button>
                    <button class="answer-btn" onclick="checkAnswer(this, true)">La pendiente de la tangente</button>
                    <button class="answer-btn" onclick="checkAnswer(this, false)">El valor máximo</button>
                </div>
            </div>
        `;
    }
    
    showActivity('Retos Matemáticos', content);
    awardPoints(15, 'science');
}

// Check answer for challenges
function checkAnswer(button, isCorrect) {
    const buttons = button.parentElement.querySelectorAll('.answer-btn');
    buttons.forEach(btn => btn.disabled = true);
    
    if (isCorrect) {
        button.classList.add('correct');
        awardPoints(20, 'science');
        showNotification('¡Correcto! +20 puntos 🎉');
        if (!gameState.achievements.mathMaster) {
            unlockAchievement('mathMaster', '¡Maestro Matemático! 📊');
        }
    } else {
        button.classList.add('incorrect');
        showNotification('Intenta de nuevo 💪');
    }
}

// Experiments
function startExperiment(type) {
    let content = '';
    
    if (type === 'density') {
        content = `
            <h3>Experimento: Densidad y Flotación</h3>
            <p>Observa cómo objetos de diferentes densidades se comportan en agua.</p>
            <div class="simulation-canvas">
                <canvas id="sim-canvas" width="700" height="400"></canvas>
            </div>
            <div class="controls">
                <button class="control-btn" onclick="addObject('wood')">Añadir Madera</button>
                <button class="control-btn" onclick="addObject('metal')">Añadir Metal</button>
                <button class="control-btn" onclick="addObject('plastic')">Añadir Plástico</button>
            </div>
        `;
        showActivity('Densidad y Flotación', content);
        setTimeout(() => initDensityExperiment(), 100);
    } else if (type === 'optics') {
        content = `
            <h3>Experimento: Óptica y Luz</h3>
            <p>Explora la reflexión y refracción de la luz.</p>
            <div class="challenge-box">
                <p>La luz viaja a aproximadamente 300,000 km/s en el vacío.</p>
            </div>
        `;
    } else if (type === 'energy') {
        content = `
            <h3>Experimento: Conservación de Energía</h3>
            <p>La energía no se crea ni se destruye, solo se transforma.</p>
            <div class="challenge-box">
                <p>Observa cómo la energía potencial se convierte en cinética en una montaña rusa.</p>
            </div>
        `;
    }
    
    showActivity('Experimento Virtual', content);
    awardPoints(15, 'science');
}

// Art Activities
function openCanvas(type) {
    let content = '';
    
    if (type === 'drawing') {
        content = `
            <h3>Canvas de Dibujo</h3>
            <p>Expresa tu creatividad dibujando libremente.</p>
            <canvas id="drawing-canvas" width="700" height="400"></canvas>
            <div class="controls">
                <button class="control-btn" onclick="clearCanvas()">Limpiar</button>
                <button class="control-btn success" onclick="saveDrawing()">Guardar</button>
            </div>
        `;
        showActivity('Dibujo Digital', content);
        setTimeout(() => initDrawingCanvas(), 100);
    } else if (type === 'patterns') {
        content = `
            <h3>Patrones y Formas</h3>
            <p>Crea patrones geométricos hermosos.</p>
            <div class="simulation-canvas">
                <canvas id="sim-canvas" width="700" height="400"></canvas>
            </div>
            <div class="controls">
                <button class="control-btn" onclick="generatePattern('circles')">Círculos</button>
                <button class="control-btn" onclick="generatePattern('squares')">Cuadrados</button>
                <button class="control-btn" onclick="generatePattern('triangles')">Triángulos</button>
            </div>
        `;
        showActivity('Patrones Geométricos', content);
        setTimeout(() => initPatterns(), 100);
    } else if (type === 'colors') {
        content = `
            <h3>Teoría del Color</h3>
            <p>Aprende sobre colores primarios, secundarios y complementarios.</p>
            <div class="challenge-box">
                <p><strong>Colores Primarios:</strong> Rojo, Azul, Amarillo</p>
                <p><strong>Colores Secundarios:</strong> Verde, Naranja, Violeta</p>
            </div>
        `;
    }
    
    showActivity('Arte Digital', content);
    awardPoints(10, 'art');
    unlockAchievement('creativeArtist', '¡Artista Creativo! 🎨');
}

function exploreArt(period) {
    const content = `
        <h3>Explorando ${period}</h3>
        <p>Descubre los grandes maestros y obras de este período artístico.</p>
        <div class="challenge-box">
            <p>El arte nos permite expresar emociones y contar historias visuales.</p>
        </div>
    `;
    showActivity('Historia del Arte', content);
    awardPoints(10, 'art');
}

function openMusic(type) {
    const content = `
        <h3>Música y Sonido</h3>
        <p>La música es matemáticas en movimiento. Explora ritmos y melodías.</p>
        <div class="challenge-box">
            <p>🎵 Las notas musicales siguen patrones matemáticos de frecuencias.</p>
        </div>
    `;
    showActivity('Compositor Virtual', content);
    awardPoints(10, 'art');
}

// Technology Activities
function startCoding(language) {
    let content = '';
    
    if (language === 'scratch') {
        content = `
            <h3>Programación Visual con Scratch</h3>
            <p>Crea tus primeros programas arrastrando bloques de código.</p>
            <div class="challenge-box">
                <p class="challenge-question">¿Qué hace este código?</p>
                <pre style="background: #f4f4f4; padding: 1rem; border-radius: 8px;">
cuando se presione la bandera verde
repetir 10 veces
    mover 10 pasos
    girar 36 grados
fin
                </pre>
                <div class="answer-options">
                    <button class="answer-btn" onclick="checkAnswer(this, false)">Dibuja un cuadrado</button>
                    <button class="answer-btn" onclick="checkAnswer(this, true)">Dibuja un decágono</button>
                    <button class="answer-btn" onclick="checkAnswer(this, false)">Dibuja un círculo</button>
                </div>
            </div>
        `;
    } else if (language === 'python') {
        content = `
            <h3>Python Básico</h3>
            <p>Aprende uno de los lenguajes más populares del mundo.</p>
            <div class="challenge-box">
                <pre style="background: #2d2d2d; color: #f8f8f2; padding: 1rem; border-radius: 8px;">
# Mi primer programa en Python
nombre = "Estudiante"
print(f"¡Hola, {nombre}!")
                </pre>
            </div>
        `;
    } else if (language === 'web') {
        content = `
            <h3>Desarrollo Web</h3>
            <p>Crea tus propias páginas web con HTML, CSS y JavaScript.</p>
            <div class="challenge-box">
                <p>HTML estructura el contenido, CSS lo hace bonito, y JavaScript lo hace interactivo.</p>
            </div>
        `;
    }
    
    showActivity('Aprendiendo a Programar', content);
    awardPoints(15, 'tech');
    unlockAchievement('initialProgrammer', '¡Programador Inicial! 💻');
}

function openRobotics(level) {
    const content = `
        <h3>Robótica Virtual</h3>
        <p>Programa un robot virtual para completar misiones.</p>
        <div class="simulation-canvas">
            <canvas id="sim-canvas" width="700" height="400"></canvas>
        </div>
        <div class="controls">
            <button class="control-btn" onclick="robotMove('forward')">⬆️ Adelante</button>
            <button class="control-btn" onclick="robotMove('left')">⬅️ Izquierda</button>
            <button class="control-btn" onclick="robotMove('right')">➡️ Derecha</button>
        </div>
    `;
    showActivity('Robótica', content);
    setTimeout(() => initRobot(), 100);
    awardPoints(15, 'tech');
}

function solvePuzzle(type) {
    const content = `
        <h3>Desafío de Lógica</h3>
        <p>Resuelve este puzzle usando pensamiento computacional.</p>
        <div class="challenge-box">
            <p class="challenge-question">Si tienes 3 cajas y 2 pelotas, ¿de cuántas formas puedes distribuir las pelotas?</p>
            <div class="answer-options">
                <button class="answer-btn" onclick="checkAnswer(this, false)">3</button>
                <button class="answer-btn" onclick="checkAnswer(this, true)">6</button>
                <button class="answer-btn" onclick="checkAnswer(this, false)">9</button>
            </div>
        </div>
    `;
    showActivity('Puzzle Lógico', content);
    awardPoints(15, 'tech');
}

// Canvas Implementations
function initPendulum() {
    const canvas = document.getElementById('sim-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let angle = Math.PI / 4;
    let angleVelocity = 0;
    let angleAcceleration = 0;
    let length = 200;
    let gravity = 0.5;
    let isRunning = false;
    
    window.startPendulum = () => { isRunning = true; animate(); };
    window.stopPendulum = () => { isRunning = false; };
    window.resetPendulum = () => { angle = Math.PI / 4; angleVelocity = 0; };
    
    function animate() {
        if (!isRunning) return;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        angleAcceleration = (-gravity / length) * Math.sin(angle);
        angleVelocity += angleAcceleration;
        angle += angleVelocity;
        angleVelocity *= 0.99;
        
        const originX = canvas.width / 2;
        const originY = 50;
        const bobX = originX + length * Math.sin(angle);
        const bobY = originY + length * Math.cos(angle);
        
        ctx.beginPath();
        ctx.moveTo(originX, originY);
        ctx.lineTo(bobX, bobY);
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(bobX, bobY, 20, 0, Math.PI * 2);
        ctx.fillStyle = '#4a90e2';
        ctx.fill();
        
        requestAnimationFrame(animate);
    }
}

function initProjectile() {
    const canvas = document.getElementById('sim-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const slider = document.getElementById('angle-slider');
    const angleDisplay = document.getElementById('angle-value');
    
    slider.addEventListener('input', () => {
        angleDisplay.textContent = slider.value + '°';
    });
    
    window.launchProjectile = () => {
        const angle = (slider.value * Math.PI) / 180;
        const velocity = 15;
        let x = 50;
        let y = canvas.height - 50;
        let vx = velocity * Math.cos(angle);
        let vy = -velocity * Math.sin(angle);
        
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Ground
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(0, canvas.height - 30, canvas.width, 30);
            
            // Projectile trail
            vy += 0.5;
            x += vx;
            y += vy;
            
            ctx.beginPath();
            ctx.arc(x, y, 10, 0, Math.PI * 2);
            ctx.fillStyle = '#ff6b6b';
            ctx.fill();
            
            if (y < canvas.height - 30 && x < canvas.width) {
                requestAnimationFrame(animate);
            } else {
                awardPoints(5, 'science');
            }
        }
        animate();
    };
    
    window.resetProjectile = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(0, canvas.height - 30, canvas.width, 30);
    };
    
    window.resetProjectile();
}

function initWave() {
    const canvas = document.getElementById('sim-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let frequency = 3;
    let amplitude = 50;
    let phase = 0;
    
    window.updateWave = () => {
        frequency = document.getElementById('freq-slider').value;
        amplitude = document.getElementById('amp-slider').value;
    };
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);
        
        for (let x = 0; x < canvas.width; x++) {
            const y = canvas.height / 2 + amplitude * Math.sin((x * frequency * 0.02) + phase);
            ctx.lineTo(x, y);
        }
        
        ctx.strokeStyle = '#7b68ee';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        phase += 0.05;
        requestAnimationFrame(animate);
    }
    animate();
}

function drawTriangle() {
    const canvas = document.getElementById('sim-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.beginPath();
    ctx.moveTo(350, 50);
    ctx.lineTo(550, 250);
    ctx.lineTo(150, 250);
    ctx.closePath();
    ctx.strokeStyle = '#4a90e2';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = 'rgba(74, 144, 226, 0.2)';
    ctx.fill();
    
    // Labels
    ctx.fillStyle = '#000';
    ctx.font = '16px Arial';
    ctx.fillText('60°', 340, 70);
    ctx.fillText('60°', 520, 240);
    ctx.fillText('60°', 160, 240);
}

function initDensityExperiment() {
    const canvas = document.getElementById('sim-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Draw water
    ctx.fillStyle = '#4a90e2';
    ctx.globalAlpha = 0.3;
    ctx.fillRect(50, 100, 600, 250);
    ctx.globalAlpha = 1;
    
    const objects = [];
    
    window.addObject = (type) => {
        const obj = {
            x: Math.random() * 500 + 100,
            y: 50,
            type: type,
            density: type === 'wood' ? 0.5 : type === 'plastic' ? 0.9 : 1.2
        };
        objects.push(obj);
        animateObjects();
    };
    
    function animateObjects() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#4a90e2';
        ctx.globalAlpha = 0.3;
        ctx.fillRect(50, 100, 600, 250);
        ctx.globalAlpha = 1;
        
        objects.forEach(obj => {
            if (obj.density < 1) {
                obj.y = Math.min(obj.y + 2, 130);
            } else {
                obj.y = Math.min(obj.y + 2, 320);
            }
            
            ctx.fillStyle = obj.type === 'wood' ? '#8B4513' : obj.type === 'plastic' ? '#FFD700' : '#808080';
            ctx.fillRect(obj.x, obj.y, 40, 40);
        });
    }
}

function initDrawingCanvas() {
    const canvas = document.getElementById('drawing-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let isDrawing = false;
    
    canvas.addEventListener('mousedown', () => { isDrawing = true; });
    canvas.addEventListener('mouseup', () => { isDrawing = false; ctx.beginPath(); });
    canvas.addEventListener('mousemove', (e) => {
        if (!isDrawing) return;
        
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#4a90e2';
        
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    });
    
    window.clearCanvas = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
    
    window.saveDrawing = () => {
        awardPoints(25, 'art');
        showNotification('¡Dibujo guardado! 🎨');
    };
}

function initPatterns() {
    const canvas = document.getElementById('sim-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    window.generatePattern = (shape) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const colors = ['#4a90e2', '#7b68ee', '#ff6b6b', '#51cf66', '#FFD700'];
        
        for (let i = 0; i < 50; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const size = Math.random() * 30 + 10;
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            ctx.fillStyle = color;
            ctx.globalAlpha = 0.6;
            
            if (shape === 'circles') {
                ctx.beginPath();
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.fill();
            } else if (shape === 'squares') {
                ctx.fillRect(x, y, size, size);
            } else if (shape === 'triangles') {
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x + size, y);
                ctx.lineTo(x + size/2, y - size);
                ctx.fill();
            }
        }
        ctx.globalAlpha = 1;
        awardPoints(15, 'art');
    };
}

function initRobot() {
    const canvas = document.getElementById('sim-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let robotX = 100;
    let robotY = 200;
    let robotAngle = 0;
    
    function drawRobot() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Grid
        ctx.strokeStyle = '#ddd';
        for (let i = 0; i < canvas.width; i += 50) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, canvas.height);
            ctx.stroke();
        }
        for (let i = 0; i < canvas.height; i += 50) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(canvas.width, i);
            ctx.stroke();
        }
        
        // Robot
        ctx.save();
        ctx.translate(robotX, robotY);
        ctx.rotate(robotAngle);
        
        ctx.fillStyle = '#4a90e2';
        ctx.fillRect(-20, -20, 40, 40);
        
        ctx.fillStyle = '#ff6b6b';
        ctx.fillRect(15, -5, 10, 10);
        
        ctx.restore();
    }
    
    window.robotMove = (direction) => {
        if (direction === 'forward') {
            robotX += Math.cos(robotAngle) * 50;
            robotY += Math.sin(robotAngle) * 50;
        } else if (direction === 'left') {
            robotAngle -= Math.PI / 2;
        } else if (direction === 'right') {
            robotAngle += Math.PI / 2;
        }
        drawRobot();
        awardPoints(5, 'tech');
    };
    
    drawRobot();
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    loadGameState();
});
