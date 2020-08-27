window.addEventListener('load', function () {
    //Get a CanvasRenderingContext2D object
    const canvas = document.querySelector('canvas')
    const context = canvas.getContext('2d')

    //Set logical canvas dimensions != intrinsic canvas size
    canvas.width = 480 + 50 // 15 columns
    canvas.height = 360

    //Pixelate Image
    context.imageSmoothingEnabled = false

    const World = function (url) {
        this.tileSet = new Image()
        this.tileSet.src = url
        this.sourceTileWidth = 16
        this.sourceTileHeight = 16
        this.tileWidth = 32
        this.tileHeight = 36

        // prettier-ignore
        this.map = [
        ['A1', 'B1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'G1', 'H1'],
        ['A2', 'B2', 'C2', 'C2', 'C2', 'C2', 'C2', 'C2', 'C2', 'C2', 'C2', 'C2', 'C2', 'G2', 'H2'],
        ['A3', 'B3', 'C3', 'C3', 'D3', 'F3', 'C3', 'C3', 'C3', 'C3', 'C3', 'E4', 'B>', 'G3', 'H3'],
        ['A3', 'B3', 'C3', 'C3', 'C3', 'C3', 'C3', 'C3', 'C3', 'C3', 'C3', 'C3', 'D3', 'G3', 'H3'],
        ['I6', 'J6', 'C?', 'D?', 'C3', 'C3', 'C3', 'C3', 'C3', 'E4', 'C3', 'C3', 'C3', 'I8', 'J8'],
        ['I7', 'J7', 'C@', 'D@', 'C3', 'C3', 'C3', 'C3', 'C3', 'F4', 'C3', 'C3', 'C3', 'I9', 'J9'],
        ['A3', 'B3', 'A?', 'B?', 'E4', 'C3', 'E4', 'C4', 'D4', 'E4', 'C3', 'C3', 'C3', 'G3', 'H3'],
        ['A3', 'B3', 'A@', 'B@', 'C3', 'C3', 'B9', 'C9', 'D9', 'F4', 'D3', 'E3', 'F3', 'G3', 'H3'],
        ['A7', 'B7', 'I2', 'J2', 'C7', 'C7', 'B:', 'C:', 'D:', 'C7', 'C7', 'I2', 'J2', 'G7', 'H7'],
        ['A8', 'B8', 'I3', 'J3', 'C8', 'C8', 'B;', 'C;', 'D;', 'C8', 'C8', 'I3', 'J3', 'G8', 'H8']
    ];

        this.boundary = new World.Boundary(64, 72, 32 * 11, 36 * 6)
    }

    World.Boundary = function (
        boundary_x,
        boundary_y,
        boundary_width,
        boundary_height
    ) {
        this.boundary_x = boundary_x
        this.boundary_y = boundary_y
        this.boundary_width = boundary_width
        this.boundary_height = boundary_height

        this.collide = function (object) {
            let colliding = true
            if (object.getTop() < this.boundary_y)
                object.setTop(this.boundary_y)
            else if (object.getLeft() < this.boundary_x)
                object.setLeft(this.boundary_x)
            else if (object.getRight() > this.boundary_x + this.boundary_width)
                object.setRight(this.boundary_x + this.boundary_width)
            else if (
                object.getBottom() >
                this.boundary_y + this.boundary_height
            )
                object.setBottom(this.boundary_y + this.boundary_height)
            else colliding = false

            return colliding
        }
    }

    const world = new World('MC_House.png')

    const Object = function (url, x, y, width, height) {
        this.sprite = new Image()
        if (url) this.sprite.src = url
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.offset_bottom = 0
        this.offset_left = 0
        this.offset_right = 0
        this.offset_top = 0

        this.getTop = function () {
            return this.y + this.offset_top
        }
        this.getLeft = function () {
            return this.x + this.offset_left
        }
        this.getRight = function () {
            return this.x + this.width - this.offset_right
        }
        this.getBottom = function () {
            return this.y + this.height - this.offset_bottom
        }
        this.getCenterX = function () {
            return (this.getLeft() + this.getRight()) / 2
        }
        this.getCenterY = function () {
            return (this.getTop() + this.getBottom()) / 2
        }
        this.setTop = function (top) {
            this.y = top - this.offset_top
        }
        this.setLeft = function (left) {
            this.x = left - this.offset_left
        }
        this.setRight = function (right) {
            this.x = right - this.width + this.offset_right
        }
        this.setBottom = function (bottom) {
            this.y = bottom - this.height + this.offset_bottom
        }
        this.setCenterX = function (centerX) {
            this.x =
                centerX -
                (this.offset_left - this.offset_right + this.width) / 2
        }
        this.setCenterY = function (centerY) {
            this.y =
                centerY -
                (this.offset_top - this.offset_bottom + this.height) / 2
        }

        this.collideObject = function (object) {
            if (
                this.getRight() < object.getLeft() ||
                this.getBottom() < object.getTop() ||
                this.getLeft() > object.getRight() ||
                this.getTop() > object.getBottom()
            )
                return false
            return true
        }
    }

    const anvil = new Object(
        false,
        world.tileWidth * 2,
        world.tileHeight * 4,
        world.tileWidth * 2,
        world.tileHeight
    )
    anvil.offset_bottom = 5
    const table = new Object(
        false,
        world.tileWidth * 2,
        world.tileHeight * 6,
        world.tileWidth * 2,
        world.tileHeight
    )
    table.offset_left = 20
    table.offset_top = 10
    const water = new Object(
        false,
        world.tileWidth * 12,
        world.tileHeight * 2,
        world.tileWidth,
        world.tileHeight
    )

    const ammo = new Object('ammo.png', 50, 50, 100, 100)
    ammo.offset_bottom = 10
    ammo.offset_right = 35
    ammo.offset_left = 20

    const explosion = new Object('explosion.png', 120, 120, 100, 100)
    explosion.source_x = 0
    explosion.source_y = 0
    explosion.source_width = 46
    explosion.source_height = 61

    const MovingObject = function (url, x, y, width, height, speed = 5) {
        Object.call(this, url, x, y, width, height)
        this.speed = speed
        this.direction = 'up'

        this.moveUp = function () {
            this.direction = 'up'
            this.y -= this.speed
        }
        this.moveRight = function () {
            this.direction = 'right'
            this.x += this.speed
        }
        this.moveDown = function () {
            this.direction = 'down'
            this.y += this.speed
        }
        this.moveLeft = function () {
            this.direction = 'left'
            this.x -= this.speed
        }
    }

    const Frame = function (x, y, width, height) {
        this.source_x = x
        this.source_y = y
        this.source_width = width
        this.source_height = height
    }

    const Bullet = function (url) {
        MovingObject.call(this, url, canvas.width, canvas.height, 100, 100, 15)

        this.setBullet = function (direction) {
            switch (direction) {
                case 'right':
                    this.direction = 'right'
                    this.source_y = 0
                    this.setCenterY(player.getCenterY() - 20)
                    this.setLeft(player.getRight())
                    break
                case 'up':
                    this.direction = 'up'
                    this.source_y = this.source_height * 2
                    this.setCenterX(player.getCenterX())
                    this.setBottom(player.getTop())
                    break
                case 'left':
                    this.direction = 'left'
                    this.source_y = this.source_height
                    this.setCenterY(player.getCenterY() - 20)
                    this.setRight(player.getLeft())
                    break
                case 'down':
                    this.direction = 'down'
                    this.source_y = this.source_height * 3
                    this.setTop(player.getBottom())
                    this.setCenterX(player.getCenterX())
                    break
            }
        }
    }
    const hydrogenBomb = new Bullet('hydrogenbomb.png')
    hydrogenBomb.sprite.src = 'hydrogenbomb.png'
    hydrogenBomb.source_x = 0
    hydrogenBomb.source_y = 0
    hydrogenBomb.source_width = 382
    hydrogenBomb.source_height = 382
    hydrogenBomb.offset_top = 20
    hydrogenBomb.offset_left = 20
    hydrogenBomb.offset_right = 20
    hydrogenBomb.offset_bottom = 20

    const paperTowel = new Bullet('papertowel.png')
    paperTowel.source_x = 0
    paperTowel.source_y = 0
    paperTowel.source_width = 138
    paperTowel.source_height = 138
    paperTowel.offset_top = 7
    paperTowel.offset_left = 7
    paperTowel.offset_right = 7
    paperTowel.offset_bottom = 7
    paperTowel.width = 50
    paperTowel.height = 50

    //Define player constructor function
    const Player = function () {
        MovingObject.call(this, 'trump_run.png', 100, 100, 100, 100)
        this.source_x = 0
        this.source_y = 0
        this.source_width = 1536 / 6
        this.source_height = 1024 / 4
        this.speed = 15
        this.isMoving = false
        this.offset_top = 55
        this.offset_left = 35
        this.offset_right = 34
        this.offset_bottom = 10
        this.firing = false
        this.direction = 'down'
        this.bullet = hydrogenBomb

        //Define a function for creating and firing a bullet
        this.createBullet = function () {
            this.bullet.setBullet(this.direction)
        }

        this.changeBullet = function () {
            if (this.bullet === hydrogenBomb) this.bullet = paperTowel
            else if (this.bullet === paperTowel) this.bullet = hydrogenBomb
        }
    }

    //Create player object
    const player = new Player()

    const Enemy = function () {
        MovingObject.call(this, 'hillaryclinton.png', 350, 100, 100, 100)
        this.speed = 15
        this.isMoving = false
        this.isFiring = false
        this.offset_top = 0
        this.offset_left = 0
        this.offset_right = 60
        this.offset_bottom = 10
        this.state = 'wander'
        this.maxsteps = 10
        this.move = this.moveDown
        this.coolTime = 0

        this.update = function () {
            switch (this.state) {
                case 'wander':
                    if (this.coolTime == 0) {
                        this.coolTime = Math.floor(
                            Math.random() * this.maxsteps
                        )

                        let movements = [
                            this.moveDown,
                            this.moveLeft,
                            this.moveRight,
                            this.moveUp,
                        ]
                        this.move =
                            movements[
                                Math.floor(Math.random() * movements.length)
                            ]
                    }
                    this.move()
                    break
                case 'hurt':
                    this.isMoving = false
                    explosion.setCenterX(this.getCenterX())
                    explosion.setCenterY(this.getCenterY())
                    explosion.source_x += explosion.source_width
                    if (explosion.source_x >= explosion.sprite.width)
                        explosion.source_x = 0
                    if (this.coolTime == 0) this.state = 'wander'
            }
            this.coolTime = this.coolTime > 0 ? this.coolTime - 1 : 0
        }
    }

    const hillaryclinton = new Enemy()
    //Update animation for every frame
    const update = function () {
        //Change sequence according to the controller
        player.isMoving = true
        if (controller.up.active) {
            player.direction = 'up'
            player.source_y = player.source_height * 2
            player.y -= player.speed
        } else if (controller.right.active) {
            player.direction = 'right'
            player.source_y = player.source_height
            player.x += player.speed
        } else if (controller.down.active) {
            player.direction = 'down'
            player.source_y = 0
            player.y += player.speed
        } else if (controller.left.active) {
            player.direction = 'left'
            player.source_y = player.source_height * 3
            player.x -= player.speed
        } else player.isMoving = false

        // Fire a bullet with spacebar
        //Only one bullet is fired at a time
        if (controller.space.active && !player.firing) {
            player.firing = true
            controller.space.active = false
            player.createBullet()
        }

        if (controller.shift.active && !player.firing) {
            player.changeBullet()
            controller.shift.active = false
        }

        //Update the bullets position
        if (player.firing) {
            switch (player.bullet.direction) {
                case 'right':
                    player.bullet.x += player.bullet.speed
                    break
                case 'up':
                    player.bullet.y -= player.bullet.speed
                    break
                case 'left':
                    player.bullet.x -= player.bullet.speed
                    break
                case 'down':
                    player.bullet.y += player.bullet.speed
                    break
            }

            //Collision check for bullet
            if (world.boundary.collide(player.bullet)) {
                player.firing = false
            }

            if (hillaryclinton.collideObject(player.bullet)) {
                hillaryclinton.state = 'hurt'
                hillaryclinton.coolTime = 20
            }
        }

        hillaryclinton.update()
        ;[ammo, anvil, table, water].forEach((object) => {
            ;[player, hillaryclinton].forEach((agent) => {
                if (agent.collideObject(object)) {
                    if (agent.direction == 'left')
                        agent.setLeft(object.getRight() + 0.1)
                    else if (agent.direction == 'right')
                        agent.setRight(object.getLeft() - 0.1)
                    else if (agent.direction == 'up')
                        agent.setTop(object.getBottom() + 0.1)
                    else if (agent.direction == 'down')
                        agent.setBottom(object.getTop() - 0.1)
                }
            })
        })

        world.boundary.collide(player)
        world.boundary.collide(hillaryclinton)

        explosion.source_x += explosion.source_width
        if (explosion.source_x >= explosion.sprite.width) explosion.source_x = 0
        //Feed the next frame of the sequence
        if (player.isMoving) {
            player.source_x += player.source_width
            if (player.source_x >= player.sprite.width) player.source_x = 0
        }
    }

    //Draw image to canvas
    const render = function () {
        //Draw the tile map
        for (let column in world.map) {
            for (let row in world.map[column]) {
                context.drawImage(
                    world.tileSet,
                    (world.map[column][row][0].charCodeAt() - 65) *
                        world.sourceTileWidth,
                    (world.map[column][row][1].charCodeAt() - 49) *
                        world.sourceTileHeight,
                    world.sourceTileWidth,
                    world.sourceTileHeight,
                    world.tileWidth * row,
                    world.tileHeight * column,
                    world.tileWidth,
                    world.tileHeight
                )
            }
        }

        context.drawImage(
            hillaryclinton.sprite,
            0,
            0,
            880,
            664,
            hillaryclinton.x,
            hillaryclinton.y,
            hillaryclinton.width,
            hillaryclinton.height
        )

        context.drawImage(
            ammo.sprite,
            0,
            0,
            590,
            546,
            ammo.x,
            ammo.y,
            ammo.width,
            ammo.height
        )

        context.drawImage(
            player.sprite,
            player.source_x,
            player.source_y,
            player.source_width,
            player.source_height,
            player.x,
            player.y,
            player.width,
            player.height
        )

        if (hillaryclinton.state == 'hurt') {
            context.drawImage(
                explosion.sprite,
                explosion.source_x,
                explosion.source_y,
                explosion.source_width,
                explosion.source_height,
                explosion.x,
                explosion.y,
                explosion.width,
                explosion.height
            )
        }

        context.fillStyle = '#FFFFFF'
        context.fillRect(480, 0, 50, 50)

        context.drawImage(
            player.bullet.sprite,
            0,
            0,
            player.bullet.source_width,
            player.bullet.source_height,
            480,
            0,
            50,
            50
        )

        context.lineWidth = '2'
        //Draw the bullet
        if (player.firing) {
            context.drawImage(
                player.bullet.sprite,
                player.bullet.source_x,
                player.bullet.source_y,
                player.bullet.source_width,
                player.bullet.source_height,
                player.bullet.x,
                player.bullet.y,
                player.bullet.width,
                player.bullet.height
            )

            /*
            context.beginPath()
            context.rect(
                player.bullet.getLeft(),
                player.bullet.getTop(),
                player.bullet.getRight() - player.bullet.getLeft(),
                player.bullet.getBottom() - player.bullet.getTop()
            )
            context.stroke()
            */
        }

        /*
        ;[player, hillaryclinton, ammo, anvil, water, table].forEach(
            (object) => {
                context.beginPath()
                context.rect(
                    object.getLeft(),
                    object.getTop(),
                    object.getRight() - object.getLeft(),
                    object.getBottom() - object.getTop()
                )
                context.stroke()
            }
        )
        */
    }

    //Create controller object
    const controller = new Controller()

    //Create engine object
    const engine = new Engine(1000 / 10, update, render)

    //Callback function for controller
    const keyDownUp = function (event) {
        controller.keyDownUp(event.type, event.keyCode)
    }

    // Add event listeners for controller
    window.addEventListener('keydown', keyDownUp)
    window.addEventListener('keyup', keyDownUp)

    engine.start()
})
