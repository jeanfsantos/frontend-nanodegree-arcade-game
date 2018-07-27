/* Engine.js
 * Este arquivo mostra a funcionalidade do loop do jogo (render e entidades
 * de update), esboça o tabuleiro inicial do jogo na tela e, depois, chama
 * os métodos update e render para os objetos dos inimigos e de seu jogador
 * (definidos em seu app.js).
 *
 * Um mecanismo de jogo desenha toda a tela do jogo várias vezes, meio
 * como um folioscópio, que dá a ilusão de "animação" às imagens.
 * Quando seu jogador se move pela tela, pode parecer que apenas aquele(a)
 * imagem/personagem está se movendo ou sendo desenhado(a), mas esse não é
 * o caso. O que realmenbte ocorre é que toda a "cena" está sendo desenhada
 * diversas vezes, dando a ilusão de animação.
 *
 * Este mecanismo disponibiliza globalmente o objeto context (ctx)
 * do canvas, a fim de escrever app.js mais simples de lidar.
 */

var Engine = (function(global) {
    /* Pré-defina as variáveis que usaremos neste escopo,
     * crie o elemento canvas, pegue o contexto 2D desse
     * canvas, configure a altura/largura dos elementos do
     * canvas e adicione isso ao DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime,
        gameover = false;

    canvas.width = 505;
    canvas.height = 606;
    doc.getElementById('game').appendChild(canvas);

    /* Esta função age como o ponto de largada do loop do jogo em si e
     * lida com as chamadas dos métodos render e update de forma adequada.
     */
    function main() {
        /* Obtenha a informação delta de tempo, que é exigida caso seu jogo
         * requeira uma animação fluida. Como cada computador processa
         * instruções em velocidades diferentes, precisamos de um valor
         * de constante que seja o mesmo para todos (independentemente da
         * velocidade do computador).
         *
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* Chame suas funções update/render e passe o delta de tempo para a
         * função update, pois ele pode ser usado para melhorar a animação.
         */
        update(dt);
        render();

        /* Defina a variável lastTime, que será usada para definir o delta
         * de tempo na próxima vez em que essa função for chamada.
         */
        lastTime = now;

        /* Use a função requestAnimationFrame do navegador para chamar essa
         * função novamente quando o navegador puder desenhar outro frame.
         * caso o jogo finalize desenha uma tela preta com a frase game over
         * mostrando a quantidade de gemas juntadas.
         */
        if (!gameover) {
            win.requestAnimationFrame(main);
        } else {
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'white';
            ctx.font = '30px Gaegu';
            ctx.textAlign = 'center';
            ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2);
            ctx.fillText(`Gemas: ${gem.bonus}`, canvas.width / 2, canvas.height / 2 + 60)
            document.getElementById('restart').style.visibility = 'visible';
        }
    }

    /* Esta função faz algumas configurações iniciais que só devem ocorrer
     * uma vez, especialmente a definição da variável lastTime, que é
     * exigida para o loop do jogo.
     */
    function init() {
        reset();
        lastTime = Date.now();
        main();
    }

    /* Esta função é chamada pela principal (o loop de nosso jogo), e ela
     * mesma chama todas as funções possivelmente necessárias para
     * atualizar os dados da entidade. Com base na implementação de sua
     * detecção de colisão (quando duas entidades ocupam o mesmo espaço -
     * por exemplo, quando seu personagem deve morrer), você pode achar
     * necessário adicionar mais uma chamada de função aqui. Por enquanto,
     * só fizemos comentários - você pode implementar essa funcionalidade
     * dessa maneira ou não (também pode implementar a detecção de colisão
     * apenas nas próprias entidades, em seu arquivo app.js).
     */
    function update(dt) {
        updateEntities(dt);
        checkCollisions();
    }

    /* É chamada pela função update, faz loops por todos os objetos dentro
     * de sua array allEnemies, como definido no app.js, e chama
     * seus métodos update(). Então, chama a função update do objeto de
     * seu jogador. Esses métodos update devem focar apenas em atualizar
     * os dados/propriedades relacionados ao objeto. Faça seus desenhos
     * nos métodos render.
     */
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        player.update();
        gem.update(dt);
    }

    // funcao que faz as tratativas das colisao do inimigo e gema
    function checkCollisions() {
        if (checkIfEnemyIsCollided()) {
            gameover = true;
        }
        if (checkIfGemIsCollided()) {
            gem.handleBonus(true);
            gem.reset();
        }
    }

    //  funcao que verifica colisao com inimigo
    function checkIfEnemyIsCollided() {
        return allEnemies.some(function (enemy) {
            // https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
            return player.x < enemy.x + enemy.width &&
                player.x + player.width > enemy.x &&
                player.y < enemy.y + enemy.height &&
                player.height + player.y > enemy.y;
        });
    }

    // funcao que verifica colisao com gema
    function checkIfGemIsCollided() {
        return player.x < gem.x + gem.width &&
            player.x + player.width > gem.x &&
            player.y < gem.y + gem.height &&
            player.height + player.y > gem.y;
    }

    /* Esta função primeiro deseha o "nível do jogo" e, depois, chama a
     * função renderEntities. Lembre-se de que esta função é chamada a
     * cada "tique" do jogo (ou loop do mecanismo do jogo), pois é como os
     * jogos funionam - são folioscópios que geram a ilusão de animação,
     * mas estão apenas desenhando a mesma tela várias vezes.
     */
    function render() {
        /* Esta array armazena a URL relativa à imagem usada
         * para aquela linha específica do nível do jogo.
         */
        var rowImages = [
                'images/water-block.png',   // Top row is water
                'images/stone-block.png',   // Row 1 of 3 of stone
                'images/stone-block.png',   // Row 2 of 3 of stone
                'images/stone-block.png',   // Row 3 of 3 of stone
                'images/grass-block.png',   // Row 1 of 2 of grass
                'images/grass-block.png'    // Row 2 of 2 of grass
            ],
            numRows = 6,
            numCols = 5,
            row, col;

        // Antes de fazer os desenhos, limpe os canvas existentes
        ctx.clearRect(0,0,canvas.width,canvas.height)

        /* Faça o loop pelo número de linhas e colunas que definimos acima
         * e, usando a array rowImages, desenhe a imagem correta para
         * aquela parte da "grade"
         */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* A função drawImage do elemento do contexto do canvas
                 * exige 3 parâmetros: a imagem, a coordenada x e a
                 * coordenada y a serem desenhadas. Estamos usando nossa
                 * ajuda, dos recursos, para nos referirmos às imagens
                 * de forma a obtermos os benefícios de fazer seu cache,
                 * já que as usamos o tempo todo.
                 */
                if (col === 2 && row === 0) {
                    ctx.drawImage(Resources.get('images/stone-block.png'), col * 101, row * 83);
                } else {
                    ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
                }
            }
        }

        renderEntities();
    }

    /* Esta função é chamada pela função render, e isso ocorre a cada tique
     * do jogo. Seu propósito é chamar as funções render que você definiu
     * nas entidades de seu jogador e seus inimigos dentro do app.js
     */
    function renderEntities() {
        /* Faça o loop por todos os objetos dentro da array allEnemies
         * e chame a função render que você definiu.
         */
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });

        player.render();
        gem.render();
    }

    /* Esta função não faz nada, mas pode ser um bom local para lidar com os
     * estados de reinicialização do jogo - talvez, um novo menu de jogo, uma
     * tela de fim de jogo ou coisas assim. É chamada só uma vez pelo
     * método init().
     */
    function reset() {
        gameover = false;
        player.reset();
        gem.handleBonus(false);
    }

    /* Vá em frente e carregue todas as imagens que sabemos que serão
     * necessárias para desenhar o nível do jogo. Depois, defina init como o
     * método de callback para que, quando todas essas imagens forem
     * adequadamente carregadas, nosso jogo comece.
     */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png',
        'images/char-cat-girl.png',
        'images/Gem Blue.png',
        'images/Gem Green.png',
        'images/Gem Orange.png',
        'images/Selector.png'
    ]);
    Resources.onReady(init);

    /* Aloque o objeto context do canvas na variável global (o objeto
     * window quando executado em um navegador) para que desenvolvedores
     * possam usá-lo com mais facilidade em seus arquivos app.js.
     */
    global.ctx = ctx;

    // exporta a funcao init para usar fora da iife
    return {
        init: init
    };
})(this);
