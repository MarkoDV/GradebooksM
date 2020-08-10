/// <reference types="Cypress"/> 
import {user} from '../fixtures/user';
import  {authPage} from '../integration/pageObject/loginPOM';
import {createGB} from '../integration/pageObject/creategbPOM';
const faker = require('faker');
let randomTitle = faker.random.word();
let randomIme = faker.name.findName();
let randomPrezime = faker.name.lastName();

describe('Create gradebook', ()=>{
    beforeEach(()=>{
        cy.visit('/');
        cy.server();
        cy.route(Cypress.env('apiUrl') + '/diaries?page=1').as('gb');
        cy.route(Cypress.env('apiUrl') + '/gradebooks').as('gbs');
        authPage.signin(user.email, user.password);
        cy.wait('@gb')
    });
    it('Add student without gradebook', ()=>{
        cy.get('.nav-link').contains('My Gradebook').should('be.visible').click();
        cy.get('.btn').contains('Add Student').should('be.visible').click();
        cy.get('.alert-danger')
          .should('have.text',`\n      Message: You dont have your diary. Please first set your own diary\n    `)
    });
    it('Create new GB', ()=>{
        createGB.creation('Litte Red Riding Hood');
        cy.url().should('eq', 'https://gradebook.vivifyideas.com/gradebooks')
    });
    it('GB, with student', ()=>{
        cy.get('.nav-link').contains('My Gradebook').click();
        cy.url().should('include', 'my-gradebook');
        cy.get('h3').should('contain.text', 'My Gradebook Page');
        cy.get('.btn').contains('Add Student').click();
        cy.url().should('include', 'add-student')
        cy.get('#firstName').type(randomIme);
        cy.get('#lastName').type(randomPrezime);
        cy.get('.btn').contains('Add image').click();
        cy.get('input[placeholder="Image URL"]').should('be.visible').type('https://i.pinimg.com/originals/23/52/f7/2352f71cba2c87344fc611b0e7ee7cb5.jpg');
        cy.get('.btn').contains('Submit').click();
    });
    it('Delete my gradebook', ()=>{
        cy.get('.nav-link').contains('My Gradebook').click();
        cy.url().should('include', 'my-gradebook');
        cy.get('.btn-danger').should('be.visible').click(); 
        cy.url().should('eq', 'https://gradebook.vivifyideas.com/gradebooks');
        cy.get('input[type=text]').should('be.visible').type('Little Red Riding');
        cy.get('.btn').contains('Search').should('be.visible').click();
        cy.contains('There is no more gradebooks in base, try again').should('be.visible')
    }); 
});