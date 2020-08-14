/// <reference types="Cypress"/> 
import {user} from '../fixtures/user';
import {gradebook} from '../fixtures/gradebook'
import  {authPage} from './pageObject/loginPOM';
import {createGB} from './pageObject/creategbPOM';
import {studentGB} from './pageObject/studentPOM'
const faker = require('faker');
let alphanum = faker.random.alphaNumeric(255);

describe('Visit and modify another author gradebook', ()=>{
    beforeEach(()=>{
        cy.visit('/')
        cy.server();
        cy.route('GET', Cypress.env('apiUrl') + '/diaries?page=1').as('gb');
        cy.get('.nav-link').contains('Sign in').click();
        authPage.signin(user.email, user.password);
        cy.wait('@gb')
        cy.url().should('be.eq', 'https://gradebook.vivifyideas.com/gradebooks');
    });
    it('TC 31 - Visit Single Gradebebook Page of another author-professor', ()=>{
        cy.get('.table-dark th').eq(0).should('contain', 'Gradebook');
        cy.get('.table-dark th').eq(2).should('contain.text', 'Created at');
        cy.get('.table-dark td').eq(0).click();
        cy.url().should('include', 'single-gradebook');
    });
    it('TC 34 - Add Student to Gradebook of other professor(author) with image',()=>{
        cy.get('.table-dark td').eq(0).click();
        cy.url().should('include', 'single-gradebook');
        studentGB.studentAdd('Sergei', 'Yesenin', 'https://glamourprin.files.wordpress.com/2018/01/230px-esenin_moscow_1922.jpg');
        cy.url().should('include', 'single-gradebook');
    });
    it('TC 35 - Edit Gradebook of the other author( title and professor)',()=>{
        cy.get('.table-dark td').eq(0).click();
        cy.url().should('include', 'single-gradebook');
        cy.get('.btn-warning').contains('Edit Gradebook').click();
        cy.url().should('contain', 'single-gradebook');
        cy.get('#title').clear().type('Odd new odd gradebook');
        cy.get('#professor')
            .then(function ($select) {
                let value = $select[0].value;
                cy.get('#professor').select(value, { force: true });
            });
        cy.get('.btn-primary').contains('Submit').click();
    });
    it('TC 38 - Write comment at the Single Gradebook Page from other author (255 characters)',()=>{
        cy.get('.table-dark td').eq(0).click();
        cy.url().should('include', 'single-gradebook');
        cy.get('textarea')
          .should('be.visible')
          .and('have.attr', 'placeholder', 'Writte your comment')
          .type(alphanum);
        cy.get('.btn-primary').contains('Submit Comment').should('be.visible').click();
    });
    it('TC 41 - Delete comment written by user on Single Gradebook Page of other author',()=>{
        cy.get('.table-dark td').eq(0).click();
        cy.url().should('include', 'single-gradebook');
        cy.get('.btn-danger').last().contains('Delete').click();
    });
    it('TC 43 - Delete Gradebook of other author(professor)', ()=>{
        cy.get('.table-dark td').eq(0).click();
        cy.url().should('include', 'single-gradebook');
        cy.get('.btn-danger').contains('Delete Gradebook').click(); 
    });
    it('TC 46 - Gradebook Filter - click on the Professor name of the filtered gradebook', ()=>{
        cy.get('.table-dark td').eq(1).click();
        cy.url().should('contain', 'single-professor');
    });
});
