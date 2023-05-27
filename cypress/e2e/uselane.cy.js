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

      cy.intercept('GET', '/checksiteconfig?*', (req) => {
        // Send a request using cy.request()
        cy.request('POST', 'https://api2.hcaptcha.com/checksiteconfig?v=30d2bc2&host=jobs.lever.co&sitekey=e33f87f8-88ec-4e1a-9a13-df9bbb1d8120&sc=1&swa=1&se=30d2bc2', 
        {"features":{},"c":{"type":"hsw","req":"eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJmIjowLCJzIjoyLCJ0IjoidyIsImQiOiIzaEJyWnlQS0dsZ3dSTXhhdjJycGFDV2ZOSGpybm1oREFYT0pUTzFsSDRZK01PbU9QQVRQMGRWWDMwSWJYSHlWczRra0M4eDhrWDdHd2gvU2xuT3R5SmU2WHhIa1R0cVByRE9oejFZMWVETnhJbkh1WjU1TytjekxKLzNiYVJkRVZ5ckNKSVdpdHo5MFVRWmlaU0xwQkVvTlJoOTFWdGV5cWZjdHB3VmQweEhaVENQVWp2a3NhL1gwcFE9PUI1a1lqMjJTRlhtY2VEZDIiLCJsIjoiaHR0cHM6Ly9uZXdhc3NldHMuaGNhcHRjaGEuY29tL2MvMGQyYWVjZiIsImUiOjE2ODUxMzYzNzIsIm4iOiJoc3ciLCJjIjoxMDAwfQ.tP_6qip23dcHS9JS6l9KVLXOFtPn_F0bRGZgNXJTOLYgFLwdhk6n5hPSMezr1_Ae6wFVma_uwin7sSQ-3z-ObP76jPKxs4fcSLQMO9iL-bsBsofnecWgO5yx5SyzXlsiCPTSQyR1Bfp-1UWh9iskgBVOupEq-GbBRuPbCY2i0M0WEiylbY_6scX8wLEoTXALNo9UFdohzi6NrVwEE22jhfQivTSeNgtPXjfmBgQPE9UbnRl4vZ5Z2oJs3MQK0LClztwAi86Zp9GUBcLqrv47q66LAxyiSTFJTeN0jxuH_VLjHItGU7gIhHl_4lRG0dgHo9vg9nVrYmMKxYqIqUXnMA"},"pass":true})
          .then((response) => {
            // Handle the response as needed
            console.log(response.body);
          });
      
        // Continue the original request
        req.continue();
      });
      

      // submits the page: 
      cy.contains(element.SUBMIT_CTA, 'Submit application').click()
      cy.contains('Application submitted!')
    })
  })
  