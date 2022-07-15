import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IComment } from 'src/app/shared/models/IComment';

import { CommentFormComponent } from './comment-form.component';
import { AuthorizationService } from 'src/app/shared/services/authorization/authorization.service';
import { CommentsService } from '../services/comments/comments.service';
import { By } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';


const returnComment: IComment = {
  id: '1',
  createdAt: Date.now().toLocaleString(),
  updatedAt: Date.now().toLocaleString(),
  body: 'test-comment',
  author: {
    username: 'test-user',
    bio: 'test-bio',
    image: 'test-image',
    following: false,
  },
  article: '1'
};

class CommentsServiceMock {
  public createComment = (slug: string, comment: {body: string}): Observable<IComment> => of(returnComment);
}

class AuthorizationServiceMock {
  public isAuthorized$ = of(true);
}

describe('COMMENT FORM COMPONENT', () => {
  let component: CommentFormComponent;
  let fixture: ComponentFixture<CommentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommentFormComponent],
      providers: [FormBuilder],
      imports: [ReactiveFormsModule, FormsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).overrideComponent(CommentFormComponent, {
      set: {
        providers: [
          { provide: CommentsService, useClass: CommentsServiceMock },
          { provide: AuthorizationService, useClass: AuthorizationServiceMock }
        ],
      }
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentFormComponent);
    component = fixture.componentInstance;
    component.slug = 'test-slug';
    fixture.detectChanges();
  });

  it('AddComment method should not be called because the form is empty', () => {
    const spy = spyOn(component, 'addComment').and.callThrough();
    component.commentForm.controls['body'].setValue('');
   
    const button = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(button.disabled).toBe(true);

    expect(component.commentForm.valid).toBe(false);

    expect(spy).not.toHaveBeenCalled();
  });

  it('AddComment method should be called', () => {
    const spy = spyOn(component, 'addComment').and.callThrough();
    const spyCreateCommentData = spyOn<any>(component, 'createCommentData').and.callThrough();

    component.commentForm.controls['body'].setValue('test-comment');
    fixture.detectChanges();

    expect(component.commentForm.getRawValue().body).toBe('test-comment');
    expect(component.commentForm.valid).toBe(true);

    const button = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(button.disabled).toBe(false);
    button.click();
    fixture.detectChanges();

    expect(component.commentForm.getRawValue().body).toBe(null);
    expect(component.commentForm.valid).toBe(false);

    expect(button.disabled).toBe(true);

    expect(spy).toHaveBeenCalled();
    expect(spyCreateCommentData).toHaveBeenCalled();
  });

});



