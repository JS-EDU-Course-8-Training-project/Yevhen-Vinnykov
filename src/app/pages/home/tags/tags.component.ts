import { Subject, takeUntil } from 'rxjs';
import { Component, Input, OnInit, Output, EventEmitter, OnChanges, OnDestroy } from '@angular/core';
import { ArticlesService } from 'src/app/shared/services/articles/articles.service';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent implements OnInit, OnChanges, OnDestroy {
  @Input() tabIndex!: number;
  @Output() selectedTagEmmiter: EventEmitter<string> = new EventEmitter();

  public tags: string[] = [];
  public isLoading: boolean = false;
  public selectedTag!: string | null;
  private notifier: Subject<void> = new Subject<void>();

  constructor(
    private articlesService: ArticlesService
  ) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.articlesService.fetchTags()
      .pipe(takeUntil(this.notifier))
      .subscribe((tags: string[] | any) => {
        if (tags as string[]) {
          this.tags = tags
          this.isLoading = false;
        }
      });
  }

  ngOnDestroy(): void {
    this.notifier.next();
    this.notifier.complete();
  }

  ngOnChanges() {
    if (this.tabIndex !== 2) {
      this.selectedTag = null;
    }
  }

  public selectTag(tag: string): void {
    this.selectedTagEmmiter.emit(tag);
    this.selectedTag = tag;
  }
}
