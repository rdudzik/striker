import { Coordinates } from '../../../../../src/server/map/coordinates';
import { countTileByPx, countTilePositionPx } from './../../../../../src/server/utils/pixel-utilities';

describe('Pixel utilities', ()=> {
  const tileSizePx = 130;

  it('should properly return tile position in pixels', () => {
    const tilePosition = new Coordinates(2,4);
    const expectedTilePositionPx = new Coordinates(tilePosition.x * tileSizePx, tilePosition.y * tileSizePx);
    
    const tilePositionPx = countTilePositionPx(tilePosition, tileSizePx);

    expect(tilePositionPx.x).toBe(expectedTilePositionPx.x);
    expect(tilePositionPx.y).toBe(expectedTilePositionPx.y);
    expect(tilePositionPx.equalTo(expectedTilePositionPx)).toBe(true);
  });

  it('should properly return tile basing on x,y pixel coordinates', () => {
    const x = 200;
    const y = 260;
    const expectedX = 1;
    const expectedY = 2;
    const expectedTilePx = new Coordinates(x, y);
    const expectedTile = new Coordinates(expectedX, expectedY);

    const tilePosition = countTileByPx(expectedTilePx, tileSizePx);

    expect(tilePosition).toBeDefined()
    expect(tilePosition.x).toBe(expectedX);
    expect(tilePosition.y).toBe(expectedY);
    expect(expectedTile.equalTo(tilePosition));
  });
})