const dodgeCooldown = 1000;
const atkCooldown = 500;
const switchCooldown = 1000;

export class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, sprite) {
        super(scene, x, y, sprite);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.initEvents();
        this.init();
    }

    init() {
        // Variables
        this.alive = true;
        this.nrj = 0;
        this.hp = 5;
        this.hpMax = 5;
        this.hplvl = 1;
        this.atklvl = 1;
        this.deflvl = 1;
        this.endurancelvl = 1;
        this.reslvl = 1;
        this.dodgelvl = 1;
        this.move = false;
        this.dodge = false;
        this.hurt = false;
        this.attaque = false;
        this.screwdriver = false;
        this.pointeau = false;
        this.cameraMode = false;
        this.grab = false;
        this.contactOccured = false;
        this.dodgeExecuted = false;
        this.lastDodgeTime = 0;
        this.lastComboTime = 0;
        this.lastSwitchTime = 0;
        this.isDodging = false;
        this.isAttacking = false;
        this.isHurt = false;
        this.facingLeft = false;
        this.facingRight = true;
        this.atkType = 0;
        this.cameraMode = false;
        this.reparionMode = true;
        this.mode = 0;

        // Contrôles
        this.clavier = this.scene.input.keyboard.addKeys('Q,D,SPACE,SHIFT,A,Z,E,R,X,ALT,CTRL,F');
        this.cursors = this.scene.input.keyboard.createCursorKeys();
        this.pad = {
            leftStick: { x: 0, y: 0 },
            rightStick: { x: 0, y: 0 },
            A: false,
            B: false,
            X: false,
            Y: false,
            L1: 0,
            L2: 0,
            R1: 0,
            R2: 0,
            right: false,
            left: false,
            up: false,
            down: false,
            start: false,
            select: false,
        };

        // Combo d'attaques
        /*this.comboAttacks = [
            () => {
                // Logique de la première attaque du combo
                console.log('Attaque 1');
            },
            () => {
                // Logique de la deuxième attaque du combo
                console.log('Attaque 2');
            },
            () => {
                // Logique de la troisième attaque du combo
                console.log('Attaque 3');
            }
        ];*/

        // Index de l'attaque en cours dans le combo
        this.currentAttackIndex = 0;

        console.log("test");

        // Paramètres
        this.setOrigin(0.5, 0.5);
        this.setCollideWorldBounds(true);
    }

    update() {

        const currentTime = Date.now();

        // Déplacement à gauche
        if (this.clavier.Q.isDown && this.body.onFloor() && !this.isDodging && !this.isAttacking && this.reparionMode == true && this.cameraMode == false) {
            this.setVelocityX(-1024);
            this.move = true;
            this.facingLeft = true;
            this.facingRight = false;
        }


        // Déplacement à droite
        else if (this.clavier.D.isDown && this.body.onFloor() && !this.isDodging && !this.isAttacking && this.reparionMode == true && this.cameraMode == false) {
            this.setVelocityX(1024);
            this.move = true;
            this.facingLeft = false;
            this.facingRight = true;
        }


        // Saut à gauche
        if (this.clavier.SPACE.isDown && this.clavier.Q.isDown && this.body.onFloor() && !this.isDodging && !this.isAttacking && this.reparionMode == true && this.cameraMode == false) {
            this.setVelocityX(-1024);
            this.setAccelerationY(-4096);
            setTimeout(() => {
                this.body.gravity.y = -768;
                this.setAccelerationY(0);
                setTimeout(() => {
                    this.body.gravity.y = 512;
                }, 256);
            }, 256);
            this.body.setGravityY(0);
        }


        // Saut à droite
        else if (this.clavier.SPACE.isDown && this.clavier.D.isDown && this.body.onFloor() && !this.isDodging && !this.isAttacking && this.reparionMode == true && this.cameraMode == false) {
            this.setVelocityX(1024);
            this.setAccelerationY(-4096);
            setTimeout(() => {
                this.body.gravity.y = -768;
                this.setAccelerationY(0);
                setTimeout(() => {
                    this.body.gravity.y = 512;
                }, 256);
            }, 256);
            this.body.setGravityY(0);
        }


        // Saut stationnaire
        else if (this.clavier.SPACE.isDown && this.body.onFloor() && !this.isDodging && !this.isAttacking && this.reparionMode == true && this.cameraMode == false) {
            this.setAccelerationY(-4096);
            setTimeout(() => {
                this.body.gravity.y = -768;
                this.setAccelerationY(0);
                setTimeout(() => {
                    this.body.gravity.y = 512;
                }, 256);
            }, 256);
            this.body.setGravityY(0);
        }


        // Aucun mouvement
        if (this.body.onFloor() && !this.move && !this.isDodging) {
            this.setVelocityX(0);
        }


        // Dash vers droite
        if (this.clavier.SHIFT.isDown && this.clavier.D.isDown && !this.isDodging && Date.now() - this.lastDodgeTime >= dodgeCooldown && !this.isAttacking && this.reparionMode == true && this.cameraMode == false) {
            this.setVelocityX(5000);
            this.setVelocityY(0);
            this.body.gravity.y = -1024;
            this.isDodging = true;
            this.lastDodgeTime = Date.now();
            setTimeout(() => {
                this.setVelocityX(0);
                this.setVelocityY(0);
                this.isDodging = false;
                this.body.gravity.y = 0;
            }, this.dodgelvl * 10 + 300);
        }


        // Dash vers gauche
        if (this.clavier.SHIFT.isDown && this.clavier.Q.isDown && !this.isDodging && Date.now() - this.lastDodgeTime >= dodgeCooldown && this.reparionMode == true && this.cameraMode == false) {
            this.setVelocityX(-5000);
            this.setVelocityY(0);
            this.body.gravity.y = -1024;
            this.isDodging = true;
            this.lastDodgeTime = Date.now();
            setTimeout(() => {
                this.setVelocityX(0);
                this.setVelocityY(0);
                this.isDodging = false;
                this.body.gravity.y = 0;
            }, this.dodgelvl * 10 + 300);
        }


        // On absorbe l'orbe d'énergie buglian
        this.on('absorbtion', (data) => {
            if (!this.contactOccured) {
                console.log(data.information);
                this.collecter = true;
                this.nrj += 10;
                console.log(this.nrj);
                this.contactOccured = true;
            }
        });


        // On prend un dégât
        this.on('ouch', (data) => {
            if (!this.contactOccured && !this.hurt && !this.isDodging && !this.isHurt && !this.isAttacking) {
                console.log(data.information);
                this.hp -= 1;
                console.log(this.hp);
                this.contactOccured = true;
                this.hurt = true;
                this.isHurt = true;
                setTimeout(() => {
                    this.hurt = false;
                    setTimeout(() => {
                        this.isHurt = false;
                    }, 1000);
                }, 1000);
            }
        });


        //definir le mode pour empecher mouvement pendant mode caméra

        if (this.clavier.Z.isDown && this.mode == 0 && Date.now() - this.lastSwitchTime >= switchCooldown) {
            this.lastSwitchTime = Date.now();
            this.cameraMode = true;
            this.mode = 1;
            this.reparionMode = false;
            console.log(this.mode);
        }

        if (this.clavier.Z.isDown && this.mode == 1 && Date.now() - this.lastSwitchTime >= switchCooldown) {
            this.lastSwitchTime = Date.now();
            this.cameraMode = false;
            this.mode = 0;
            this.reparionMode = true;
            console.log(this.mode);
        }


    












        //constante pour le temps actuel
        //const currentTime = Date.now();

        // Gestion du combo d'attaques
        /*this.canAttack = currentTime - this.lastComboTime >= atkCooldown;
        const comboMaxTime = 1000; // Temps maximum entre les attaques pour maintenir le combo
        if (this.canAttack && this.comboCount === 0) {
            this.lastComboTime = currentTime;
        }
        this.comboTimer = currentTime - this.lastComboTime;
        if (this.comboTimer >= comboMaxTime) {
            this.comboCount = 0;
        }

        // Gestion des contrôles
        if (this.clavier.A.isDown && !this.dodge && this.facingRight) {
            if (this.canAttack && this.comboTimer <= comboMaxTime && this.comboCount < 3) {
                this.isAttacking = true;
                this.emit('currentlyAttacking', { information: 'attaque en cours' });
                this.lastAttackTime = currentTime;

                this.comboAttacks[this.currentAttackIndex](); // Appel de la fonction d'attaque spécifique du combo

                this.currentAttackIndex = Math.min(this.currentAttackIndex + 1, this.comboAttacks.length - 1);
                this.comboCount++;
                this.canAttack = false;
                this.comboTimer = 0;

                setTimeout(() => {
                    this.setSize(256, 512);
                    this.setOffset(0, 0);
                    this.isAttacking = false;
                    this.emit('i am weak', { information: 'hello' });
                }, 500);
            } else {
                // Réinitialisation du comboCount si le temps écoulé dépasse le temps maximum
                if (this.comboTimer >= comboMaxTime) {
                    this.comboCount = 0;
                }
                this.canAttack = true;
                this.comboTimer = 0;
            }
        }*/

        this.contactOccured = false;
        this.move = false;
    }




    initEvents() {
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    }
}