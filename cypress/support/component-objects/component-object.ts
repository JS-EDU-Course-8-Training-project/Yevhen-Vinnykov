import { TestAttributes } from '../../../src/app/shared/tests/TestAttributes';

export class ComponentObject {
    constructor(private containerAttr: TestAttributes) { }

    public get itself() {
        return cy.getByTestAttr(this.containerAttr);
    }
}