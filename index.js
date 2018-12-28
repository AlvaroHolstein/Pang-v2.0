window.onload = function () {
    const canvas = document.getElementById('myCanvas')
    const ctx = canvas.getContext("2d")

    canvas.width = 1000
    canvas.height = 600

    let noGrav = true
    let bolas = []
    let jogos = []
    let jog1 = {
        nome: '',
        pontuacao: 0,
        data: (date) => {
            return new Date(date).toISOString()
        }
    }

    let stopGame = true
    let text = "PLAYER 2"
    let score1 = 0


    let background1 = new Image()
    background1.src = "images/bg6.jpg"
    let background2 = new Image()
    background2.src = "images/bg8.jpg"
    let background3 = new Image()
    background3.src = "images/bg5.jpg"


    let mortyHead = new Image()
    mortyHead.src = "images/MORTYHEAD.PNG"

    let space = new Image()
    space.src = "images/space.jpg"

    let mees = new Image()
    mees.src = "images/mees.png"
    //let pattern=ctx.createPattern(mees,"no-repeat");

    let level = 1

    let MortyScaledWidth = 90
    let MortyScaledHeight = 80

    let MortyHeight = 111
    let MortyWidth = 125
    let countFrame = 0
    let vX = 0
    let row = 2
    let controler = 1

    let img = new Image()
    img.src = "images/MORTY.png"

    let ladder = new Image()
    ladder.src = "images/ladder.png"

    let plat = new Image()
    plat.src = "images/plat2.png"

    //-------------------------------------------------------
    class Platform {
        constructor() {
            this.x = 0
            this.y = 250
            this.length = canvas.width
            this.height = 35
        }
        show() {
            ctx.drawImage(plat, this.x, this.y, this.length, this.height)
        }
    }
    class Escada {
        constructor(x, y, width, height) {
            this.x = x
            this.y = y
            this.width = width
            this.height = height

            this.color = 'black'
        }

        show() {
            ctx.drawImage(ladder, this.x, this.y - this.height, this.width, this.height)
        }
    }


    //el Diablo
    class Devil {
        constructor() {
            this.x = 300
            this.y = 450
            // this.vivo = true
            this.fat = 17
            this.altura = 50
            this.lives = 3

            this.gravidade = 0.5

            this.aSubir = false

            this.morty = {
                left: this.x + MortyScaledWidth - this.fat,
                right: this.x + this.fat,
                pes: this.y + this.altura,
                altura: this.y - this.altura
            }
            this.centro = {
                x: this.morty.left - this.morty.right / 2,
                y: this.y + this.altura / 2
            }

            //Movimentar o grande Moty
            this.vX = 0
            this.vY = 5
            this.row = 2
            this.controler = 1
            this.countFrame = 0
        }


        show() {
            ctx.drawImage(img, MortyWidth * countFrame, row * MortyHeight, MortyWidth, MortyHeight, devil.x, this.y - 28, MortyScaledWidth, MortyScaledHeight)
        }

        update() {

            // console.log(this.up())
            if (keyboardState.right && devil.centro.x < canvas.width) //MORTY
            {
                vX = 5;
                controler = 4
                row = 0
            }
            else if (keyboardState.left && devil.centro.x > 0) {
                vX = -5
                controler = 4
                row = 1
            }
            else if (keyboardState.up && this.centro.x >= escada.x - 5 && this.centro.x <= escada.x + escada.width + 5) {
                countFrame = 0
                vX = 0
                row = 2
                controler = 2

            }
            else if (keyboardState.down && this.centro.x >= escada.x - 5 && this.centro.x <= escada.x + escada.width + 5) {
                countFrame = 0
                vX = 0
                row = 2
                controler = 2

            }
            else {
                vX = 0
                row = 2
                controler = 1
            }

            devil.x += vX


            if (controler != 0) {
                countFrame++
            }


            if (countFrame >= controler && controler != 0) {
                countFrame = 0
            }
        }

        morreu() {
            //medidas do morty
            this.morty.right = this.x + MortyScaledWidth - this.fat
            this.morty.left = this.x + this.fat
            this.morty.altura = this.y - this.altura + 25
            this.morty.pes = this.y + this.altura

            this.centro.x = this.x + this.fat + 29
            this.centro.y = this.y

            for (let i = 0; i < bolas.length; i++) {

                if (bolas[i].x + bolas[i].raio >= this.morty.left && bolas[i].y + bolas[i].raio >= this.morty.altura &&
                    bolas[i].y + bolas[i].raio <= this.morty.pes && bolas[i].x + bolas[i].raio <= this.morty.right
                    ||
                    bolas[i].x - bolas[i].raio >= this.morty.left && bolas[i].y + bolas[i].raio >= this.morty.altura
                    &&
                    bolas[i].y + bolas[i].raio <= this.morty.pes
                    && bolas[i].x - bolas[i].raio <= this.morty.right) {
                    this.x = 300
                    this.y = 450
                    stopGame = true
                    return true
                }

            }

            return false
        }

        up(vel) {
            if (keyboardState.up) {
                this.vY = vel
                // console.log(this.vY)
                if (this.morty.pes <= 250) keyboardState.up = false
            }
            this.aSubir = false

            if (this.centro.x >= escada.x - 5 && this.centro.x <= escada.x + escada.width + 5) {
                this.aSubir = true
                if (keyboardState.up == true) {
                    this.y -= this.vY
                }
            }

        }
        down(vel) {
            if (keyboardState.down) {
                this.vY = vel
                if (this.morty.pes >= 500) keyboardState.down = false
            }
            this.aSubir = false
            if (this.centro.x >= escada.x - 5 && this.centro.x <= escada.x + escada.width + 5) {
                this.aSubir = true
                if (keyboardState.down == true) {
                    this.y -= this.vY
                }
            }

        }

        grav() {
            noGrav = true


            if (this.morty.pes <= 250 && this.aSubir == false) {
                noGrav = false
            }

            if (noGrav == true) {
                if (this.y < 450 && this.aSubir == false) {
                    this.vY += this.gravidade
                    this.y += this.vY

                }
            }


        }
    }

    let devil = new Devil()
    let platform = new Platform()
    let escada = new Escada(100, 500, 30, 250)

    class Bola {
        constructor(x = Number(Math.random() * canvas.width), y = Number(Math.random() * 100), raio = 30, lado = 1, novabola = false) {
            this.x = x
            this.y = y
            this.vx = 8 * Math.cos(-85 * Math.PI / 180) * lado
            this.vy = 2 * Math.sin(-85 * Math.PI / 180)
            this.lado = lado
            this.acel = 0.1
            this.raio = raio
            this.floor = devil.y
            this.id = this.getId()
            this.cor = "red"
            this.novabola = novabola
            this.velynovabola = 1
        }
        show() {

            ctx.fillStyle = ctx.createPattern(space, "repeat")
            ctx.strokeStyle = "black"
            ctx.lineWidth = "1"
            ctx.save()
            ctx.beginPath()
            ctx.arc(this.x, this.y, this.raio, 0, 2 * Math.PI)
            ctx.fill()
            ctx.stroke()
            ctx.restore()


            //ctx.drawImage(mees,this.x-this.raio, this.y-this.raio,50,50)

        }
        update() {
            let aux = this.vx
            if (this.novabola) {
                this.vx += this.velynovabola * this.lado
                if (this.velynovabola >= 1) {
                    this.velynovabola -= 0.5
                }
                else {
                    this.novabola = false
                    // this.vx = 8 * Math.cos(-85 * Math.PI / 180) * this.lado
                }

            }
            else {

                if (this.vx >= 1 && this.lado == 1) this.vx -= 0.2

                if (this.vx <= -1 && this.lado == -1) this.vx += 0.2
            }
            this.vy += this.acel
            this.x += this.vx
            this.y += this.vy


            if (this.y + this.raio >= 500) {
                this.vy *= -1
                this.y = 500 - this.raio
            }
            if (this.x - this.raio <= 0 || this.x + this.raio >= canvas.width) this.vx *= -1
        }
        colide() {
            for (let seta of setas) {
                if (seta.x >= this.x - this.raio && seta.x <= this.x + this.raio) {
                    if (this.y - this.raio >= seta.y && this.y + this.raio <= devil.y) {

                        //Ao entrar aqui é porque a bola tocou em alguma parte da linha
                        let diengBallx = 0, diengBally = 0
                        bolas = bolas.filter(bola => {

                            if (bola.id != this.id) {
                                return true
                            }
                            else {
                                diengBallx = bola.x
                                diengBally = bola.y
                                return false
                            }
                        })
                        score1 += 5

                        //Esta linha faz com que a "seta" seja removida quando rebenta uma bola
                        setas.splice(setas.findIndex((xibanga) => xibanga.id == seta.id), 1)
                        if (this.raio == 30) {
                            // let lado = 0
                            bolas.push(new Bola(diengBallx, diengBally, this.raio / 2, 1, true))
                            bolas.push(new Bola(diengBallx, diengBally, this.raio / 2, -1, true))
                        }
                        //As setas só explodirem quando chegam ao "teto" devia ser um power up.
                    }
                }
            }
        }
        getId() {
            return bolas.length == 0 ? 1 : bolas[bolas.length - 1].id + 1
        }
    }

    //Onde a magia começa
    window.requestAnimationFrame(draw)

    let keyboardState = {
        left: false,
        right: false,
        up: false,
        down: false
    }
    function onKeyDown(evt) {
        if (evt.keyCode == 39) {
            keyboardState.right = true
        }
        else if (evt.keyCode == 37) {
            keyboardState.left = true
        }
        else if (evt.keyCode == 38) {
            keyboardState.up = true
        }
        else if (evt.keyCode == 40) {
            keyboardState.down = true
        }
        //Lançar Lança
        if (event.key == ' ') {
            if (setas.length == 0) {
                let newArrow = new Seta(devil.x + 45)
                setas.push(newArrow)
            }
        }
    }
    document.addEventListener('keydown', onKeyDown, false)
    function onKeyUp(evt) {
        if (evt.keyCode == 39) {
            keyboardState.right = false
        }
        else if (evt.keyCode == 37) {
            keyboardState.left = false
        }
        else if (evt.keyCode == 38) {
            keyboardState.up = false
            // devil.aSubir = false
        }
        else if (evt.keyCode == 40) {
            keyboardState.down = false
        }
    }
    document.addEventListener('keyup', onKeyUp, false)
    //------------------------------------------------------------------
    let consoles = false
    let nivelPassado = false

    //O que faz a magia continuar
    function draw() {
        //Os niveis vão para aqui

        if (level == 1) nivel1()
        else if (level == 2) nivel2()

        //-------------------------

        if (devil.morreu()) {
            // reset = true //Vai levar mais merdas, porque temos que dar a hipotese de tentar outra vez sem dar refresh
            level = 1
        }

        vidas()



        if (nivelPassado == true) {
            console.log('Passas te de nivel')
            nivelPassado = false
            if (level < 4) level++
            console.log('Nivel - ' + level)
            for (let i = 0; i < 1; i++) {
                bolas.push(new Bola())
            }
        }

        ctx.fillStyle = 'white'
        ctx.font = "20px Arial";
        ctx.fillText(text, 20, 525)
        ctx.fillText(score1, 55, 590)

        //O que faz a magia repetir se
        if (!stopGame) {
            window.requestAnimationFrame(draw)
        }
        else {
            while (bolas.length != 0) {
                bolas.pop()
            }
            while (setas.length != 0) {
                setas.pop()
            }

            console.log('Vidas - ' + devil.lives)
            if (devil.lives > 0) {
                devil.lives--
                window.requestAnimationFrame(draw)
            }
            else { //Morte do Morty
                devil.vy = -3
                if (devil.y < 500) {
                    devil.vy += 0.5
                    devil.y -= devil.vy
                }
            }

            for (let i = 0; i < 1; i++) {
                bolas.push(new Bola())
            }
            stopGame = false
        }

        nivelPassado = false

        if (bolas.length == 0) {
            console.log('ata')
            nivelPassado = true
        }
    }

    function nivel1() {
        ctx.fillStyle = 'black'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(background1, 0, 0, background1.width, background1.height, 0, 0, canvas.width, 500)

        for (let i = 0; i < setas.length; i++) {
            setas[i].draw()
            setas[i].arrowRise()
            setas[i].max()
        }
        devil.up(5)
        devil.down(-5)
        devil.grav()
        devil.update()
        devil.show()
        for (let bola of bolas) {
            bola.show()
            bola.update()
            bola.colide()
        }
    }

    function nivel2() {
        ctx.fillStyle = 'green'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(background2, 0, 0, background2.width, background2.height, 0, 0, canvas.width, 500)

        platform.show()
        escada.show()

        for (let i = 0; i < setas.length; i++) {
            setas[i].draw()
            setas[i].arrowRise()
            setas[i].max()
        }
        devil.up(5)
        devil.down(-5)
        devil.grav()
        devil.update()
        devil.show()
        for (let bola of bolas) {
            bola.show()
            bola.update()
            bola.colide()
        }
    }
    //Mostrar Vidas
    function vidas() {
        if (devil.lives >= 0) ctx.drawImage(mortyHead, 20, 535, 25, 25)
        if (devil.lives >= 1) ctx.drawImage(mortyHead, 50, 535, 25, 25)
        if (devil.lives >= 2) {
            ctx.drawImage(mees, 80, 535, 25, 25)
        }
    }

    //O chão
    function floorLine() {
        ctx.strokeStyle = 'black'
        ctx.beginPath()
        ctx.moveTo(0, 500)
        ctx.lineTo(canvas.width, 500)
        ctx.stroke()
    }
    //Céu, só para ajudar
    function sky() {
        ctx.strokeStyle = 'blue'
        ctx.beginPath()
        ctx.moveTo(0, 200)
        ctx.lineTo(canvas.width, 200)
        ctx.stroke()
    }

    let setas = [] //Array que vai guardar as setas
    //A seta
    class Seta {
        constructor(x) {
            this.x = x
            this.y = devil.y
            this.velSeta = 5
            this.cor = "lime"
            this.id = this.getId()
            this.launchY = devil.y + devil.altura
        }
        max() {
            if (this.y <= 0) {
                setas = setas.filter(set => set.id != this.id)
            }
        }
        draw() {
            ctx.save()
            ctx.lineWidth = 6
            ctx.shadowBlur = 15
            ctx.shadowColor = "lime"
            ctx.strokeStyle = this.cor
            ctx.beginPath()
            ctx.moveTo(this.x, this.launchY)
            ctx.lineTo(this.x, this.y)
            ctx.stroke()
            ctx.restore()

            ctx.save()
            ctx.lineWidth = 1
            ctx.strokeStyle = "white"
            ctx.beginPath()
            ctx.moveTo(this.x, this.launchY)
            ctx.lineTo(this.x, this.y)
            ctx.stroke()
            ctx.restore()


        }
        arrowRise() {
            this.y -= this.velSeta
        }
        getId() {
            return setas.length == 0 ? 1 : setas[setas.length - 1].id + 1
        }
    }

    function drawLine(x, xLine) {
        ctx.beginPath()
        if (xLine) {
            ctx.moveTo(x, 0)
            ctx.lineTo(x, canvas.height)
        }
        else {
            ctx.moveTo(0, x)
            ctx.lineTo(canvas.width, x)
        }
        ctx.stroke()
    }
}


