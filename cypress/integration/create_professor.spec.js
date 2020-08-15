/// <reference types="Cypress"/> 
import {user} from '../fixtures/user';
import  {authPage} from './pageObject/loginPOM';
import {createGB} from './pageObject/creategbPOM';
import {studentGB} from './pageObject/studentPOM';
import {professorGB} from './pageObject/professorPOM'
const faker = require('faker');
let randomName = faker.name.findName();
let randomSurname = faker.name.lastName();

describe('Create Professor', ()=>{
    beforeEach(()=>{
        cy.visit('/');
        cy.server();
        cy.route(Cypress.env('apiUrl') + '/diaries?page=1').as('gb');
        cy.route(Cypress.env('apiUrl') + '/professors').as('allpro');
        authPage.signin(user.email, user.password);
        cy.wait('@gb')
    });
    it('TC 75 - Professors - Create Professor', ()=>{
        cy.get('#navbardrop').click();
        cy.get('.nav-item').contains('Create Professor').click();
        cy.url().should('include', 'create-professor');
        professorGB.createProf('Tom', 'Waits', 'https://i.pinimg.com/564x/be/cd/52/becd52f1b4e40426b6fb75feef2fbfbc.jpg');
        cy.wait('@allpro');
        cy.scrollTo('bottom');
        cy.url().should('include', 'all-professors');
    });
    it('TC 76 - Professors - Create Professor without adding image', ()=>{
        cy.get('#navbardrop').click();
        cy.get('.nav-item').contains('Create Professor').click();
        cy.url().should('include', 'create-professor');
        cy.get('#firstName').type(randomName);
        cy.get('#lastName').type(randomSurname);
        cy.get('.btn-primary').contains('Add images').click();
        cy.get('input[placeholder="Image URL"]').invoke('val', '');
        cy.get('.btn-primary').contains('Submit');
        cy.get('input[placeholder="Image URL"]').then(($input) => {
            expect($input[0].validationMessage).to.eq('Please fill in this field.');
        });
    });
    it('TC 73 - Professors filter', ()=>{
        cy.get('#navbardrop').click();
        cy.get('.nav-item').contains('All Professors').click();
        cy.url().should('include', 'all-professors');
        //mora delay jer ako ne stavim ostane samo crna tabla sa thead bez podataka u row ispod o izbranom autoru(useru)
        cy.get('input[type=text').type('Tom', {delay:100});
        cy.scrollTo('bottom');
    });
});