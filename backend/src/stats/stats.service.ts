import { Injectable } from '@nestjs/common';

import { ContentService } from '../content/content.service';
import { CourseService } from '../course/course.service';
import { UserService } from '../user/user.service';
import { StatsResponseDto } from './stats.dto';

@Injectable()
export class StatsService {
  constructor(
    private readonly userService: UserService,
    private readonly courseService: CourseService,
    private readonly contentService: ContentService,
  ) {}
  async getStats(): Promise<StatsResponseDto> {
    const numberOfUsers = await this.userService.count();
    const numberOfCourses = await this.courseService.count();
    const numberOfContents = await this.contentService.count();
    const latestUsers = await this.userService.latestUsers();
    const latestCourses = await this.courseService.latestCourses();
    const coursesMoreContents = await this.courseService.coursesMoreContents();

    return {
      numberOfUsers,
      numberOfContents,
      numberOfCourses,
      latestUsers,
      latestCourses,
      coursesMoreContents,
    };
  }
}
