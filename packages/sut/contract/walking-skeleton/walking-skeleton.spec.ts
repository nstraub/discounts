import { randomUUID } from 'node:crypto';

import { chromium } from 'playwright';
import { describe, it, onTestFinished } from 'vitest';

const pageTimeoutBelowTheTestTimeout = 10_000;

const deployedAppUrlFromEnv = (): string => {
  const url = process.env.DEPLOYED_APP_URL;
  if (!url) {
    throw new Error('DEPLOYED_APP_URL names no deployed app; scripts/ci.sh sets it after the deploy');
  }
  return url;
};

const openDeployedApp = async () => {
  const browser = await chromium.launch({ headless: true });
  onTestFinished(() => browser.close());
  const page = await browser.newPage();
  page.setDefaultTimeout(pageTimeoutBelowTheTestTimeout);
  await page.goto(deployedAppUrlFromEnv());
  return page;
};

describe('walking skeleton', () => {
  it('should walk', async () => {
    const page = await openDeployedApp();
    const greeting = page.getByTestId('greeting');
    await greeting.filter({ hasText: /\S/ }).waitFor();

    const newGreeting = `Hello from run ${randomUUID()}`;
    await page.getByTestId('new-greeting').fill(newGreeting);
    await page.getByTestId('save-greeting').click();
    await greeting.filter({ hasText: newGreeting }).waitFor();
    await page.reload();

    await greeting.filter({ hasText: newGreeting }).waitFor();
  });
});
