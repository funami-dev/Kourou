import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { SiteLocalTimePipe } from './site-local-time.pipe';

describe('SiteLocalTimePipe', () => {
  it('shows the local clock time of the time zone', () => {
    TestBed.configureTestingModule({ providers: [SiteLocalTimePipe, { provide: LOCALE_ID, useValue: 'de' }] });
    const pipe = TestBed.inject(SiteLocalTimePipe);

    // 17:05 UTC is 14:05 in Kourou (UTC−3).
    expect(pipe.transform(Date.UTC(2026, 10, 13, 17, 5), 'America/Cayenne')).toBe('14:05');
  });
});
