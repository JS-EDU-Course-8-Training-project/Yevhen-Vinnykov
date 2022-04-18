import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ArticlesService } from 'src/app/services/articles.service';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent implements OnInit {
  @Output() selectedTagEmmiter: EventEmitter<string> = new EventEmitter();
  tags: string[] = [];
  isLoading: boolean = false;

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
  }


}
