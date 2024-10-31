// Classe Ball representa a bola no jogo
class Ball {
    constructor(x, y, radius, color) {
        // Inicializa as propriedades da bola, como posição, raio, cor, velocidade, ângulo, etc.
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.speed = 0; // Velocidade inicial da bola
        this.angle = 0; // Ângulo de movimento da bola
        this.isMoving = false; // Indica se a bola está em movimento
        this.friction = 0.98; // Fator de atrito que reduz a velocidade
        this.opacity = 1; // Opacidade da bola
        this.isSinking = false; // Indica se a bola está afundando
        this.sinkSpeed = 0.05; // Velocidade de afundamento
    }

    // Método para desenhar a bola no contexto do canvas
    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`; // Cor da bola com opacidade
        ctx.fill();
        ctx.closePath();

        // Desenha uma sombra se a bola não estiver afundando
        if (!this.isSinking) {
            ctx.beginPath();
            ctx.arc(this.x + 2, this.y + 2, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'; // Cor da sombra
            ctx.fill();
            ctx.closePath();
        }
    }

    // Método para atualizar a posição e estado da bola
    update() {
        // Se a bola estiver afundando, reduz o raio e a opacidade
        if (this.isSinking) {
            this.radius *= 0.97; // Reduz o raio
            this.opacity -= this.sinkSpeed; // Reduz a opacidade
            return;
        }

        // Se a bola estiver em movimento, atualiza sua posição
        if (this.isMoving) {
            const randomFactor = 1 + (Math.random() - 0.5) * 0.01; // Fator aleatório para movimento
            let nextX = this.x + Math.cos(this.angle) * this.speed * randomFactor; // Nova posição X
            let nextY = this.y + Math.sin(this.angle) * this.speed * randomFactor; // Nova posição Y

            // Detecção de colisão com as paredes
            if (nextX - this.radius < 0 || nextX + this.radius > 800) {
                this.angle = Math.PI - this.angle; // Inverte a direção horizontal
                this.speed *= 0.8; // Reduz a velocidade na colisão
                nextX = Math.max(this.radius, Math.min(800 - this.radius, nextX)); // Ajusta a posição
            }

            if (nextY - this.radius < 0 || nextY + this.radius > 600) {
                this.angle = -this.angle; // Inverte a direção vertical
                this.speed *= 0.8; // Reduz a velocidade na colisão
                nextY = Math.max(this.radius, Math.min(600 - this.radius, nextY)); // Ajusta a posição
            }

            this.x = nextX; // Atualiza a posição X
            this.y = nextY; // Atualiza a posição Y

            this.friction = this.speed > 5 ? 0.97 : 0.98; // Ajusta o atrito com base na velocidade
            this.speed *= this.friction; // Aplica o atrito à velocidade

            // Adiciona uma leve curva ao movimento da bola
            this.angle += (Math.random() - 0.5) * 0.01;

            // Se a velocidade for muito baixa, para a bola
            if (this.speed < 0.1) {
                this.speed = 0;
                this.isMoving = false; // Para o movimento
            }
        }
    }

    // Método para iniciar o afundamento da bola
    startSinking() {
        this.isSinking = true; // Define que a bola está afundando
        this.isMoving = false; // Para o movimento
    }
}

// Classe Hole representa o buraco no jogo
class Hole {
    constructor(x, y, radius) {
        this.x = x; // Posição X do buraco
        this.y = y; // Posição Y do buraco
        this.radius = radius; // Raio do buraco
        this.pullRadius = radius * 2; // Raio de atração do buraco
    }

    // Método para desenhar o buraco
    draw(ctx) {
        const gradient = ctx.createRadialGradient(
            this.x, this.y, this.radius,
            this.x, this.y, this.pullRadius
        );
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0.4)'); // Cor do gradiente
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)'); // Cor do gradiente

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.pullRadius, 0, Math.PI * 2); // Desenha o círculo de atração
        ctx.fillStyle = gradient; // Aplica o gradiente
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius + 2, 0, Math.PI * 2); // Desenha a borda do buraco
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'; // Cor da borda
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); // Desenha o buraco
        ctx.fillStyle = 'black'; // Cor do buraco
        ctx.fill();
        ctx.closePath();
    }

    // Método para puxar a bola em direção ao buraco
    pullBall(ball) {
        const dx = this.x - ball.x; // Diferença em X
        const dy = this.y - ball.y; // Diferença em Y
        const distance = Math.hypot(dx, dy); // Distância até a bola

        // Se a bola estiver dentro do raio de atração
        if (distance < this.pullRadius) {
            const pullStrength = 0.1 * (1 - distance / this.pullRadius); // Força de atração
            ball.x += dx * pullStrength; // Atualiza a posição X da bola
            ball.y += dy * pullStrength; // Atualiza a posição Y da bola
            ball.speed *= (1 - pullStrength); // Reduz a velocidade da bola
        }
    }
}

// Classe Obstacle representa os obstáculos no jogo
class Obstacle {
    constructor(x, y, width, height, color = 'brown') {
        this.x = x; // Posição X do obstáculo
        this.y = y; // Posição Y do obstáculo
        this.width = width; // Largura do obstáculo
        this.height = height; // Altura do obstáculo
        this.color = color; // Cor do obstáculo
    }

    // Método para desenhar o obstáculo
    draw(ctx) {
        ctx.fillStyle = this.color; // Define a cor do obstáculo
        ctx.fillRect(this.x, this.y, this.width, this.height); // Desenha o retângulo
    }

    // Método para verificar colisão com a bola
    checkCollision(ball) {
        return (
            ball.x + ball.radius > this.x && // Verifica se a bola está à direita do obstáculo
            ball.x - ball.radius < this.x + this.width && // Verifica se a bola está à esquerda do obstáculo
            ball.y + ball.radius > this.y && // Verifica se a bola está abaixo do obstáculo
            ball.y - ball.radius < this.y + this.height // Verifica se a bola está acima do obstáculo
        );
    }
}
// Classe WaterHazard representa os perigos de água no jogo
class WaterHazard {
    constructor(x, y, radius, color = 'rgba(0, 150, 255, 0.6)') {
        this.x = x; // Posição X do perigo de água
        this.y = y; // Posição Y do perigo de água
        this.radius = radius; // Raio do perigo de água
        this.color = color; // Cor do perigo de água
    }

    // Método para desenhar o perigo de água
    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); // Desenha o círculo
        ctx.fillStyle = this.color; // Define a cor
        ctx.fill();
        ctx.strokeStyle = 'rgba(0, 100, 255, 0.8)'; // Cor da borda
        ctx.lineWidth = 2; // Largura da borda
        ctx.stroke(); // Desenha a borda
        ctx.closePath();
    }

    // Método para verificar colisão com a bola
    checkCollision(ball) {
        const distance = Math.hypot(ball.x - this.x, ball.y - this.y); // Distância até a bola
        return distance < this.radius + ball.radius; // Verifica se a bola está dentro do raio
    }
}

// Classe Game representa o jogo em si
class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId); // Obtém o canvas pelo ID
        this.ctx = this.canvas.getContext('2d'); // Obtém o contexto 2D do canvas
        this.width = this.canvas.width; // Largura do canvas
        this.height = this.canvas.height; // Altura do canvas
        this.level = 1; // Nível atual do jogo
        this.score = 0; // Pontuação do jogador
        this.fps = 0; // Frames por segundo
        this.lastFpsUpdate = 0; // Última atualização de FPS
        this.frameCount = 0; // Contador de frames
        this.isCharging = false; // Indica se a carga está sendo feita
        this.levelCompleted = false; // Indica se o nível foi completado

        // Inicializa o valor de ping
        this.initializePing();
        
        // Inicializa o valor de FPS
        this.initializeFps();

        this.initializeLevel(); // Inicializa o nível
        this.setupEventListeners(); // Configura os ouvintes de eventos
        this.updateControlsHint(); // Atualiza dicas de controle
    }

    // Método para inicializar o ping
    initializePing() {
        document.getElementById('pingCounter').innerText = 'Ping: ...'; // Define um valor padrão para o ping
    }

    // Método para inicializar o FPS
    initializeFps() {
        document.getElementById('fpsCounter').innerText = 'FPS: ...'; // Define um valor padrão para o FPS
    }

    // Método para obter as configurações de dificuldade com base no nível
    getDifficultySettings() {
        const settings = {
            1: { obstacles: { count: 5, minSize: 20, maxSize: 50 }, waterHazards: { count: 2, minRadius: 25, maxRadius: 35 }, holePosition: { x: 750, y: 300 } },
            2: { obstacles: { count: 6, minSize: 25, maxSize: 60 }, waterHazards: { count: 3, minRadius: 30, maxRadius: 40 }, holePosition: { x: 750, y: 250 } },
            3: { obstacles: { count: 7, minSize: 30, maxSize: 70 }, waterHazards: { count: 4, minRadius: 35, maxRadius: 45 }, holePosition: { x: 750, y: 200 } },
            4: { obstacles: { count: 8, minSize: 35, maxSize: 85 }, waterHazards: { count: 5, minRadius: 40, maxRadius: 50 }, holePosition: { x: 750, y: 150 } },
            5: { obstacles: { count: 9, minSize: 40, maxSize: 100 }, waterHazards: { count: 6, minRadius: 45, maxRadius: 55 }, holePosition: { x: 750, y: 100 } }
        };
        return settings[this.level]; // Retorna as configurações do nível atual
    }

    // Método para inicializar o nível
    initializeLevel() {
        const settings = this.getDifficultySettings(); // Obtém as configurações de dificuldade
        this.ball = new Ball(50, 550, 10, 'white'); // Cria uma nova bola
        this.hole = new Hole(settings.holePosition.x, settings.holePosition.y, 15); // Cria um novo buraco
        this.obstacles = this.createRandomObstacles(settings.obstacles.count, settings.obstacles.minSize, settings.obstacles.maxSize); // Cria obstáculos aleatórios
        this.waterHazards = this.createRandomWaterHazards(settings.waterHazards.count, settings.waterHazards.minRadius, settings.waterHazards.maxRadius); // Cria perigos de água aleatórios
        this.mouseX = this.canvas.width / 2; // Posição inicial do mouse
        this.mouseY = this.canvas.height / 2; // Posição inicial do mouse
        this.charge = 0; // Carga inicial
        this.maxCharge = 30; // Carga máxima
        this.chargingInterval = null; // Intervalo de carga
        this.lastTime = 0; // Último tempo registrado
        this.updateScore(); // Atualiza a pontuação
        this.updateDisplay(); // Atualiza a exibição
        this.updateChargeBar(); // Atualiza a barra de carga
        this.levelCompleted = false; // Reseta o estado de nível completado
        this.charge = 0; // Reseta a carga
        this.isCharging = false; // Reseta o estado de carga
        if (this.chargingInterval) {
            clearInterval(this.chargingInterval); // Limpa o intervalo de carga se existir
            this.chargingInterval = null; // Reseta o intervalo de carga
        }
    }

    // Método para criar obstáculos aleatórios
    createRandomObstacles(count, minSize, maxSize) {
        const obstacles = []; // Array para armazenar os obstáculos
        const minDistance = 120; // Distância mínima entre obstáculos

        for (let i = 0; i < count; i++) {
            let valid = false; // Flag para verificar se o obstáculo é válido
            let newObstacle; // Novo obstáculo

            while (!valid) {
                const x = Math.random() * (this.canvas.width - 300) + 150; // Posição X aleatória
                const y = Math.random() * (this.canvas.height - 200) + 100; // Posição Y aleatória
                const width = Math.random() * (maxSize - minSize) + minSize; // Largura aleatória
                const height = Math.random() * (maxSize - minSize) + minSize; // Altura aleatória

                newObstacle = new Obstacle(x, y, width, height); // Cria um novo obstáculo

                const distToBall = Math.hypot(newObstacle.x - this.ball.x, newObstacle.y - this.ball.y); // Distância até a bola
                const distToHole = Math.hypot(newObstacle.x - this.hole.x, newObstacle.y - this.hole.y); // Distância até o buraco

                valid = distToBall > minDistance && distToHole > minDistance; // Verifica se o obstáculo é válido

                for (const obstacle of obstacles) {
                    const dist = Math.hypot(newObstacle.x - obstacle.x, newObstacle.y - obstacle.y); // Distância até outros obstáculos
                    if (dist < minDistance) {
                        valid = false; // Se a distância for menor que a mínima, não é válido
                        break;
                    }
                }
            }
            obstacles.push(newObstacle); // Adiciona o obstáculo ao array
        }
        return obstacles; // Retorna os obstáculos criados
    }

    // Método para criar perigos de água aleatórios
    createRandomWaterHazards(count, minRadius, maxRadius) {
        const hazards = []; // Array para armazenar os perigos de água
        const minDistance = 120; // Distância mínima entre perigos de água

        for (let i = 0; i < count; i++) {
            let valid = false; // Flag para verificar se o perigo de água é válido
            let newHazard; // Novo perigo de água

            while (!valid) {
                const x = Math.random() * (this.canvas.width - 300) + 150; // Posição X aleatória
                const y = Math.random() * (this.canvas.height - 200) + 100; // Posição Y aleatória
                const radius = Math.random() * (maxRadius - minRadius) + minRadius; // Raio aleatório

                newHazard = new WaterHazard(x, y, radius); // Cria um novo perigo de água

                const distToBall = Math.hypot(newHazard.x - this.ball.x, newHazard.y - this.ball.y); // Distância até a bola
                const distToHole = Math.hypot(newHazard.x - this.hole.x, newHazard.y - this.hole.y); // Distância até o buraco

                valid = distToBall > minDistance && distToHole > minDistance; // Verifica se o perigo de água é válido

                for (const obstacle of this.obstacles) {
                    const dist = Math.hypot(newHazard.x - obstacle.x, newHazard.y - obstacle.y); // Distância até obstáculos
                    if (dist < minDistance) {
                        valid = false; // Se a distância for menor que a mínima, não é válido
                        break;
                    }
                }

                for (const hazard of hazards) {
                    const dist = Math.hypot(newHazard.x - hazard.x, newHazard.y - hazard.y); // Distância até outros perigos de água
                    if (dist < minDistance) {
                        valid = false; // Se a distância for menor que a mínima, não é válido
                        break;
                    }
                }
            }
            hazards.push(newHazard); // Adiciona o perigo de água ao array
        }
        return hazards; // Retorna os perigos de água criados
    }

    // Método para atualizar a exibição do nível
    updateDisplay() {
        const levelElement = document.getElementById('roundDisplay'); // Obtém o elemento do nível
        levelElement.textContent = `Nível ${this.level}`; // Atualiza o texto com o nível atual
    }

    // Método para configurar ouvintes de eventos
    setupEventListeners() {
        this.canvas.addEventListener('mousedown', () => this.startCharge()); // Inicia a carga ao pressionar o botão do mouse
        this.canvas.addEventListener('mouseup', () => this.shoot()); // Dispara ao soltar o botão do mouse
        this.canvas.addEventListener('mousemove', (e) => this.updateMousePosition(e)); // Atualiza a posição do mouse

        // Adiciona evento de toque para dispositivos móveis
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault(); // Previne o comportamento padrão
            this.startCharge(); // Inicia a carga ao tocar
        });

        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault(); // Previne o comportamento padrão
            this.shoot(); // Dispara ao soltar o toque
        });

        window.addEventListener('keydown', (e) => {
            if (e.key.toLowerCase() === 'w' && !this.isCharging) {
                this.startCharge(); // Inicia a carga ao pressionar a tecla 'W'
            }
        });

        window.addEventListener('keyup', (e) => {
            if (e.key.toLowerCase() === 'w') {
                this.shoot(); // Dispara ao soltar a tecla 'W'
            }
        });
    }

    // Método para iniciar a carga
    startCharge() {
        if (!this.ball.isMoving && !this.isCharging && !this.levelCompleted) {
            this.isCharging = true; // Define que está carregando
            this.charge = 0; // Reseta a carga
            this.chargingInterval = setInterval(() => {
                this.charge = Math.min(this.charge + 1, this.maxCharge); // Aumenta a carga até o máximo
                this.updateChargeBar(); // Atualiza a barra de carga
            }, 50); // Intervalo de 50ms
        }
    }

    // Método para disparar a bola
    shoot() {
        if (this.chargingInterval && !this.ball.isMoving && !this.levelCompleted) {
            clearInterval(this.chargingInterval); // Limpa o intervalo de carga
            this.chargingInterval = null; // Reseta o intervalo de carga
            this.isCharging = false; // Para a carga

            const dx = this.mouseX - this.ball.x; // Diferença em X
            const dy = this.mouseY - this.ball.y; // Diferença em Y
            const angle = Math.atan2(dy, dx); // Calcula o ângulo de disparo

            this.ball.angle = angle; // Define o ângulo da bola
            this.ball.speed = (this.charge / this.maxCharge) * 15; // Define a velocidade da bola com base na carga
            this.ball.isMoving = true; // Define que a bola está em movimento
            this.score++; // Aumenta a pontuação
            this.updateScore(); // Atualiza a pontuação na tela
            this.charge = 0; // Reseta a carga
            this.updateChargeBar(); // Atualiza a barra de carga
        }
    }

    // Método para atualizar a posição do mouse
    updateMousePosition(e) {
        const rect = this.canvas.getBoundingClientRect(); // Obtém a posição do canvas
        this.mouseX = e.clientX - rect.left; // Atualiza a posição X do mouse
        this.mouseY = e.clientY - rect.top; // Atualiza a posição Y do mouse
    }

    // Adiciona um método para atualizar a posição do toque
    updateTouchPosition(e) {
        const rect = this.canvas.getBoundingClientRect(); // Obtém a posição do canvas
        const touch = e.touches[0]; // Obtém o primeiro toque
        this.mouseX = touch.clientX - rect.left; // Atualiza a posição X do toque
        this.mouseY = touch.clientY - rect.top; // Atualiza a posição Y do toque
    }

    // Método para atualizar a barra de carga
    updateChargeBar() {
        const chargeLevel = document.getElementById('chargeLevel'); // Obtém o elemento da barra de carga
        chargeLevel.style.width = `${(this.charge / this.maxCharge) * 100}%`; // Define a largura da barra

        const hue = 120 - (this.charge / this.maxCharge) * 60; // Calcula a cor da barra com base na carga
        chargeLevel.style.background = `hsl(${hue}, 60%, 50%)`; // Define a cor da barra
    }

    // Método para atualizar a pontuação
    updateScore() {
        const scoreElement = document.getElementById('score'); // Obtém o elemento da pontuação
        scoreElement.textContent = this.score; // Atualiza o texto com a pontuação atual
        this.updateControlsHint(); // Atualiza as dicas de controle
    }

    // Método para atualizar as dicas de controle
    updateControlsHint() {
        const controlsHintElement = document.getElementById('controlsHint'); // Obtém o elemento das dicas de controle
        if (this.score >= 1) {
            controlsHintElement.style.display = 'none'; // Esconde as dicas se a pontuação for maior ou igual a 1
        } else {
            controlsHintElement.style.display = 'block'; // Mostra as dicas se a pontuação for 0
        }
    }

    // Método para desenhar o indicador de mira
    drawAimIndicator() {
        if (!this.ball.isMoving) { // Se a bola não estiver em movimento
            this.ctx.beginPath();
            this.ctx.moveTo(this.ball.x, this.ball.y); // Move para a posição da bola
            this.ctx.lineTo(this.mouseX, this.mouseY); // Desenha uma linha até a posição do mouse
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)'; // Cor da linha
            this.ctx.lineWidth = 2; // Largura da linha
            this.ctx.setLineDash([5, 5]); // Define o estilo da linha como tracejada
            this.ctx.stroke(); // Desenha a linha
            this.ctx.setLineDash([]); // Reseta o estilo da linha

            const angle = Math.atan2(this.mouseY - this.ball.y, this.mouseX - this.ball.x); // Calcula o ângulo
            const arrowLength = 15; // Comprimento da seta
            this.ctx.beginPath();
            this.ctx.moveTo(this.mouseX, this.mouseY); // Move para a posição do mouse
            this.ctx.lineTo(
                this.mouseX - arrowLength * Math.cos(angle - Math.PI / 6), // Ponta da seta
                this.mouseY - arrowLength * Math.sin(angle - Math.PI / 6) // Ponta da seta
            );
            this.ctx.lineTo(
                this.mouseX - arrowLength * Math.cos(angle + Math.PI / 6), // Ponta da seta
                this.mouseY - arrowLength * Math.sin(angle + Math.PI / 6) // Ponta da seta
            );
            this.ctx.closePath();
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'; // Cor da seta
            this.ctx.fill(); // Desenha a seta
        }
    }

    // Método para desenhar todos os elementos do jogo
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Limpa o canvas
        this.drawBackground(); // Desenha o fundo

        this.hole.draw(this.ctx); // Desenha o buraco
        this.obstacles.forEach(obstacle => obstacle.draw(this.ctx)); // Desenha todos os obstáculos
        this.waterHazards.forEach(hazard => hazard.draw(this.ctx)); // Desenha todos os perigos de água
        this.ball.draw(this.ctx); // Desenha a bola
        this.drawAimIndicator(); // Desenha o indicador de mira
    }

    // Método para desenhar o fundo do jogo
    drawBackground() {
        this.ctx.fillStyle = '#4CAF50'; // Cor do fundo
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height); // Desenha o fundo
    }

    // Método para atualizar o estado do jogo a cada frame
    update(timestamp) {
        this.frameCount++; // Incrementa o contador de frames
        if (timestamp - this.lastFpsUpdate >= 1000) {
            this.fps = this.frameCount; // Atualiza o FPS
            this.frameCount = 0; // Reseta o contador de frames
            this.lastFpsUpdate = timestamp; // Atualiza o timestamp da última atualização de FPS
            document.getElementById('fpsCounter').textContent = `FPS: ${this.fps}`; // Atualiza o contador de FPS na tela
        }

        if (!this.lastTime) this.lastTime = timestamp; // Inicializa o último tempo se não estiver definido
        const deltaTime = timestamp - this.lastTime; // Calcula o tempo desde a última atualização
        this.lastTime = timestamp; // Atualiza o último tempo

        if (this.ball.isMoving || this.ball.isSinking) { // Se a bola estiver em movimento ou afundando
            this.ball.update(); // Atualiza a bola

            if (!this.ball.isSinking) {
                this.hole.pullBall(this.ball); // Puxa a bola em direção ao buraco

                // Verifica colisões com as paredes
                if (this.ball.x - this.ball.radius < 0) {
                    this.ball.x = this.ball.radius; // Ajusta a posição da bola
                    this.ball.angle = Math.PI - this.ball.angle; // Inverte a direção
                    this.ball.speed *= 0.8; // Reduz a velocidade
                }
                if (this.ball.x + this.ball.radius > this.width) {
                    this.ball.x = this.width - this.ball.radius; // Ajusta a posição da bola
                    this.ball.angle = Math.PI - this.ball.angle; // Inverte a direção
                    this.ball.speed *= 0.8; // Reduz a velocidade
                }
                if (this.ball.y - this.ball.radius < 0) {
                    this.ball.y = this.ball.radius; // Ajusta a posição da bola
                    this.ball.angle = -this.ball.angle; // Inverte a direção
                    this.ball.speed *= 0.8; // Reduz a velocidade
                }
                if (this.ball.y + this.ball.radius > this.height) {
                    this.ball.y = this.height - this.ball.radius; // Ajusta a posição da bola
                    this.ball.angle = -this.ball.angle; // Inverte a direção
                    this.ball.speed *= 0.8; // Reduz a velocidade
                }

                // Verifica colisões com obstculos
                for (const obstacle of this.obstacles) {
                    if (obstacle.checkCollision(this.ball)) { // Se houver colisão
                        // Determina de qual lado a bola colidiu e inverte a direção
                        const ballCenterX = this.ball.x;
                        const ballCenterY = this.ball.y;
                        const obstacleCenterX = obstacle.x + obstacle.width / 2;
                        const obstacleCenterY = obstacle.y + obstacle.height / 2;

                        // Calcula a normal de colisão
                        const dx = ballCenterX - obstacleCenterX;
                        const dy = ballCenterY - obstacleCenterY;

                        // Determina se a colisão é mais horizontal ou vertical
                        if (Math.abs(dx) > Math.abs(dy)) {
                            this.ball.angle = Math.PI - this.ball.angle; // Inverte a direção horizontal
                        } else {
                            this.ball.angle = -this.ball.angle; // Inverte a direção vertical
                        }

                        this.ball.speed *= 0.8; // Reduz a velocidade

                        // Move a bola para fora da colisão
                        const overlap = this.ball.radius + 1; // Sobreposição
                        if (Math.abs(dx) > Math.abs(dy)) {
                            this.ball.x += dx > 0 ? overlap : -overlap; // Ajusta a posição X
                        } else {
                            this.ball.y += dy > 0 ? overlap : -overlap; // Ajusta a posição Y
                        }
                    }
                }

                // Verifica colisões com perigos de água
                for (const hazard of this.waterHazards) {
                    if (hazard.checkCollision(this.ball)) { // Se houver colisão
                        this.ball.x = 50; // Reseta a posição da bola
                        this.ball.y = 550; // Reseta a posição da bola
                        this.ball.speed = 0; // Para a bola
                        this.ball.isMoving = false; // Para o movimento
                        break; // Sai do loop
                    }
                }

                const distToHole = Math.hypot(this.ball.x - this.hole.x, this.ball.y - this.hole.y); // Distância até o buraco
                if (distToHole < this.hole.radius && !this.levelCompleted && this.ball.speed < 2) { // Se a bola estiver no buraco
                    this.levelCompleted = true; // Define que o nível foi completado
                    this.ball.startSinking(); // Inicia o afundamento da bola

                    setTimeout(() => {
                        this.showVictoryMessage(); // Mostra a mensagem de vitória
                    }, 1000); // Espera 1 segundo
                }
            }
        }

        this.draw(); // Desenha todos os elementos do jogo
        requestAnimationFrame((timestamp) => this.update(timestamp)); // Solicita a próxima atualização
    }

    // Método para iniciar o jogo
    start() {
        requestAnimationFrame((timestamp) => this.update(timestamp)); // Inicia a atualização do jogo
    }

    // Método para calcular o ping
    calculatePing() {
        const startTime = performance.now(); // Marca o tempo de início

        fetch('https://golsf-2d-game.vercel.app/') // Faz uma requisição para calcular o ping
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok'); // Lida com erros de rede
                }
                const endTime = performance.now(); // Marca o tempo de fim
                const ping = Math.round(endTime - startTime); // Calcula o ping
                document.getElementById('pingCounter').innerText = `Ping: ${ping} ms`; // Atualiza o contador de ping na tela
            })
            .catch(error => {
                console.error('Erro ao calcular o ping:', error); // Loga o erro
                document.getElementById('pingCounter').innerText = 'Ping: Erro'; // Atualiza o contador de ping com erro
            });
    }

    // Método para mostrar a mensagem de vitória
    showVictoryMessage() {
        const message = `🎉 Parabéns! Você completou o Level ${this.level} !\n\nTacadas: ${this.score}`; // Mensagem de vitória

        setTimeout(() => {
            if (window.confirm(message + "\nContinuar para o próximo nível?")) { // Pergunta se o jogador quer continuar
                if (this.level < 5) {
                    this.level++; // Avança para o próximo nível
                    this.levelCompleted = false; // Reseta o estado de nível completado
                    this.initializeLevel(); // Inicializa o novo nível
                } else {
                    if (window.confirm("🏆 Parabéns! Você zerou o Game!\nJogar novamente?")) { // Pergunta se o jogador quer reiniciar
                        this.level = 1; // Reseta para o nível 1
                        this.levelCompleted = false; // Reseta o estado de nível completado
                        this.initializeLevel(); // Inicializa o nível
                    }
                }
            }
        }, 100); // Espera 100ms antes de mostrar a mensagem
    }
}

// Inicializa o jogo
const game = new Game('golfCanvas'); // Cria uma nova instância do jogo
game.start(); // Inicia o jogo

// Calcula o ping a cada 5 segundos
setInterval(() => {
    game.calculatePing(); // Chama o método para calcular o ping
}, 5000);

