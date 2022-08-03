import { of } from 'rxjs';
import { IComment } from './../../../../shared/models/IComment';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { CommentsService } from './comments.service';
import { HttpClient } from '@angular/common/http';

const commentsMock: IComment[] = [
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

class HttpClientMock {
  public get = () => of({ comments: commentsMock });
  public post = () => of(commentsMock[0]);
  public delete = () => of(commentsMock[0]);
}

describe('COMMENTS SERVICE', () => {
  let service: CommentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: HttpClient, useClass: HttpClientMock }],
    });
    service = TestBed.inject(CommentsService);
  });

  it('fetch correct comments', async () => {
    const comments = await service.fetchArticleComments('test-slug');
    expect(comments).toEqual(commentsMock);
  });

  it('should create comment', async () => {
    const comment = await service.createComment('test-slug', {
      body: 'test-comment',
    });

    expect(comment).toEqual(commentsMock[0]);
  });

  it('should delete comment', async () => {
    const comment = await service.removeComment('test-slug', '1');
    expect(comment).toEqual(commentsMock[0]);
  });
});
