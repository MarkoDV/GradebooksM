/// <reference types="Cypress"/> 
import {user} from '../fixtures/user';
import  {authPage} from '../integration/pageObject/loginPOM';
import {createGB} from '../integration/pageObject/creategbPOM';

describe('Create gradebook', ()=>{
    beforeEach(()=>{
        cy.visit('/');
        cy.server();
        cy.route(Cypress.env('apiUrl') + '/diaries?page=1').as('gb');
        cy.route(Cypress.env('apiUrl') + '/create-gradebook').as('createGB');
        authPage.signin(user.email, user.password);
        cy.wait('@gb')
    });
    it('Create new GB', ()=>{
        createGB.creation('Red riding');
        cy.url().should('eq', 'https://gradebook.vivifyideas.com/gradebooks')
    })
});