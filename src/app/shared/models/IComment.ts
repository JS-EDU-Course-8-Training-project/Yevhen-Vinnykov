import { IArticleAuthor } from "./IArticle"
  export interface IComment {
      _id: string;
      id: string;
      createdAt: string;
      updatedAt: string;
      body: string;
      author: IArticleAuthor
  }