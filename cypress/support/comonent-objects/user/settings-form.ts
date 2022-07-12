import { TestAttributes } from "src/app/shared/tests/TestAttributes.old";

class SettingsForm {
    get username() {
        return cy.getByTestAttr(TestAttributes.UsernameInput);
    }

    get email() {
        return cy.getByTestAttr(TestAttributes.EmailInput);
    }

    get password() {
        return cy.getByTestAttr(TestAttributes.PasswordInput);
    }

    get image() {
        return cy.getByTestAttr(TestAttributes.ImageInput);
    }

    get bio() {
        return cy.getByTestAttr(TestAttributes.BioInput);
    }

    get formError() {
        return cy.getByTestAttr(TestAttributes.FormError);
    }

    get updateButton() {
        return cy.getByTestAttr(TestAttributes.SettingsUpdateBtn);
    }

    get logoutButton() {
        return cy.getByTestAttr(TestAttributes.SettingsLogoutBtn);
    }
}

export const settingsForm = new SettingsForm();