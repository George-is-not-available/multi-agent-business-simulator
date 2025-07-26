'use client';

import { useState, useEffect } from 'react';
import Leaderboard from '@/components/Leaderboard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, BarChart3, Calendar, Clock, DollarSign, Target, Users, ArrowLeft, Award, Star, Crown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AchievementProgress, RecentAchievements, AchievementBadge } from '@/components/AchievementBadge';
import { ACHIEVEMENTS } from '@/lib/game/achievements';

export default function LeaderboardPage() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('rankings');
  const [achievementData, setAchievementData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRarity, setSelectedRarity] = useState<string>('all');
  const [showUnlockedOnly, setShowUnlockedOnly] = useState(false);

  const fetchAchievementData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/achievements');
      const data = await response.json();
      if (data.success) {
        setAchievementData(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch achievement data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedTab === 'achievements') {
      fetchAchievementData();
    }
  }, [selectedTab]);

  const tabs = [
    { id: 'rankings', label: '排行榜', icon: Trophy },
    { id: 'statistics', label: '统计数据', icon: BarChart3 },
    { id: 'achievements', label: '成就', icon: Target },
  ];

  const renderStatistics = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="bg-slate-800/50 backdrop-blur-sm border-blue-500/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-blue-300 flex items-center gap-2">
            <Users className="h-5 w-5" />
            玩家统计
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">总玩家数</span>
              <span className="text-white font-medium">1,234</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">活跃玩家</span>
              <span className="text-green-400 font-medium">892</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">新用户（本周）</span>
              <span className="text-blue-400 font-medium">156</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 backdrop-blur-sm border-blue-500/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-blue-300 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            游戏统计
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">总游戏场次</span>
              <span className="text-white font-medium">5,678</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">今日游戏</span>
              <span className="text-green-400 font-medium">234</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">平均时长</span>
              <span className="text-blue-400 font-medium">12.5分钟</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 backdrop-blur-sm border-blue-500/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-blue-300 flex items-center gap-2">
            <Clock className="h-5 w-5" />
            时间统计
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">总游戏时长</span>
              <span className="text-white font-medium">1,234小时</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">平均在线时长</span>
              <span className="text-green-400 font-medium">45分钟</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">峰值在线</span>
              <span className="text-blue-400 font-medium">67人</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 backdrop-blur-sm border-blue-500/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-blue-300 flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            资产统计
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">最高资产记录</span>
              <span className="text-white font-medium">$12.5M</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">平均资产</span>
              <span className="text-green-400 font-medium">$2.1M</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">总资产流通</span>
              <span className="text-blue-400 font-medium">$456M</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAchievements = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
        </div>
      );
    }

    if (!achievementData) {
      return (
        <div className="text-center text-gray-400 py-12">
          <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>暂无成就数据</p>
        </div>
      );
    }

    const categories = ['all', 'business', 'competition', 'strategy', 'collection', 'special'];
    const rarities = ['all', 'common', 'uncommon', 'rare', 'epic', 'legendary'];
    
    const filteredAchievements = ACHIEVEMENTS.filter(achievement => {
      const categoryMatch = selectedCategory === 'all' || achievement.category === selectedCategory;
      const rarityMatch = selectedRarity === 'all' || achievement.rarity === selectedRarity;
      return categoryMatch && rarityMatch;
    });

    return (
      <div className="space-y-6">
        {/* 成就统计概览 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-slate-800/50 backdrop-blur-sm border-blue-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Trophy className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{ACHIEVEMENTS.length}</p>
                  <p className="text-sm text-gray-400">总成就数</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 backdrop-blur-sm border-yellow-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                  <Star className="h-6 w-6 text-yellow-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{achievementData.leaderboard?.length || 0}</p>
                  <p className="text-sm text-gray-400">玩家参与</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 backdrop-blur-sm border-purple-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Crown className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{ACHIEVEMENTS.filter(a => a.rarity === 'legendary').length}</p>
                  <p className="text-sm text-gray-400">传奇成就</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 过滤器 */}
        <Card className="bg-slate-800/50 backdrop-blur-sm border-blue-500/30">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-300">类别:</span>
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-slate-700 border border-slate-600 rounded px-3 py-1 text-sm text-white"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat === 'all' ? '全部' : cat}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-300">稀有度:</span>
                <select 
                  value={selectedRarity}
                  onChange={(e) => setSelectedRarity(e.target.value)}
                  className="bg-slate-700 border border-slate-600 rounded px-3 py-1 text-sm text-white"
                >
                  {rarities.map(rarity => (
                    <option key={rarity} value={rarity}>
                      {rarity === 'all' ? '全部' : rarity}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 成就网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredAchievements.map((achievement) => (
            <AchievementBadge
              key={achievement.id}
              achievement={achievement}
              unlocked={false} // 这里需要实际的解锁状态
            />
          ))}
        </div>

        {filteredAchievements.length === 0 && (
          <div className="text-center text-gray-400 py-12">
            <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>没有找到符合条件的成就</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => router.push('/')}
              variant="outline"
              size="sm"
              className="border-blue-500/30 hover:border-blue-400"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回主页
            </Button>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                游戏排行榜
              </h1>
              <p className="text-blue-200 mt-1">查看玩家排名、统计数据和成就</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              variant={selectedTab === tab.id ? "default" : "outline"}
              className={`flex items-center gap-2 ${
                selectedTab === tab.id
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'border-blue-500/30 hover:border-blue-400'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-6">
          {selectedTab === 'rankings' && (
            <Leaderboard className="min-h-[600px]" />
          )}
          
          {selectedTab === 'statistics' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-blue-300 mb-4">游戏统计概览</h2>
              {renderStatistics()}
            </div>
          )}
          
          {selectedTab === 'achievements' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-blue-300 mb-4">成就系统</h2>
              {renderAchievements()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}