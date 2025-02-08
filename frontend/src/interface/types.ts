export interface Post {
    _id: string;
    title: string;
    content: string;
    author: string;
    createdAt: string;
    updatedAt: string;
    communityId: string;
    likes: number;
  }
  
  export interface Comment {
    id: string;
    postId: string;
    author: string;
    content: string;
    createdAt: string;
  }
  
  export interface Community {
    _id: string;
    name: string;
    description: string;
    createdAt: string;
    membersCount: number;
  }
  