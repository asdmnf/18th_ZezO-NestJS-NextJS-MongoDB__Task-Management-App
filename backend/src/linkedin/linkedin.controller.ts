import { Controller, Get, Query } from '@nestjs/common';
import { LinkedinService } from './linkedin.service';

@Controller('linkedin')
export class LinkedinController {
  constructor(private readonly LinkedinService: LinkedinService) {}

  @Get('scrape')
  async scrapeProfileByEmail(@Query('email') email: string) {
    if (!email) {
      return { error: 'Email is required' };
    }
    const profileData = await this.LinkedinService.scrapeProfileByEmail(email);
    return profileData;
  }
}
