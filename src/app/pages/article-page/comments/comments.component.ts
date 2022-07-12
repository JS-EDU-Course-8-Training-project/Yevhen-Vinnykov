import { HttpErrorResponse } from '@angular/common/http';
import { takeUntil, Subject } from 'rxjs';
import { IComment } from 'src/app/shared/models/IComment';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommentsService } from '../services/comments/comments.service';
import { IExistingUser } from 'src/app/shared/models/IExistingUser';
import { TestedComponent } from 'src/app/shared/tests/TestedComponent';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent extends TestedComponent implements OnInit, OnDestroy {
  @Input() slug!: string;
  @Input() authUser!: IExistingUser;
  @Input() requestForComments$!: Subject<void>;

  public comments!: IComment[];
  public commentsBeingDeletedIds: string[] = [];
  private notifier: Subject<void> = new Subject<void>();
  public isLoaded!: boolean;

  constructor(
    private commentsService: CommentsService
  ) {
    super();
  }

  ngOnInit(): void {
    this.getComments();
    this.requestForComments$
      .pipe(takeUntil(this.notifier))
      .subscribe(() => this.getComments());
  }

  ngOnDestroy(): void {
    this.notifier.next();
    this.notifier.complete();
  }

  public getComments(): void {
    this.isLoaded = false;
    this.commentsService.fetchArticleComments(this.slug)
      .pipe(takeUntil(this.notifier))
      .subscribe((comments) => {
        if (!(comments instanceof HttpErrorResponse)) {
          this.comments = comments;
          this.isLoaded = true;
        }
      });
  }

  public deleteComment(id: string): void {
    const commentToBeDeletedId: string | undefined = this.comments.find(c => c.id === id)?.id;
    if (!commentToBeDeletedId) return;

    this.commentsBeingDeletedIds.push(commentToBeDeletedId);

    this.commentsService.removeComment(this.slug, id)
      .pipe(takeUntil(this.notifier))
      .subscribe(() => {
        this.getComments();
        this.commentsBeingDeletedIds.pop();
      });
  }

}
