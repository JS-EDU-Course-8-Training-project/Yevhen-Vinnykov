import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DeleteButtonStore {
  readonly isLoading$ = new BehaviorSubject<boolean>(false);
}
