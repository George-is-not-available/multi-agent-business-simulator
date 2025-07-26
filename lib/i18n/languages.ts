export type Language = 'zh' | 'en';

export interface Translation {
  // 通用
  common: {
    confirm: string;
    cancel: string;
    save: string;
    loading: string;
    error: string;
    success: string;
    warning: string;
    info: string;
  };
  
  // 游戏基础
  game: {
    title: string;
    subtitle: string;
    description: string;
    company: string;
    assets: string;
    employees: string;
    buildings: string;
    turn: string;
    status: string;
    actions: string;
  };
  
  // 公司相关
  company: {
    myCompany: string;
    competitor: string;
    active: string;
    bankrupt: string;
    centralizedManagement: string;
    decentralizedManagement: string;
    neuralWorkforce: string;
    aeroVitaEnterprise: string;
  };
  
  // 建筑相关
  buildings: {
    tradeCenter: string;
    hospital: string;
    company: string;
    realEstate: string;
    hotel: string;
    apartment: string;
    purchase: string;
    recruit: string;
    upgrade: string;
    income: string;
    level: string;
    owned: string;
    available: string;
  };
  
  // 智能体和动作
  agents: {
    idle: string;
    moving: string;
    working: string;
    attacking: string;
    selectAgent: string;
    moveAgent: string;
    purchaseBuilding: string;
    recruitEmployee: string;
    attack: string;
    intelligence: string;
    move: string;
    negotiation: string;
    espionage: string;
    management: string;
  };
  
  // 股票市场
  stockMarket: {
    title: string;
    manipulation: string;
    priceManipulation: string;
    volumeManipulation: string;
    newsManipulation: string;
    algorithmicTrading: string;
    shortSelling: string;
    pumpAndDump: string;
    spoofing: string;
    execute: string;
    cost: string;
    success: string;
    failure: string;
  };
  
  // 竞争系统
  competition: {
    title: string;
    ranking: string;
    marketShare: string;
    buildingControl: string;
    totalTransactions: string;
    averageAssetGrowth: string;
    competitionIntensity: string;
    riskLevel: string;
    hostileTakeover: string;
    eliminationMechanism: string;
    activated: string;
    gracePeriod: string;
    timeRemaining: string;
    safetyPeriod: string;
    preparingElimination: string;
    aboutToActivate: string;
    eliminationActivated: string;
    assetsZeroEliminated: string;
    competitionIntensified: string;
  };
  
  // AI系统
  ai: {
    decision: string;
    countdown: string;
    thinking: string;
    ready: string;
    nextDecision: string;
    aiOpponent: string;
    strategy: string;
    reasoning: string;
  };
  
  // 胜利条件
  victory: {
    victory: string;
    defeat: string;
    winner: string;
    reason: string;
    eliminatedAllCompetitors: string;
    controlledAssets: string;
    playerBankrupt: string;
    marketDominance: string;
  };
  
  // 启动屏幕
  startup: {
    title: string;
    subtitle: string;
    description: string;
    poweredBy: string;
    initializing: string;
    copyright: string;
    platform: string;
  };
  
  // 通知消息
  notifications: {
    purchaseSuccess: string;
    purchaseFailure: string;
    recruitmentSuccess: string;
    recruitmentFailure: string;
    buildingUpgraded: string;
    insufficientFunds: string;
    actionCompleted: string;
    aiDecision: string;
    marketManipulation: string;
    companyEliminated: string;
    hostileTakeoverSuccess: string;
    hostileTakeoverFailure: string;
  };
  
  // 动作图例
  actionLegend: {
    title: string;
    purchase: string;
    recruit: string;
    attack: string;
    intelligence: string;
    move: string;
  };
}

