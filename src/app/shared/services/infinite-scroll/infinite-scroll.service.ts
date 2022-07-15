import { BehaviorSubject, take } from 'rxjs';
import { Injectable } from '@angular/core';

interface IObserverData {
  canLoad: BehaviorSubject<boolean>;
  callback(): void;
}

@Injectable({
  providedIn: 'root',
})
export class InfiniteScrollService {
  public observer!: IntersectionObserver;

  public observeIntersection(data: IObserverData) {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    };
    this.observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        data.canLoad.pipe(take(1)).subscribe((canLoad) => {
          if (canLoad) data.callback();
        });
      }
    }, options);
  }
}
