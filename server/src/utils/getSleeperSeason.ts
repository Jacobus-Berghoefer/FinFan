export function getCurrentSleeperSeason(): number {
    const now = new Date();
    const year = now.getFullYear();
  
    // Fantasy season runs from August to early February (based on NFL playoffs)
    // If it's Jan or Feb, we're still in *last year's* Sleeper season
    const isOffseason = now.getMonth() < 2; // Jan = 0, Feb = 1
  
    return isOffseason ? year - 1 : year;
  }