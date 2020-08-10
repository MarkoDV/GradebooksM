export default class AuthPage {
    get email(){
        return cy.get('input[type=text]');
     };
    get password(){
        return cy.get('input[type=password]');
     };
    get signInButton(){
        return cy.get('button[type=submit]');
     };
    signin(imejl, lozinka){
        this.email.type(imejl);
        this.password.type(lozinka);
        this.signInButton.click();
     };
 };
 
 export const authPage = new AuthPage;