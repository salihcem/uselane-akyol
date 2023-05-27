import content from '../fixtures/content.json'
import element from '../support/selectors/elements'
import 'cypress-file-upload'

// Values:
const userName = 'John Doe'
const date = new Date().toISOString().replace(/[-:\\.]/g, '')
const userEmail = `${Cypress.env('testerName')}+cy+${date}@testmail.com`
const userPhone = '+49 123 456 78 90'
const userCompany = 'ExComp LLC'
const expectedSalary = '55000'

describe('As a User, I should be able to apply to QA position', () => {
    before('Pass the privacy settings', () => {
      cy.visit('/')
      cy.get('#usercentrics-root', { timeout: 10000 })
        .invoke('remove')
        .should('not.exist')
      cy.get(element.SEARCH_RESULT_SECTION).scrollIntoView()
    })
  
    it('appylies to the QA position', () => {
      // asserts the webinar popup and closes it:
      cy.get(element.WEBINAR_POPUP).click()

      // checks for the job with the specific role name and clicks on it:
      cy.contains(element.JOB_CARD, content.roleName)
        .find('a')
        .click()
        
      // asserts job description page and clicks "apply" button:
      cy.origin('https://jobs.lever.co', () => {
        cy.url().should('contain', 'jobs.lever.co/userlane/', { timeout: 10000 })
      })
      cy.get(element.JOB_DESCRIPTION).should('be.visible')
      cy.get(element.SHOW_PAGE_APPLY).contains('Apply for this job').click()

      // asserts the application page:
      cy.url().should('contain', '/apply')
      cy.get(element.APPLICATION_FORM).should('be.visible')
      cy.contains('h4', 'Submit your application')
      
      // attaches the pdf document:
      cy.get('input[type="file"]').attachFile('testDocument.pdf')

      // adds user details:
      cy.get(element.NAME_INPUT).should('be.empty').type(userName)
      cy.get(element.EMAIL_INPUT).should('be.empty').type(userEmail)
      cy.get(element.PHONE_INPUT).should('be.empty').type(userPhone)
      cy.get(element.COMPANY_INPUT).should('be.empty').type(userCompany)
      cy.contains('.custom-question', content.salaryExpactation)
      cy.get(element.SALARY_INPUT).should('be.empty').type(expectedSalary)
      cy.get(element.MARKETING_CHECKBOX).click()

      // submits the page: 
      cy.contains(element.SUBMIT_CTA, 'Submit application').click()
      cy.contains('Application submitted!')
    })
  })
  