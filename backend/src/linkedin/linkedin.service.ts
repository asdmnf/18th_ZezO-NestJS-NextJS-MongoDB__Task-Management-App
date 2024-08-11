import { Injectable } from '@nestjs/common';
import * as webdriver from 'selenium-webdriver';
import * as chrome from 'selenium-webdriver/chrome';

@Injectable()
export class LinkedinService {
  private driver: webdriver.WebDriver;

  constructor() {
    const options = new chrome.Options();
    options.addArguments('--headless'); // Run Chrome in headless mode
    options.addArguments('--disable-gpu');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');

    this.driver = new webdriver.Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
  }

  async scrapeProfile(linkedinUrl: string): Promise<any> {
    try {
      await this.driver.get(linkedinUrl);

      const name = await this.driver
        .findElement(webdriver.By.css('.top-card-layout__title'))
        .getText();
      const profilePicture = await this.driver
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
      await this.driver.quit();
    }
  }
}
