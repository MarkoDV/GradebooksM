export default class RegPage {
    get firstName(){
        return cy.get('#firstName');
     };
    get lastName(){
        return cy.get('#lastName');
     };
    get password(){
        return cy.get('#password');
    }
    get passwordConfirm(){
        return cy.get('#passwordConfirmation');
    }
    get email(){
        return cy.get('#email')
    }
    get registerButton(){
        return cy.get('button[type=submit]');
     };
    register(prvoIme, zadnjeIme, lozinka, lozinkaP, imejl){
        this.firstName.type(prvoIme);
        this.lastName.type(zadnjeIme);
        this.password.type(lozinka);
        this.passwordConfirm.type(lozinkaP);
        this.email.type(imejl)
        this.registerButton.click();
     };
 };
 
 export const regPage = new RegPage;