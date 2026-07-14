export interface Lesson {
  id: number;
  sectionId: number | null;
  judul: string;
  videoUrl: string;
  duration: number | null;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Section {
  id: number;
  courseId: number | null;
  judul: string;
  order: number;
  lessons: Lesson[];
  createdAt?: string;
  updatedAt?: string;
}
