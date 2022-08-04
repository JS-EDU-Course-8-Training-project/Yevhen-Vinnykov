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
    service.initObserver(() => ({}));

    const mockElement = document.createElement('div');
    document.body.appendChild(mockElement);
    service.observer.observe(mockElement);

    expect(service).toBeTruthy();
  });
});