export const translations: Record<Language, Translation> = {
  zh: {
    common: {
      confirm: '确认',
      cancel: '取消',
      save: '保存',
      loading: '加载中...',
      error: '错误',
      success: '成功',
      warning: '警告',
      info: '信息',
    },
    game: {
      title: '多智能体商业模拟器',
      subtitle: '征服商业世界',
      description: '一款类似群星风格的2D商业竞争游戏，通过多智能体系统建立商业帝国，消灭竞争对手！',
      company: '公司',
      assets: '资产',
      employees: '员工',
      buildings: '建筑',
      turn: '回合',
      status: '状态',
      actions: '操作',
    },
    company: {
      myCompany: '我的企业',
      competitor: '竞争对手',
      active: '活跃',
      bankrupt: '破产',
      centralizedManagement: '集权管理',
      decentralizedManagement: '去中心化管理',
      neuralWorkforce: '神经网络员工',
      aeroVitaEnterprise: '天翼企业',
    },
    buildings: {
      tradeCenter: '国际贸易中心',
      hospital: '中心医院',
      company: '公司总部',
      realEstate: '房地产交易所',
      hotel: '豪华酒店',
      apartment: '高档公寓',
      purchase: '购买',
      recruit: '招聘',
      upgrade: '升级',
      income: '收入',
      level: '等级',
      owned: '已拥有',
      available: '可用',
    },
    agents: {
      idle: '闲置',
      moving: '移动中',
      working: '工作中',
      attacking: '攻击中',
      selectAgent: '选择智能体',
      moveAgent: '移动智能体',
      purchaseBuilding: '购买建筑',
      recruitEmployee: '招聘员工',
      attack: '攻击',
      intelligence: '情报',
      move: '移动',
      negotiation: '谈判',
      espionage: '间谍',
      management: '管理',
    },
    stockMarket: {
      title: '股票市场',
      manipulation: '市场操纵',
      priceManipulation: '价格操纵',
      volumeManipulation: '成交量操纵',
      newsManipulation: '新闻操纵',
      algorithmicTrading: '算法交易',
      shortSelling: '卖空',
      pumpAndDump: '拉高出货',
      spoofing: '虚假报价',
      execute: '执行',
      cost: '成本',
      success: '成功',
      failure: '失败',
    },
    competition: {
      title: '竞争分析',
      ranking: '排行榜',
      marketShare: '市场份额',
      buildingControl: '建筑控制',
      totalTransactions: '总交易数',
      averageAssetGrowth: '平均资产增长',
      competitionIntensity: '竞争激烈程度',
      riskLevel: '风险级别',
      hostileTakeover: '敌对收购',
      eliminationMechanism: '淘汰机制',
      activated: '已激活',
      gracePeriod: '宽限期',
      timeRemaining: '剩余时间',
      safetyPeriod: '安全期',
      preparingElimination: '淘汰机制准备中',
      aboutToActivate: '即将启动淘汰机制',
      eliminationActivated: '淘汰机制已启用',
      assetsZeroEliminated: '资产为0的公司将被淘汰',
      competitionIntensified: '竞争激化',
    },
    ai: {
      decision: 'AI决策',
      countdown: '倒计时',
      thinking: '思考中',
      ready: '准备就绪',
      nextDecision: '下次决策',
      aiOpponent: 'AI对手',
      strategy: '策略',
      reasoning: '推理',
    },
    victory: {
      victory: '胜利',
      defeat: '失败',
      winner: '获胜者',
      reason: '原因',
      eliminatedAllCompetitors: '消灭了所有竞争对手',
      controlledAssets: '控制了市场资产',
      playerBankrupt: '玩家公司破产',
      marketDominance: '市场主导地位',
    },
    startup: {
      title: 'RESP-X',
      subtitle: 'AeroVita Labs',
      description: '高级多智能体商业模拟',
      poweredBy: '基于AI和分子智能技术',
      initializing: '正在初始化神经网络...',
      copyright: '© 2024 AeroVita Labs. 版权所有.',
      platform: '下一代商业智能平台',
    },
    notifications: {
      purchaseSuccess: '成功购买建筑',
      purchaseFailure: '购买失败，资金不足',
      recruitmentSuccess: '成功招聘员工',
      recruitmentFailure: '招聘失败，资金不足',
      buildingUpgraded: '建筑升级完成',
      insufficientFunds: '资金不足',
      actionCompleted: '操作完成',
      aiDecision: 'AI决策',
      marketManipulation: '市场操纵',
      companyEliminated: '公司被淘汰',
      hostileTakeoverSuccess: '敌对收购成功',
      hostileTakeoverFailure: '敌对收购失败',
    },
    actionLegend: {
      title: '操作图例',
      purchase: '购买建筑',
      recruit: '招聘员工',
      attack: '攻击行动',
      intelligence: '情报收集',
      move: '移动',
    },
  },
  en: {
    common: {
      confirm: 'Confirm',
      cancel: 'Cancel',
      save: 'Save',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      warning: 'Warning',
      info: 'Info',
    },
    game: {
      title: 'Multi-Agent Business Simulator',
      subtitle: 'Conquer the Business World',
      description: 'A Stellaris-style 2D business competition game where you build your business empire through multi-agent systems and eliminate competitors!',
      company: 'Company',
      assets: 'Assets',
      employees: 'Employees',
      buildings: 'Buildings',
      turn: 'Turn',
      status: 'Status',
      actions: 'Actions',
    },
    company: {
      myCompany: 'My Company',
      competitor: 'Competitor',
      active: 'Active',
      bankrupt: 'Bankrupt',
      centralizedManagement: 'Centralized Management',
      decentralizedManagement: 'Decentralized Management',
      neuralWorkforce: 'Neural Workforce',
      aeroVitaEnterprise: 'AeroVita Enterprise',
    },
    buildings: {
      tradeCenter: 'International Trade Center',
      hospital: 'Central Hospital',
      company: 'Company Headquarters',
      realEstate: 'Real Estate Exchange',
      hotel: 'Luxury Hotel',
      apartment: 'Premium Apartment',
      purchase: 'Purchase',
      recruit: 'Recruit',
      upgrade: 'Upgrade',
      income: 'Income',
      level: 'Level',
      owned: 'Owned',
      available: 'Available',
    },
    agents: {
      idle: 'Idle',
      moving: 'Moving',
      working: 'Working',
      attacking: 'Attacking',
      selectAgent: 'Select Agent',
      moveAgent: 'Move Agent',
      purchaseBuilding: 'Purchase Building',
      recruitEmployee: 'Recruit Employee',
      attack: 'Attack',
      intelligence: 'Intelligence',
      move: 'Move',
      negotiation: 'Negotiation',
      espionage: 'Espionage',
      management: 'Management',
    },
    stockMarket: {
      title: 'Stock Market',
      manipulation: 'Market Manipulation',
      priceManipulation: 'Price Manipulation',
      volumeManipulation: 'Volume Manipulation',
      newsManipulation: 'News Manipulation',
      algorithmicTrading: 'Algorithmic Trading',
      shortSelling: 'Short Selling',
      pumpAndDump: 'Pump and Dump',
      spoofing: 'Spoofing',
      execute: 'Execute',
      cost: 'Cost',
      success: 'Success',
      failure: 'Failure',
    },
    competition: {
      title: 'Competition Analysis',
      ranking: 'Ranking',
      marketShare: 'Market Share',
      buildingControl: 'Building Control',
      totalTransactions: 'Total Transactions',
      averageAssetGrowth: 'Average Asset Growth',
      competitionIntensity: 'Competition Intensity',
      riskLevel: 'Risk Level',
      hostileTakeover: 'Hostile Takeover',
      eliminationMechanism: 'Elimination Mechanism',
      activated: 'Activated',
      gracePeriod: 'Grace Period',
      timeRemaining: 'Time Remaining',
      safetyPeriod: 'Safety Period',
      preparingElimination: 'Preparing Elimination',
      aboutToActivate: 'About to Activate Elimination',
      eliminationActivated: 'Elimination Mechanism Activated',
      assetsZeroEliminated: 'Companies with zero assets will be eliminated',
      competitionIntensified: 'Competition Intensified',
    },
    ai: {
      decision: 'AI Decision',
      countdown: 'Countdown',
      thinking: 'Thinking',
      ready: 'Ready',
      nextDecision: 'Next Decision',
      aiOpponent: 'AI Opponent',
      strategy: 'Strategy',
      reasoning: 'Reasoning',
    },
    victory: {
      victory: 'Victory',
      defeat: 'Defeat',
      winner: 'Winner',
      reason: 'Reason',
      eliminatedAllCompetitors: 'Eliminated all competitors',
      controlledAssets: 'Controlled market assets',
      playerBankrupt: 'Player company bankrupt',
      marketDominance: 'Market dominance',
    },
    startup: {
      title: 'RESP-X',
      subtitle: 'AeroVita Labs',
      description: 'Advanced Multi-Agent Business Simulation',
      poweredBy: 'Powered by AI & Molecular Intelligence',
      initializing: 'Initializing Neural Networks...',
      copyright: '© 2024 AeroVita Labs. All rights reserved.',
      platform: 'Next-Gen Business Intelligence Platform',
    },
    notifications: {
      purchaseSuccess: 'Successfully purchased building',
      purchaseFailure: 'Purchase failed, insufficient funds',
      recruitmentSuccess: 'Successfully recruited employee',
      recruitmentFailure: 'Recruitment failed, insufficient funds',
      buildingUpgraded: 'Building upgraded successfully',
      insufficientFunds: 'Insufficient funds',
      actionCompleted: 'Action completed',
      aiDecision: 'AI Decision',
      marketManipulation: 'Market Manipulation',
      companyEliminated: 'Company eliminated',
      hostileTakeoverSuccess: 'Hostile takeover successful',
      hostileTakeoverFailure: 'Hostile takeover failed',
    },
    actionLegend: {
      title: 'Action Legend',
      purchase: 'Purchase Building',
      recruit: 'Recruit Employee',
      attack: 'Attack Action',
      intelligence: 'Intelligence Gathering',
      move: 'Move',
    },
  },
};