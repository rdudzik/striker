import { Coordinates } from "../map/coordinates";

export const countTilePositionPx = (tileCoordinates: Coordinates, tileSizePx: number): Coordinates => {
  return new Coordinates(tileCoordinates.x * tileSizePx, tileCoordinates.y * tileSizePx);
};

export const countTileByPx = (coordinatesPx: Coordinates, tileSizePx: number): Coordinates  => {
  return new Coordinates(Math.floor(coordinatesPx.x / tileSizePx), Math.floor(coordinatesPx.y / tileSizePx));
}
