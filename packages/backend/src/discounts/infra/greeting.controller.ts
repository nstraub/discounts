import { Body, Controller, Get, Inject, Put } from '@nestjs/common';
import { desc } from 'drizzle-orm';

import type { Greeting } from '@app/types/greeting';

import { database, type Database } from './database.module.js';
import { greetings } from './schema.js';

@Controller('greeting')
export class GreetingController {
  constructor(@Inject(database) private readonly database: Database) {}

  @Get()
  async latest(): Promise<Greeting | undefined> {
    const [latest] = await this.database
      .select({ text: greetings.text })
      .from(greetings)
      .orderBy(desc(greetings.id))
      .limit(1);
    return latest;
  }

  @Put()
  async save(@Body() greeting: Greeting): Promise<void> {
    await this.database.insert(greetings).values({ text: greeting.text });
  }
}
