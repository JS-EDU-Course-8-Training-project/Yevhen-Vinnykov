import { Subject, takeUntil } from 'rxjs';
import { EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Input, OnInit, Output } from '@angular/core';
import { CommentsService } from 'src/app/pages/article-page/services/comments/comments.service';
import { AuthorizationService } from 'src/app/shared/services/authorization/authorization.service';

@Component({
  selector: 'app-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.scss']
})
export class CommentFormComponent implements OnInit {
  @Input() slug!: string;
  @Input() image!: string;
  @Output() commentEventEmmiter: EventEmitter<any> = new EventEmitter();

  public commentForm!: FormGroup;
  public isAuthorized!: boolean;
  private notifier: Subject<void> = new Subject<void>();
  public isLoading: boolean = false;

  constructor(
    private commentsService: CommentsService,
    private fb: FormBuilder,
    private authorizationService: AuthorizationService
  ) { }

  ngOnInit(): void {
    this.authorizationService.isAuthorized$
      .pipe(takeUntil(this.notifier))
      .subscribe(isAuthorized => this.isAuthorized = isAuthorized);
    this.commentForm = this.fb.group({
      body: ['', [Validators.required]]
    });
  }

  ngOnDestroy(): void {
    this.notifier.next();
    this.notifier.complete();
  }

  private createCommentData(): { body: string } {
    return { body: this.commentForm.getRawValue().body };
  }

  public addComment(): void {
    if (!this.commentForm.valid) return;
    this.isLoading = true;
    this.commentForm.disable();
    this.commentsService.createComment(this.slug, this.createCommentData())
      .pipe(takeUntil(this.notifier))
      .subscribe(() => {
        this.commentEventEmmiter.emit();
        this.commentForm.reset();
        this.isLoading = false;
        this.commentForm.enable();
      });
  }
}



