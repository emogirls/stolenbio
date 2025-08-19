import { useState, useEffect } from 'react';

export interface LeaderboardEntry {
  username: string;
  name: string;
  score: number;
  userId: string;
}

export interface LeaderboardData {
  views: LeaderboardEntry[];
  affiliates: LeaderboardEntry[];
  spenders: LeaderboardEntry[];
}

const createPlaceholderEntries = (type: 'views' | 'affiliates' | 'spenders'): LeaderboardEntry[] => {
  const scoreLabel = type === 'views' ? 'views' : type === 'affiliates' ? 'recruits' : 'coins spent';
  
  return [
    {
      username: 'awaiting_champion',
      name: 'Awaiting Champion',
      score: 0,
      userId: 'placeholder-1'
    },
    {
      username: 'seeking_warrior',
      name: 'Seeking Warrior', 
      score: 0,
      userId: 'placeholder-2'
    },
    {
      username: 'future_legend',
      name: 'Future Legend',
      score: 0,
      userId: 'placeholder-3'
    }
  ];
};

export function useLeaderboards(accessToken?: string) {
  const [leaderboards, setLeaderboards] = useState<LeaderboardData>({
    views: createPlaceholderEntries('views'),
    affiliates: createPlaceholderEntries('affiliates'),
    spenders: createPlaceholderEntries('spenders')
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboards = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Prepare headers with authorization if available
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }

      const [viewsRes, affiliatesRes, spendersRes] = await Promise.all([
        fetch('/api/leaderboards?type=views&period=monthly', { headers }),
        fetch('/api/leaderboards?type=affiliates', { headers }),
        fetch('/api/leaderboards?type=spenders', { headers })
      ]);

      // Initialize with placeholder data
      let views: LeaderboardEntry[] = createPlaceholderEntries('views');
      let affiliates: LeaderboardEntry[] = createPlaceholderEntries('affiliates');
      let spenders: LeaderboardEntry[] = createPlaceholderEntries('spenders');

      // Parse views leaderboard
      if (viewsRes.ok) {
        try {
          const viewsData = await viewsRes.json();
          if (Array.isArray(viewsData.leaderboard) && viewsData.leaderboard.length > 0) {
            views = viewsData.leaderboard.slice(0, 10);
          }
        } catch (parseError) {
          console.warn('Error parsing views leaderboard:', parseError);
        }
      } else if (viewsRes.status === 401) {
        console.warn('Views leaderboard requires authentication - using placeholders');
      } else {
        console.warn('Views leaderboard API returned:', viewsRes.status, viewsRes.statusText);
      }

      // Parse affiliates leaderboard
      if (affiliatesRes.ok) {
        try {
          const affiliatesData = await affiliatesRes.json();
          if (Array.isArray(affiliatesData.leaderboard) && affiliatesData.leaderboard.length > 0) {
            affiliates = affiliatesData.leaderboard.slice(0, 5);
          }
        } catch (parseError) {
          console.warn('Error parsing affiliates leaderboard:', parseError);
        }
      } else if (affiliatesRes.status === 401) {
        console.warn('Affiliates leaderboard requires authentication - using placeholders');
      } else {
        console.warn('Affiliates leaderboard API returned:', affiliatesRes.status, affiliatesRes.statusText);
      }

      // Parse spenders leaderboard
      if (spendersRes.ok) {
        try {
          const spendersData = await spendersRes.json();
          if (Array.isArray(spendersData.leaderboard) && spendersData.leaderboard.length > 0) {
            spenders = spendersData.leaderboard.slice(0, 5);
          }
        } catch (parseError) {
          console.warn('Error parsing spenders leaderboard:', parseError);
        }
      } else if (spendersRes.status === 401) {
        console.warn('Spenders leaderboard requires authentication - using placeholders');
      } else {
        console.warn('Spenders leaderboard API returned:', spendersRes.status, spendersRes.statusText);
      }

      // Ensure we always have at least 3 entries with placeholders mixed in
      const ensureMinEntries = (entries: LeaderboardEntry[], type: 'views' | 'affiliates' | 'spenders'): LeaderboardEntry[] => {
        const placeholders = createPlaceholderEntries(type);
        const combined = [...entries];
        
        // Fill empty spots with placeholders up to 3 minimum
        while (combined.length < 3) {
          const placeholderIndex = combined.length;
          if (placeholderIndex < placeholders.length) {
            combined.push(placeholders[placeholderIndex]);
          } else {
            break;
          }
        }
        
        return combined;
      };

      setLeaderboards({
        views: ensureMinEntries(views, 'views'),
        affiliates: ensureMinEntries(affiliates, 'affiliates'),
        spenders: ensureMinEntries(spenders, 'spenders')
      });

    } catch (networkError) {
      console.error('Network error fetching leaderboards:', networkError);
      setError('Failed to load leaderboards. Using placeholder data.');
      
      // Keep placeholder data on network error
      setLeaderboards({
        views: createPlaceholderEntries('views'),
        affiliates: createPlaceholderEntries('affiliates'),
        spenders: createPlaceholderEntries('spenders')
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboards();
  }, [accessToken]);

  return { 
    leaderboards, 
    loading, 
    error,
    refetch: fetchLeaderboards 
  };
}