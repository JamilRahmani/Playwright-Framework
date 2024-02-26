
async function globalSetup() {
  process.env.TEST_RUN_ID = String(Math.floor(Date.now() / 1000)).slice(-5)
  process.env.PROGRAM_TIMEZONE = process.env.PROGRAM_TIMEZONE || 'US/Eastern'
}
 
export default globalSetup
 