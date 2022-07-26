import { Injectable } from '@angular/core';

@Injectable()
export class InfiniteScrollService {
  public observer!: IntersectionObserver;

  public initObserver(callback: () => void): void {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    };
    this.observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) callback();
    }, options);
  }
}
