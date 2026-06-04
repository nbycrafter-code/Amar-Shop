// models/Gallery.ts
import { ObjectId } from 'mongodb';

export interface IGalleryImage {
  _id?: ObjectId;
  id: number;
  src: string;
  alt: string;
  title: string;
  category: string;
  likes: number;
  tags: string[];
  dimensions: {
    width: number;
    height: number;
  };
  size: number; // in KB
  uploadedBy: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  views: number;
  downloads: number;
  shares: number;
}

export interface IGalleryCategory {
  _id?: ObjectId;
  name: string;
  slug: string;
  description: string;
  icon: string;
  order: number;
  isActive: boolean;
  parentCategory?: string;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IGalleryStats {
  _id?: ObjectId;
  totalImages: number;
  totalLikes: number;
  totalViews: number;
  totalDownloads: number;
  totalShares: number;
  mostLikedImage: IGalleryImage | null;
  mostViewedImage: IGalleryImage | null;
  categoryDistribution: Map<string, number>;
  dailyStats: {
    date: Date;
    newImages: number;
    likes: number;
    views: number;
  }[];
  updatedAt: Date;
}

export interface IGalleryComment {
  _id?: ObjectId;
  imageId: number;
  userId: string;
  userName: string;
  userAvatar?: string;
  comment: string;
  likes: number;
  createdAt: Date;
  isApproved: boolean;
}

export class GalleryModel {
  static async createImage(imageData: Partial<IGalleryImage>): Promise<IGalleryImage> {
    // Implementation for database
    const newImage: IGalleryImage = {
      id: Date.now(),
      src: imageData.src!,
      alt: imageData.alt!,
      title: imageData.title!,
      category: imageData.category!,
      likes: 0,
      tags: imageData.tags || [],
      dimensions: imageData.dimensions || { width: 0, height: 0 },
      size: imageData.size || 0,
      uploadedBy: imageData.uploadedBy || 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      views: 0,
      downloads: 0,
      shares: 0
    };
    return newImage;
  }

  static async updateStats(imageId: number, type: 'like' | 'view' | 'download' | 'share'): Promise<void> {
    // Implementation for updating stats
  }
}