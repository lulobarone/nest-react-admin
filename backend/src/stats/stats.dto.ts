import { Course } from 'src/course/course.entity';
import { User } from 'src/user/user.entity';

export interface StatsResponseDto {
  numberOfUsers: number;
  numberOfCourses: number;
  numberOfContents: number;
  latestUsers: User[];
  latestCourses: Course[];
  coursesMoreContents: any[];
}
