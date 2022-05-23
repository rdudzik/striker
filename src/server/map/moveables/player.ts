import { Missile } from './missile';
import { GridMap } from './../grid-map';
import { Moveable } from './moveable';

export class Player extends Moveable {
    private _health: number;
    private _maxHealth: number;
    private _level: number;
    
    constructor(id: string, sizePx: number, speedPx: number, health = 100, level = 1) {9
        super(id, sizePx, speedPx);

        this._maxHealth = health;
        this._health = health;
        this._level = level;
    }

    public getHealth(): number {
        return this._health;
    }

    public getMaxHealth(): number {
        return this._maxHealth;
    }

    public getLevel(): number {
        return this._level;
    }

    public fireMissile(gridMap: GridMap, speedPx: number, sizePx: number): Missile {
        const startingPointTile = this.getCurrentTileCoordinates().getClone();
        const direction = this.getFacingDirection();

        switch(direction) {
            case 'east':
                startingPointTile.x += 1;
                break;
            case 'west':
                startingPointTile.x -= 1;
                break;
            case 'south':
                startingPointTile.y += 1;
                break;
            case 'north':
                startingPointTile.y -= 1;
                break;
            default:
                throw new Error(`Invalid direction ${direction}`);
        }

        return new Missile(Math.ceil(Math.random() * 1000000).toString(), this.getId(), startingPointTile, direction, speedPx, sizePx, this._level * 5, gridMap, this._tileSizePx);
    }

    public dealDamage(damage: number): void {
        this._health -= damage;
        if (this._health < 0) {
            this._health = 0;
        }
    }
}