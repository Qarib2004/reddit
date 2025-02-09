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
  
  upvotes: string[]; // ✅ Массив ID пользователей, которые лайкнули
  downvotes: string[]; // ✅ Массив ID пользователей, которые дизлайкнули
  
  comments: Comment[]; 
}

  export interface Comment {
    _id: string;
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
  