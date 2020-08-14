/// <reference types="Cypress"/> 
import {user} from '../fixtures/user';
import  {authPage} from './pageObject/loginPOM';
import {createGB} from './pageObject/creategbPOM';
import {studentGB} from './pageObject/studentPOM';
import {professorGB} from './pageObject/professorPOM'
const faker = require('faker');
let randomName = faker.name.findName();
let randomSurname = faker.name.lastName();

describe('Add students and create professor', ()=>{
    beforeEach(()=>{
        cy.visit('/');
        cy.server();
        cy.route(Cypress.env('apiUrl') + '/diaries?page=1').as('gb');
        authPage.signin(user.email, user.password);
        cy.wait('@gb')
    });
    it('TC 51 - Create new gradebook', ()=>{
        cy.get('.nav-link').contains('Create Gradebook').should('be.visible').click();
        createGB.creation('Litte Red Riding Hood');
        cy.url().should('eq', 'https://gradebook.vivifyideas.com/gradebooks');
    });
    it('TC 55 multiple - Gradebook, with  5 new student', ()=>{
        cy.get('.nav-link').contains('My Gradebook').click();
        cy.url().should('include', 'my-gradebook');
        for (let i=0; i<5; i++) {
            studentGB.studentAdd(randomName, randomSurname, 'https://i.pinimg.com/originals/23/52/f7/2352f71cba2c87344fc611b0e7ee7cb5.jpg'); 
            cy.url().should('include', 'single-gradebook'); 
        }; 
    });
    it('TC 65 - Delete my gradebook', ()=>{
        cy.get('.nav-link').contains('My Gradebook').click();
        cy.url().should('include', 'my-gradebook');
        cy.get('.btn-danger').should('be.visible').click(); 
        cy.url().should('eq', 'https://gradebook.vivifyideas.com/gradebooks');
        cy.get('input[type=text]').should('be.visible').type('Little Red');
        cy.get('.btn').contains('Search').should('be.visible').click();
        cy.contains('There is no more gradebooks in base, try again').should('be.visible');
    });
    it('TC 73 - Professors filter(gradebook is not yet created by user)', ()=>{
        cy.get('#navbardrop').click();
        cy.get('.nav-item').contains('All Professors').click();
        cy.url().should('include', 'all-professors');
        //mora delay jer ako ne stavim ostane samo crna tabla sa thead bez podataka u row ispod o izbranom autoru(useru)
        cy.get('input[type=text').type('Isadora', {delay:100});
    });
    it('TC 75 - Professors - Create Professor', ()=>{
        cy.get('#navbardrop').click();
        cy.get('.nav-item').contains('Create Professor').click();
        cy.url().should('include', 'create-professor');
        professorGB.createProf(randomName, randomSurname, 'https://globallovemuseum.net/wp-content/uploads/2019/06/yesenincolor_crop.jpg');
        cy.scrollTo('bottom');
        cy.url().should('include', 'all-professors');
    });
    it('TC 79 - Reload All Professors Page', ()=>{
        cy.reload();
        cy.get('center').eq(0).should('contain.html', 'h1').and('contain.text', '404 Not Found')
    })
});