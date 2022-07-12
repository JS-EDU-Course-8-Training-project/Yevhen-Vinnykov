import { TestAttributes } from '../../../src/app/shared/tests/TestAttributes.old';

export class ComponentObject {
    constructor(private containerAttr: TestAttributes) { }

    public get itself() {
        return cy.getByTestAttr(this.containerAttr);
    }
}