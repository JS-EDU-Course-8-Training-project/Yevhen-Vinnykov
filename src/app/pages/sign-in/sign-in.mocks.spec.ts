import { HttpErrorResponse, HttpHeaders, HttpEventType } from "@angular/common/http";
import { of, throwError } from "rxjs";
import { IExistingUser } from "src/app/shared/models/IExistingUser";
import { IUserData } from "src/app/shared/models/IUserData";

export const dataMock: IUserData = {
    email: 'test-user@example.com',
    password: 'test-password'
};

export const userMock: IExistingUser = {
    email: 'test-user@example.com',
    password: 'test-password',
    bio: null,
    image: '',
    username: 'test-username'
};

export const mockError: HttpErrorResponse = {
    error: {
        errors: {
            'email': ['is wrong']
        }
    },
    name: 'HttpErrorResponse',
    message: '',
    ok: false,
    headers: new HttpHeaders,
    status: 0,
    statusText: '',
    url: null,
    type: HttpEventType.ResponseHeader
};

export class RedirectionServiceMock {
    public redirectHome = () => new Promise<boolean>((resolve, reject) => resolve(true));
}

export class UsersServiceMock {
    public signIn = (data: IUserData) => of(userMock);
}

export class UsersServiceMockWithError {
    public signIn = (data: IUserData) => throwError(() => mockError);
}