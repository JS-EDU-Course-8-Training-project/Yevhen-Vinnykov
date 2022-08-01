import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  OnChanges,
} from '@angular/core';
import { ArticlesService } from 'src/app/shared/services/articles/articles.service';
import { TestedComponent } from 'src/app/shared/tests/TestedComponent';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss'],
})
export class TagsComponent
  extends TestedComponent
  implements OnInit, OnChanges
{
  @Input() tabIndex!: number;
  @Output() selectedTagEmmiter: EventEmitter<string> = new EventEmitter();

  public tags: string[] = [];
  public isLoading = false;
  public selectedTag!: string | null;

  constructor(private articlesService: ArticlesService) {
    super();
  }

  ngOnInit(): void {
    this.setTags();
  }

  ngOnChanges() {
    if (this.tabIndex !== 2) {
      this.selectedTag = null;
    }
  }

  private async setTags(): Promise<void> {
    this.isLoading = true;
    this.tags = await this.articlesService.fetchTags();
    this.isLoading = false;
  }

  public selectTag(tag: string): void {
    this.selectedTagEmmiter.emit(tag);
    this.selectedTag = tag;
  }
}
