import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { gameStatistics, users, playerAchievements, unlockedAchievements } from '@/lib/db/schema';
import { desc, eq, sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sortBy = searchParams.get('sortBy') || 'gamesWon';
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Validate sortBy parameter
    const validSortFields = ['gamesWon', 'gamesPlayed', 'averageRank', 'totalPlayTime', 'highestAssets', 'achievementPoints', 'achievementCount'];
    if (!validSortFields.includes(sortBy)) {
      return NextResponse.json(
        { error: 'Invalid sortBy parameter' },
        { status: 400 }
      );
    }

    // Build the query based on sort field
    let orderBy;
    switch (sortBy) {
      case 'gamesWon':
        orderBy = desc(gameStatistics.gamesWon);
        break;
      case 'gamesPlayed':
        orderBy = desc(gameStatistics.gamesPlayed);
        break;
      case 'averageRank':
        orderBy = gameStatistics.averageRank; // Lower rank is better
        break;
      case 'totalPlayTime':
        orderBy = desc(gameStatistics.totalPlayTime);
        break;
      case 'highestAssets':
        orderBy = desc(gameStatistics.highestAssets);
        break;
      case 'achievementPoints':
        orderBy = desc(playerAchievements.totalPoints);
        break;
      case 'achievementCount':
        orderBy = desc(playerAchievements.unlockedCount);
        break;
      default:
        orderBy = desc(gameStatistics.gamesWon);
    }

    // Get leaderboard data
    const leaderboardData = await db
      .select({
        userId: gameStatistics.userId,
        userName: users.name,
        email: users.email,
        gamesPlayed: gameStatistics.gamesPlayed,
        gamesWon: gameStatistics.gamesWon,
        averageRank: gameStatistics.averageRank,
        totalPlayTime: gameStatistics.totalPlayTime,
        highestAssets: gameStatistics.highestAssets,
        lastPlayed: gameStatistics.lastPlayed,
        winRate: sql<number>`CASE WHEN ${gameStatistics.gamesPlayed} > 0 THEN ROUND((${gameStatistics.gamesWon}::decimal / ${gameStatistics.gamesPlayed}::decimal * 100), 2) ELSE 0 END`,
        // Achievement data
        achievementPoints: playerAchievements.totalPoints,
        achievementCount: playerAchievements.unlockedCount,
        badges: playerAchievements.badges,
        titles: playerAchievements.titles,
      })
      .from(gameStatistics)
      .innerJoin(users, eq(gameStatistics.userId, users.id))
      .leftJoin(playerAchievements, eq(gameStatistics.userId, playerAchievements.userId))
      .where(sql`${gameStatistics.gamesPlayed} > 0`) // Only include players who have played at least one game
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    // Add ranking
    const rankedLeaderboard = leaderboardData.map((player, index) => ({
      ...player,
      rank: offset + index + 1,
    }));

    return NextResponse.json({
      success: true,
      data: rankedLeaderboard,
      meta: {
        sortBy,
        limit,
        offset,
        total: rankedLeaderboard.length,
      },
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, gameResult } = await request.json();

    // Validate required fields
    if (!userId || !gameResult) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { won, rank, assets, playTime } = gameResult;

    // Update or create game statistics
    const existingStats = await db
      .select()
      .from(gameStatistics)
      .where(eq(gameStatistics.userId, userId))
      .limit(1);

    if (existingStats.length > 0) {
      // Update existing statistics
      const stats = existingStats[0];
      const newGamesPlayed = stats.gamesPlayed + 1;
      const newGamesWon = stats.gamesWon + (won ? 1 : 0);
      const newAverageRank = Math.round((stats.averageRank * stats.gamesPlayed + rank) / newGamesPlayed);
      const newTotalPlayTime = stats.totalPlayTime + playTime;
      const newHighestAssets = Math.max(stats.highestAssets, assets);

      await db
        .update(gameStatistics)
        .set({
          gamesPlayed: newGamesPlayed,
          gamesWon: newGamesWon,
          averageRank: newAverageRank,
          totalPlayTime: newTotalPlayTime,
          highestAssets: newHighestAssets,
          lastPlayed: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(gameStatistics.userId, userId));
    } else {
      // Create new statistics record
      await db
        .insert(gameStatistics)
        .values({
          userId,
          gamesPlayed: 1,
          gamesWon: won ? 1 : 0,
          averageRank: rank,
          totalPlayTime: playTime,
          highestAssets: assets,
          lastPlayed: new Date(),
        });
    }

    return NextResponse.json({
      success: true,
      message: 'Statistics updated successfully',
    });
  } catch (error) {
    console.error('Error updating statistics:', error);
    return NextResponse.json(
      { error: 'Failed to update statistics' },
      { status: 500 }
    );
  }
}