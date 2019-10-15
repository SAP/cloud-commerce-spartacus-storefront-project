      win.sessionStorage.clear();
      win.localStorage.clear();
    });
  });

  // ---------------------------
  // same as below
  // works 1/3 and state is not working as intended with cypress
  // describe('when anonymous user', () => {
  //   before(() => {
  //     cy.reload();
  //     cy.visit('/');
  //   });

  //   beforeEach(() => {
  //     cy.restoreLocalStorage();
  //   });

  //   testAsAnonymousUser();

  //   afterEach(() => {
  //     cy.saveLocalStorage();
  //   });
  // });
  // ---------------------------

  // ---------------------------
  // works 1/3 time need to explain the problem -- state not changing
  // describe('when changing the language with consents', () => {
  //   before(() => {
  //     cy.window().then(win => {
  //       win.sessionStorage.clear();
  //       win.localStorage.clear();
  //     });
  //     cy.reload();
  //     cy.visit('/');
  //   });

  //   stub(LANGUAGE_REQUEST, LANGUAGES);

  //   changeLanguageTest();
  // });
  // ---------------------------

  // ---------------------------
  // only one that works as intended perfectly
  // describe('when registering a user and checking registration consent', () => {
  //   before(() => {
  //     cy.window().then(win => {
  //       win.sessionStorage.clear();
  //       win.localStorage.clear();
  //     });
  //     cy.reload();
  //     cy.visit('/');
  //   });
  //   giveRegistrationConsentTest();
  // });
  // ---------------------------

  // ------------------
  // still does not work
  // uncomment after talking because this doesn't work when user does not click the register consent
  // describe('moving from the anonymous user to the registered user', () => {
  //   before(() => {
  //     cy.window().then(win => {
  //       win.sessionStorage.clear();
  //       win.localStorage.clear();
  //     });
  //     cy.reload();
  //     cy.visit('/');
  //   });

  //   movingFromAnonymousToRegisteredUser();
  // });
  // ------------------

  // -------------------------
  // works always
  // describe('moving from anonymous user to the logged in user', () => {
  //   before(() => {
  //     sessionLogin();
  //     cy.reload(true);
  //     cy.visit('/');
  //   });

  //   moveAnonymousUserToLoggedInUser();
  // });
  // -------------------------

  // -----------------
  // good good
  // describe('when a user is logged in', () => {
  //   before(() => {
  //     cy.window().then(win => {
  //       win.sessionStorage.clear();
  //       win.localStorage.clear();
  //     });
  //     sessionLogin();
  //     cy.reload();
  //     cy.visit('/');
  //   });

  //   testAsLoggedInUser();
  // });
  // -----------------
});

