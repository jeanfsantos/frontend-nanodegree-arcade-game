// Inimigos que nosso jogador deve evitar
var Enemy = function() {
    // As variáveis aplicadas a nossas instâncias entram aqui.
    // Fornecemos uma a você para que possa começcar.
    this.x = this.initX();
    this.y = this.newPositionY();
    this.velocity = this.newVelocity();

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
    if (this.x > _canvas.width) {
        this.x = this.initX();
        this.y = this.newPositionY();
        this.velocity = this.newVelocity();
    }
};

// Desenhe o inimigo na tela, método exigido pelo jogo
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Enemy.prototype.newVelocity = function() {
    return (Math.floor(Math.random() * 5) + 1) * 100;
};

Enemy.prototype.newPositionY = function() {
    return (Math.floor(Math.random() * 3) * 83) + 60;
};

Enemy.prototype.initX = function() {
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
};

Player.prototype.update = function() {
    if (this.undoCalcAxisY(this.y) === this._minYAxis) {
        this.reset();
    }
};

// Desenhe o inimigo na tela, método exigido pelo jogo
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

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

Player.prototype.reset = function() {
    this.x = this.calcAxisX(2);
    this.y = this.calcAxisY(4);
};

Player.prototype.calcAxisX = function(val) {
    return val * 101;
};

Player.prototype.calcAxisY = function(val) {
    return val * 83 + 60;
};

Player.prototype.undoCalcAxisX = function(val) {
    return val / 101;
};

Player.prototype.undoCalcAxisY = function(val) {
    return ((val - 60) / 83);
};

// Represente seus objetos como instâncias.
// Coloque todos os objetos inimgos numa array allEnemies
// Coloque o objeto do jogador numa variável chamada jogador.
var allEnemies = [new Enemy(), new Enemy(), new Enemy()];
var player = new Player();


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
