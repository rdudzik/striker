import { countTilePositionPx } from './../../utils/pixel-utilities';
import { Coordinates } from "../coordinates";
import { GridMap } from "../grid-map";

export abstract class Moveable {
  private _id: string;
  private _speedPx: number;
  private _sizePx: number;
  protected _tileSizePx: number;
  private _positionPx: Coordinates;

  private _positionTile: Coordinates;
  private _destinationTile: Coordinates;
  private _maxXTile: number;
  private _maxYTile: number;

  private _facingDirection: string;

  private _gridMap: GridMap;

  constructor(id: string, sizePx: number, speedPx: number) {
    this._id = id;
    this._sizePx = sizePx;
    this._speedPx = speedPx;
  }

  public getId(): string {
    return this._id;
  }

  public setOnMap(gridMap: GridMap, destinationTile: Coordinates, tileSizePx: number, facingDirection = 'south'): void {
    gridMap.occupyTile(destinationTile.getClone(), this._id);

    this._gridMap = gridMap;
    this._positionTile = destinationTile.getClone();
    this._destinationTile = destinationTile.getClone();
    this._positionPx = countTilePositionPx(destinationTile, tileSizePx);
    this._maxXTile = gridMap.getXTiles() - 1;
    this._maxYTile = gridMap.getYTiles() - 1;
    this._tileSizePx = tileSizePx;
    this._facingDirection = facingDirection;
  }

  public getCurrentTileCoordinates(): Coordinates {
    if (!this._positionTile) throw new Error(`Player id=${this._id} is not placed on the map!`);
    return this._positionTile;
  }

  public setSpeedPx(value: number): void {
    this._speedPx = value;
  }

  public getSpeedPx(): number {
    return this._speedPx;
  }

  public getSizePx(): number {
    return this._sizePx;
  }

  public isMoving(): boolean {
    return (this.isMovingX() || this.isMovingY());
  }

  public isMovingX(): boolean {
    return this.getCurrentTileCoordinates().x !== this._destinationTile.x;
  }

  public isMovingY(): boolean {
    return this.getCurrentTileCoordinates().y !== this._destinationTile.y;
  }

  public moveEast(): boolean {
    if (!this.isMovingX() && this._positionTile.x < this._maxXTile) {
      this.faceEast();
      return this.moveByTiles(1, 0);
    }
    return false;
  }

  public moveWest(): boolean {
    if (!this.isMovingX() && this._positionTile.x > 0) {
      this.faceWest();
      return this.moveByTiles(-1, 0);
    }
    return false;
  }

  public moveSouth(): boolean {
    if (!this.isMovingY() && this._positionTile.y < this._maxYTile) {
      this.faceSouth();
      return this.moveByTiles(0, 1);
    }
    return false;
  }

  public moveNorth(): boolean {
    if (!this.isMovingY() && this._positionTile.y > 0) {
      this.faceNorth();
      return this.moveByTiles(0, -1);
    }
    return false;
  }

  public faceEast(): void {
    this._facingDirection = 'east';
  }

  public faceWest(): void {
    this._facingDirection = 'west';
  }

  public faceSouth(): void {
    this._facingDirection = 'south';
  }

  public faceNorth(): void {
    this._facingDirection = 'north';
  }

  public getFacingDirection(): string {
    return this._facingDirection;
  }

  public moveByTiles(differenceX: number, differenceY: number) {
    const newDestinationTile = new Coordinates(this._destinationTile.x + differenceX, this._destinationTile.y + differenceY);
    if (this._gridMap.isTileAvailable(newDestinationTile)) {
      try {
        this._gridMap.releaseTile(this._destinationTile);
      } catch (e) {
        console.warn(e);
      };
      try {
        this._gridMap.occupyTile(newDestinationTile, this._id.toString());
        this._destinationTile = newDestinationTile;
        return true;
      } catch (error) {
        console.error(error);
      }
    }
    return false;
  }

  public processMovementPx(gridMap: GridMap): Coordinates {
    if (this.isMoving()) {
      let destinationPx = countTilePositionPx(this._destinationTile, this._tileSizePx);

      const xDirection = this._destinationTile.x - this._positionTile.x;
      if (xDirection > 0) {
        if (this._positionPx.x + this._speedPx >= destinationPx.x) {
          this._positionPx.x = destinationPx.x;
          this._positionTile.x = this._destinationTile.x;
        } else {
          this._positionPx.x += this._speedPx;
        }
      }
      if (xDirection < 0) {
        if (this._positionPx.x - this._speedPx <= destinationPx.x) {
          this._positionPx.x = destinationPx.x;
          this._positionTile.x = this._destinationTile.x;
        } else {
          this._positionPx.x -= this._speedPx;
        }
      }
      const yDirection = this._destinationTile.y - this._positionTile.y;
      if (yDirection > 0) {
        if (this._positionPx.y + this._speedPx >= destinationPx.y) {
          this._positionPx.y = destinationPx.y;
          this._positionTile.y = this._destinationTile.y;
        } else {
          this._positionPx.y += this._speedPx;
        }
      }
      if (yDirection < 0) {
        if (this._positionPx.y - this._speedPx <= destinationPx.y) {
          this._positionPx.y = destinationPx.y;
          this._positionTile.y = this._destinationTile.y;
        } else {
          this._positionPx.y -= this._speedPx;
        }
      }
    }

    return new Coordinates(this._positionPx.x + (this._tileSizePx - this._sizePx) / 2, this._positionPx.y + (this._tileSizePx - this._sizePx) / 2);
  }
}