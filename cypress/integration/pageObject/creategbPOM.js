export default class CreateGB {
    get createGBBttn(){
        return cy.get('.nav-link').contains('Create Gradebook');
    };
    get title (){
        return cy.get('#title');
    };
    get selectOpt(){
        return cy.get('#professor').select('10')
        .should('have.value', '10');
    };
    get submitting(){
        return cy.get('.btn').contains('Submit');
    };
    creation(naslov){
        this.createGBBttn.click();
        this.title.type(naslov);
        this.selectOpt
        this.submitting.click();
    };
};
export const createGB = new CreateGB;