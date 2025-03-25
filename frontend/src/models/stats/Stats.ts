import Course from '../../models/course/Course';
import User from '../../models/user/User';

export default interface Stats {
  numberOfUsers: number;
  numberOfCourses: number;
  numberOfContents: number;
  latestUsers: User[];
  latestCourses: Course[];
  coursesMoreContents: any[];
}
