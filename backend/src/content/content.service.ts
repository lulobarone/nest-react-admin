import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ILike, MoreThan } from 'typeorm';

import { CourseService } from '../course/course.service';
import { CreateContentDto, UpdateContentDto } from './content.dto';
import { Content } from './content.entity';
import { ContentQuery } from './content.query';

@Injectable()
export class ContentService {
  constructor(private readonly courseService: CourseService) {}

  async save(
    courseId: string,
    createContentDto: CreateContentDto,
  ): Promise<Content> {
    const { name, description, imageUrl } = createContentDto;
    const course = await this.courseService.findById(courseId);
    return await Content.create({
      name,
      description,
      course,
      imageUrl,
      dateCreated: new Date(),
    }).save();
  }

  async findAll(contentQuery: ContentQuery): Promise<Content[]> {
    Object.keys(contentQuery).forEach((key) => {
      contentQuery[key] = ILike(`%${contentQuery[key]}%`);
    });

    return await Content.find({
      where: contentQuery,
      order: {
        name: 'ASC',
        description: 'ASC',
      },
    });
  }

  async findById(id: string): Promise<Content> {
    const content = await Content.findOne(id);

    if (!content) {
      throw new HttpException(
        `Could not find content with matching id ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }

    return content;
  }

  async findByCourseIdAndId(courseId: string, id: string): Promise<Content> {
    const content = await Content.findOne({ where: { courseId, id } });
    if (!content) {
      throw new HttpException(
        `Could not find content with matching id ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }
    return content;
  }

  async findAllByCourseId(
    courseId: string,
    contentQuery: ContentQuery,
  ): Promise<{ contents: Content[]; total: number; courseName: string }> {
    const page = contentQuery.page;
    const pageSize = contentQuery.pageSize;
    const queryfind = {};
    Object.keys(contentQuery).forEach((key) => {
      if (!['pageSize', 'page', 'courseId'].includes(key)) {
        queryfind[key] =
          key === 'dateCreated'
            ? MoreThan(contentQuery[key])
            : ILike(`%${contentQuery[key]}%`);
      }
    });
    const [contents, total] = await Content.findAndCount({
      where: { courseId, ...queryfind },
      relations: ['course'],
      order: {
        name: 'ASC',
        description: 'ASC',
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    const courseName =
      contents.length > 0 ? contents[0].course.name : 'SIN CONTENIDOS';

    return { contents, total, courseName };
  }

  async update(
    courseId: string,
    id: string,
    updateContentDto: UpdateContentDto,
  ): Promise<Content> {
    const content = await this.findByCourseIdAndId(courseId, id);
    return await Content.create({ id: content.id, ...updateContentDto }).save();
  }

  async delete(courseId: string, id: string): Promise<string> {
    const content = await this.findByCourseIdAndId(courseId, id);
    await Content.delete(content);
    return id;
  }

  async count(): Promise<number> {
    return await Content.count();
  }
}
