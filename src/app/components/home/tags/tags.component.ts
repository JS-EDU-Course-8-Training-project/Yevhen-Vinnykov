import { Component, Input, OnInit, Output, EventEmitter, OnChanges } from '@angular/core';
import { ArticlesService } from 'src/app/services/articles.service';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent implements OnInit, OnChanges {
  @Input() tabIndex!: number;
  @Output() selectedTagEmmiter: EventEmitter<string> = new EventEmitter();
  tags: string[] = [];
  isLoading: boolean = false;
  selectedTag!: string | null;

  constructor(private articlesService: ArticlesService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.articlesService.fetchTags().subscribe(tags => {
      this.tags = tags
      this.isLoading = false;
    });
  }

  selectTag(tag: string): void {
    this.selectedTagEmmiter.emit(tag);
    this.selectedTag = tag;
  }

  ngOnChanges() {
    if(this.tabIndex !== 2) {
      this.selectedTag = null;
    }
  }


}
