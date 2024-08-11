import { Injectable } from '@nestjs/common';
import * as webdriver from 'selenium-webdriver';
import * as chrome from 'selenium-webdriver/chrome';

@Injectable()
export class LinkedinService {
  async scrapeProfile(linkedinUrl: string): Promise<any> {
    const driver = new webdriver.Builder()
      .forBrowser('chrome')
      .setChromeOptions(
        new chrome.Options()
          .addArguments('--headless')
          .addArguments('--disable-gpu')
          .addArguments('--no-sandbox')
          .addArguments('--disable-dev-shm-usage'),
      )
      .build();

    try {
      await driver.get(linkedinUrl);

      const name = await driver
        .findElement(webdriver.By.css('.top-card-layout__title'))
        .getText();
      const profilePicture = await driver
        .findElement(
          webdriver.By.css('.top-card-layout__entity-image-container img'),
        )
        .getAttribute('src');

      return {
        name,
        profilePicture,
        linkedinUrl,
      };
    } catch (error) {
      console.error('Error scraping LinkedIn profile:', error);
      throw new Error('Failed to scrape LinkedIn profile');
    } finally {
      await driver.quit();
    }
  }
}
