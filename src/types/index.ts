export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  walletBalance: number;
  createdAt: Date;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  type: 'short-form' | 'long-form';
  url: string;
  price: number;
  creatorId: string;
  creatorName: string;
  createdAt: Date;
  thumbnailUrl: string;
}

export interface Comment {
  id: string;
  videoId: string;
  userId: string;
  username: string;
  text: string;
  createdAt: Date;
}

export interface Purchase {
  id: string;
  userId: string;
  videoId: string;
  amount: number;
  createdAt: Date;
}

export interface Gift {
  id: string;
  fromUserId: string;
  toUserId: string;
  videoId: string;
  amount: number;
  createdAt: Date;
}