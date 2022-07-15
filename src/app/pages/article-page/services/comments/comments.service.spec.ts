import { IComment } from './../../../../shared/models/IComment';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { CommentsService } from './comments.service';

const expectedData: IComment[] = [{
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
  article: '1'
}];

describe('COMMENTS SERVICE', () => {
  let service: CommentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(CommentsService);
  });

  it('fetch correct comments', () => {
    const spy = spyOn(service, 'fetchArticleComments').and.callThrough();

    service.fetchArticleComments('test-slug').subscribe(comments => {
      expect(comments).toEqual(expectedData);
    });

    expect(spy).toHaveBeenCalled();
  });

  it('should create comment', () => {
    const spy = spyOn(service, 'createComment').and.callThrough();

    service.createComment('test-slug', { body: 'test-comment' }).subscribe(comments => {
      expect(comments).toEqual(expectedData[0]);
    });

    expect(spy).toHaveBeenCalled();
  });

  it('should delete comment', waitForAsync(() => {
    const spy = spyOn(service, 'removeComment').and.callThrough();

    service.removeComment('test-slug', '1').subscribe(comment => {
      expect(comment).toEqual(expectedData[0]);
    });

    expect(spy).toHaveBeenCalled();
  }));
});



