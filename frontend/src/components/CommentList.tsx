import CommentItem from "./CommentItem";

const CommentList = ({ comments }: { comments: any[] }) => {
  return (
    <div className="space-y-2">
      {comments.map((comment) => (
        <CommentItem key={comment._id} comment={comment} />
      ))}
    </div>
  );
};

export default CommentList;