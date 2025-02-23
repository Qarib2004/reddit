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
    type: "Public" | "Restricted" | "Private" | "Mature (18+)";
    creator: string; 
    members: string[]; 
    joinRequests: JoinRequest[]; 

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
  reports?: {
    userId: string; 
    reason: string; 
    timestamp: string;
  }[];

  hiddenByUsers?: string[]; 

  showFewerByUsers?: string[]; 
  reportedByUsers?: string[]; 

  isDeleted?: boolean;
  tags?: string[]; 
 
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
  reports?: {
    userId: string; 
    reason: string; 
    timestamp: string;
  }[];
  karma: number;
}
  
export interface Community {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  membersCount: number;
  type: "Public" | "Restricted" | "Private" | "Mature (18+)";
  creator: string | { _id: string; username: string };
  members: (string | { _id: string; username: string })[];
  joinRequests: JoinRequest[]; 
  avatar:string;
  banner:string
}

export interface JoinRequest {
  _id: string;
  username: string;
  avatar?: string;
  requestedAt: string;
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
    friends: { _id: string; username: string; avatar?: string }[]; 
    friendRequests?: string[];
    banned: boolean;
    bio?: string;  
    country?: string;  
    timezone?: string; 
    phoneNumber?:string;
    theme?: "light" | "dark" | "custom";
    fontSize?: number;
    showTrending?: boolean;
    moderatorRequests?: "pending" | "approved" | "rejected" | "none"; 
    moderatedCommunities?: string[];
    reportCount?: number;
    hiddenCommunities?: string[];
    faceId?:number[];
    coins?:number;
    banUntil?: Date | null;
    }
  

  export interface Message {
    _id: string;
    senderId: string; 
    recipientId: string; 
    message: string;
    createdAt: string;
    updatedAt: string;
  }
  

  export interface AdminStats {
    users: number;
    moderators: number;
    admins: number;
    posts: number;
    comments: number;
    communities: number;
    totalUsers: number;
    totalPosts: number;
    totalComments: number;
    totalCommunities: number;
    topUsers: { _id: string; username: string; karma: number }[];
  }


  export interface ModeratorStats {
    totalReports: number;
    resolvedReports: number;
    pendingReports: number;
    bannedUsers: number;
    deletedPosts: number;
    deletedComments: number;
    handledReports: number;
    dismissedReports: number; 
    warningsIssued: number; 
    postRestores: number;
  }
  
  

  export interface ModeratorHistoryRecord {
    _id: string;
    moderatorId: string;
    actionType: "ban_user" | "delete_post" | "delete_comment" | "warn_user";
    targetId: string;
    targetType: "user" | "post" | "comment";
    reason: string;
    timestamp: string;
    restoredPostId?: string; 
  warnedUserId?: string; 
  }
  
  


  export interface ModeratorChatMessage {
    _id: string;
    senderId: string;
    senderUsername: string;
    message: string; 
    timestamp: string;
    messageType?: "text" | "image" | "warning";
    isSystemMessage?: boolean; 
  }
  

  export interface UserWarnings {
    _id: string;
    userId: string;
    username: string;
    warnings: {
      reason: string;
      issuedBy: string;
      timestamp: string;
    }[];
    warningCount?: number;
  }
  
  
  