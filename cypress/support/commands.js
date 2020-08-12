Cypress.Commands.add('loginBeck', (imejl, lozinka) => {
    Cypress.log({
        name: 'loginByForm',
        message: imejl + ' | ' + lozinka
    })
    cy.request({
        method: 'POST',
        url: Cypress.env('apiUrl') + '/login',
        form: true,
        followRedirect: true,
        body: {
            email: imejl,
            password: lozinka
        }
    }).then((resp) => {
        expect(resp.body).to.have.property('token')
        localStorage.setItem('loginToken', resp.body.token)
        cy.visit('/')
    });
});

Cypress.Commands.add("createGB", (naslov, broj) => {
    Cypress.log({
        name: 'createByBeck',
        message: naslov + ' | ' + broj
    })
    cy.request({
        method: 'POST',
        url: Cypress.env('apiUrl') + '/professors',
        form: true,
        followRedirect: true,
        body: {
            title: naslov,
            professor_id: broj
        }
    }).then((resp) => {
        expect(resp.body).to.have.property('token')
        localStorage.setItem('loginToken', resp.body.token)
        cy.visit('/');
    });
});

