import { NgModule } from '@angular/core';
import { TestAttributeDirective } from './tests/test-attribute.directive';



@NgModule({
  declarations: [
    TestAttributeDirective,
  ],
  imports: [],
  exports: [
    TestAttributeDirective,
  ]
})
export class SharedModule { }