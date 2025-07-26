import { Company, GameState, Agent, Building } from './useGameState';

export interface CompetitionEvent {
  id: string;
  timestamp: number;
  type: 'asset_change' | 'building_acquired' | 'company_eliminated' | 'hostile_takeover' | 'market_manipulation';
  initiator: string;
  target?: string;
  description: string;
  impact: number;
}

export interface CompetitionAnalytics {
  totalTransactions: number;
  averageAssetGrowth: number;
  competitionIntensity: number;
  marketShare: Record<string, number>;
  buildingControl: Record<string, number>;
  riskLevel: number;
}

export class CompetitionEngine {
  private events: CompetitionEvent[] = [];
  private eliminationThreshold = 50000; // 公司破产阈值：5万资产
  private victoryAssetRatio = 0.6; // 胜利条件：控制60%的总资产

  // 检查资产变化并记录事件
  checkAssetChanges(previousState: GameState, currentState: GameState): CompetitionEvent[] {
    const newEvents: CompetitionEvent[] = [];

    currentState.companies.forEach(currentCompany => {
      const previousCompany = previousState.companies.find(c => c.id === currentCompany.id);
      if (previousCompany && previousCompany.assets !== currentCompany.assets) {
        const change = currentCompany.assets - previousCompany.assets;
        
        newEvents.push({
          id: `asset_${Date.now()}_${currentCompany.id}`,
          timestamp: Date.now(),
          type: 'asset_change',
          initiator: currentCompany.id,
          description: change > 0 
            ? `${currentCompany.name}资产增加 ¥${change.toLocaleString()}`
            : `${currentCompany.name}资产减少 ¥${Math.abs(change).toLocaleString()}`,
          impact: Math.abs(change)
        });

        // 检查是否接近破产
        if (currentCompany.assets < this.eliminationThreshold && currentCompany.status === 'active') {
          newEvents.push({
            id: `warning_${Date.now()}_${currentCompany.id}`,
            timestamp: Date.now(),
            type: 'asset_change',
            initiator: currentCompany.id,
            description: `⚠️ ${currentCompany.name}资产危急，濒临破产！`,
            impact: this.eliminationThreshold - currentCompany.assets
          });
        }
      }
    });

    return newEvents;
  }

  // 检查建筑收购事件
  checkBuildingAcquisitions(previousState: GameState, currentState: GameState): CompetitionEvent[] {
    const newEvents: CompetitionEvent[] = [];

    currentState.buildings.forEach(currentBuilding => {
      const previousBuilding = previousState.buildings.find(b => b.id === currentBuilding.id);
      if (previousBuilding && previousBuilding.owner !== currentBuilding.owner && currentBuilding.owner) {
        const acquirer = currentState.companies.find(c => c.id === currentBuilding.owner);
        const previousOwner = previousBuilding.owner 
          ? currentState.companies.find(c => c.id === previousBuilding.owner)
          : null;

        newEvents.push({
          id: `acquisition_${Date.now()}_${currentBuilding.id}`,
          timestamp: Date.now(),
          type: 'building_acquired',
          initiator: currentBuilding.owner,
          target: previousBuilding.owner || undefined,
          description: previousOwner 
            ? `${acquirer?.name}从${previousOwner.name}手中收购了${currentBuilding.name}`
            : `${acquirer?.name}收购了${currentBuilding.name}`,
          impact: currentBuilding.income * 12 // 年收入估值
        });
      }
    });

    return newEvents;
  }

  // 检查公司消除
  checkEliminations(gameState: GameState): { 
    eliminatedCompanies: Company[], 
    updatedState: GameState,
    events: CompetitionEvent[]
  } {
    const eliminatedCompanies: Company[] = [];
    const events: CompetitionEvent[] = [];

    // 找出破产公司
    const bankruptCompanies = gameState.companies.filter(
      company => company.assets <= 0 && company.status === 'active'
    );

    bankruptCompanies.forEach(company => {
      eliminatedCompanies.push(company);
      
      events.push({
        id: `elimination_${Date.now()}_${company.id}`,
        timestamp: Date.now(),
        type: 'company_eliminated',
        initiator: 'system',
        target: company.id,
        description: `💀 ${company.name}已破产出局`,
        impact: Math.abs(company.assets)
      });
    });

    // 更新游戏状态
    const updatedState: GameState = {
      ...gameState,
      companies: gameState.companies.map(company =>
        bankruptCompanies.some(bc => bc.id === company.id)
          ? { ...company, status: 'bankrupt' as const }
          : company
      ),
      // 释放破产公司的建筑
      buildings: gameState.buildings.map(building =>
        bankruptCompanies.some(bc => bc.id === building.owner)
          ? { ...building, owner: undefined }
          : building
      )
    };

    return { eliminatedCompanies, updatedState, events };
  }

  // 检查胜利条件
  checkVictoryConditions(gameState: GameState): {
    isGameOver: boolean;
    winner: Company | null;
    reason: string;
  } {
    const activeCompanies = gameState.companies.filter(c => c.status === 'active');
    
    // 条件1：只剩下一家公司
    if (activeCompanies.length === 1) {
      return {
        isGameOver: true,
        winner: activeCompanies[0],
        reason: '消灭了所有竞争对手'
      };
    }

    // 条件2：某公司控制超过60%的总资产
    const totalAssets = activeCompanies.reduce((sum, company) => sum + company.assets, 0);
    const dominantCompany = activeCompanies.find(
      company => (company.assets / totalAssets) >= this.victoryAssetRatio
    );

    if (dominantCompany) {
      return {
        isGameOver: true,
        winner: dominantCompany,
        reason: `控制了${Math.round((dominantCompany.assets / totalAssets) * 100)}%的市场资产`
      };
    }

    // 条件3：玩家破产
    const playerCompany = gameState.companies.find(c => c.isPlayer);
    if (playerCompany && playerCompany.status === 'bankrupt') {
      const richestAI = activeCompanies
        .filter(c => !c.isPlayer)
        .sort((a, b) => b.assets - a.assets)[0];

      return {
        isGameOver: true,
        winner: richestAI || null,
        reason: '玩家公司破产'
      };
    }

    return {
      isGameOver: false,
      winner: null,
      reason: ''
    };
  }

