import { takeUntil, Subject } from 'rxjs';
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

  public async getComments(): Promise<void> {
    this.isLoading = true;
    try {
      const comments = await this.commentsService.fetchArticleComments(
        this.slug
      );
      this.comments = comments;
      this.isLoading = false;
    } catch (error) {
      this.onCatchError(error as string);
    }
  }

  public async deleteComment(id: string): Promise<void> {
    this.commentsBeingDeletedIds.push(id);
    try {
      await this.commentsService.removeComment(this.slug, id);
      this.getComments();
    } catch (error) {
      this.onCatchError(error as string);
    } finally {
      this.commentsBeingDeletedIds.pop();
    }
  }

  private onCatchError(error: string): void {
    this.isLoading = false;
    this.dialog.open(ErrorDialogComponent, { data: error });
  }
}
