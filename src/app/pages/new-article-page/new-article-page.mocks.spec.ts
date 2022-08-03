import { INewArticle } from '../../shared/models/INewArticle';
import { IArticle } from 'src/app/shared/models/IArticle';
import { IUpdateArticle } from 'src/app/shared/models/IUpdateArticle';

export const expectedData: IArticle = {
  id: '1',
  slug: 'test-slug',
  title: 'test-title',
  description: 'test-description',
  body: 'test-body',
  image: 'test-image',
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
  },
};

export class ArticlesServiceMock {
  public fetchArticle = () => new Promise((resolve) => resolve(expectedData));

  public createArticle = (newArticle: INewArticle) =>
    new Promise((resolve) =>
      resolve({
        ...expectedData,
        title: newArticle.title,
        description: newArticle.description,
        body: newArticle.body,
        tagList: [...newArticle.tagList],
      })
    );

  public updateArticle = (slug: string, article: IUpdateArticle) =>
    new Promise((resolve) =>
      resolve({
        ...expectedData,
        title: article.title || expectedData.title,
        description: article.description || expectedData.description,
        body: article.body || expectedData.body,
      })
    );
}

export class RouterMockEditMode {
  public url = 'localhost:3000/article/test-slug';
  public navigateByUrl = () => ({ catch: () => {} });
}

export class RouterMockCreateMode {
  public url = '/create-article';
  public navigateByUrl = () => ({ catch: () => {} });
}
