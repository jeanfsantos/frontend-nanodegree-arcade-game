// Inimigos que nosso jogador deve evitar
var Enemy = function() {
    // As variáveis aplicadas a nossas instâncias entram aqui.
    // Fornecemos uma a você para que possa começcar.
    this.x = this.initAxisX();
    this.y = this.newPositionY();
    this.velocity = this.newVelocity();
    this.width = 99;
    this.height = 67;

    // A imagem/sprite de nossos inimigos, isso usa um
    // ajudante que é fornecido para carregar imagens
    // com facilidade.
    this.sprite = 'images/enemy-bug.png';
};

// Atualize a posição do inimigo, método exigido pelo jogo
// Parâmetro: dt, um delta de tempo entre ticks
Enemy.prototype.update = function(dt) {
    // Você deve multiplicar qualquer movimento pelo parâmetro
    // dt, o que garantirá que o jogo rode na mesma velocidade
    // em qualquer computador.
    this.x = this.x + this.velocity * dt;
    if (this.x > ctx.canvas.width) {
        this.x = this.initAxisX();
        this.y = this.newPositionY();
        this.velocity = this.newVelocity();
    }
};

// Desenhe o inimigo na tela, método exigido pelo jogo
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// returna uma nova velocidade entre 100ms a 500ms
Enemy.prototype.newVelocity = function() {
    return (Math.floor(Math.random() * 5) + 1) * 100;
};

// returna uma nova posicao vertical
Enemy.prototype.newPositionY = function() {
    return (Math.floor(Math.random() * 3) * 83) + 60;
};

// returna posicao inicial no eixo x
Enemy.prototype.initAxisX = function() {
    return -101;
};

// Agora, escreva sua própria classe de jogador
// Esta classe exige um método update(),
// um render() e um handleInput().
var Player = function() {
    this.reset();
    this._minXAxis = 0;
    this._maxXAxis = 4;
    this._minYAxis = -1;
    this._maxYAxis = 4;
    this.sprite = 'images/char-boy.png';
    this.width = 67;
    this.height = 76;
};

// valida se o jogador chegou ate a agua,
// em caso de sucesso retorna para posicao inicial
Player.prototype.update = function() {
    if (this.undoCalcAxisY(this.y) === this._minYAxis) {
        this.reset();
    }
};

// Desenhe o inimigo na tela, método exigido pelo jogo
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// manipula o input validando se a posicao
// futura e permitido e se sim atualizando
Player.prototype.handleInput = function(move) {
    var newValue = null;
    switch (move) {
        case 'left':
            newValue = this.undoCalcAxisX(this.x) - 1;
            if (newValue >= this._minXAxis) this.x = this.calcAxisX(newValue);
            break;
        case 'right':
            newValue = this.undoCalcAxisX(this.x) + 1;
            if (newValue <= this._maxXAxis) this.x = this.calcAxisX(newValue);
            break;
        case 'up':
            newValue = this.undoCalcAxisY(this.y) - 1;
            if (newValue >= this._minYAxis) this.y = this.calcAxisY(newValue);
            break;
        case 'down':
            newValue = this.undoCalcAxisY(this.y) + 1;
            if (newValue <= this._maxYAxis) this.y = this.calcAxisY(newValue);
            break;
    }
};

// reseta para a posicao inicial
Player.prototype.reset = function() {
    this.x = this.calcAxisX(2);
    this.y = this.calcAxisY(4);
};

// calcula a posicao do jogador no eixo x
Player.prototype.calcAxisX = function(val) {
    return val * 101;
};

// calcula a posicao do jogador no eixo y
Player.prototype.calcAxisY = function(val) {
    return val * 83 + 60;
};

// metodo auxiliar para ajudar a calcular posicao no eixo x
Player.prototype.undoCalcAxisX = function(val) {
    return val / 101;
};

// metodo auxiliar para ajudar a calcular posicao no eixo y
Player.prototype.undoCalcAxisY = function(val) {
    return ((val - 60) / 83);
};

// altera o personagem
Player.prototype.changeChar = function(char) {
    this.sprite = char;
};

// construtor da classe gema
var Gem = function() {
    this.x = this.initAxisX();
    this.y = this.newPositionY();
    this.width = 101;
    this.height = 104;
    this.images = [
        'images/Gem Blue.png',
        'images/Gem Green.png',
        'images/Gem Orange.png'
    ];
    this.sprite = this.gemImage();
    this.bonus = 0;
};

// atualiza a posicao da gema e valida
// se ela chegou no final para resetar
Gem.prototype.update = function(dt) {
    this.x = this.x + 200 * dt;
    if (this.x > ctx.canvas.width) {
        this.reset();
    }
};

// renderiza a gema
Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// returna nova posicao no eixo y
Gem.prototype.newPositionY = function() {
    return (Math.floor(Math.random() * 3) * 83) + 60;
};

// retorna posicao initial no eixo x
Gem.prototype.initAxisX = function() {
    return -101;
};

// reseta a gema para posicao inicial, e uma imagem aleatorio
Gem.prototype.reset = function() {
    this.x = -101;
    this.y = this.newPositionY();
    this.sprite = this.gemImage();
};

// retorna imagem aleatorio da lista de gemas
Gem.prototype.gemImage = function() {
    return this.images[Math.floor(Math.random() * this.images.length)];
};

// manipula bonus e atualiza o texto da pontuacao
Gem.prototype.handleBonus = function (val) {
    if (val) {
        this.bonus++;
    } else {
        this.bonus = 0;
    }
    document.getElementById('bonus').textContent = this.bonus;
};

// Represente seus objetos como instâncias.
// Coloque todos os objetos inimgos numa array allEnemies
// Coloque o objeto do jogador numa variável chamada jogador.
var allEnemies = [new Enemy(), new Enemy(), new Enemy()];
var player = new Player();
var gem = new Gem();

// Isto reconhece cliques em teclas e envia as chaves para seu
// jogador. método handleInput(). Não é preciso mudar nada.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

// ouve mudancas na alteracao do jogador e chama o metodo changeChar
document.getElementById('char').addEventListener('change', function(e) {
    player.changeChar(e.target.value);
});