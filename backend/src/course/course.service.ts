import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ILike, MoreThan } from 'typeorm';

import { CreateCourseDto, UpdateCourseDto } from './course.dto';
import { Course } from './course.entity';
import { CourseQuery } from './course.query';

@Injectable()
export class CourseService {
  async save(createCourseDto: CreateCourseDto): Promise<Course> {
    return await Course.create({
      ...createCourseDto,
      dateCreated: new Date(),
    }).save();
  }

  async findAll(
    courseQuery: CourseQuery,
  ): Promise<{
    courses: Course[];
    total: number;
  }> {
    const page = courseQuery.page;
    const pageSize = courseQuery.pageSize;
    const queryfind = {};
    Object.keys(courseQuery).forEach((key) => {
      if (!['pageSize', 'page'].includes(key)) {
        queryfind[key] =
          key === 'dateCreated'
            ? MoreThan(courseQuery[key])
            : ILike(`%${courseQuery[key]}%`);
      }
    });
    const [courses, total] = await Course.findAndCount({
      where: queryfind,
      order: {
        name: 'ASC',
        description: 'ASC',
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return { courses, total };
  }

  async findById(id: string): Promise<Course> {
    const course = await Course.findOne(id);
    if (!course) {
      throw new HttpException(
        `Could not find course with matching id ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }
    return course;
  }

  async update(id: string, updateCourseDto: UpdateCourseDto): Promise<Course> {
    const course = await this.findById(id);
    return await Course.create({ id: course.id, ...updateCourseDto }).save();
  }

  async delete(id: string): Promise<string> {
    const course = await this.findById(id);
    await Course.delete(course);
    return id;
  }

  async count(): Promise<number> {
    return await Course.count();
  }

  async latestCourses(): Promise<Course[]> {
    return await Course.find({
      order: { dateCreated: 'DESC' },
      take: 5,
    });
  }

  async coursesMoreContents(): Promise<any[]> {
    const allCourses = await Course.find({ relations: ['contents'] });

    return allCourses
      .map((course) => ({
        ...course,
        contentCount: course.contents.length,
      }))
      .filter((e) => e.contentCount > 0)
      .sort((a, b) => b.contentCount - a.contentCount)
      .slice(0, 5);
  }
}
