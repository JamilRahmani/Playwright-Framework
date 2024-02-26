import { expect, Browser, BrowserContext, Page } from '@playwright/test'
 
type UserKeys = 'admin' | 'employee' | 'sales'
type UserProps = {
  key: UserKeys
  firstName: string
  lastName: string
  homePath: string
}
 
export class User {
  private homeUrlString: string
 
  constructor(private user: UserProps) {
    this.homeUrlString = user.key.startsWith('orgAdmin')
      ? new URL('/organizations', process.env.MANAGE_APP_URL).toString()
      : new URL(this.user.homePath, process.env.CORE_APP_URL).toString()
  }
 
  public get key() {
    return this.user.key
  }
 
  public get firstName() {
    return this.user.firstName
  }
 
  public get lastName() {
    return this.user.lastName
  }
 
  public get fullName() {
    return `${this.user.firstName} ${this.user.lastName}`
  }
 
  public get homePath() {
    return this.homeUrlString
  }
 
}
 
export class UserContext {
  constructor(
    public page: Page,
    private user: User,
  ) {}
 
  public get key() {
    return this.user.key
  }
 
  public get firstName() {
    return this.user.firstName
  }
 
  public get lastName() {
    return this.user.lastName
  }
 
  public get fullName() {
    return `${this.user.firstName} ${this.user.lastName}`
  }
 
  public get homePath() {
    return this.user.homePath
  }
 
}
 
export class UserContextFactory {
  private browserContexts: {
    [userKey: string]: BrowserContext
  } = {}
 
  private userContexts: {
    [userKey: string]: UserContext
  } = {}
 
  constructor(private browser: Browser) {}
 
  async addUserAndGoToHomepage(user: User) {
    const browserContext = await this.browser.newContext({
      storageState: `playwright/.auth/${user.key}.json`,
      permissions: ['microphone', 'camera'],
    })
    this.userContexts[user.key] = new UserContext(await browserContext.newPage(), user)
    this.browserContexts[user.key] = browserContext
 
    await this.userContexts[user.key].page.goto(this.userContexts[user.key].homePath)
    return this.userContexts[user.key]
  }
 
  async loadUsers() {
    const UserCredentialsFile = await import('../../resources/.credentials.json')
 
    // TODO: Make more dynamic
    await this.addUserAndGoToHomepage(new User(UserCredentialsFile.admin[0] as UserProps))
    await this.addUserAndGoToHomepage(new User(UserCredentialsFile.employee[0] as UserProps))
    await this.addUserAndGoToHomepage(new User(UserCredentialsFile.sales[0] as UserProps))
  }
 
  async getUser(userKey: UserKeys) {
    return this.userContexts[userKey]
  }
 
  async getBrowserContext(userKey: UserKeys) {
    return this.browserContexts[userKey]
  }
 
  async cleanup(userKey?: UserKeys) {
    if (userKey) {
      await this.userContexts[userKey].page.context().storageState({ path: `playwright/.auth/${userKey}.json` })
      return await this.browserContexts[userKey].close()
    }
 
    for await (const browserContextKey of Object.keys(this.browserContexts)) {
      await this.userContexts[browserContextKey].page.context().storageState({ path: `playwright/.auth/${browserContextKey}.json` })
      await this.browserContexts[browserContextKey].close()
    }
  }
}