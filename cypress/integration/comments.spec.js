/// <reference types="Cypress"/> 
import {user} from '../fixtures/user';
import {gradebook} from '../fixtures/gradebook'
import  {authPage} from './pageObject/loginPOM';
import {createGB} from './pageObject/creategbPOM';
const faker = require('faker');
let randomTitle = faker.random.word();

describe('Write and delete comments', ()=>{
    beforeEach(()=>{
        cy.visit('/')
        cy.server();
        cy.route('GET', Cypress.env('apiUrl') + '/diaries?page=1').as('gb');
        cy.get('.nav-link').contains('Sign in').click();
        authPage.signin(user.email, user.password);
        cy.wait('@gb')
        cy.url().should('be.eq', 'https://gradebook.vivifyideas.com/gradebooks');
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
    it('TC 67 - Write comment without gradebook on My Gradebook Page', ()=>{
        cy.get('.nav-link').contains('My Gradebook').should('be.visible')
          .invoke('removeAttr', 'target')
          .click();
        cy.url().should('include', 'my-gradebook');
        cy.get('textarea')
          .should('be.visible')
          .and('have.attr', 'placeholder', 'Writte your comment')
          .type('Ygl3oujHyncbGgbv');
        cy.get('.btn').contains('Submit Comment').should('be.visible').click();
        cy.get('.alert-danger')
          .should('have.text',`\n      Message: You dont have your diary. Please first set your own diary\n    `)
    });
    it('TC 68 - Should be able to create comment on own gradebook', ()=>{
        cy.get('.nav-link').contains('Create Gradebook').should('be.visible').click();
        createGB.creation('Litte Red Riding Hood');
        cy.url().should('eq', 'https://gradebook.vivifyideas.com/gradebooks');
        cy.get('.nav-link').contains('My Gradebook').should('be.visible')
          .invoke('removeAttr', 'target')
          .click();
        cy.url().should('include', 'my-gradebook');
        cy.get('textarea')
          .should('be.visible')
          .and('have.attr', 'placeholder', 'Writte your comment')
          .type('Ygl3oujHyncbGgbv');
        cy.get('.btn').contains('Submit Comment').should('be.visible').click();
        cy.wait('@gb')
        cy.get('.nav-link').contains('Gradebooks').should('be.visible').click();
        cy.wait('@gb');
        cy.get('.nav-link').contains('My Gradebook').click();
        cy.url().should('include', 'my-gradebook');
        cy.get('.comments-box').should('have.descendants', '.comments');
     });
     it('TC 68 multiple - Should be able to write multiple comments',()=>{
        cy.get('.nav-link').contains('My Gradebook').click();
        cy.url().should('include', 'my-gradebook');
        for(let i=0; i<5; i++){
            cy.get('textarea').type('Ygl3oujHyncbGgbv');
            cy.get('.btn').contains('Submit Comment').should('be.visible').click();
            cy.get('.nav-link').contains('Gradebooks').should('be.visible').click();
            cy.get('.nav-link').contains('My Gradebook').click();
        };
     });
     it('TC 71 - Delete comment on My Gradebook Page', ()=>{
        cy.get('.nav-link').contains('My Gradebook').click();
        for(let i =0; i<6; i++){
            cy.get('.btn-danger').eq(1).contains('Delete').click();
            cy.get('.nav-link').contains('My Gradebook').click();
        }
        cy.location().should((loc)=>{
            expect(loc.pathname).to.include('/my-gradebook')
            expect(loc.search).to.be.empty
        });
        cy.get('.comments-box').should('not.have.descendants', '.comments');
     });
     it('TC 65 - Delete my gradebook', ()=>{
        cy.get('.nav-link').contains('My Gradebook').click();
        cy.url().should('include', 'my-gradebook');
        cy.get('.btn-danger').contains('Delete Gradebook').click(); 
        cy.url().should('eq', 'https://gradebook.vivifyideas.com/gradebooks');
     });
 });
