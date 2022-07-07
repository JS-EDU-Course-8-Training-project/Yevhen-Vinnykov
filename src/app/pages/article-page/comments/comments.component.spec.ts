import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { IExistingUser } from './../../../shared/models/IExistingUser';
import { Observable, of, Subject } from 'rxjs';
import { IComment } from './../../../shared/models/IComment';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentsComponent } from './comments.component';
import { CommentsService } from '../services/comments/comments.service';
import { By } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

const comments: IComment[] = [{
  _id: '1',
  id: '1',
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

describe('COMMENTS COMPONENT', () => {
  let component: CommentsComponent;
  let fixture: ComponentFixture<CommentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommentsComponent ],
      imports: [MatCardModule, MatIconModule],
      providers: [
        { provide: CommentsService, useClass: CommentsServiceMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
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

  it('should delete comment', () => {
    const spy = spyOn(component, 'deleteComment').and.callThrough();

    const deleteIcon = fixture.debugElement.query(By.css('[data-angular="test-delete-icon"]'));
    deleteIcon.triggerEventHandler('click', null);

    expect(spy).toHaveBeenCalledWith('1');
  });

  it('should not delete a comment that does not exist', () => {
    const spy = spyOn(component, 'deleteComment').and.callThrough();
    component.deleteComment('1000');
    expect(spy).toHaveBeenCalledWith('1000');
  });

  it('requestForComments$ should trigger getComments', () => {
    const spy = spyOn(component, 'getComments').and.callThrough();
    component.requestForComments$.next();
    expect(spy).toHaveBeenCalledTimes(1);
  });

});
