import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { IExistingUser } from './../../../shared/models/IExistingUser';
import { Observable, of, Subject } from 'rxjs';
import { IComment } from './../../../shared/models/IComment';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentsComponent } from './comments.component';
import { CommentsService } from '../services/comments/comments.service';
import { By } from '@angular/platform-browser';

const comments: IComment[] = [{
  id: 1,
  createdAt: Date.now().toString(),
  updatedAt: Date.now().toString(),
  body: 'test-comment',
  author: {
    username: 'test-username',
    bio: 'test-bio',
    image: 'test-image',
    following: false,
  }
}];

const authUser: IExistingUser = {
  email: 'test@example.com',
  username: 'test-username',
  bio: 'test-bio',
  image: 'test-image',
  token: 'test-token',
  password: 'test-password'
};


class CommentsServiceMock {
  public fetchArticleComments = (slug: string): Observable<IComment[]> => of(comments);
  public removeComment = (slug: string, id: number): Observable<IComment> => of(comments[0]);
}

describe('CommentsComponent', () => {
  let component: CommentsComponent;
  let fixture: ComponentFixture<CommentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommentsComponent ],
      imports: [MatCardModule, MatIconModule],
      providers: [
        { provide: CommentsService, useClass: CommentsServiceMock }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentsComponent);
    component = fixture.componentInstance;
    component.slug = 'test-slug';
    component.authUser = authUser;
    component.requestForComments$ = new Subject<void>();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should delete comment', () => {
    fixture.detectChanges();
    component.ngOnInit();
    const deleteIcon = fixture.debugElement.query(By.css('[data-angular="test-delete-icon"]'));
    deleteIcon.triggerEventHandler('click', null);
    expect(deleteIcon.nativeElement).toBeTruthy();
  });

});
