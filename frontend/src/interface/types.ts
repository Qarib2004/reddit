// export interface Post {
//     _id: string;
//     title: string;
//     content: string;
//     author: string;
//     createdAt: string;
//     updatedAt: string;
//     communityId: string;
//     likes: number;
//   }
  
export interface Post {
  _id: string;
  title: string;
  content: string;
  postType: "text" | "image" | "link"; 
  mediaUrl?: string;
  
  community: {
    _id: string;
    name: string;
    description: string;
    createdAt: string;
    membersCount: number;
  }; 

  author: {
    _id: string;
    username: string;
  };

  createdAt: string;
  updatedAt: string;
  
  upvotes: string[]; 
  downvotes: string[]; 
  
  comments: Comment[]; 
}

export interface Comment {
  _id: string;
  post: string;
  author: {
    _id: string;
    username: string;
    avatar?: string;
  };
  content: string;
  createdAt: string;
  parentComment?: string; 
  replies?: Comment[]; 
  upvotes: string[]; 
  downvotes: string[]; 
}
  
  export interface Community {
    _id: string;
    name: string;
    description: string;
    createdAt: string;
    membersCount: number;
  }
  
  
  export interface User {
    _id: string;
    username: string;
    role: "user" | "moderator" | "admin";
    email: string;
    password?: string;
    googleId?: string;
    facebookId?: string;
    karma: number;
    subscriptions: string[]; 
    createdAt: string;
    selectedTopics?: string[]; 
    savedPosts?: string[]; 
    avatar: string;
    topics?: string[];
  }
  