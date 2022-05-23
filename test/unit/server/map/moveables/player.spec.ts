import { Player } from './../../../../../src/server/map/moveables/player';

describe('Player', ()=> {
  it('should be defined', ()=> {
    const player = new Player('1', 100, 100, 100, 100);

    expect(player).toBeDefined();
  })
});