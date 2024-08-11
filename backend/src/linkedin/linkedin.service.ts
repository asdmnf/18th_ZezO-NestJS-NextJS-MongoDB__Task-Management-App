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

  async scrapeProfileByEmail(email: string): Promise<any> {
    try {
      // Go to Google search and search for LinkedIn profiles by email
      await this.driver.get(`https://www.google.com/search?q=site:linkedin.com "${email}"`);

      // Click on the first LinkedIn result (assumes it's the correct profile)
      const linkedinProfileLink = await this.driver
        .findElement(webdriver.By.css('a[href*="linkedin.com"]'))
        .getAttribute('href');
      await this.driver.get(linkedinProfileLink);

      // Scrape profile data
      const name = await this.driver.findElement(webdriver.By.css('.text-heading-xlarge')).getText();
      const profilePicture = await this.driver
        .findElement(webdriver.By.css('.profile-photo img'))
        .getAttribute('src');

      return {
        name,
        profilePicture,
        linkedinUrl: linkedinProfileLink,
      };
    } catch (error) {
      console.error('Error scraping LinkedIn profile:', error);
      throw new Error('Failed to scrape LinkedIn profile');
    } finally {
      await this.driver.quit();
    }
  }
}