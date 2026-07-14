import type { Member } from "./member";
import type { StrapiMedia } from "./strapi";

export type ProjectStatus =
  | "planned"
  | "in-progress"
  | "completed";

export interface Project {
  id: number;
  documentId: string;

  title: string;
  description: string;

  status_project: ProjectStatus;
  slug:string;
  start_date: string; // ISO date (YYYY-MM-DD)
  end_date: string;

  leader?: Member | null;
  members?: Member[];
  cover_img ?: StrapiMedia | null
  createdAt: string;
  updatedAt: string;
  publishedAt?: string | null;
  category?: string | null;
  gallery?:StrapiMedia[];
  galleryDriveLink:string;
}