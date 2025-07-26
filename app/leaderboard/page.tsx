'use client';

import { useState } from 'react';
import Leaderboard from '@/components/Leaderboard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, BarChart3, Calendar, Clock, DollarSign, Target, Users, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LeaderboardPage() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('rankings');

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

  const renderAchievements = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card className="bg-slate-800/50 backdrop-blur-sm border-yellow-500/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-yellow-300 flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            传奇商人
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400 text-sm mb-3">连续获胜10场游戏</p>
          <div className="flex items-center gap-2">
            <div className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded text-xs">
              超级稀有
            </div>
            <span className="text-gray-400 text-xs">12人获得</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 backdrop-blur-sm border-blue-500/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-blue-300 flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            百万富翁
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400 text-sm mb-3">单局游戏资产超过100万</p>
          <div className="flex items-center gap-2">
            <div className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs">
              稀有
            </div>
            <span className="text-gray-400 text-xs">89人获得</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 backdrop-blur-sm border-green-500/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-green-300 flex items-center gap-2">
            <Target className="h-5 w-5" />
            精准狙击
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400 text-sm mb-3">成功执行恶意收购</p>
          <div className="flex items-center gap-2">
            <div className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs">
              常见
            </div>
            <span className="text-gray-400 text-xs">234人获得</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 backdrop-blur-sm border-purple-500/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-purple-300 flex items-center gap-2">
            <Clock className="h-5 w-5" />
            马拉松玩家
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400 text-sm mb-3">累计游戏时长超过100小时</p>
          <div className="flex items-center gap-2">
            <div className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded text-xs">
              稀有
            </div>
            <span className="text-gray-400 text-xs">67人获得</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 backdrop-blur-sm border-red-500/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-red-300 flex items-center gap-2">
            <Users className="h-5 w-5" />
            团队合作
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400 text-sm mb-3">参与多人游戏获胜</p>
          <div className="flex items-center gap-2">
            <div className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-xs">
              常见
            </div>
            <span className="text-gray-400 text-xs">456人获得</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 backdrop-blur-sm border-cyan-500/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-cyan-300 flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            股市大亨
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400 text-sm mb-3">单局股票操作盈利超过50万</p>
          <div className="flex items-center gap-2">
            <div className="bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded text-xs">
              稀有
            </div>
            <span className="text-gray-400 text-xs">78人获得</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );

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