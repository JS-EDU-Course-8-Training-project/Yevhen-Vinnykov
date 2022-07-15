import { IArticle, IArticleResponse } from './../../src/app/shared/models/IArticle';

export const dislikedArticle: IArticle = {
    id: "62962f059a092d5bb72fd59f",
    slug: "Lorem",
    title: "Lorem",
    description: "Lorem ipsum dolor sit amet consectetur adip ex ea commodo consequ velit es u",
    body: "Lorem ipsum dolor sit amet consectetur adip ex ea commodo consequ velit es u.Lorem ipsum dolor sit amet consectetur adip ex ea commodo consequ velit es u",
    tagList: [
        "lorem"
    ],
    createdAt: "1654009605136",
    updatedAt: "1656518693581",
    favorited: false,
    favoritesCount: 0,
    author: {
        username: "Jane",
        following: false,
        bio: "test",
        image: "https://st3.depositphotos.com/2229436/13671/v/600/depositphotos_136717406-stock-illustration-flat-user-icon-member-sign.jpg"
    }
};

export const likedArticle: IArticle = {
    id: "62962f059a092d5bb72fd59f",
    slug: "Lorem",
    title: "Lorem",
    description: "Lorem ipsum dolor sit amet consectetur adip ex ea commodo consequ velit es u",
    body: "Lorem ipsum dolor sit amet consectetur adip ex ea commodo consequ velit es u.Lorem ipsum dolor sit amet consectetur adip ex ea commodo consequ velit es u",
    tagList: [
        "lorem"
    ],
    createdAt: "1654009605136",
    updatedAt: "1656518693581",
    favorited: true,
    favoritesCount: 1,
    author: {
        username: "Jane",
        following: false,
        bio: "test",
        image: "https://st3.depositphotos.com/2229436/13671/v/600/depositphotos_136717406-stock-illustration-flat-user-icon-member-sign.jpg"
    }
};

export const ownArticle: IArticle = {
    id: "62962f059a092d5bb72fd59f",
    slug: "Lorem",
    title: "Lorem",
    description: "Lorem ipsum dolor sit amet consectetur adip ex ea commodo consequ velit es u",
    body: "Lorem ipsum dolor sit amet consectetur adip ex ea commodo consequ velit es u.Lorem ipsum dolor sit amet consectetur adip ex ea commodo consequ velit es u",
    tagList: [
        "lorem"
    ],
    createdAt: "1654009605136",
    updatedAt: "1656518693581",
    favorited: false,
    favoritesCount: 0,
    author: {
        username: "John",
        following: false,
        bio: "test",
        image: "https://st3.depositphotos.com/2229436/13671/v/600/depositphotos_136717406-stock-illustration-flat-user-icon-member-sign.jpg"
    }
};

export const notOwnArticle: IArticle = {
    id: "62962f059a092d5bb72fd59f",
    slug: "Lorem",
    title: "Lorem",
    description: "Lorem ipsum dolor sit amet consectetur adip ex ea commodo consequ velit es u",
    body: "Lorem ipsum dolor sit amet consectetur adip ex ea commodo consequ velit es u.Lorem ipsum dolor sit amet consectetur adip ex ea commodo consequ velit es u",
    tagList: [
        "lorem"
    ],
    createdAt: "1654009605136",
    updatedAt: "1656518693581",
    favorited: false,
    favoritesCount: 0,
    author: {
        username: "Jane",
        following: false,
        bio: "test",
        image: "https://st3.depositphotos.com/2229436/13671/v/600/depositphotos_136717406-stock-illustration-flat-user-icon-member-sign.jpg"
    }
};

export const articleOfFollowedUser: IArticle = {
    id: "62962f059a092d5bb72fd59f",
    slug: "Lorem",
    title: "Lorem",
    description: "Lorem ipsum dolor sit amet consectetur adip ex ea commodo consequ velit es u",
    body: "Lorem ipsum dolor sit amet consectetur adip ex ea commodo consequ velit es u.Lorem ipsum dolor sit amet consectetur adip ex ea commodo consequ velit es u",
    tagList: [
        "lorem"
    ],
    createdAt: "1654009605136",
    updatedAt: "1656518693581",
    favorited: false,
    favoritesCount: 0,
    author: {
        username: "Jane",
        following: true,
        bio: "test",
        image: "https://st3.depositphotos.com/2229436/13671/v/600/depositphotos_136717406-stock-illustration-flat-user-icon-member-sign.jpg"
    }
};

export const articleOfNotFollowedUser: IArticle = {
    id: "62962f059a092d5bb72fd59f",
    slug: "Lorem",
    title: "Lorem",
    description: "Lorem ipsum dolor sit amet consectetur adip ex ea commodo consequ velit es u",
    body: "Lorem ipsum dolor sit amet consectetur adip ex ea commodo consequ velit es u.Lorem ipsum dolor sit amet consectetur adip ex ea commodo consequ velit es u",
    tagList: [
        "lorem"
    ],
    createdAt: "1654009605136",
    updatedAt: "1656518693581",
    favorited: false,
    favoritesCount: 0,
    author: {
        username: "Jane",
        following: false,
        bio: "test",
        image: "https://st3.depositphotos.com/2229436/13671/v/600/depositphotos_136717406-stock-illustration-flat-user-icon-member-sign.jpg"
    }
};

const articles: IArticle[] = [
    dislikedArticle,
    likedArticle,
    ownArticle,
    notOwnArticle,
    articleOfFollowedUser,
    articleOfNotFollowedUser
];

export const articlesResponse: IArticleResponse = { articles, articlesCount: 6 };