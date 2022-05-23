import { Missile } from './server/map/moveables/missile';
import { Player } from'./server/map/moveables/player';
import { GridMap } from'./server/map/grid-map';
import { Coordinates } from './server/map/coordinates';
import { dimensionsConfig as dimensionsConfig } from './config/dimentions-config';

const socketIO = require('socket.io');
const express = require('express');
const path = require('path');

const app = express();
const server = require('http').Server(app);
const port = 2000;

app.get('/', (req, resp) => {
    const pathToIndex = path.resolve(__dirname + '/../../client/index.html');
    resp.sendFile(pathToIndex);
    // resp.sendFile(__dirname + '/client/index.html');
});

// app.use('/client', express.static(__dirname + '/client'));
const pathToClient = path.resolve(__dirname + '/../../client/img');
app.use('/client/img/', express.static(pathToClient));

console.info(`Server starts at http://localhost:${port}`);
server.listen(port);

const io = socketIO(server, {});

let sockets = [];
let players = new Array<Player>();
let missiles = new Array<Missile>();
let readyToFire = new Array<Player>();
let alreadyFired = new Array<Player>();

const gridMap = new GridMap(dimensionsConfig.TILES_X, dimensionsConfig.TILES_Y);

const npcId = Math.ceil(Math.random() * 1000000);
const npc = new Player('npc_' + npcId, dimensionsConfig.PLAYER_SIZE_PX, dimensionsConfig.PLAYER_SPEED_PX);
npc.setSpeedPx(1);
npc.setOnMap(gridMap, new Coordinates(4,4), dimensionsConfig.TILE_SIZE_PX);
const npc2 = new Player('npc_' + Math.ceil(Math.random() * 1000000), dimensionsConfig.PLAYER_SIZE_PX, dimensionsConfig.PLAYER_SPEED_PX);
npc2.setSpeedPx(2);
npc2.setOnMap(gridMap, new Coordinates(4,5), dimensionsConfig.TILE_SIZE_PX);
players.push(npc);
players.push(npc2);

io.sockets.on('connection', socket => {
    socket.userId = Math.ceil(Math.random() * 1000000).toString();
    console.info(`Player '${socket.userId}' connected` )
    sockets.push(socket);
    
    //create new player for the client
    const newPlayer = new Player(socket.userId, dimensionsConfig.PLAYER_SIZE_PX, dimensionsConfig.PLAYER_SPEED_PX);
    newPlayer.setOnMap(gridMap, new Coordinates(1, 1), dimensionsConfig.TILE_SIZE_PX);
    players.push(newPlayer);
    socket.emit('player-id', newPlayer.getId());

    //send grid map to the client
    socket.emit('map-dimensions', {
        xSize: dimensionsConfig.TILES_X,
        ySize: dimensionsConfig.TILES_Y,
        tileSize: dimensionsConfig.TILE_SIZE_PX,
        playerSize: dimensionsConfig.PLAYER_SIZE_PX,
        missileSize: dimensionsConfig.MISSILE_SIZE_PX
    });

    socket.on('move', direction => {
        const player = players.filter(p => p.getId() === socket.userId)[0];
        switch(direction) {
            case 'west': {
                player.moveWest();
                break;
            }
            case 'north': {
                player.moveNorth();
                break;
            }
            case 'east': {
                player.moveEast();
                break;
            }
            case 'south': {
                player.moveSouth();
                break;
            }
            default : {
                break;
            }
        }
    });

    socket.on('face', direction => {
        const player = players.filter(p => p.getId() === socket.userId)[0];
        switch(direction) {
            case 'west': {
                player.faceWest();
                break;
            }
            case 'north': {
                player.faceNorth();
                break;
            }
            case 'east': {
                player.faceEast();
                break;
            }
            case 'south': {
                player.faceSouth();
                break;
            }
            default : {
                break;
            }
        }
    });

    socket.on('disconnect', () => {
        console.log(`Player '${socket.userId}' disconnected`)
        const player = players.filter(x => x.getId() === socket.userId)[0];

        gridMap.releaseTile(player.getCurrentTileCoordinates());
        
        sockets = sockets.filter(x => x.id !== socket.userId);
        players = players.filter(x => x.getId() !== socket.userId);
    });

    socket.on('fire-missile', () => {
        const player = players.filter(x => x.getId() === socket.userId)[0];

        if (readyToFire.filter(p => p.getId() === player.getId()).length === 0 && alreadyFired.filter(p => p.getId() === player.getId()).length === 0) {
            readyToFire.push(player);
        }
    });
});


function moveRandomDirection(player: Player):void {
    switch(Math.round(Math.random() * 4)) {
        case 0: {
            player.moveWest();
            break;
        }
        case 1: {
            player.moveEast();
            break;
        }
        case 2: {
            player.moveNorth();
            break;
        }
        case 3: {
            player.moveSouth();
            break;
        }
    };
}

function moveNpc () {
    if (npc.getCurrentTileCoordinates() && !npc.isMoving()) {
        moveRandomDirection(npc);
    }
    if (npc2.getCurrentTileCoordinates() && !npc2.isMoving()) {
        moveRandomDirection(npc2);
    }
}

function sendPlayersData() {
    const playersData = [];
    players.forEach(player => {
        const location = player.processMovementPx(gridMap);
        playersData.push({
            x: location.x,
            y: location.y,
            id: player.getId(),
            direction: player.getFacingDirection(),
            max_health: player.getMaxHealth(),
            health: player.getHealth(),
            level: player.getLevel()
        });
    });
    sockets.forEach(socket => {
        socket.emit('players', playersData)
    });
}

function sendMissilesData() {
    const missilesData = [];
    missiles.forEach(missile => {
        let target: string;
        let positionPx: Coordinates;

        if (missile.isTargetReached()) {
            const target = missile.getCollisionCause();
            const damage = missile.getDamage();

            if (!target) {
                throw new Error('Target not defined for collision!');
            }
            
            if (target !== 'map') {
                try {
                    const targetPlayer = players.filter(p => p.getId() === target)[0];
                    targetPlayer.dealDamage(damage);
                } catch(error) {
                    console.error(`Could not deal damage to the target ${target}`, error);
                }
            } 

            positionPx = missile.getCenteredLocation();
            
            missiles = missiles.filter(m => m.getId() !== missile.getId());
        } else {
            positionPx = missile.processMovementPx(gridMap);
        }

        missilesData.push({
            x: positionPx.x,
            y: positionPx.y,
            target: target,
            direction: missile.getDirection()
        });
    });
    sockets.forEach(socket => {
        socket.emit('missiles', missilesData);
    });
}

function fireMissiles() {
    readyToFire.forEach(player => {
        if (alreadyFired.filter(p => p.getId() === player.getId()).length === 0) {
            missiles.push(player.fireMissile(gridMap, dimensionsConfig.MISSILE_SPEED_PX, dimensionsConfig.MISSILE_SIZE_PX));
            alreadyFired.push(player);
        }
    });
    readyToFire = new Array<Player>();
}

function resetAlreadyFired() {
    alreadyFired = new Array<Player>();
}

function sendOccupiedTiles() {
    sockets.forEach(socket => socket.emit('occupied-tiles', gridMap.getOccupiedTiles()));
}

setInterval(sendPlayersData, 20);
setInterval(sendOccupiedTiles, 20);
setInterval(sendMissilesData, 10);

setInterval(moveNpc, 1000);
setInterval(fireMissiles, 20);
setInterval(resetAlreadyFired, 1000);