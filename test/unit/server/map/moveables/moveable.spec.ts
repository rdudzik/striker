import { GridMap } from '../../../../../src/server/map/grid-map';
import { Coordinates } from '../../../../../src/server/map/coordinates';
import { Moveable } from '../../../../../src/server/map/moveables/moveable';

describe('Moveable', () => {
  class DumbMoveable extends Moveable {
    constructor(id: string, sizePx: number, speedPx: number) {
      super(id, sizePx, speedPx);
    }
  }
  
  let player: DumbMoveable;
  const playerId = 'player1';
  const playerSizePx = 14;
  const playerSpeedPx = 17;
  const playerXTile = 1;
  const playerYTile = 1;

  let gridMap: GridMap;
  const xTiles = 4;
  const yTiles = 17;
  let players: Array<DumbMoveable>;

  beforeEach(() => {
    gridMap = new GridMap(xTiles, yTiles);

    player = new DumbMoveable(playerId, playerSizePx, playerSpeedPx);  
    players = new Array<DumbMoveable>();
    players.push(player);
  });

  it('should be defined', () => {
    expect(player).toBeDefined();
  });

  it('should properly set speed', () => {
    const speedSpy = jest.spyOn(player, 'setSpeedPx');
    
    player.setSpeedPx(100);

    expect(speedSpy).toHaveBeenCalled();
  })

  it('should return correct id', () => {
    expect(player.getId()).toBe(playerId);
  });

  it('should return correct moveable px size', () => {
    expect(player.getSizePx()).toBe(playerSizePx);
  });

  it('should return direction "south" by default', ()=> {
    player.setOnMap(gridMap, new Coordinates(playerXTile, playerYTile), 100);

    expect(player.getFacingDirection()).toBeDefined();
    expect(player.getFacingDirection()).toBe('south');
  });

  it('should return current tile', () => {
    player.setOnMap(gridMap, new Coordinates(playerXTile, playerYTile), 100);

    expect(player.getCurrentTileCoordinates()).toBeDefined();
    expect(player.getCurrentTileCoordinates()).toBeDefined();
    expect(player.getCurrentTileCoordinates().equalTo(new Coordinates(1,1))).toBe(true);
  });

  it('should indicate that player is not moving by default', () => {
    player.setOnMap(gridMap, new Coordinates(playerXTile, playerYTile), 100);
    
    expect(player.isMovingX()).toBe(false);
    expect(player.isMovingY()).toBe(false);
    expect(player.isMoving()).toBe(false);
  });

  it('should indicate that player is moving in X when commanded to move', () => {
    player.setOnMap(gridMap, new Coordinates(playerXTile, playerYTile), 100);

    expect(player.moveEast()).toBe(true);
    
    expect(player.isMovingY()).toBe(false);
    expect(player.isMovingX()).toBe(true);
    expect(player.isMoving()).toBe(true);
  });

  it('should indicate correct tile after move and that is not moving anymore', () => {
    player.setOnMap(gridMap, new Coordinates(playerXTile, playerYTile), 100);
    
    expect(player.moveEast()).toBe(true);
    while(player.isMoving()) {
      player.processMovementPx(gridMap);
    }
    
    expect(player.isMovingY()).toBe(false);
    expect(player.isMovingX()).toBe(false);
    expect(player.isMoving()).toBe(false);
    expect(player.getCurrentTileCoordinates().equalTo(new Coordinates(2,1))).toBe(true);
  });

  it('should not move player if tile is occupied by another player', () => {
    player.setOnMap(gridMap, new Coordinates(playerXTile, playerYTile), 100);
    const npc = new DumbMoveable('npc', 10, 10);
    const npcCoordinates = new Coordinates(playerXTile + 1, playerYTile);
    npc.setOnMap(gridMap, npcCoordinates, 100);

    expect(npc.getCurrentTileCoordinates().equalTo(npcCoordinates)).toBe(true);
    expect(player.moveEast()).toBe(false);
    while(player.isMoving()) {
      player.processMovementPx(gridMap);
    }
    
    expect(player.isMovingY()).toBe(false);
    expect(player.isMovingX()).toBe(false);
    expect(player.isMoving()).toBe(false);
    expect(npc.getCurrentTileCoordinates().equalTo(npcCoordinates)).toBe(true);
  });

  it('should not move player west if at the edge of the map', ()=> {
    const npc = new DumbMoveable('npc', 100,100);
    const edgeOfMapCoordinates = new Coordinates(0, 0);
    npc.setOnMap(gridMap, edgeOfMapCoordinates, 100);

    expect(npc.moveWest()).toBe(false);
    while(npc.isMoving()) {
      npc.processMovementPx(gridMap);
    }

    expect(npc.getCurrentTileCoordinates().equalTo(edgeOfMapCoordinates));
  });
  
  it('should not move player north if at the edge of the map', ()=> {
    const npc = new DumbMoveable('npc', 100,100);
    const edgeOfMapCoordinates = new Coordinates(0, 0);
    npc.setOnMap(gridMap, edgeOfMapCoordinates, 100);

    expect(npc.moveNorth()).toBe(false);
    while(npc.isMoving()) {
      npc.processMovementPx(gridMap);
    }

    expect(npc.getCurrentTileCoordinates().equalTo(edgeOfMapCoordinates));
  });

  it('should not move player east if at the edge of the map', ()=> {
    const npc = new DumbMoveable('npc', 100,100);
    const edgeOfMapCoordinates = new Coordinates(xTiles-1, 0);
    npc.setOnMap(gridMap, edgeOfMapCoordinates, 100);

    expect(npc.moveEast()).toBe(false);
    while(npc.isMoving()) {
      npc.processMovementPx(gridMap);
    }

    expect(npc.getCurrentTileCoordinates().equalTo(edgeOfMapCoordinates));
  });

  it('should not move player south if at the edge of the map', ()=> {
    const npc = new DumbMoveable('npc', 100,100);
    const edgeOfMapCoordinates = new Coordinates(0, yTiles-1);
    npc.setOnMap(gridMap, edgeOfMapCoordinates, 100);

    expect(npc.moveSouth()).toBe(false);
    while(npc.isMoving()) {
      npc.processMovementPx(gridMap);
    }

    expect(npc.getCurrentTileCoordinates().equalTo(edgeOfMapCoordinates));
  });
  
  it('should indicate correct tile after move in two directions and that is not moving anymore', () => {
    player.setOnMap(gridMap, new Coordinates(playerXTile, playerYTile), 100);

    expect(player.moveEast()).toBe(true);
    expect(player.moveNorth()).toBe(true);

    while(player.isMoving()) {
      player.processMovementPx(gridMap);
    }

    expect(player.isMovingY()).toBe(false);
    expect(player.isMovingX()).toBe(false);
    expect(player.isMoving()).toBe(false);
    expect(player.getCurrentTileCoordinates().equalTo(new Coordinates(2,0))).toBe(true);
  });

  it('should indicate that player is not moving when commanded to move and position were calculated', () => {
    player.setOnMap(gridMap, new Coordinates(playerXTile, playerYTile), 100);
    
    expect(player.moveWest()).toBe(true);
    expect(player.moveNorth()).toBe(true);

    while(player.isMoving()) {
      player.processMovementPx(gridMap);
    }

    expect(player.isMovingY()).toBe(false);
    expect(player.isMovingX()).toBe(false);
    expect(player.isMoving()).toBe(false);
    expect(player.getCurrentTileCoordinates().equalTo(new Coordinates(0,0))).toBe(true);
  });

  it('should indicate that player is not moving when commanded to move and position were calculated', () => {
    player.setOnMap(gridMap, new Coordinates(playerXTile, playerYTile), 100);

    expect(player.moveEast()).toBe(true);
    expect(player.moveSouth()).toBe(true);

    while(player.isMoving()) {
      player.processMovementPx(gridMap);
    }

    expect(player.isMovingY()).toBe(false);
    expect(player.isMovingX()).toBe(false);
    expect(player.isMoving()).toBe(false);
    expect(player.getCurrentTileCoordinates().equalTo(new Coordinates(2,2))).toBe(true);
  });
});