import { IArticleAuthor } from "./IArticle"
  export interface IComment {
      id: number;
      createdAt: string;
      updatedAt: string;
      body: string;
      author: IArticleAuthor
  }