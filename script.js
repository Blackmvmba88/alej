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

// Animation tracking for cleanup
let activeAnimations = {
    pendulum: null,
    projectile: null,
    wave: null
};

// Cleanup function for animations
function cleanupAnimations() {
    Object.keys(activeAnimations).forEach(key => {
        if (activeAnimations[key]) {
            cancelAnimationFrame(activeAnimations[key]);
            activeAnimations[key] = null;
        }
    });
}

// Load game state from localStorage with error handling
function loadGameState() {
    try {
        const saved = localStorage.getItem('alejGameState');
        if (saved) {
            const parsed = JSON.parse(saved);
            // Validate saved state structure
            if (parsed && typeof parsed === 'object' && 
                typeof parsed.points === 'number' && 
                typeof parsed.level === 'number') {
                gameState = {
                    ...gameState,
                    ...parsed,
                    // Ensure achievements object exists
                    achievements: parsed.achievements || gameState.achievements
                };
                updateUI();
            }
        }
    } catch (error) {
        console.warn('Error loading game state:', error);
        // Reset to default state if corrupted
        saveGameState();
    }
}

// Save game state to localStorage with error handling
function saveGameState() {
    try {
        localStorage.setItem('alejGameState', JSON.stringify(gameState));
    } catch (error) {
        console.error('Error saving game state:', error);
        // Handle quota exceeded or other storage errors
        if (error.name === 'QuotaExceededError') {
            showNotification('⚠️ No se pudo guardar el progreso');
        }
    }
}

// Update UI with current state (with null checks)
function updateUI() {
    const updateElement = (id, value) => {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    };
    
    const updateProgress = (id, percent) => {
        const element = document.getElementById(id);
        if (element) element.style.width = percent + '%';
    };
    
    updateElement('total-points', gameState.points);
    updateElement('user-level', gameState.level);
    updateElement('total-badges', gameState.badges);
    
    updateProgress('science-progress', gameState.scienceProgress);
    updateElement('science-percent', gameState.scienceProgress + '%');
    
    updateProgress('art-progress', gameState.artProgress);
    updateElement('art-percent', gameState.artProgress + '%');
    
    updateProgress('tech-progress', gameState.techProgress);
    updateElement('tech-percent', gameState.techProgress + '%');
    
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

// Award points and update progress with validation
function awardPoints(points, category) {
    // Validate input
    if (typeof points !== 'number' || points < 0) return;
    
    gameState.points += points;
    
    // Update category progress with validated category
    const progressIncrement = 5;
    const categoryMap = {
        'science': 'scienceProgress',
        'art': 'artProgress',
        'tech': 'techProgress'
    };
    
    if (categoryMap[category]) {
        gameState[categoryMap[category]] = Math.min(100, gameState[categoryMap[category]] + progressIncrement);
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

// Show notification with queue management
const notificationQueue = [];
let isShowingNotification = false;

function showNotification(message) {
    if (!message || typeof message !== 'string') return;
    
    // Add to queue
    notificationQueue.push(message);
    
    // Process queue if not already processing
    if (!isShowingNotification) {
        processNotificationQueue();
    }
}

function processNotificationQueue() {
    if (notificationQueue.length === 0) {
        isShowingNotification = false;
        return;
    }
    
    isShowingNotification = true;
    const message = notificationQueue.shift();
    
    const notification = document.createElement('div');
    notification.className = 'score-notification';
    notification.textContent = message;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'polite');
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
            // Process next notification
            setTimeout(() => processNotificationQueue(), 300);
        }, 300);
    }, 2500);
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

// Close activity modal with cleanup
function closeActivity() {
    const activityArea = document.getElementById('activity-area');
    if (activityArea) {
        activityArea.classList.add('hidden');
    }
    document.body.style.overflow = 'auto';
    
    // Cleanup any running animations
    cleanupAnimations();
}

