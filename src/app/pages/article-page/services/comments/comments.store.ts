import { IComment } from 'src/app/shared/models/IComment';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommentsStore {
  public readonly comments$ = new BehaviorSubject<IComment[]>([]);
}
