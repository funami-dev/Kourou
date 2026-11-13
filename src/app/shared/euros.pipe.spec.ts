import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { EurosPipe } from './euros.pipe';

describe('EurosPipe', () => {
  let pipe: EurosPipe;

  beforeEach(() => {
    registerLocaleData(localeDe);
    TestBed.configureTestingModule({ providers: [EurosPipe, { provide: LOCALE_ID, useValue: 'de' }] });
    pipe = TestBed.inject(EurosPipe);
  });

  it('formats whole euros in the German style', () => {
    expect(pipe.transform(100_000_000)).toBe('100.000.000 €');
  });

  it('rounds away cents', () => {
    expect(pipe.transform(1_234.56)).toBe('1.235 €');
  });

  it('can show a plus sign for income', () => {
    expect(pipe.transform(5_000, { showPlusSign: true })).toBe('+5.000 €');
    expect(pipe.transform(-5_000, { showPlusSign: true })).toBe('-5.000 €');
  });
});
