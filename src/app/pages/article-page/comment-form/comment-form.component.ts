import { MatDialog } from '@angular/material/dialog';
import { EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Input, OnInit, Output } from '@angular/core';
import { CommentsService } from 'src/app/pages/article-page/services/comments/comments.service';
import { AuthorizationService } from 'src/app/shared/services/authorization/authorization.service';
import { TestedComponent } from 'src/app/shared/tests/TestedComponent';
import { ErrorDialogComponent } from 'src/app/components/error-dialog/error-dialog.component';

@Component({
  selector: 'app-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.scss'],
})
export class CommentFormComponent extends TestedComponent implements OnInit {
  @Input() slug!: string;
  @Input() image!: string;
  @Output() commentEventEmmiter: EventEmitter<void> = new EventEmitter();

  public commentForm!: FormGroup;
  public isAuth!: boolean;
  public isLoading = false;

  constructor(
    private commentsService: CommentsService,
    private fb: FormBuilder,
    private authorizationService: AuthorizationService,
    private dialog: MatDialog
  ) {
    super();
  }

  ngOnInit(): void {
    this.isAuth = this.authorizationService.isAuthorized$.getValue();

    this.commentForm = this.fb.group({
      body: ['', [Validators.required]],
    });
  }

  public async addComment(): Promise<void> {
    this.isLoading = true;
    this.commentForm.disable();
    const comment = this.commentForm.getRawValue().body;

    try {
      await this.commentsService.createComment(this.slug, comment);

      this.commentEventEmmiter.emit();
      this.commentForm.reset();
      this.commentForm.enable();
      this.isLoading = false;
    } catch (error) {
      this.onCatchError(error as string);
    }
  }
  
  private onCatchError(error: string): void {
    this.isLoading = false;
    this.dialog.open(ErrorDialogComponent, { data: error });
  }
}
