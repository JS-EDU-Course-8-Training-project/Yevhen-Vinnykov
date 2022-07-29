import { Subject } from 'rxjs';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommentsService } from '../services/comments/comments.service';
import { IExistingUser } from 'src/app/shared/models/IExistingUser';
import { TestedComponent } from 'src/app/shared/tests/TestedComponent';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from 'src/app/components/error-dialog/error-dialog.component';
import { CommentsStore } from '../services/comments/comments.store';

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

  public commentsBeingDeletedIds: string[] = [];
  private notifier: Subject<void> = new Subject<void>();
  public isLoading!: boolean;

  constructor(
    private commentsService: CommentsService,
    public store: CommentsStore,
    private dialog: MatDialog
  ) {
    super();
  }

  ngOnInit(): void {
    this.getComments();
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
      this.store.comments$.next(comments);
      this.isLoading = false;
    } catch (error) {
      this.onCatchError(error as string);
    }
  }

  public async deleteComment(id: string): Promise<void> {
    this.isLoading = true;
    this.commentsBeingDeletedIds.push(id);
    try {
      await this.commentsService.removeComment(this.slug, id);
      await this.getComments();
      this.commentsBeingDeletedIds.pop();
    } catch (error) {
      this.onCatchError(error as string);
    }
  }

  private onCatchError(error: string): void {
    this.isLoading = false;
    this.dialog.open(ErrorDialogComponent, { data: error });
  }
}
