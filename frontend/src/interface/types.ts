export interface Post {
    id: string;
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
    id: string;
    name: string;
    description: string;
    createdAt: string;
    membersCount: number;
  }
  