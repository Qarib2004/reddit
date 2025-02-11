import CommentItem from "./CommentItem";
import { Comment } from "../interface/types";

const CommentList = ({ comments }: { comments: Comment[] }) => {
  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment._id}>
          <CommentItem comment={comment} />
        </div>
      ))}
    </div>
  );
};

export default CommentList;
