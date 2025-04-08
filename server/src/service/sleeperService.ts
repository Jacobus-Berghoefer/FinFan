import axios from 'axios';

export const getLeagueUsers = async (leagueId: string) => {
  const response = await axios.get(`https://api.sleeper.app/v1/league/${leagueId}/users`);
  return response.data;
};
