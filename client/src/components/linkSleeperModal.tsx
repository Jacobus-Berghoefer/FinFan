import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";

interface SleeperUser {
  display_name: string;
  username: string;
  avatar: string | null;
  user_id: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function LinkSleeperModal({ isOpen, onClose }: Props) {
  const { user, setUser } = useAuth();
  const [sleeperUsername, setSleeperUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [sleeperUser, setSleeperUser] = useState<SleeperUser | null>(null);
  const [useSleeperName, setUseSleeperName] = useState(true);

  const fetchSleeperData = async () => {
    setLoading(true);

    try {
      const res = await fetch(`https://api.sleeper.app/v1/user/${sleeperUsername}`);
      const data = await res.json();

      if (!data.user_id) throw new Error("User not found");

      setSleeperUser(data);
    } catch (err) {
      setSleeperUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLinkAccount = async () => {
    if (!user || !sleeperUser) return;
  
    const toastId = toast.loading("Linking account...");
  
    try {
      const res = await fetch("/api/sleeper/link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          sleeper_id: sleeperUser.user_id,
          avatar: sleeperUser.avatar,
          display_name: useSleeperName ? sleeperUser.display_name : user.display_name,
        }),
      });
  
      const data = await res.json();
  
      if (res.ok) {
        toast.success("Sleeper account linked!", { id: toastId });
        setUser(data);
        onClose();
      } else {
        toast.error(data.error || "Failed to link account", { id: toastId });
      }
    } catch (err) {
      toast.error("Something went wrong!", { id: toastId });
      console.error(err);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-[#1e1f25] p-6 rounded-lg max-w-md w-full text-white shadow-lg">
          <Dialog.Title className="text-lg font-semibold mb-4">Link Sleeper Account</Dialog.Title>

          {!sleeperUser ? (
            <>
              <label className="block text-sm mb-2">Enter Sleeper Username:</label>
              <input
                type="text"
                value={sleeperUsername}
                onChange={(e) => setSleeperUsername(e.target.value)}
                className="w-full p-2 rounded bg-[#2c2d31] text-white border border-gray-600 mb-4"
              />
              <button
                onClick={fetchSleeperData}
                disabled={loading || !sleeperUsername}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 rounded"
              >
                {loading ? "Fetching..." : "Fetch Info"}
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center space-x-4 mb-4">
                {sleeperUser.avatar && (
                  <img
                    src={`https://sleepercdn.com/avatars/${sleeperUser.avatar}`}
                    alt="Sleeper Avatar"
                    className="w-12 h-12 rounded-full"
                  />
                )}
                <div>
                  <p className="font-semibold">{sleeperUser.display_name}</p>
                  <p className="text-sm text-gray-400">@{sleeperUser.username}</p>
                </div>
              </div>

              <label className="flex items-center space-x-2 text-sm mb-4">
                <input
                  type="checkbox"
                  checked={useSleeperName}
                  onChange={() => setUseSleeperName(!useSleeperName)}
                />
                <span>Use Sleeper display name as my new name</span>
              </label>

              <div className="flex justify-between gap-2">
                <button
                  onClick={handleLinkAccount}
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-2 rounded"
                >
                  Confirm
                </button>
                <button
                  onClick={() => {
                    setSleeperUser(null);
                    setSleeperUsername("");
                  }}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </>
          )}

        </Dialog.Panel>
      </div>
    </Dialog>
  );
}