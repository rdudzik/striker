import { Coordinates } from './coordinates';

export class GridMap {
  private _xTiles: number;
  private _yTiles: number;

  private _tiles: Array<string>;

  constructor(xTiles: number, yTiles: number) {
    this._xTiles = xTiles;
    this._yTiles = yTiles;
    this._tiles = new Array<string>(xTiles * yTiles).fill('');
  }

  public getXTiles(): number {
    return this._xTiles;
  }

  public getYTiles(): number {
    return this._yTiles;
  }

  public getTileContent(coordinates: Coordinates): string {
    this.checkTile(coordinates);
    const index = this._xTiles > this._yTiles ? (coordinates.y * this._xTiles) + coordinates.x : (coordinates.x * this._yTiles) + coordinates.y;
    return this._tiles[index];
  }

  public occupyTile(coordinates: Coordinates, invader: string): void {
    this.checkTile(coordinates);

    if (!this.isTileAvailable(coordinates)) {
      throw new Error(`Tile x=${coordinates.x}, y=${coordinates.y} is occupied by ${this._tiles[this.getTileIndex(coordinates)]}!`);
    }
    this._tiles[this.getTileIndex(coordinates)] = invader;
  }

  public releaseTile(coordinates: Coordinates): void {
    this.checkTile(coordinates);

    if (this.isTileAvailable(coordinates)) {
      throw new Error(`Tile x=${coordinates.x}, y=${coordinates.y} is not occupied!`);
    }
    this._tiles[this.getTileIndex(coordinates)] = '';
  }

  public isTileAvailable(coordinates: Coordinates): boolean {
    this.checkTile(coordinates);

    return (this._tiles[this.getTileIndex(coordinates)] === '');
  }

  public getOccupiedTiles(): Array<{ x: number, y: number, content: string }> {
    const occupiedTiles = [];

    for (let i = 0; i < this._tiles.length; i++) {
      if (this._tiles[i]) {
        const coordinates = this.getTileCoordinates(i);
        occupiedTiles.push({
          x: coordinates.x,
          y: coordinates.y,
          content: this._tiles[i]
        });
      }
    }

    return occupiedTiles;
  }

  public isTileInsideMap(coordinates: Coordinates): boolean {
    return !(coordinates.x < 0 || coordinates.y < 0 || coordinates.x >= this._xTiles || coordinates.y >= this._yTiles);
  }

  private getTileIndex(coordinates: Coordinates): number {
    const tilesDifference = Math.abs(this._xTiles - this._yTiles);

    if (this._xTiles < this._yTiles) {
      return ((coordinates.x * this._xTiles) + (coordinates.y + (tilesDifference * coordinates.x)));
    }
    return ((coordinates.y * this._yTiles) + (coordinates.x + (tilesDifference * coordinates.y)));
  }

  private getTileCoordinates(index: number): Coordinates {
    if (this._xTiles < this._yTiles) {
      return new Coordinates(Math.floor(index / this._yTiles), index % (this._yTiles));
    }
    return new Coordinates(index % (this._xTiles), Math.floor(index / this._xTiles));
  }

  private checkTile(coordinates: Coordinates): void {
    if (!this.isTileInsideMap(coordinates)) {
      throw new Error(`Trying to reach tile x=${coordinates.x}, y=${coordinates.y} outside of the map x=${this._xTiles - 1}, y=${this._yTiles - 1}!`);
    }
  }
}
