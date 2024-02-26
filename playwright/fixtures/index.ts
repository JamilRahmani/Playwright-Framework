import { test as base } from '@playwright/test'
import { UserContextFactory } from './user-context-factory'
 
// Declare the types of your fixtures.
type MyFixtures = {
  userFactory: UserContextFactory
}
 
export * from '@playwright/test'
export const test = base.extend<MyFixtures>({
  userFactory: async ({ browser }, use) => {
    const userContextFactory = new UserContextFactory(browser)
    await userContextFactory.loadUsers()
    await use(userContextFactory)
    await userContextFactory.cleanup()
  },
})