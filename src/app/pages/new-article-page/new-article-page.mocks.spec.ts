import { INewArticle } from '../../shared/models/INewArticle';
import { Observable, of, throwError } from 'rxjs';
import { IArticle } from 'src/app/shared/models/IArticle';
import { ICreatedArticle } from 'src/app/shared/models/ICreatedArticle';
import { IUpdateArticle } from 'src/app/shared/models/IUpdateArticle';


export const expectedData: IArticle = {
    slug: 'test-slug',
    title: 'test-title',
    description: 'test-description',
    body: 'test-body',
    tagList: ['test-tag'],
    createdAt: Date.now().toString(),
    updatedAt: Date.now().toString(),
    favorited: false,
    favoritesCount: 2,
    author: {
      username: 'test-author',
      bio: 'test-bio',
      image: 'test-image',
      following: false,
    }
  };
  
  export const mockNewArticle: INewArticle = {
    title: 'test-title',
    description: 'test-description',
    body: 'test-body',
    tagList: ['test-tag']
  };
  
  
  export class ArticlesServiceMock {
  
    public fetchArticle = (slug: string): Observable<IArticle> => of(expectedData);
  
    public createArticle = (newArticle: ICreatedArticle): Observable<IArticle> => of({
      ...expectedData,
      title: newArticle.title,
      description: newArticle.description,
      body: newArticle.body,
      tagList: [...newArticle.tagList]
    });
  
    public updateArticle = (slug: string, article: IUpdateArticle): Observable<IArticle> => of({
      ...expectedData,
      title: article.title,
      description: article.description,
      body: article.body
    });
  
  }
  
  export class ArticlesServiceMockWithError {
    public fetchArticle = (slug: string) => throwError(() => 'Fetching articles failed');
  }
  
  export class RouterMockEditMode {
    public url = 'localhost:3000/article/test-slug';
  }
  
  export class RouterMockCreateMode {
    public url = '/create-article';
  }
  