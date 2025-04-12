import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSleeperAuth } from "@/hooks/useSleeperAuth.js";


export default function Dashboard() {
    const { sleeperId, displayName } = useSleeperAuth();
  const [opponentName, setOpponentName] = useState<string>("this week's matchup");

    useEffect(() => {
    const fetchOpponent = async () => {
        try {
        const res = await fetch(`/api/matchups/${sleeperId}/current`);
        const data = await res.json();
        setOpponentName(data.opponentName || "your opponent");
        } catch (err) {
          console.error("Failed to fetch opponent:", err);
          setOpponentName("your opponent");
        }
    };

    if (sleeperId) fetchOpponent();
  }, [sleeperId]);
  return (
    <div className="flex flex-col min-h-screen bg-[#2c2d31] text-white">
      <div className="w-full px-4 py-6 space-y-6">

        {/* Welcome Section */}
        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold">
              Welcome <span className="text-teal-400">{displayName || "User"}</span>, good luck in your matchup against <span className="text-teal-400">{opponentName || 'this weeks matchup'}</span> this week!
            </h2>
          </CardContent>
        </Card>

        {/* Leagues */}
        <Card>
          <CardHeader>
            <CardTitle>Leagues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 font-semibold text-sm pb-2 border-b border-gray-600">
              <span>League</span>
              <span>Matchup</span>
              <span>Streak</span>
              <span>Dues Paid</span>
            </div>
            <div className="grid grid-cols-4 text-sm py-2">
              <span>Knapp St. Legacy</span>
              <span><a className="text-blue-400 hover:underline" href="#">Subocaj vs Brobeak</a></span>
              <span>W2 <span className="text-green-400">↑</span></span>
              <span><input type="checkbox" /></span>
            </div>
            <div className="grid grid-cols-4 text-sm py-2">
              <span>McVay's Coaching Tree</span>
              <span><a className="text-blue-400 hover:underline" href="#">Subocaj vs Gerbs62</a></span>
              <span>L3 <span className="text-red-400">↓</span></span>
              <span><input type="checkbox" /></span>
            </div>
          </CardContent>
        </Card>

        {/* QuickBet Section */}
        <Card>
          <CardHeader>
            <CardTitle>QuickBet</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>Me vs <span className="text-blue-300">"Matched up user"</span></p>
            <div className="flex justify-between items-center">
              <div>
                <span className="mr-2">Bet on "Me":</span>
                {[1, 5, 10, 20].map((amount) => (
                  <button key={amount} className="bg-teal-600 text-white text-xs font-semibold px-2 py-1 rounded mr-2 hover:bg-teal-700">
                    ${amount}
                  </button>
                ))}
              </div>
              <div>
                <span className="mr-2">Bet on "Them":</span>
                {[1, 5, 10, 20].map((amount) => (
                  <button key={amount} className="bg-rose-600 text-white text-xs font-semibold px-2 py-1 rounded mr-2 hover:bg-rose-700">
                    ${amount}
                  </button>
                ))}
              </div>
            </div>
            <div className="text-right text-sm pt-2">
              <a href="/matchups" className="text-blue-400 hover:underline">[ View all Weekly Matchups ]</a>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Side Bet Section */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Side Bet</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Week 1 Challenge – <span className="text-blue-400 underline">Highest Scoring QB</span></p>
            <p className="text-sm pt-1">Join this challenge? <a href="#" className="text-blue-300 hover:underline">[ Pay to play ]</a></p>
          </CardContent>
        </Card>
      </div>

      {/* Advertisement Footer */}
      <div className="w-full px-4 pb-6">
        <div className="bg-black text-white text-center py-2 rounded">
          Advertisement Goes Here
        </div>
      </div>
    </div>
  );
}