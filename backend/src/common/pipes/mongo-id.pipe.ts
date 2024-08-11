import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import mongoose from 'mongoose';

@Injectable()
export class ParseMongoIdPipe implements PipeTransform<string> {
  transform(value: string) {
    if (!value) {
      throw new BadRequestException('ID is required');
    }

    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new BadRequestException('Invalid ID');
    }
    return value;
  }
}
