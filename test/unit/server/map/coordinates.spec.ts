import { Coordinates } from '../../../../src/server/map/coordinates';

describe('Coordinates', () => {
  it('should be defined',()=> {
    const coordinates = new Coordinates(0, 0);

    expect(coordinates).toBeDefined();
  });

  it('should return cloned coordinates', ()=> {
    const x = 0;
    const y = 1;
    const coordinates = new Coordinates(x, y);

    const clonedCoordinates = coordinates.getClone();
    
    expect(clonedCoordinates).toBeDefined();
    expect(clonedCoordinates.x).toBe(x);
    expect(clonedCoordinates.y).toBe(y);
  });
  
  it('should return different object for cloned coordinates', ()=> {
    const x = 0;
    const y = 1;
    const coordinates = new Coordinates(x, y);

    const clonedCoordinates = coordinates.getClone();
    
    expect(clonedCoordinates).not.toBe(coordinates);
  });

  it('should properly compare coordinates', ()=> {
    const x = 0;
    const y = 1;
    const coordinates = new Coordinates(x, y);

    const clonedCoordinates = coordinates.getClone();
    
    expect(clonedCoordinates.equalTo(coordinates)).toBe(true);
  });

  it('should properly compare cloned coordinates when changed', ()=> {
    const x = 0;
    const y = 1;
    const coordinates = new Coordinates(x, y);

    const clonedCoordinates = coordinates.getClone();
    clonedCoordinates.x = 1;
    
    expect(clonedCoordinates.equalTo(coordinates)).toBe(false);
  });
});