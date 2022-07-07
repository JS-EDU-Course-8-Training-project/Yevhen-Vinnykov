import { BehaviorSubject } from 'rxjs';
import { TestBed } from '@angular/core/testing';

import { InfiniteScrollService } from './infinite-scroll.service';

describe('INFINITE SCROLL SERVICE', () => {
  let service: InfiniteScrollService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InfiniteScrollService);
  });

  it('should be created', () => {
    const data = {
      canLoad: new BehaviorSubject<boolean>(true),
      callback: () => { }
    };
    service.observeIntersection(data);

    const mockElement = document.createElement('div');
    document.body.appendChild(mockElement);
    service.observer.observe(mockElement);
    
    expect(service).toBeTruthy();
  });

});








