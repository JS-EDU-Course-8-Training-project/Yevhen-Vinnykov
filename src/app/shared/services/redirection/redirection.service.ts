import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RedirectionService {
  constructor(private router: Router) {}

  public redirectUnauthorized(): void {
    this.router.navigateByUrl('/sign-in').catch((err: any) => console.log(err));
  }

  public redirectToEditArticle(slug: string): void {
    this.router
      .navigateByUrl(`/edit-article/${slug}`)
      .catch((err) => console.log(err));
  }

  public redirectHome(): void {
    this.router.navigateByUrl('').catch((err: any) => console.log(err));
  }

  public redirectByUrl(url: string): void {
    this.router.navigateByUrl(url).catch((err: any) => console.log(err));
  }
}
