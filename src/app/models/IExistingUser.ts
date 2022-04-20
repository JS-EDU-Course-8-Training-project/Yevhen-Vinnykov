export interface IExistingUser{
        email: string;
        username: string;
        bio: string | null;
        image: string;
        token?: string;
        password?: string;
}
