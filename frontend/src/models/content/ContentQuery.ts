export default interface ContentQuery {
  courseId: string;
  name?: string;
  description?: string;
  dateCreated?: string;
  imageUrl?: string;
  page?: number;
  pageSize?: number;
}
