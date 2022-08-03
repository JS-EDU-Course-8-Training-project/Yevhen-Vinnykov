import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { IExistingUser } from './../../../shared/models/IExistingUser';
import { BehaviorSubject } from 'rxjs';
import { IComment } from './../../../shared/models/IComment';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CommentsComponent } from './comments.component';
import { CommentsService } from '../services/comments/comments.service';
import { By } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { TestAttributes } from 'src/app/shared/tests/TestAttributes';
import { TestAttributeDirective } from 'src/app/shared/tests/test-attribute.directive';
import { MatDialogModule } from '@angular/material/dialog';
import { CommentsStore } from '../services/comments/comments.store';

const comments: IComment[] = [
  {
    id: '1',
    createdAt: Date.now().toString(),
    updatedAt: Date.now().toString(),
    body: 'test-comment',
    author: {
      username: 'test-username',
      bio: 'test-bio',
      image: 'test-image',
      following: false,
    },
    article: '1',
  },
];

class CommentsStoreMock {
  public comments$ = new BehaviorSubject<IComment[]>([]);
}

const authUser: IExistingUser = {
  id: '1',
  email: 'test@example.com',
  username: 'test-username',
  bio: 'test-bio',
  image: 'test-image',
  token: 'test-token',
  password: 'test-password',
};

class CommentsServiceMock {
  public fetchArticleComments = () =>
    new Promise((resolve) => resolve(comments));
  public removeComment = () => new Promise<void>((resolve) => resolve());
}

describe('COMMENTS COMPONENT', () => {
  let component: CommentsComponent;
  let fixture: ComponentFixture<CommentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommentsComponent, TestAttributeDirective],
      imports: [MatCardModule, MatIconModule, MatDialogModule],
      providers: [
        { provide: CommentsService, useClass: CommentsServiceMock },
        { provide: CommentsStore, useClass: CommentsStoreMock },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentsComponent);
    component = fixture.componentInstance;
    component.slug = 'test-slug';
    component.authUser = authUser;
    fixture.detectChanges();
  });

  it('deleteComment() should be invoked on click', waitForAsync(() => {
    const spy = spyOn(component, 'deleteComment').and.callThrough();

    fixture.whenStable().then(() => {
      fixture.detectChanges();

      const deleteIcon = fixture.debugElement.query(
        By.css(`[data-test=${TestAttributes.CommentDeleteBtn}]`)
      );

      deleteIcon.triggerEventHandler('click', null);

      expect(spy).toHaveBeenCalledWith('1');
    });
  }));

  it('getComments() should be invoked on click', waitForAsync(() => {
    const spy = spyOn(component, 'getComments').and.callThrough();
    component.ngOnInit();

    fixture.whenStable().then(() => {
      expect(spy).toHaveBeenCalled();
      expect(component.store.comments$.getValue()).toEqual(comments);
    });
  }));
});
