/// <reference types="Cypress"/> 
import {user} from '../fixtures/user';
import  {authPage} from './pageObject/loginPOM';
import {createGB} from './pageObject/creategbPOM';
import {studentGB} from './pageObject/studentPOM';
import {professorGB} from './pageObject/professorPOM'
const faker = require('faker');
let randomName = faker.name.findName();
let randomSurname = faker.name.lastName();

describe('Add students', ()=>{
    beforeEach(()=>{
        cy.visit('/');
        cy.server();
        cy.route(Cypress.env('apiUrl') + '/diaries?page=1').as('gb');
        authPage.signin(user.email, user.password);
        cy.wait('@gb')
    });
    it('TC 66 - Add student without gradebook', ()=>{
        cy.get('.nav-link').contains('My Gradebook').should('be.visible').click();
        cy.get('.btn').contains('Add Student').should('be.visible').click();
        cy.get('.alert-danger')
          .should('have.text',`\n      Message: You dont have your diary. Please first set your own diary\n    `)
    });
    it('TC 51 - Create new gradebook', ()=>{
        cy.get('.nav-link').contains('Create Gradebook').should('be.visible').click();
        createGB.creation('Litte Red Riding Hood');
        cy.wait('@gb');
    });
    it('TC 55 - Add Student to Gradebook', ()=>{
        cy.get('.nav-link').contains('My Gradebook').click();
        cy.url().should('include', 'my-gradebook');
        studentGB.studentAdd(randomName, randomSurname, 'https://i.pinimg.com/originals/23/52/f7/2352f71cba2c87344fc611b0e7ee7cb5.jpg');
        cy.url().should('include', 'single-gradebook');  
    });
    it('TC 55 multiple - Gradebook, with 3 new student', ()=>{
        cy.get('.nav-link').contains('My Gradebook').click();
        cy.url().should('include', 'my-gradebook');
        for (let i=0; i<3; i++) {
            studentGB.studentAdd(randomName, randomSurname, 'https://i.pinimg.com/originals/23/52/f7/2352f71cba2c87344fc611b0e7ee7cb5.jpg'); 
            cy.url().should('include', 'single-gradebook'); 
        }; 
    });
    it('TC 65 - Delete my gradebook', ()=>{
        cy.get('.nav-link').contains('My Gradebook').click();
        cy.url().should('include', 'my-gradebook');
        cy.get('.btn-danger').should('be.visible').click(); 
        cy.wait('@gb');
        cy.url().should('eq', 'https://gradebook.vivifyideas.com/gradebooks');
        cy.get('input[type=text]').should('be.visible').type('Little Red');
        cy.get('.btn').contains('Search').should('be.visible').click();
        cy.contains('There is no more gradebooks in base, try again').should('be.visible');
    });
    it('TC 79 - Reload All Professors Page', ()=>{
        cy.reload();
        cy.get('center').eq(0).should('contain.html', 'h1').and('contain.text', '404 Not Found')
    })
});