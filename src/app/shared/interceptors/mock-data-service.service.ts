import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class MockDataService {
  ROOT_URL = `http://jsonplaceholder.typicode.com`;

  constructor(private http: HttpClient) {}

  getPosts() {
    return this.http.get<string[]>(`${this.ROOT_URL}/posts`);
  }
}
