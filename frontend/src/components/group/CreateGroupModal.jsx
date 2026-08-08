import { useState, useEffect } from "react";
import {useChatStore} from "../../store/useChatStore"
import { useGroupStore } from "../../store/useGroupStore";

const CreateGroupModal = ({ close }) => {
  const { allContacts } = useChatStore();
  const { createGroup } = useGroupStore();

  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);

  const toggleMember = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id)
        ? prev.filter((m) => m !== id)
        : [...prev, id]
    );
  };

  const handleCreate = async () => {
    if (!groupName || selectedMembers.length === 0) {
      alert("Group name and members required");
      return;
    }

    await createGroup(groupName, selectedMembers);
    close();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded w-96">
        <h2 className="text-xl font-bold mb-4">Create Group</h2>

        <input
          type="text"
          placeholder="Group Name"
          className="border p-2 w-full mb-3"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />

        <div className="max-h-40 overflow-y-auto">
          {allContacts?.map((user) => (
            <div key={user._id} className="flex items-center mb-2">
              <input
                type="checkbox"
                onChange={() => toggleMember(user._id)}
              />
              <span className="ml-2">{user.fullName}</span>
            </div>
          ))}
        </div>

        <button
          onClick={handleCreate}
          className="bg-green-600 text-white px-4 py-2 mt-4 rounded"
        >
          Create
        </button>
      </div>
    </div>
  );
};

export default CreateGroupModal;