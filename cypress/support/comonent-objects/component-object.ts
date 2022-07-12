import { TestAttributes } from '../../../src/app/shared/tests/TestAttributes';

export class ComponentObject {
    constructor(private containerAttr: keyof typeof TestAttributes) { }

    public get itself() {
        return cy.getByTestAttr(this.containerAttr);
    }
}