import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
import LinkSleeperModal from "../components/linkSleeperModal";

export default function MyProfile() {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!user) {
    return (
      <div className="text-center text-white mt-10">
        <p>You must be logged in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 mt-10 bg-[#1f1f22] rounded-lg shadow-lg text-white space-y-6">
      <h1 className="text-2xl font-bold text-teal-400">My Profile</h1>

      {/* App Account Info */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Account Info</h2>
        <div className="space-y-2 text-sm">
          <p><span className="font-medium text-gray-300">Username:</span> {user.username}</p>
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
          <div className="flex items-center space-x-4">
            {user.avatar && (
              <img
                src={`https://sleepercdn.com/avatars/${user.avatar}`}
                alt="Sleeper Avatar"
                className="w-12 h-12 rounded-full"
              />
            )}
            <div className="text-sm">
              <p><span className="font-medium text-gray-300">Display Name:</span> {user.display_name}</p>
              <p><span className="font-medium text-gray-300">Sleeper ID:</span> {user.sleeper_id}</p>
            </div>
          </div>
        )}
      </div>

      <LinkSleeperModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}