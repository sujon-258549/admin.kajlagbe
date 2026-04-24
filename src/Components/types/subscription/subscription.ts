export interface Subscription {
  id: string;
  name: string;
  slug: string;
  price: string;
  discount: string;
  duration: string;
  activeDays: number;
  description?: string;
  isRecomended: boolean;
  featured: string[];
  isActive: boolean;
  status: boolean;
  createdAt: string;
}
