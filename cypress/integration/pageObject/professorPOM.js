export default class ProfessorGB {
    get name(){
        return cy.get('#firstName');
    };
    get surname(){
        return cy.get('#lastName');
    };
    get img(){
        return cy.get('.btn-primary').contains('Add images');
    };
    get put(){
        return cy.get('input[placeholder="Image URL"]').should('be.visible');
    };
    get submiter(){
        return cy.get('.btn-primary').contains('Submit');
    };
    createProf(imeP, prezimeP, slikaP){
        this.name.type(imeP);
        this.surname.type(prezimeP);
        this.img.click();
        this.put.type(slikaP);
        this.submiter.click();
    };
 };
 export const professorGB = new ProfessorGB;