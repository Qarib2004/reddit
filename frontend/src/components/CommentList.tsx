import CommentItem from "./CommentItem";
import { Comment } from "../interface/types";


const CommentList = ({ comments }: { comments: Comment[] }) => {
  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentItem key={comment._id} comment={comment} />
      ))}
    </div>
  );
};

export default CommentList;