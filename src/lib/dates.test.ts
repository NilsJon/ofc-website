import test from 'node:test';
import assert from 'node:assert/strict';
import { classifyExhibition } from './dates.ts';

const exhibition = { start_date: '2026-10-06 00:00', end_date: '2026-10-12 23:59' };

test('classifies before, during and after an exhibition, including both boundary days', () => {
  assert.equal(classifyExhibition(exhibition, new Date('2026-10-05T12:00:00Z')), 'upcoming');
  assert.equal(classifyExhibition(exhibition, new Date('2026-10-06T12:00:00Z')), 'current');
  assert.equal(classifyExhibition(exhibition, new Date('2026-10-12T12:00:00Z')), 'current');
  assert.equal(classifyExhibition(exhibition, new Date('2026-10-13T12:00:00Z')), 'archived');
});

test('uses the Swedish local calendar day near midnight', () => {
  assert.equal(classifyExhibition(exhibition, new Date('2026-10-05T22:30:00Z')), 'current');
});

test('keeps incomplete legacy entries out of automatic scheduling', () => {
  assert.equal(classifyExhibition({ start_date: '2026-10-06' }), 'undated');
});
