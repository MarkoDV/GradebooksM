export default class CreateGB {
    get title (){
        return cy.get('#title');
    };
    get selectOpt(){
        return cy.get('#professor').select('Isadora Duncan')
                 .invoke('val')
                 .should('deep.equal', '17')
    };
    get submitting(){
        return cy.get('.btn').contains('Submit');
    };
    creation(naslov){
        this.title.type(naslov);
        this.selectOpt
        this.submitting.click();
    };
};
export const createGB = new CreateGB;