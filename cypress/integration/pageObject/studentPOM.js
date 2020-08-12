export default class StudentGB {
   get add(){
       return cy.get('.btn').contains('Add Student');
   };
   get name(){
       return cy.get('#firstName');
   };
   get surname(){
       return cy.get('#lastName');
   };
   get img(){
       return cy.get('.btn').contains('Add image');
   };
   get put(){
       return cy.get('input[placeholder="Image URL"]').should('be.visible');
   };
   get submiter(){
       return cy.get('.btn').contains('Submit');
   };
   studentAdd(ime, prezime, slika){
       this.add.click();
       this.name.type(ime);
       this.surname.type(prezime);
       this.img.click();
       this.put.type(slika);
       this.submiter.click();
   };
};
export const studentGB = new StudentGB;