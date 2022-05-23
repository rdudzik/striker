import { countTilePositionPx, countTileByPx } from './../../utils/pixel-utilities';
import { Coordinates } from './../coordinates';
import { GridMap } from '../grid-map';

export class Missile {
  private _id: string;
  private _ownerId: string;
  private _direction: string;
  private _speedPx: number;
  private _positionPx: Coordinates;
  private _sizePx: number;
  private _damage: number;

  private _tileSizePx: number;
  private _collision: boolean;
  private _collisionWith: string;
  private _gridMap: GridMap;

  constructor(id: string, ownerId: string, startingPoint: Coordinates, direction: string, speedPx: number, sizePx: number, damage: number, gridMap: GridMap, tileSizePx: number) {
    this._id = id;
    this._ownerId = ownerId;
    this._gridMap = gridMap;
    this._positionPx = countTilePositionPx(startingPoint, tileSizePx);
    this._speedPx = speedPx;
    this._sizePx = sizePx;
    this._tileSizePx = tileSizePx;
    this._collision = false;
    this._damage = damage;
    this._direction = direction;
  }

  public getId(): string {
    return this._id;
  }

  public getOwnerId(): string {
    return this._ownerId;
  }

  public isTargetReached(): boolean {
    return this._collision;
  }

  public getCollisionCause(): string {
    return this._collisionWith;
  }

  public getLocationPx(): Coordinates {
    return this._positionPx;
  }

  public getDamage(): number {
    return this._damage;
  }

  public getDirection(): string {
    return this._direction;
  }
  
  public processMovementPx(gridMap: GridMap): Coordinates {
    if (this._collision) throw new Error(`Missile already collied with: ${this._collisionWith}`);

    switch(this._direction) {
      case 'east':
        this._positionPx.x += this._speedPx;
        break;
      case 'west':
        this._positionPx.x -= this._speedPx;
        break;
      case 'south':
        this._positionPx.y += this._speedPx;
        break;
      case 'north':
        this._positionPx.y -= this._speedPx;
        break;
      default:
        throw new Error(`Invalid direction ${this._direction}`);
    }

    const currentTile = countTileByPx(this.getCenteredLocation(), this._tileSizePx);
    
    if (!this._gridMap.isTileInsideMap(currentTile)) {
      this._collision = true;
      this._collisionWith = 'map';
      return this.getCenteredLocation();
    }

    if (!this._gridMap.isTileAvailable(currentTile)) {
      const collisionCause = this._gridMap.getTileContent(currentTile);
      if (collisionCause !== this._ownerId) {
        this._collision = true;
        this._collisionWith = collisionCause;
        return this.getCenteredLocation();
      }
    }
      
    return this.getCenteredLocation();
  }

  public getCenteredLocation(): Coordinates {
    return new Coordinates(this._positionPx.x + (this._tileSizePx - this._sizePx) / 2, this._positionPx.y + (this._tileSizePx - this._sizePx) / 2)
  }
}