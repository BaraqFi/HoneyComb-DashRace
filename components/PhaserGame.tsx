"use client"
import { useEffect, useRef, useState } from "react"
import Phaser from "phaser"

let car: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
let lanes: number[]
let currentLaneIndex: number
let coins: Phaser.Physics.Arcade.Group
let obstacles: Phaser.Physics.Arcade.Group
let missiles: Phaser.Physics.Arcade.Group
let score = 0
let miles = 0
let level = 1
let scoreText: Phaser.GameObjects.Text
let mileText: Phaser.GameObjects.Text
let levelText: Phaser.GameObjects.Text
let speed = 70
let obstacleSpeed = 90
let missileSpeed = 180

const levelThresholds = [10, 25, 50, 75, 100, 150, 200, 250, 300, 400]

type Props = {
  onExit: () => void
  onSaveAndExit?: (stats: { score: number, miles: number }) => void
  isPaused?: boolean
}

export default function PhaserGame({ onExit, onSaveAndExit, isPaused }: Props) {
  const gameRef = useRef<HTMLDivElement>(null)
  const [internalPaused, setInternalPaused] = useState(false)
const pauseRef = useRef(false)

// Watch for external pause prop
useEffect(() => {
  if (typeof isPaused === "boolean") {
    pauseRef.current = isPaused
    setInternalPaused(isPaused)
  }
}, [isPaused])


  // These will store the final score/miles at exit
  const [finalScore, setFinalScore] = useState(0)
  const [finalMiles, setFinalMiles] = useState(0)

  useEffect(() => {
    let game: Phaser.Game | null = null
    let milesTimer: Phaser.Time.TimerEvent
    let missileTimer: Phaser.Time.TimerEvent

    function preload(this: Phaser.Scene) {
      this.load.image('car', '/car.png')
      this.load.image('coin', '/coin.png')
      this.load.image('obstacle', '/obstacle.png')
      this.load.image('missile', '/missile.png')
    }

    function create(this: Phaser.Scene) {
      const { width, height } = this.cameras.main

      this.add.rectangle(width / 2, height / 2, width, height, 0x333333)
      lanes = [width / 4, width / 2, (3 * width) / 4]
      for (let lane of lanes) {
        this.add.rectangle(lane, height / 2, width / 3.5, height, 0x333333).setOrigin(0.5, 0.5)
        for (let i = 0; i < 10; i++) {
          this.add.rectangle(lane, i * (height / 10), 10, height / 20, 0xffffff).setOrigin(0.5, 0.5)
        }
      }

      currentLaneIndex = 1
      car = this.physics.add.sprite(lanes[currentLaneIndex], height - 100, 'car')
      car.setCollideWorldBounds(true)
      car.setScale(0.18)
      car.angle = 0

      coins = this.physics.add.group({
        key: 'coin',
        repeat: 2,
        setXY: { x: lanes[Phaser.Math.Between(0, 2)], y: 0, stepX: 100 }
      })
      coins.children.iterate(function (coin) {
        (coin as Phaser.Physics.Arcade.Image).setVelocityY(speed)
        ;(coin as Phaser.Physics.Arcade.Image).setScale(1.5)
        return null
      })
      this.physics.add.overlap(car, coins, collectCoin as any, undefined, this)

      obstacles = this.physics.add.group({
        key: 'obstacle',
        repeat: 1,
        setXY: { x: lanes[Phaser.Math.Between(0, 2)], y: 0, stepX: 200 }
      })
      obstacles.children.iterate(function (obs) {
        (obs as Phaser.Physics.Arcade.Image).setVelocityY(obstacleSpeed)
        ;(obs as Phaser.Physics.Arcade.Image).setScale(0.6)
        return null
      })
      this.physics.add.overlap(car, obstacles, hitObstacle as any, undefined, this)

      missiles = this.physics.add.group()
      this.physics.add.overlap(car, missiles, hitMissile as any, undefined, this)

      missileTimer = this.time.addEvent({
        delay: 10000,
        callback: spawnMissile,
        callbackScope: this,
        loop: true
      })

      this.input.on('pointerdown', function (pointer: Phaser.Input.Pointer) {
        if (pauseRef.current) return
        if (pointer.x < car.x && currentLaneIndex > 0) {
          currentLaneIndex--
        } else if (pointer.x > car.x && currentLaneIndex < 2) {
          currentLaneIndex++
        }
        car.x = lanes[currentLaneIndex]
      }, this)

      // Score/miles/level display
      score = 0
      miles = 0
      level = 1
      speed = 70
      obstacleSpeed = 90
      missileSpeed = 180
      scoreText = this.add.text(16, 50, 'Score: 0', { fontSize: '25px', color: '#FFFFFF', fontFamily: 'sans-serif' })
      mileText = this.add.text(16, 90, 'Miles: 0', { fontSize: '25px', color: '#FFFFFF', fontFamily: 'sans-serif' })
      levelText = this.add.text(16, 130, 'Level: 1', { fontSize: '25px', color: '#FFFFFF', fontFamily: 'sans-serif' })

      milesTimer = this.time.addEvent({
        delay: 3000,
        callback: updateMiles,
        callbackScope: this,
        loop: true
      })
    }

    function collectCoin(car: Phaser.GameObjects.GameObject, coin: Phaser.GameObjects.GameObject) {
      const coinSprite = coin as Phaser.Physics.Arcade.Image
      coinSprite.disableBody(true, true)
      score += 10
      scoreText.setText('Score: ' + score)
      const laneIdx = Phaser.Math.Between(0, 2)
      coinSprite.enableBody(true, lanes[laneIdx], 0, true, true)
      coinSprite.setVelocityY(speed)
    }

    function hitObstacle(car: Phaser.GameObjects.GameObject, obstacle: Phaser.GameObjects.GameObject) {
      const obsSprite = obstacle as Phaser.Physics.Arcade.Image
      obsSprite.disableBody(true, true)
      score -= 30
      if (score < 0) score = 0
      scoreText.setText('Score: ' + score)
      const laneIdx = Phaser.Math.Between(0, 2)
      obsSprite.enableBody(true, lanes[laneIdx], 0, true, true)
      obsSprite.setVelocityY(obstacleSpeed)
    }

    function hitMissile(car: Phaser.GameObjects.GameObject, missile: Phaser.GameObjects.GameObject) {
      const missileSprite = missile as Phaser.Physics.Arcade.Image
      missileSprite.disableBody(true, true)
      score -= 60
      if (score < 0) score = 0
      scoreText.setText('Score: ' + score)
    }

    function spawnMissile(this: Phaser.Scene) {
      if (missiles.countActive(true) < 1) {
        const laneIdx = Phaser.Math.Between(0, 2)
        const missileSprite = missiles.create(lanes[laneIdx], 0, 'missile') as Phaser.Physics.Arcade.Image
        missileSprite.setVelocityY(missileSpeed)
        missileSprite.setScale(0.3)
        missileSprite.angle = 180
      }
    }

    function updateMiles(this: Phaser.Scene) {
      if (pauseRef.current) return
      miles += 1
      mileText.setText('Miles: ' + miles)
      if (level < levelThresholds.length && miles >= levelThresholds[level - 1]) {
        level++
        levelText.setText('Level: ' + level)
        speed += 10
        obstacleSpeed += 10
        missileSpeed += 15
        coins.children.iterate(function (coin) {
          (coin as Phaser.Physics.Arcade.Image).setVelocityY(speed)
          return null
        })
        obstacles.children.iterate(function (obs) {
          (obs as Phaser.Physics.Arcade.Image).setVelocityY(obstacleSpeed)
          return null
        })
        missiles.children.iterate(function (missile) {
          (missile as Phaser.Physics.Arcade.Image).setVelocityY(missileSpeed)
          return null
        })
      }
    }

    function update(this: Phaser.Scene) {
      if (pauseRef.current) {
        this.physics.pause()
        this.time.timeScale = 0
      } else {
        this.physics.resume()
        this.time.timeScale = 1
      }

      coins.children.iterate(function (coin) {
        const sprite = coin as Phaser.Physics.Arcade.Image
        if (sprite.y > 800) {
          const laneIdx = Phaser.Math.Between(0, 2)
          sprite.y = 0
          sprite.x = lanes[laneIdx]
        }
        return null
      })

      obstacles.children.iterate(function (obs) {
        const sprite = obs as Phaser.Physics.Arcade.Image
        if (sprite.y > 800) {
          const laneIdx = Phaser.Math.Between(0, 2)
          sprite.y = 0
          sprite.x = lanes[laneIdx]
        }
        return null
      })

      missiles.children.iterate(function (missile) {
        const sprite = missile as Phaser.Physics.Arcade.Image
        if (sprite.y > 800) {
          sprite.disableBody(true, true)
        }
        return null
      })
    }

    if (gameRef.current) {
      game = new Phaser.Game({
        type: Phaser.AUTO,
        width: 480,
        height: 800,
        parent: gameRef.current,
        scene: { preload, create, update },
        backgroundColor: "#1a1a1a",
        physics: {
          default: "arcade",
          arcade: { debug: false }
        }
      })
    }

    return () => {
      if (game) game.destroy(true)
    }
  }, [])

  // Button handlers
  const handlePause = () => setInternalPaused(p => {
  pauseRef.current = !p
  return !p
})


  // NEW: "Save & Exit" passes score/miles up
  const handleSaveAndExit = () => {
  if (onSaveAndExit) {
    onSaveAndExit({ score, miles })
  }
  // DO NOT call onExit here! Parent handles game/modal flow.
}


  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-3 mb-2">
        <button
          className="px-5 py-2 rounded-lg bg-blue-800 text-white font-mono"
          onClick={handlePause}
        >
          {internalPaused ? "Resume" : "Pause"}
        </button>
        <button
          className="px-5 py-2 rounded-lg bg-red-700 text-white font-mono"
          onClick={handleSaveAndExit}
        >
          Save & Exit
        </button>
      </div>
      <div
        ref={gameRef}
        className="w-full max-w-md aspect-[3/5] flex justify-center items-center mx-auto"
        style={{ minHeight: 400 }}
      />
    </div>
  )
}
