import { ArticlesService } from './../../../shared/services/articles/articles.service';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TagsComponent } from './tags.component';
import { By } from '@angular/platform-browser';
import { TestAttributes } from 'src/app/shared/tests/TestAttributes';
import { TestAttributeDirective } from 'src/app/shared/tests/test-attribute.directive';

class ArticlesServiceMock {
  public fetchTags = () =>
    new Promise((resolve) => resolve(['tagOne', 'tagTwo']));
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
    fixture.detectChanges();
  });

  it('should fetch tags correctly', waitForAsync(() => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.tags).toEqual(['tagOne', 'tagTwo']);
    });
  }));

  it('should set selected tag to null', () => {
    component.tabIndex = 1;
    component.ngOnChanges();

    expect(component.selectedTag).toBeNull();
  });

  it('should set selected tag on click', waitForAsync(() => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();

      const [tagOneElement, tagTwoElement] = fixture.debugElement.queryAll(
        By.css(`[data-test=${TestAttributes.Tag}]`)
      );
      tagOneElement.triggerEventHandler('click', null);
      fixture.detectChanges();

      expect(component.selectedTag).toBe('tagOne');
      expect(tagOneElement.nativeElement.innerText).toBe('tagOne');
      expect(tagOneElement.nativeElement.className).toContain('selected');
      expect(tagTwoElement.nativeElement.className).not.toContain('selected');
    });
  }));
});
