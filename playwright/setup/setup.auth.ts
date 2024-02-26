import { Page, test as setup } from '@playwright/test'
import UserCredentialsFile from '../../resources/.credentials.json'
import { GlobalLoginPage } from '../pages/login/global'
 
const authenticateUser = async (page: Page, user) => {
  const loginPage = new GlobalLoginPage(page)
  // Perform authentication steps. Replace these actions with your own.
  await loginPage.page.goto('/')
  await loginPage.fields.emailAddress.fill(user.email)
  await loginPage.fields.password.fill(user.password)
  await loginPage.buttons.signIn.click()
  // Wait until the page receives the cookies.
  //
  // Sometimes login flow sets cookies in the process of several redirects.
  // Wait for the final URL to ensure that the cookies are actually set.
  await loginPage.page.waitForURL(user.homePath)
 
  // End of authentication steps.
 
  await loginPage.page.context().storageState({ path: `playwright/.auth/${user.key}.json` })
}
 
const admin01 = UserCredentialsFile.admins.find((admins) => admins.key === 'admin01')
setup(`Authenticate User: Admin ${admin01?.email}`, async ({ page }) => {
  await authenticateUser(page, admin01)
})
 

 
const employee01 = UserCredentialsFile.employees.find((employees) => employees.key === 'employee01')
setup(`Authenticate User: Employee ${employee01?.email}`, async ({ page }) => {
  await authenticateUser(page, employee01)
})
 
const sale01 = UserCredentialsFile.sales.find((sales) => sales.key === 'sale01')
setup(`Authenticate User: Sales ${sale01?.email}`, async ({ page }) => {
  await authenticateUser(page, sale01)
})
 