  // 计算竞争分析数据
  calculateAnalytics(gameState: GameState): CompetitionAnalytics {
    const activeCompanies = gameState.companies.filter(c => c.status === 'active');
    const totalAssets = activeCompanies.reduce((sum, c) => sum + c.assets, 0);
    const totalBuildings = gameState.buildings.length;

    // 市场份额计算
    const marketShare: Record<string, number> = {};
    activeCompanies.forEach(company => {
      marketShare[company.id] = totalAssets > 0 ? (company.assets / totalAssets) * 100 : 0;
    });

    // 建筑控制计算
    const buildingControl: Record<string, number> = {};
    activeCompanies.forEach(company => {
      const ownedBuildings = gameState.buildings.filter(b => b.owner === company.id).length;
      buildingControl[company.id] = totalBuildings > 0 ? (ownedBuildings / totalBuildings) * 100 : 0;
    });

    // 计算资产增长率（基于最近的事件）
    const recentAssetEvents = this.events
      .filter(e => e.type === 'asset_change' && e.timestamp > Date.now() - 60000) // 最近1分钟
      .slice(-10); // 最近10个事件

    const averageAssetGrowth = recentAssetEvents.length > 0
      ? recentAssetEvents.reduce((sum, e) => sum + e.impact, 0) / recentAssetEvents.length
      : 0;

    // 竞争激烈程度（基于最近的活动频率）
    const recentEvents = this.events.filter(e => e.timestamp > Date.now() - 30000); // 最近30秒
    const competitionIntensity = Math.min(recentEvents.length / 10, 1) * 100; // 标准化到0-100

    // 风险级别（基于资产波动性）
    const assetChanges = recentAssetEvents.map(e => e.impact);
    const variance = assetChanges.length > 0
      ? assetChanges.reduce((sum, change) => sum + Math.pow(change - averageAssetGrowth, 2), 0) / assetChanges.length
      : 0;
    const riskLevel = Math.min(Math.sqrt(variance) / 100000, 1) * 100; // 标准化风险级别

    return {
      totalTransactions: this.events.length,
      averageAssetGrowth,
      competitionIntensity,
      marketShare,
      buildingControl,
      riskLevel
    };
  }

  // 执行敌对收购
  executeHostileTakeover(
    attackerCompany: Company,
    targetCompany: Company,
    gameState: GameState
  ): { 
    success: boolean, 
    cost: number, 
    updatedState: GameState,
    event: CompetitionEvent 
  } {
    // 计算收购成本（目标公司资产的150%）
    const cost = Math.floor(targetCompany.assets * 1.5);
    const success = attackerCompany.assets >= cost;

    let updatedState = gameState;
    
    if (success) {
      // 执行收购
      updatedState = {
        ...gameState,
        companies: gameState.companies.map(company => {
          if (company.id === attackerCompany.id) {
            return {
              ...company,
              assets: company.assets - cost,
              buildings: [...company.buildings, ...targetCompany.buildings]
            };
          }
          if (company.id === targetCompany.id) {
            return {
              ...company,
              status: 'bankrupt' as const,
              assets: 0,
              buildings: []
            };
          }
          return company;
        }),
        // 转移建筑所有权
        buildings: gameState.buildings.map(building =>
          building.owner === targetCompany.id
            ? { ...building, owner: attackerCompany.id }
            : building
        )
      };
    }

    const event: CompetitionEvent = {
      id: `takeover_${Date.now()}_${attackerCompany.id}_${targetCompany.id}`,
      timestamp: Date.now(),
      type: 'hostile_takeover',
      initiator: attackerCompany.id,
      target: targetCompany.id,
      description: success 
        ? `🏢 ${attackerCompany.name}成功收购了${targetCompany.name}（成本：¥${cost.toLocaleString()}）`
        : `❌ ${attackerCompany.name}试图收购${targetCompany.name}但资金不足`,
      impact: cost
    };

    return { success, cost, updatedState, event };
  }

  // 添加事件到历史记录
  addEvent(event: CompetitionEvent): void {
    this.events.push(event);
    // 保持事件历史在合理范围内（最多1000个事件）
    if (this.events.length > 1000) {
      this.events = this.events.slice(-1000);
    }
  }

  // 批量添加事件
  addEvents(events: CompetitionEvent[]): void {
    events.forEach(event => this.addEvent(event));
  }

  // 获取最近事件
  getRecentEvents(limit: number = 10): CompetitionEvent[] {
    return this.events
      .slice(-limit)
      .reverse(); // 最新的在前
  }

  // 清除历史事件（用于重置游戏）
  clearEvents(): void {
    this.events = [];
  }

  // 设置破产阈值
  setEliminationThreshold(threshold: number): void {
    this.eliminationThreshold = threshold;
  }

  // 设置胜利资产比例
  setVictoryAssetRatio(ratio: number): void {
    this.victoryAssetRatio = Math.min(Math.max(ratio, 0.1), 1); // 限制在10%-100%之间
  }
}