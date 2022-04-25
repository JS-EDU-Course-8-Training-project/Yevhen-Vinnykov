import { EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Component, Input, OnInit, Output } from '@angular/core';
import { CommentsService } from 'src/app/services/comments.service';

@Component({
  selector: 'app-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.scss']
})
export class CommentFormComponent implements OnInit {
  @Input() slug!: string;
  @Input() image!: string;
  @Output() commentEventEmmiter: EventEmitter<any> = new EventEmitter();
  public commentForm: any;
  public isAuthorized: boolean = localStorage.getItem('authorized') === 'true';
  constructor(
    private commentsService: CommentsService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.commentForm = this.fb.group({
      body: ['', [Validators.required]]
    });
  }

  public addComment(): void {
    const newComment = {
      body: this.commentForm.getRawValue().body,
    };
    if (this.commentForm.status === 'VALID') {
      this.commentsService.createComment(this.slug, newComment).subscribe(comment => {
        this.commentEventEmmiter.emit();
        this.commentForm.reset();
      });
    }
  }
}



