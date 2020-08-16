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
    it.skip('TC 11 - Register - valid registration', () => {
        regPage.register('Isadora', 'Duncan', 'angelaisadoraduncan1877', 'angelaisadoraduncan1877', 'Clarabelle55@yahoo.com');
        cy.url().should('be.eq', 'https://gradebook.vivifyideas.com/gradebooks');
        cy.get('.nav-link').contains('Sign out').should('be.visible');
    });
    it('TC 13 - Registration - First name input filed required', () => {
        //cy.type() cannot accept an empty String, I want to set the value of an input as an empty string:
        cy.get('#firstName').invoke('val', '');
        cy.get('#lastName').type(prezIme);
        cy.get('#password').type(randomPassword);
        cy.get('#passwordConfirmation').type(randomPassword);
        cy.get('#email').type(randomEmail);
        cy.get('#termsAndConditions').uncheck();
        cy.get('#termsAndConditions').check();
        cy.get('button[type=submit]').click();
        cy.get('#firstName').then(($input) => {
            expect($input[0].validationMessage).to.eq('Please fill in this field.');
        });
    });
    it('TC 14 - Registration - Last name input filed required', () => {
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
    it('TC 15 - Registration - Email input filed required', ()=>{
        cy.get('#firstName').type(prvoIme);
        cy.get('#lastName').type(prezIme);
        cy.get('#password').type(randomPassword);
        cy.get('#passwordConfirmation').type(randomPassword);
        cy.get('#email').invoke('val', '');
        cy.get('button[type=submit]').click();
        cy.get('#email').then(($input) => {
            expect($input[0].validationMessage).to.eq('Please fill in this field.');
        });
    });
    it('TC 16 - Registration - Email with invalid format (NO @ CHARACTER)', ()=>{
        regPage.register('Isadora', 'Duncan', 'angelaisadoraduncan1877', 'angelaisadoraduncan1877', 'Clarabelle55.yahoo.com');
        cy.get('#email').then(($input) => {
            expect($input[0].validationMessage).to.include("Please include an '@' in the email address. 'Clarabelle55.yahoo.com' is missing an '@'.");
        });
    });
    it('TC 22 - Registration - Password Confirmation input field stays empty, without entries', ()=>{
        cy.get('#firstName').type(prvoIme);
        cy.get('#lastName').type(prezIme);
        cy.get('#password').type(randomPassword);
        cy.get('#passwordConfirmation').invoke('val', '');
        cy.get('#email').type(randomEmail);
        cy.get('button[type=submit]').click();
        cy.on('window:alert', (str) => {
            expect(str).to.equal('Your passwords doesn`t match, try again, please');
        });
    });
    it('TC 23 - Registration - Password Confirmation does not match', () => {
        regPage.register(prvoIme, prezIme, randomPassword, 'angelaisadoraduncan1877', randomEmail);
        //it is not possible to find class for alert popup and this message for confirmation password is not integral part of html input fileds
        cy.on('window:alert', (str) => {
            expect(str).to.equal('Your passwords doesn`t match, try again, please');
        });
    });
    it('TC 24 - Registration - A minimum 8 characters password, password pattern rule', () => {
        regPage.register(prvoIme, prezIme, '1234567', '1234567', randomEmail)
        cy.get('#password').then(($input) => {
            expect($input[0].validationMessage).to.eq('Please match the format requested.');
        });
    });
    it('TC 29 - Reload page buton', ()=>{
        cy.reload();
        cy.get('center').eq(0).should('contain.html', 'h1').and('contain.text', '404 Not Found')
    })
    it('TC 12 - Register with the same credentials twice', () => {
        regPage.register('Marko', 'Davidovic', '12345678', '12345678', 'macanes02@gmail.com');
        cy.url().should('include', 'gradebooks');
    });
}); 