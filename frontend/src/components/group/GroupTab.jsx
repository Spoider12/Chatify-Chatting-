import { useState, useEffect } from "react";
import CreateGroupModal from "./CreateGroupModal";
import { useGroupStore } from "../../store/useGroupStore";
import { useChatStore } from "../../store/useChatStore";

const GroupTab = () => {
  const { groups, fetchGroups } = useGroupStore();
  const { setSelectedGroup } = useChatStore();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  return (
    <div className="p-4">
      <button
        onClick={() => setShowModal(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        + Create Group
      </button>

      {groups.map((group) => (
        <div
          key={group._id}
          onClick={()=> setSelectedGroup(group)}
          className="bg-slate-700 p-4 rounded mb-2 cursor-pointer"
        >
          👥 {group.name}
        </div>
      ))}

      {showModal && <CreateGroupModal close={() => setShowModal(false)} />}
    </div>
  );
};

export default GroupTab;