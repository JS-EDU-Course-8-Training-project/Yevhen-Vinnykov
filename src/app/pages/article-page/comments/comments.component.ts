import { takeUntil, Subject, Observable, of, catchError } from 'rxjs';
import { IComment } from 'src/app/shared/models/IComment';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommentsService } from '../services/comments/comments.service';
import { IExistingUser } from 'src/app/shared/models/IExistingUser';
import { TestedComponent } from 'src/app/shared/tests/TestedComponent';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from 'src/app/components/error-dialog/error-dialog.component';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
})
export class CommentsComponent
  extends TestedComponent
  implements OnInit, OnDestroy
{
  @Input() slug!: string;
  @Input() authUser!: IExistingUser;
  @Input() requestForComments$!: Subject<void>;

  public comments!: IComment[];
  public commentsBeingDeletedIds: string[] = [];
  private notifier: Subject<void> = new Subject<void>();
  public isLoading!: boolean;

  constructor(
    private commentsService: CommentsService,
    private dialog: MatDialog
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
    this.isLoading = true;
    this.commentsService
      .fetchArticleComments(this.slug)
      .pipe(
        takeUntil(this.notifier),
        catchError((err: string) => this.onCatchError(err))
      )
      .subscribe((comments: IComment[]) => {
        this.comments = comments;
        this.isLoading = false;
      });
  }

  public deleteComment(id: string): void {
    this.commentsBeingDeletedIds.push(id);

    this.commentsService
      .removeComment(this.slug, id)
      .pipe(
        takeUntil(this.notifier),
        catchError((err: string) => this.onCatchError(err))
      )
      .subscribe(() => {
        this.getComments();
        this.commentsBeingDeletedIds.pop();
      });
  }

  private onCatchError(error: string): Observable<IComment[]> {
    this.isLoading = false;
    this.dialog.open(ErrorDialogComponent, { data: error });

    return of([]);
  }
}