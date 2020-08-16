/// <reference types="Cypress"/> 
import {user} from '../fixtures/user';
import  {authPage} from './pageObject/loginPOM';
import {createGB} from './pageObject/creategbPOM';
import {studentGB} from './pageObject/studentPOM'
const faker = require('faker');
let randomTitle = faker.random.word();
let alphanum = faker.random.alphaNumeric(255);
let supraalphanum = faker.random.alphaNumeric(256);
let supremealphanum = faker.random.alphaNumeric(257);
//nije korisceno jer nema odakle da povuce img iz servera, nego konkretna slika
let randomImg = faker.image.imageUrl();

describe('Create, edit, and delete my gradebook', ()=>{
    beforeEach(()=>{
        cy.visit('/');
        cy.server();
        cy.route(Cypress.env('apiUrl') + '/diaries?page=1').as('gb');
        authPage.signin(user.email, user.password);
        cy.wait('@gb');
    });
    it('POST-login', ()=>{
        //for both cy.loginBeck and with rq, I will stay not signed in
        cy.loginBeck(user.email, user.password);
        cy.request('POST', 'https://gradebook-api.vivifyideas.com/api/login', { "email": "Clarabelle55@yahoo.com", "password": "angelaisadoraduncan1877" })
        .then((response) => {
            expect(response.body).to.have.property('token')
            localStorage.setItem('loginToken', response.body.token)
        });
    });
    it('TC 51 - Create gradebook', ()=>{
        cy.get('.nav-link').contains('Create Gradebook').should('be.visible').click();
        createGB.creation('Little Red Riding Hood');
        cy.wait('@gb')
        cy.url().should('eq', 'https://gradebook.vivifyideas.com/gradebooks');
    });
    it('TC 52 - Gradebook Filter - find newly created gradebook',()=>{
        cy.get('input[type=text]').type('Little Red Riding Hood');
        cy.get('.btn-primary').contains('Search').click();
    })
    it('TC 61 - Edit gradebook title', ()=>{
        cy.get('.nav-link').contains('My Gradebook').click();
        cy.url().should('include', 'my-gradebook');
        cy.get('.btn-warning').contains('Edit Gradebook').should('be.visible').click();
        cy.url().should('contain', 'single-gradebook');
        cy.get('#title').clear().type(randomTitle);
        cy.get('.btn-primary').contains('Submit').click();
        cy.url().should('eq', 'https://gradebook.vivifyideas.com/gradebooks');
    });
    it('TC 62 - Edit gradebook title(255 characters)', ()=>{
        cy.get('.nav-link').contains('My Gradebook').click();
        cy.url().should('include', 'my-gradebook');
        cy.get('.btn-warning').contains('Edit Gradebook').should('be.visible').click();
        cy.url().should('contain', 'single-gradebook');
        cy.get('#title').clear().type(alphanum);
        cy.get('.btn-primary').contains('Submit').click();
        cy.url().should('eq', 'https://gradebook.vivifyideas.com/gradebooks');
    });
    it('TC 63 - Edit gradebook title(256 characters)', ()=>{
        cy.get('.nav-link').contains('My Gradebook').click();
        cy.url().should('include', 'my-gradebook');
        cy.get('.btn-warning').contains('Edit Gradebook').should('be.visible').click();
        cy.url().should('contain', 'single-gradebook');
        cy.get('#title').clear().type(supraalphanum);
        cy.get('.btn-primary').contains('Submit').click();
        cy.url().should('eq', 'https://gradebook.vivifyideas.com/gradebooks');
    });
    it('TC 64 - Edit gradebook title(257 characters)', ()=>{
        cy.get('.nav-link').contains('My Gradebook').click();
        cy.url().should('include', 'my-gradebook');
        cy.get('.btn-warning').contains('Edit Gradebook').should('be.visible').click();
        cy.url().should('contain', 'single-gradebook');
        cy.get('#title').clear().type(supremealphanum);
        cy.get('.btn-primary').contains('Submit').click();
        cy.url().should('include', 'single-gradebook');
    })
    it('TC 52 - Gradebook Filter - find newly created gradebook with previous title, before edited', ()=>{
        cy.get('input[type=text]').type('Litte Rot Riding Hood');
        cy.get('.btn-primary').contains('Search').click();
    });
    it('TC 65 - Delete my gradebook', ()=>{
        cy.get('.nav-link').contains('My Gradebook').click();
        cy.url().should('include', 'my-gradebook');
        cy.get('.btn-danger').should('be.visible').click(); 
        cy.url().should('eq', 'https://gradebook.vivifyideas.com/gradebooks');
        //filter after deleted gradebook
        cy.get('input[type=text]').should('be.visible').type('Little Rot Riding Hood');
        cy.get('.btn').contains('Search').should('be.visible').click();
        cy.contains('There is no more gradebooks in base, try again').should('be.visible');
    }); 
});