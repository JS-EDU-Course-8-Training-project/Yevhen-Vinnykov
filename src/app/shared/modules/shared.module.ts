import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatModule } from './mat.module';
import { TestAttributeDirective } from '../tests/test-attribute.directive';

@NgModule({
  declarations: [TestAttributeDirective],
  imports: [ReactiveFormsModule, MatModule, CommonModule],
  exports: [
    TestAttributeDirective,
    ReactiveFormsModule,
    MatModule,
    CommonModule,
  ],
})
export class SharedModule {}