// Show activity modal with cleanup
function showActivity(title, content) {
    // Cleanup previous animations before showing new content
    cleanupAnimations();
    
    const titleElement = document.getElementById('activity-title');
    const contentElement = document.getElementById('activity-content');
    const activityArea = document.getElementById('activity-area');
    
    if (titleElement) titleElement.textContent = title;
    if (contentElement) contentElement.innerHTML = content;
    if (activityArea) activityArea.classList.remove('hidden');
    
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

// Canvas Implementations with proper cleanup
function initPendulum() {
    const canvas = document.getElementById('sim-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let angle = Math.PI / 4;
    let angleVelocity = 0;
    let angleAcceleration = 0;
    const length = 200;
    const gravity = 0.5;
    let isRunning = false;
    
    window.startPendulum = () => { 
        isRunning = true; 
        animate(); 
    };
    
    window.stopPendulum = () => { 
        isRunning = false;
        if (activeAnimations.pendulum) {
            cancelAnimationFrame(activeAnimations.pendulum);
            activeAnimations.pendulum = null;
        }
    };
    
    window.resetPendulum = () => { 
        angle = Math.PI / 4; 
        angleVelocity = 0;
        if (!isRunning) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    };
    
    function animate() {
        if (!isRunning || !canvas) return;
        
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
        
        activeAnimations.pendulum = requestAnimationFrame(animate);
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
    if (!ctx) return;
    
    let frequency = 3;
    let amplitude = 50;
    let phase = 0;
    let isRunning = true;
    
    window.updateWave = () => {
        const freqSlider = document.getElementById('freq-slider');
        const ampSlider = document.getElementById('amp-slider');
        if (freqSlider) frequency = parseFloat(freqSlider.value) || 3;
        if (ampSlider) amplitude = parseFloat(ampSlider.value) || 50;
    };
    
    function animate() {
        if (!isRunning || !canvas) return;
        
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
        activeAnimations.wave = requestAnimationFrame(animate);
    }
    
    animate();
    
    // Cleanup when modal is closed
    return () => {
        isRunning = false;
        if (activeAnimations.wave) {
            cancelAnimationFrame(activeAnimations.wave);
            activeAnimations.wave = null;
        }
    };
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
    if (!ctx) return;
    
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    
    // Mouse events
    const startDrawing = (e) => {
        isDrawing = true;
        const rect = canvas.getBoundingClientRect();
        lastX = e.clientX - rect.left;
        lastY = e.clientY - rect.top;
    };
    
    const stopDrawing = () => {
        isDrawing = false;
        ctx.beginPath();
    };
    
    const draw = (e) => {
        if (!isDrawing) return;
        
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = '#4a90e2';
        
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.stroke();
        
        lastX = x;
        lastY = y;
    };
    
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawing);
    canvas.addEventListener('mousemove', draw);
    
    // Touch events for mobile
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousedown', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    });
    
    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousemove', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    });
    
    canvas.addEventListener('touchend', (e) => {
        e.preventDefault();
        const mouseEvent = new MouseEvent('mouseup', {});
        canvas.dispatchEvent(mouseEvent);
    });
    
    window.clearCanvas = () => {
        if (ctx && canvas) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
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
    if (!ctx) return;
    
    window.generatePattern = (shape) => {
        // Validate shape input
        const validShapes = ['circles', 'squares', 'triangles'];
        if (!validShapes.includes(shape)) return;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const colors = ['#4a90e2', '#7b68ee', '#ff6b6b', '#51cf66', '#FFD700'];
        const patternCount = 50;
        
        // Use batch rendering for better performance
        ctx.save();
        ctx.globalAlpha = 0.6;
        
        for (let i = 0; i < patternCount; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const size = Math.random() * 30 + 10;
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            ctx.fillStyle = color;
            
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
                ctx.lineTo(x + size / 2, y - size);
                ctx.closePath();
                ctx.fill();
            }
        }
        
        ctx.restore();
        awardPoints(15, 'art');
        
        if (!gameState.achievements.creativeArtist) {
            unlockAchievement('creativeArtist', '¡Artista Creativo! 🎨');
        }
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

// Keyboard navigation for accessibility
function setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        // ESC key to close modal
        if (e.key === 'Escape') {
            const activityArea = document.getElementById('activity-area');
            if (activityArea && !activityArea.classList.contains('hidden')) {
                closeActivity();
            }
        }
        
        // Prevent default space bar scrolling when in modal
        if (e.key === ' ' && !document.getElementById('activity-area').classList.contains('hidden')) {
            e.preventDefault();
        }
    });
}

// Debounce utility function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle utility function for scroll/resize events
function throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Global error handler
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    // Don't break the app for minor errors
    event.preventDefault();
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    event.preventDefault();
});

// Safe function wrapper for error handling
function safeExecute(func, fallback = null) {
    try {
        return func();
    } catch (error) {
        console.error('Error in safe execution:', error);
        return fallback;
    }
}

// Initialize on load with error handling
document.addEventListener('DOMContentLoaded', () => {
    safeExecute(() => {
        loadGameState();
        setupKeyboardNavigation();
        
        // Add visibility change handler to pause animations when tab is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                cleanupAnimations();
            }
        });
        
        // Prefetch critical resources (if needed in future)
        // This is a hook for future performance improvements
        
        console.log('ALEJ Platform initialized successfully');
    });
});
