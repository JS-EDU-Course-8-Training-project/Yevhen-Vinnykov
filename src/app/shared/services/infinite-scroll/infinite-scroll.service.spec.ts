import { TestBed } from '@angular/core/testing';

import { InfiniteScrollService } from './infinite-scroll.service';

describe('INFINITE SCROLL SERVICE', () => {
  let service: InfiniteScrollService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InfiniteScrollService],
    });
    service = TestBed.inject(InfiniteScrollService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
