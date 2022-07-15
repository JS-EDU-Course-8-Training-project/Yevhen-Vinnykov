import { ArticlesService } from './../../../shared/services/articles/articles.service';
import { of } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagsComponent } from './tags.component';
import { By } from '@angular/platform-browser';
import { TestAttributes } from 'src/app/shared/tests/TestAttributes';
import { TestAttributeDirective } from 'src/app/shared/tests/test-attribute.directive';

class ArticlesServiceMock {
  public fetchTags = () => of(['test-tag', 'foo']);
}

describe('TAGS COMPONENT', () => {
  let component: TagsComponent;
  let fixture: ComponentFixture<TagsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TagsComponent, TestAttributeDirective],
      providers: [{ provide: ArticlesService, useClass: ArticlesServiceMock }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TagsComponent);
    component = fixture.componentInstance;
    component.tabIndex = 2;
    component.selectedTag = 'test-tag';
    fixture.detectChanges();
  });

  it('should fetch tags correctly', () => {
    fixture.detectChanges();
    expect(component.tags).toEqual(['test-tag', 'foo']);
  });

  it('should set selected tag to null', () => {
    component.tabIndex = 1;
    component.ngOnChanges();

    expect(component.selectedTag).toBeNull();
  });

  it('should not set selected tag to null', () => {
    fixture.detectChanges();
    expect(component.selectedTag).toBe('test-tag');
  });

  describe('SELECT TAG METHOD', () => {
    it('should select tag correctly', () => {
      const spy = spyOn(component, 'selectTag').and.callThrough();
      const [div1, div2] = fixture.debugElement.queryAll(
        By.css(`[data-test=${TestAttributes.Tag}]`)
      );

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
