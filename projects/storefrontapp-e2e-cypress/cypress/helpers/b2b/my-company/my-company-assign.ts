import {
  ASSIGNMENT_LABELS,
  CONFIRMATION_LABELS,
  MyCompanyConfig,
} from './models/index';
import { completeForm, FormType } from './my-company-form';
import { ignoreCaseSensivity, loginAsMyCompanyAdmin } from './my-company.utils';

export function testAssignmentFromConfig(config: MyCompanyConfig) {
  config?.subCategories?.forEach((subConfig: MyCompanyConfig) => {
    describe(`${config.name} Assignment - ${subConfig.name}`, () => {
      let firstOption: string;
      let entityId: string;
      const codeRow = config.rows?.find((row) => row.useInUrl || row.useCookie);

      before(() => {
        loginAsMyCompanyAdmin();

        cy.route('GET', `**${config.apiEndpoint}**`).as('getEntity');
        if (config.preserveCookies) {
          cy.getCookie(codeRow.useCookie).then((cookie) => {
            entityId = cookie.value;
            cy.visit(`${config.baseUrl}/${entityId}`);
          });
        } else {
          entityId = codeRow.updateValue;
          cy.visit(`${config.baseUrl}/${entityId}`);
        }
      });

      beforeEach(() => {
        cy.server();
      });

      it('should show no assignments', () => {
        cy.get('cx-org-card section.link-list')
          .contains(ignoreCaseSensivity(subConfig.name))
          .click();

        if (codeRow.useCookie) {
          cy.getCookie(codeRow.useCookie).then((cookie) => {
            cy.url().should(
              'contain',
              `${config.baseUrl}/${cookie.value}${subConfig.baseUrl}`
            );
          });
        } else {
          cy.url().should(
            'contain',
            `${config.baseUrl}/${codeRow.updateValue}${subConfig.baseUrl}`
          );
        }

        cy.get('cx-org-card .header h3').contains(
          ignoreCaseSensivity(subConfig.name)
        );

        checkListEmpty();
      });

      if (subConfig.createConfig) {
        it('should create and show in list', () => {
          cy.get('cx-org-card .header a')
            .contains(ASSIGNMENT_LABELS.CREATE)
            .click();
          completeForm(subConfig.createConfig.rows, FormType.CREATE);

          cy.route('POST', '**').as('save');
          cy.route('GET', `**${entityId}**`).as('getEntityData');
          cy.get('div.header button').contains('Save').click();
          cy.wait('@save');
          cy.wait('@getEntityData');

          const headerRows = subConfig.createConfig.rows?.filter(
            (row) => row.useInHeader
          );
          if (headerRows.length) {
            headerRows.forEach((hRow) => {
              cy.get('cx-org-sub-list table tr td').contains(
                ignoreCaseSensivity(hRow.createValue)
              );
            });
          } else {
            const nameRow = subConfig.createConfig.rows?.find(
              (row) => row.sortLabel === 'name'
            );
            cy.get('cx-org-sub-list table tr td').contains(nameRow.createValue);
          }
        });
      }

      if (subConfig.editConfig) {
        it('should update', () => {
          cy.get('cx-org-sub-list cx-table')
            .contains(subConfig.updateEntity)
            .click();
          cy.get('cx-org-card cx-view[position="3"] .header a')
            .contains(ASSIGNMENT_LABELS.EDIT)
            .click({ force: true });
          completeForm(subConfig.editConfig.rows, FormType.UPDATE);

          cy.route('PATCH', '**').as('save');
          cy.route('GET', `**${entityId}**`).as('getEntityData');
          cy.get('div.header button').contains('Save').click();
          cy.wait('@save');
          cy.wait('@getEntityData');

          cy.get('cx-org-notification').contains(
            ASSIGNMENT_LABELS.UPDATE_SUCCESS
          );
          cy.get('cx-org-notification').should('not.exist');

          const headerRows = subConfig.editConfig.rows?.filter(
            (row) => row.useInHeader
          );
          if (headerRows.length) {
            headerRows.forEach((hRow) => {
              cy.get('cx-org-sub-list table tr td').contains(
                ignoreCaseSensivity(hRow.updateValue)
              );
            });
          } else {
            const nameRow = subConfig.editConfig.rows?.find(
              (row) => row.sortLabel === 'name'
            );
            cy.get('cx-org-sub-list table tr td').contains(nameRow.updateValue);
          }
        });
      }

      if (subConfig.deleteEntity) {
        it('should delete', () => {
          cy.server();
          cy.route('GET', `**${config.apiEndpoint}**`).as('getEntity');
          cy.route('DELETE', `**`).as('deleteEntity');

          cy.get('cx-org-sub-list cx-table').contains(subConfig.deleteEntity);

          cy.get(`cx-org-card cx-view[position="3"] .header button`)
            .contains('Delete')
            .click();

          cy.route('DELETE', '**').as('delete');
          cy.route('GET', `**${entityId}**`).as('getEntityData');
          cy.get('cx-org-confirmation')
            .contains(CONFIRMATION_LABELS.CONFIRM)
            .click();
          cy.wait('@delete');
          cy.wait('@getEntityData');
          cy.get('cx-org-confirmation').should('not.exist');

          checkListEmpty();
        });
      }

      if (subConfig.rolesConfig) {
        it('should modify user roles', () => {
          cy.get('cx-org-sub-list cx-table tr td')
            .contains(ASSIGNMENT_LABELS.ROLES)
            .click();

          checkRoles();
          checkRoles(true);

          function checkRoles(uncheck?: boolean) {
            subConfig.rolesConfig.rows.forEach((row) => {
              cy.get('cx-org-card cx-view[position="3"] label span')
                .contains(row.updateValue)
                .parent()
                .within(() => {
                  if (!uncheck) {
                    cy.get('[type="checkbox"]').check();
                  } else {
                    cy.get('[type="checkbox"]').uncheck();
                  }
                });
            });
            cy.get('cx-org-notification').should('not.exist');
          }
        });
      }

      if (subConfig.manageAssignments) {
        it('should assign and unassign from assigned list', () => {
          cy.server();
          clickManage();

          cy.get('cx-org-sub-list cx-table tr td')
            .eq(0)
            .then((el) => {
              firstOption = el.text();

              clickAssign(firstOption);

              cy.route('GET', `**`).as('getAssignable');
              cy.get('cx-org-card .header')
                .contains(ASSIGNMENT_LABELS.DONE)
                .click();
              cy.wait('@getAssignable');

              clickUnassign(firstOption);
              checkListEmpty();
            });
        });

        it('should assign and unassign from assignments list', () => {
          cy.server();
          clickManage();

          clickAssign(firstOption);
          clickUnassign(firstOption);
          cy.get('cx-org-sub-list')
            .contains(firstOption)
            .parent()
            .parent()
            .contains(ASSIGNMENT_LABELS.ASSIGN);

          cy.route('GET', `**`).as('getAssignable');
          cy.get('cx-org-card .header')
            .contains(ASSIGNMENT_LABELS.DONE)
            .click();
          cy.wait('@getAssignable');

          checkListEmpty();
        });

        if (subConfig.canUnassignAll) {
          it('should assign and unassign all', () => {
            cy.server();
            clickManage(false);

            clickAssign(firstOption);
            clickUnassignAll();

            cy.get('cx-org-card .header a')
              .contains(ASSIGNMENT_LABELS.DONE)
              .click();

            checkListEmpty();
          });
        }
      }
    });

    function clickManage(waitForAssignable = true) {
      if (waitForAssignable) {
        cy.route('GET', `**`).as('getAssignable');
        cy.get('cx-org-card .header a')
          .contains(ASSIGNMENT_LABELS.MANAGE)
          .click();
        cy.wait('@getAssignable');
      } else {
        cy.get('cx-org-card .header a')
          .contains(ASSIGNMENT_LABELS.MANAGE)
          .click();
      }
    }

    function checkListEmpty() {
      cy.get('cx-org-sub-list div.main').contains('The list is empty');
    }

    function clickAssign(option: string) {
      cy.route('POST', '**').as('assign');
      cy.route('GET', `**${config.apiEndpoint}**`).as('getEntity');
      cy.get('cx-org-sub-list')
        .contains(option)
        .parent()
        .parent()
        .contains(ASSIGNMENT_LABELS.ASSIGN)
        .click();
      cy.wait('@assign');
      // cy.wait('@getEntity');
      cy.get('cx-org-notification').should('not.exist');
    }

    function clickUnassign(option: string) {
      cy.route('DELETE', '**').as('unassign');
      cy.route('GET', `**${config.apiEndpoint}**`).as('getEntity');
      cy.get('cx-org-sub-list')
        .contains(option)
        .parent()
        .parent()
        .contains(ASSIGNMENT_LABELS.UNASSIGN)
        .click();
      cy.wait('@unassign');
      // cy.wait('@getEntity');
      cy.get('cx-org-notification').should('not.exist');
    }

    function clickUnassignAll() {
      cy.get('cx-org-card .header button')
        .contains(ASSIGNMENT_LABELS.UNASSIGN_ALL)
        .click();
      cy.get('cx-org-sub-list').should(
        'not.contain.html',
        `<button class="link"> ${ASSIGNMENT_LABELS.UNASSIGN} </button>`
      );
    }
  });
}
