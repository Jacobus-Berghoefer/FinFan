import { useAuth } from "../hooks/useAuth";
import { useState, useEffect } from "react";
import LinkSleeperModal from "../components/linkSleeperModal";
import { Dialog } from "@headlessui/react";
import toast from "react-hot-toast";

export default function MyProfile() {
  const { user, setUser } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedName, setSelectedName] = useState<"app" | "sleeper" | null>(null);

  const [isUsingAppUsername, setIsUsingAppUsername] = useState(false);
  const [isUsingSleeperName, setIsUsingSleeperName] = useState(false);

  useEffect(() => {
    if (!user) return;
  
    const usingApp = user.display_name === user.username;
    const usingSleeper = user.sleeper_linked && user.display_name === user.sleeper_display_name;
  
    setIsUsingAppUsername(usingApp);
    setIsUsingSleeperName(usingSleeper);
  }, [user]);

  if (!user) {
    return (
      <div className="text-center text-white mt-10">
        <p>You must be logged in to view your profile.</p>
      </div>
    );
  }

  const handleNameToggle = (target: "app" | "sleeper") => {
    // prevent re-selecting current name
    if ((target === "app" && isUsingAppUsername) || (target === "sleeper" && isUsingSleeperName)) return;
    setSelectedName(target);
    setConfirmModalOpen(true);
  };

  const handleConfirmSwitch = async () => {
    if (!selectedName) return;

    const newDisplay =
    selectedName === "app" ? user.username : user.sleeper_display_name ?? user.display_name;

    const toastId = toast.loading("Updating display name...");

    try {
      const res = await fetch("/api/user/display-name", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ newDisplayName: newDisplay }),
      });

      const data = await res.json();

      if (res.ok) {
        setUser({
            ...data,
            sleeper_display_name: data.sleeper_display_name ?? user.sleeper_display_name,
          });
        toast.success("Display name updated!", { id: toastId });
      } else {
        toast.error(data.error || "Update failed", { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error", { id: toastId });
    } finally {
      setConfirmModalOpen(false);
      setSelectedName(null);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 mt-10 bg-[#1f1f22] rounded-lg shadow-lg text-white space-y-6">
      <h1 className="text-2xl font-bold text-teal-400">My Profile</h1>
  
      {/* App Account Info */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Account Info</h2>
        <div className="space-y-2 text-sm">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={isUsingAppUsername}
              onChange={() => handleNameToggle("app")}
              disabled={isUsingAppUsername}
            />
            <span>
              Use <strong>{user.username}</strong> as display name
            </span>
          </label>
          <p><span className="font-medium text-gray-300">Password:</span> ********</p>
        </div>
      </div>
  
      {/* Sleeper Account Info */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Sleeper Account</h2>
  
        {!user.sleeper_linked ? (
          <>
            <p className="text-sm text-gray-400 mb-2">No Sleeper account linked.</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded text-sm"
            >
              Link Sleeper Account
            </button>
          </>
        ) : (
          <>
            <div className="flex items-center space-x-4 mb-2">
              {user.avatar && (
                <img
                  src={`https://sleepercdn.com/avatars/${user.avatar}`}
                  alt="Sleeper Avatar"
                  className="w-12 h-12 rounded-full"
                />
              )}
              <div className="text-sm">
                <p><span className="font-medium text-gray-300">Sleeper ID:</span> {user.sleeper_id}</p>
                <p><span className="font-medium text-gray-300">Sleeper Name:</span> {user.sleeper_display_name ?? "N/A"}</p>
              </div>
            </div>
            <label className="flex items-center space-x-2 text-sm">
                <input
                    type="checkbox"
                    checked={isUsingSleeperName}
                    onChange={() => handleNameToggle("sleeper")}
                    disabled={isUsingSleeperName}
                />
                <span>Use <strong>{user.sleeper_display_name ?? user.display_name}</strong> as display name</span>
            </label>
          </>
        )}
      </div>
  
      {/* Modals */}
      <LinkSleeperModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
  
      <Dialog open={confirmModalOpen} onClose={() => setConfirmModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-[#1e1f25] p-6 rounded-lg max-w-sm w-full text-white">
            <Dialog.Title className="text-lg font-semibold mb-4">Confirm Display Name Change</Dialog.Title>
            <p className="mb-6 text-sm text-gray-300">
              Use <strong>{selectedName === "app" ? user.username : user.sleeper_display_name ?? user.display_name}</strong> as your public display name?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={handleConfirmSwitch}
                className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded text-sm"
              >
                Confirm
              </button>
              <button
                onClick={() => setConfirmModalOpen(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm"
              >
                Cancel
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}