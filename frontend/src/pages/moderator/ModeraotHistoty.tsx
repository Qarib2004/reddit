import { useGetModeratorHistoryQuery, useUndoModeratorActionMutation } from "../../redux/moderatorSlice";
import { toast } from "react-toastify";

const ModeratorHistory = () => {
  const { data: history, isLoading } = useGetModeratorHistoryQuery();
  const [undoAction] = useUndoModeratorActionMutation();

  const handleUndo = async (id: string) => {
    try {
      await undoAction(id).unwrap();
      toast.success("Action undone successfully!");
    } catch (error) {
      toast.error("Failed to undo action");
    }
  };

  if (isLoading) return <p>Loading moderator history...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Moderator History</h2>
      {history?.length ? (
        <ul>
          {history.map((record) => (
            <li key={record._id} className="p-4 border-b flex justify-between">
              <p>{record.actionType} on {record.targetType} ({record.targetId})</p>
              <button onClick={() => handleUndo(record._id)} className="text-blue-500">Undo</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No moderation history available.</p>
      )}
    </div>
  );
};

export default ModeratorHistory;
