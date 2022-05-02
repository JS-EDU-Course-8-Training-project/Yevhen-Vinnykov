import { ArticlesService } from './../../../shared/services/articles/articles.service';
import { of } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagsComponent } from './tags.component';
import { By } from '@angular/platform-browser';


class ArticlesServiceMock {
  public fetchTags = (tag: string, offset: number, limit: number) => of(['test-tag', 'foo']);
}

describe('TagsComponent', () => {
  let component: TagsComponent;
  let fixture: ComponentFixture<TagsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TagsComponent ],
      providers: [
        { provide: ArticlesService, useClass: ArticlesServiceMock}
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TagsComponent);
    component = fixture.componentInstance;
    component.tabIndex = 2;
    component.selectedTag = 'test-tag';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch tags correctly', () => {
    component.ngOnInit();
    expect(component.tags).toEqual(['test-tag', 'foo']);
  });

  it('should set selected tag to null', () => {
    component.tabIndex = 1;
    component.ngOnChanges();
    expect(component.selectedTag).toBeNull();
  });

  it('should not set selected tag to null', () => {
    component.ngOnChanges();
    expect(component.selectedTag).toBe('test-tag');
  });

  describe('selectTag method', () => {

    it('should select tag correctly', () => {
      const spy = spyOn(component, 'selectTag').and.callThrough();
      component.ngOnChanges();
      const [div1, div2] = fixture.debugElement.queryAll(By.css('[data-angular="test-tag-div"]'));
      div2.triggerEventHandler('click', null);
      fixture.detectChanges();
      expect(component.selectedTag).toBe('foo');
      expect(div2.nativeElement.innerText).toBe('foo');
      expect(div2.nativeElement.className).toBe('tag-item selected');
      expect(div1.nativeElement.innerText).toBe('test-tag');
      expect(div1.nativeElement.className).toBe('tag-item');
      div1.triggerEventHandler('click', null);
      fixture.detectChanges();
      expect(div1.nativeElement.className).toBe('tag-item selected');
      expect(div2.nativeElement.className).toBe('tag-item');
      expect(component.selectedTag).toBe('test-tag');
      expect(spy).toHaveBeenCalledTimes(2);
    });
    
  });

});
