/* 島ごとの見た目テーマ + ローポリオブジェクト定義（lamp-world.js が参照） */
(function (global) {
  'use strict';

  const T = {
    hub: {
      theme: '旅立ちの桟橋',
      deck: 0x2a4060,
      cliff: 0x3a4a5a,
      accent: 0xf5c451,
      props: ['lighthouse_s', 'pier', 'crate', 'board']
    },
    core: {
      theme: '再起動コア',
      deck: 0x2a2450,
      cliff: 0x1a1838,
      accent: 0xa78bfa,
      props: ['core_crystal', 'ring_rail', 'dawn_gate']
    },
    'island-foundation': {
      theme: '最古の灯台と白亜の崖',
      deck: 0xd8e4f0,
      cliff: 0xb8c8d8,
      accent: 0xf5c451,
      props: ['lighthouse_l', 'cliff_pillar', 'bit_stone']
    },
    'island-algorithm': {
      theme: '時計塔と歯車庭園',
      deck: 0x5a4a30,
      cliff: 0x3a3020,
      accent: 0xd4a84b,
      props: ['clock_tower', 'gear', 'hourglass']
    },
    'island-hardware': {
      theme: '蒸気工房と銅管',
      deck: 0x5a3830,
      cliff: 0x3a2820,
      accent: 0xc07040,
      props: ['chimney', 'copper_pipe', 'boiler']
    },
    'island-system': {
      theme: '系譜の図書館島',
      deck: 0x2a3858,
      cliff: 0x1a2840,
      accent: 0xc9b896,
      props: ['bookshelf', 'globe', 'thread']
    },
    'island-software': {
      theme: '多層の書庫塔',
      deck: 0x2a4038,
      cliff: 0x1a3028,
      accent: 0x7fd1ff,
      props: ['layer_floor', 'stack_box', 'process_flag']
    },
    'island-database': {
      theme: '水晶泉の島',
      deck: 0x204858,
      cliff: 0x183848,
      accent: 0x9b7dff,
      props: ['spring', 'crystal', 'grid', 'chain']
    },
    'island-network': {
      theme: '航路灯と吊り橋',
      deck: 0x284868,
      cliff: 0x183850,
      accent: 0x7fd1ff,
      props: ['beacon', 'bridge', 'sail']
    },
    'island-security': {
      theme: '盾商会の城壁',
      deck: 0x303838,
      cliff: 0x202828,
      accent: 0x6fdc8c,
      props: ['gate', 'shield', 'keyhole']
    },
    'island-media': {
      theme: '絵師のアトリエ',
      deck: 0x584868,
      cliff: 0x403850,
      accent: 0xff9ecd,
      props: ['easel', 'paint', 'canvas']
    },
    'island-corporate': {
      theme: '帳場と印鑑の港町',
      deck: 0x584830,
      cliff: 0x3a3020,
      accent: 0xc04040,
      props: ['seal_tower', 'desk', 'pier']
    },
    'island-business': {
      theme: '羅針盤の観測所',
      deck: 0x304838,
      cliff: 0x203028,
      accent: 0xf5c451,
      props: ['compass', 'round_table', 'star_arch']
    },
    'island-system-plan': {
      theme: '企画港の設計台',
      deck: 0x385878,
      cliff: 0x284058,
      accent: 0xa0c4e8,
      props: ['draft_table', 'ruler_arch', 'model_block']
    },
    'island-dev-tech': {
      theme: '型枠の開発工房',
      deck: 0x585040,
      cliff: 0x403828,
      accent: 0xf08040,
      props: ['scaffold', 'formwork', 'proto_lamp']
    },
    'island-project': {
      theme: '吊橋と工程の谷',
      deck: 0x485038,
      cliff: 0x303820,
      accent: 0xf5c451,
      props: ['bridge', 'wbs_sign', 'arrow_stone']
    },
    'island-service': {
      theme: '灯火番の小屋',
      deck: 0x483828,
      cliff: 0x302818,
      accent: 0xffb060,
      props: ['cabin', 'bell', 'lantern_row']
    },
    'island-audit': {
      theme: '記録庫の静島',
      deck: 0x383840,
      cliff: 0x282830,
      accent: 0xc04040,
      props: ['archive', 'stamp', 'evidence_box']
    },
    'gate-sky-trial': {
      theme: '雲裂きの三連門',
      deck: 0x484868,
      cliff: 0x303050,
      accent: 0xb8a0ff,
      props: ['triple_gate', 'storm_pillar', 'trial_flame']
    },
    'fortress-algorithm': {
      theme: '石版訓練場',
      deck: 0x2a3030,
      cliff: 0x1a2020,
      accent: 0x6fdc8c,
      props: ['slab', 'trace_line', 'spear']
    },
    'fortress-program': {
      theme: '擬似言語工房',
      deck: 0x3a3020,
      cliff: 0x2a2010,
      accent: 0xf0a040,
      props: ['blackboard', 'chimney', 'workbench']
    },
    'fortress-database': {
      theme: '地下水晶庫',
      deck: 0x1a2840,
      cliff: 0x121c30,
      accent: 0x7fd1ff,
      props: ['vault', 'er_board', 'lock']
    },
    'fortress-network': {
      theme: '伏線の要塞',
      deck: 0x203028,
      cliff: 0x14201a,
      accent: 0xc07040,
      props: ['cable_wall', 'switch_box', 'packet_crate']
    },
    'fortress-security': {
      theme: '盾壁団詰所',
      deck: 0x302828,
      cliff: 0x201818,
      accent: 0xf08080,
      props: ['shield_wall', 'risk_board', 'keys']
    },
    'fortress-deep': {
      theme: '最奥の読書聖堂',
      deck: 0x1a1820,
      cliff: 0x101018,
      accent: 0xf5c451,
      props: ['giant_book', 'long_table', 'gold_arch']
    },
    'plateau-mock-am': {
      theme: '旗の演習台地',
      deck: 0x3a5838,
      cliff: 0x2a4028,
      accent: 0xf5c451,
      props: ['union_flag', 'long_desk', 'sundial']
    },
    'plateau-mock-pm': {
      theme: '軍議の石台',
      deck: 0x484848,
      cliff: 0x303030,
      accent: 0xc59bff,
      props: ['war_table', 'slab_stack', 'bonfire']
    },
    'plateau-final': {
      theme: '全灯が集う地平',
      deck: 0x3a3048,
      cliff: 0x281c38,
      accent: 0xffe08a,
      props: ['lamp_ring', 'horizon_pillar', 'final_line']
    }
  };

  function themeFor(node) {
    if (!node) return T.hub;
    if (node.kind === 'hub') return T.hub;
    if (node.kind === 'core') return T.core;
    if (node.d && node.d.id && T[node.d.id]) return T[node.d.id];
    return {
      theme: '未設定の土地',
      deck: 0x2a3a5a,
      cliff: 0x1a2a3a,
      accent: 0x7fd1ff,
      props: ['beacon']
    };
  }

  global.LampIslandThemes = { themes: T, themeFor };
})(typeof window !== 'undefined' ? window : globalThis);
