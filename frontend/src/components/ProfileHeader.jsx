import { useChatStore } from "../store/useChatStore";
import { LogOut } from "lucide-react";

function ProfileHeader() {
  const { authUser, logout } = useChatStore();

  return (
    <div className="p-4 border-b border-slate-700/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {authUser?.profilePic && (
            <img
              src={authUser.profilePic}
              alt={authUser.fullName}
              className="w-10 h-10 rounded-full object-cover"
            />
          )}
          <div>
            <h2 className="text-sm font-semibold text-white">{authUser?.fullName}</h2>
            <p className="text-xs text-slate-400">{authUser?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
          title="Logout"
        >
          <LogOut size={18} className="text-slate-300" />
        </button>
      </div>
    </div>
  );
}

export default ProfileHeader;
