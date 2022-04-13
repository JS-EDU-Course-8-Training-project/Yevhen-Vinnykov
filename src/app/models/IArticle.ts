interface IArticleAuthor {
    username: string
    bio: string | null;
    image: string;
    following: boolean;
}

export interface IArticle {
    slug: string;
    title: string;
    description: string;
    body: string;
    tagList: string[];
    createdAt: string;
    updatedAt: string
    favorited: boolean;
    favoritesCount: number;
    author: IArticleAuthor;
}

export interface IArticleResponse {
    articles: IArticle[];
    articlesCount: number;
}