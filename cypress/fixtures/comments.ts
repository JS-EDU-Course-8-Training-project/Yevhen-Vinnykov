import { IComment } from 'src/app/shared/models/IComment';

export const comments: IComment[] = [
    {
        id: "629b8e492856b8bc95d945d2",
        body: "This is my comment",
        author: {
            username: "John",
            bio: "bio",
            image: "https://st3.depositphotos.com/2229436/13671/v/600/depositphotos_136717406-stock-illustration-flat-user-icon-member-sign.jpg",
            following: false,
        },
        article: "6297b6650c045b2b09a59f54",
        createdAt: "2022-06-04T16:54:33.937+00:00",
        updatedAt: "2022-06-04T16:54:33.937+00:00"
    }
];