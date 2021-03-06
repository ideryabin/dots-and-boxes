/* eslint-env jest */

import unbindAll from 'nanoevents/unbind-all';
import { TOP, BOTTOM, LEFT, RIGHT } from '../src/lib/symbols';
import Emitter from '../src/lib/Emitter';
import createField from './create-field';
import createPlayers from './create-players';

beforeEach(() => unbindAll(Emitter));

it('should set up field', () => {
  const field = createField({ size: 5 });
  expect(field.size).toEqual(5);
  expect(field.cells.size()).toEqual(5 * 5);
});

it('should check if cells exist', () => {
  const { cells } = createField();
  expect(cells.has(0, 0)).toBe(true);
  expect(cells.has(-1, -1)).toBe(false);
});

it('should set owners for edges only once', () => {
  const { cells } = createField();
  const players = createPlayers();

  const edge = cells.get(0, 0).edges[TOP];

  edge.owner = players[0];
  expect(() => edge.owner = players[1]).toThrow();
});

it('should mirror edge owners', () => {
  const { cells } = createField();
  const players = createPlayers();

  const cell = cells.get(1, 1);

  cell.edges[TOP].owner = players[0];
  expect(cells.get(cell, TOP).edges[BOTTOM].owner).toEqual(players[0]);

  cell.edges[BOTTOM].owner = players[1];
  expect(cells.get(cell, BOTTOM).edges[TOP].owner).toEqual(players[1]);

  cell.edges[LEFT].owner = players[0];
  expect(cells.get(cell, LEFT).edges[RIGHT].owner).toEqual(players[0]);

  cell.edges[RIGHT].owner = players[1];
  expect(cells.get(cell, RIGHT).edges[LEFT].owner).toEqual(players[1]);
});

it('should set cell owner when it\'s enclosed', () => {
  const { cells } = createField();
  const players = createPlayers();

  const cell = cells.get(1, 1);

  cell.edges[TOP].owner = players[0];
  cell.edges[BOTTOM].owner = players[1];
  cell.edges[LEFT].owner = players[0];
  expect(cell.owner).toBeNull();
  cell.edges[RIGHT].owner = players[1];
  expect(cell.owner).not.toBeNull();
});

it('should set cell owner to player that encloses it', () => {
  const { cells } = createField();
  const players = createPlayers();

  const cell = cells.get(1, 1);

  cell.edges[TOP].owner = players[0];
  cell.edges[BOTTOM].owner = players[1];
  cell.edges[LEFT].owner = players[0];
  cell.edges[RIGHT].owner = players[1];
  expect(cell.owner).toEqual(players[1]);
});
