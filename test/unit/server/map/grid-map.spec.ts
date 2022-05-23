import { Coordinates } from '../../../../src/server/map/coordinates';
import { GridMap } from '../../../../src/server/map/grid-map';

describe('Grid Map', () => {
  const xTiles = 10;
  const yTiles = 12;

  let gridMap: GridMap;

  beforeEach(() => {
    gridMap = new GridMap(xTiles, yTiles);
  });

  it('should be defined', () => {
    expect(gridMap).toBeDefined();
  });

  it('should return X size', () => {
    expect(gridMap.getXTiles()).toBe(xTiles);
  });

  it('should return Y size', () => {
    expect(gridMap.getYTiles()).toBe(yTiles);
  });


  it('should be defined', ()=> {
    expect(gridMap).toBeDefined();
  });

  it('should return empty tile content by default', () => {
    expect(gridMap.getTileContent(new Coordinates(0, 0))).toBeDefined();
    expect(gridMap.getTileContent(new Coordinates(0, 0))).toBe('');
  });

  it.each([[-1, 0], [0, -1], [xTiles, 0], [0, yTiles]])
  ('should return false for tile outside of the map', (x, y)=> {
    expect(gridMap.isTileInsideMap(new Coordinates(x, y))).toBe(false);
  });

  it.each([[0, 0], [1, 0], [xTiles-1, 0], [0, yTiles-1]])
  ('should return true for tile inside map', (x, y)=> {
    expect(gridMap.isTileInsideMap(new Coordinates(x, y))).toBe(true);
  });

  it('should return true for available tile', ()=> {
    expect(gridMap.isTileAvailable(new Coordinates(0, 0))).toBe(true);
  });

  it('should occupy available tile', ()=> {
    expect(gridMap.isTileAvailable(new Coordinates(0, 0))).toBe(true);

    gridMap.occupyTile(new Coordinates(0, 0), 'invader!');

    expect(gridMap.isTileAvailable(new Coordinates(0, 0))).toBe(false);
  });

  it('should throw error when trying to occupy occupied tile', ()=>{
    expect(gridMap.isTileAvailable(new Coordinates(0, 0))).toBe(true);
    gridMap.occupyTile(new Coordinates(0, 0), 'invader!');
    expect(gridMap.isTileAvailable(new Coordinates(0, 0))).toBe(false);

    expect(()=>gridMap.occupyTile(new Coordinates(0, 0), 'invader!')).toThrowError();
  });
});
