import { Page, Locator } from '@playwright/test'
 
export class GlobalLoginPage {
  readonly page: Page
  readonly buttons: {
    readonly signIn: Locator
  }
  readonly fields: {
    readonly emailAddress: Locator
    readonly password: Locator
  }
  readonly links: {
    readonly forgotYourpassword: Locator
  }

  readonly checkBoxes: {
    readonly rememberMeOnThisComputer;
  }
 
  constructor(page: Page) {
    this.page = page
    this.buttons = {
      signIn: page.getByRole('button', { name: 'Sign In' }),
    }
    this.fields = {
      emailAddress: page.getByLabel('Email'),
      password: page.getByLabel('Password'),
    }   
    this.links = {
        forgotYourpassword: page.getByText('Forgot your password ?', { exact: true })
    }
    this.checkBoxes = {
        rememberMeOnThisComputer: page.getByRole('checkbox', { name: 'Remember me on this computer', exact: true} )
    }
  }
}