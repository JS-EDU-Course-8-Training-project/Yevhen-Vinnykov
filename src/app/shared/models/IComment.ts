import { IArticleAuthor } from "./IArticle"
  export interface IComment {
      id: string;
      createdAt: string;
      updatedAt: string;
      body: string;
      author: IArticleAuthor;
      article: string;
  }