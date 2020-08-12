/// <reference types="Cypress"/> 
import {user} from '../fixtures/user';
import  {authPage} from './pageObject/loginPOM';
import {createGB} from './pageObject/creategbPOM';
import {studentGB} from './pageObject/studentPOM'
const faker = require('faker');
let randomTitle = faker.random.word();
let randomName = faker.name.findName();
let randomSurname = faker.name.lastName();
//nije korisceno jer nema odakle da povuce img iz servera, nego konkretna slika
let randomImg = faker.image.imageUrl();

describe('Create, read, edit, add student and delete gradebook', ()=>{
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
    it('Create new gradebook', ()=>{
        cy.get('.nav-link').contains('Create Gradebook').should('be.visible').click();
        createGB.creation('Litte Red Riding Hood');
        cy.url().should('eq', 'https://gradebook.vivifyideas.com/gradebooks');
    });
    it('Edit gradebook', ()=>{
        cy.get('.nav-link').contains('My Gradebook').click();
        cy.url().should('include', 'my-gradebook');
        cy.get('.btn-warning').contains('Edit Gradebook').should('be.visible').click();
        createGB.creation(randomTitle);
        cy.url().should('eq', 'https://gradebook.vivifyideas.com/gradebooks');
    });
    it('Gradebook, with student', ()=>{
        cy.get('.nav-link').contains('My Gradebook').click();
        cy.url().should('include', 'my-gradebook');
        studentGB.studentAdd(randomName, randomSurname, 'https://i.pinimg.com/originals/23/52/f7/2352f71cba2c87344fc611b0e7ee7cb5.jpg');
        cy.url().should('include', 'single-gradebook');  
    });
    it('Delete my gradebook', ()=>{
        cy.get('.nav-link').contains('My Gradebook').click();
        cy.url().should('include', 'my-gradebook');
        cy.get('.btn-danger').should('be.visible').click(); 
        cy.url().should('eq', 'https://gradebook.vivifyideas.com/gradebooks');
        cy.get('input[type=text]').should('be.visible').type('Little Red');
        cy.get('.btn').contains('Search').should('be.visible').click();
        cy.contains('There is no more gradebooks in base, try again').should('be.visible');
    }); 
});