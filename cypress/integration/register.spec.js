/// <reference types="cypress" />
import { regPage } from '../integration/pageObject/registerPOM'
const faker = require('faker');
let prvoIme = faker.name.findName();
let prezIme = faker.name.lastName();
let randomEmail = faker.internet.email();
let randomPassword = faker.internet.password();

describe('Registration on Gradebook HomePage', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.get('.nav-link').contains('Register').should('be.visible').click();
    })
    it.skip('Should be registered', () => {
        regPage.register('Isadora', 'Duncan', 'angelaisadoraduncan1877', 'angelaisadoraduncan1877', 'Clarabelle55@yahoo.com');
        cy.url().should('be.eq', 'https://gradebook.vivifyideas.com/gradebooks');
        cy.get('.nav-link').contains('Sign out').should('be.visible');
    });
    it('Confirmation password doesn`t match', () => {
        regPage.register(prvoIme, prezIme, randomPassword, 'angelaisadoraduncan1877', randomEmail);
        //it is not possible to find class for alert popup and this message for confirmation password is not integral part of html input fileds
        cy.on('window:alert', (str) => {
            expect(str).to.equal('Your passwords doesn`t match, try again, please');
        });
    });
    it('Register-First name input field: required', () => {
        //cy.type() cannot accept an empty String, I want to set the value of an input as an empty string:
        cy.get('#firstName').invoke('val', '');
        cy.get('#lastName').type(prezIme);
        cy.get('#password').type(randomPassword);
        cy.get('#passwordConfirmation').type(randomPassword);
        cy.get('#email').type(randomEmail);
        cy.get('button[type=submit]').click();
        cy.get('#firstName').then(($input) => {
            expect($input[0].validationMessage).to.eq('Please fill in this field.');
        });
    });
    it('Register-Last name input field: required', () => {
        cy.get('#firstName').type(prvoIme);
        //same as for the input filed firstName:
        cy.get('#lastName').invoke('val', '');
        cy.get('#password').type(randomPassword);
        cy.get('#passwordConfirmation').type(randomPassword);
        cy.get('#email').type(randomEmail);
        cy.get('button[type=submit]').click();
        cy.get('#lastName').then(($input) => {
            expect($input[0].validationMessage).to.eq('Please fill in this field.');
        });
    });
    it('Password form-password has less then 8 characters', () => {
        regPage.register(prvoIme, prezIme, '1234567', '1234567', randomEmail)
        cy.get('#password').then(($input) => {
            expect($input[0].validationMessage).to.eq('Please match the format requested.');
        });
    });
    it.skip('User can register twice and more', () => {
        regPage.register('Marko', 'Davidovic', '12345678', '12345678', 'macanes02@gmail.com');
    });
}); 