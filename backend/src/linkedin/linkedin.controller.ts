import { Controller, Get, Query } from '@nestjs/common';
import { LinkedinService } from './linkedin.service';

@Controller('linkedin')
export class LinkedinController {
  constructor(private readonly LinkedinService: LinkedinService) {}

  @Get('scrape')
  async scrapeProfile(@Query('url') url: string) {
    console.log(url, 'url');
    if (!url) {
      return { error: 'LinkedIn URL is required' };
    }
    const profileData = await this.LinkedinService.scrapeProfile(url);
    return profileData;
  }
}
