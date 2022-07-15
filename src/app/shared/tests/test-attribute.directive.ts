import { Directive, ElementRef, Input, isDevMode } from '@angular/core';
import { TestAttributes } from './TestAttributes';

type value = typeof TestAttributes[keyof typeof TestAttributes];

@Directive({
  selector: '[e2e]',
})
export class TestAttributeDirective {
  constructor(private element: ElementRef) {}

  @Input('e2e') public set testAttribute(value: value) {
    if (isDevMode()) {
      this.element.nativeElement.setAttribute('data-test', value);
    }
  }
}
