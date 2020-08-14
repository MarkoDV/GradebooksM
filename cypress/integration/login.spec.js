/// <reference types="Cypress"/> 
import {user} from '../fixtures/user';
import  {authPage} from '../integration/pageObject/loginPOM';
const faker = require('faker');
let randomEmail = faker.internet.email();
let randomPassword = faker.internet.password();

describe('The Home Page', ()=> {
  beforeEach(()=>{
    cy.visit('/');
    cy.server();
    cy.route(Cypress.env('apiUrl') + '/diaries?page=1').as('gb');
  });
    it('TC 7 - Sign in with valid email and password', ()=> {
      authPage.signin(user.email, user.password);
      cy.wait('@gb')
      cy.url().should('be.eq', 'https://gradebook.vivifyideas.com/gradebooks');

    });
    it('Navigation after signin', ()=>{
      authPage.signin(user.email, user.password);
      cy.wait('@gb');
      cy.url().should('include', 'gradebooks');
      cy.scrollTo('bottom');
      cy.get('.btn').contains('Next').should('be.visible').click();
      cy.get('.btn').contains('Previous').should('be.visible').click();
      cy.get('.nav-link').contains('Sign out').should('be.visible');
      cy.go('back');
      //logged but back to login page:
      cy.get('.form-signin-heading').should('contain', 'Please login');
      //forward to gradebook home page but without login:
      cy.go('forward');
      cy.location().should((loc)=>{
        expect(loc.pathname).to.eq('/gradebooks')
      });
    });
    it('TC 4 - Sign in with non registered email address', ()=>{
      cy.get('.nav-link').contains('Sign in').click();
      authPage.signin(randomEmail, user.password);
      cy.url().should('be.eq', 'https://gradebook.vivifyideas.com/login')
      cy.get('.nav-link').contains('Sign in').should('be.visible');
    });
    it('TC 5 - Sign in with wrong password', ()=>{
      cy.get('.nav-link').contains('Sign in').click();
      authPage.signin(user.email, randomPassword);
      cy.url().should('be.eq', 'https://gradebook.vivifyideas.com/login')
      cy.get('.nav-link').contains('Sign in').should('be.visible');
    });
    it('TC Special - Sig in without any credentials', ()=>{
      cy.get('input[type=text]').invoke('val', '');
      cy.get('input[type=password]').invoke('val', '');
      cy.get('button[type=submit]').click();
      cy.get('input[type=text]').then(($input) => {
        expect($input[0].validationMessage).to.eq('Please fill in this field.');
      });
    });
 });

