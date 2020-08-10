export default class CreateGB {
    get createGBBttn(){
        return cy.get('.nav-link').contains('Create Gradebook');
    };
    get title (){
        return cy.get('#title');
    };
    get selectOpt(){
        return cy.get('#professor')
    };
    get submitting(){
        return cy.get('.btn').contains('Submit');
    };
    creation(naslov){
        this.createGBBttn.click();
        this.title.type(naslov);
        this.selectOpt.select('17')
        this.submitting.click();
    };
};
export const createGB = new CreateGB;