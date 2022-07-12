import { TestAttributes } from '../../../src/app/shared/tests/TestAttributes';

type containerAttr = typeof TestAttributes[keyof typeof TestAttributes];

export class ComponentObject {
    constructor(private containerAttr: containerAttr) { }

    public get itself() {
        return cy.getByTestAttr(this.containerAttr);
    }
}