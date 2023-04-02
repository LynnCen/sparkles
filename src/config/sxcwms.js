
//乡镇边界,小班图层
export default {
  id: "sxcwms",
  layers: "ldysf:town_boundary,ldysf:town_nms", // zoom < 13
  width: 1024,
  height: 1024,
  townLayer: {
    "000": "ldysf:sxc_all",
    "001": "ldysf:xb_zj",
    "002": "ldysf:xb_yq",
    "003": "ldysf:xb_by",
    "004": "ldysf:xb_wx",
    "005": "ldysf:xb_lc",
    "007": "ldysf:xb_bh",
    "008": "ldysf:xb_dgt",
    "009": "ldysf:xb_lz",
    "010": "ldysf:xb_yx",
    "011": "ldysf:xb_fy",
    "012": "ldysf:xb_lx",
    "013": "ldysf:xb_tp",
    "014": "ldysf:xb_xd",
    "015": "ldysf:xb_hc",
    "016": "ldysf:xb_ld",
  },
  layerMap: {
    /* 左侧乡镇(可选) */
    //viewparams=townCode:001

    /* 分析决策-左侧 */
    //点击确定后的小班
    analysis_class: "ldysf:view_analysis_class", //与上面的乡镇小班图层同色
    //viewparams=townCode:001;classList:'41675'\,'41677'
    //点击单个小班
    single_class: "ldysf:view_single_class",
    //viewparams=classId:'1'

    /* 任务派发 */
    //single_class: "ldysf:view_single_class",
    //viewparams=classId:'1'
    //styles=sxc_css_task_(un)allocate

    /* 进度跟踪-左侧 */
    progress_team: "ldysf:view_progress_team",
    //viewparams=townCode:001;teamList=1\,2
  },
};
//页面特定图层
export const sxcother = {
  home0: {
    id: "home0",
    width: 1024,
    height: 1024,
    layers: "ldysf:view_home_plague_tree",
    //viewparams=townCode:001
    styles: "sxc_css_home_plague_tree_big", //(zoom>=17)
  },
  home1: {
    id: "home1",
    width: 1024,
    height: 1024,
    layers: "ldysf:view_home_plague_tree_acceptance",
    //viewparams=townCode:001
    styles: "sxc_css_home_plague_tree_acceptance_big", //(zoom>=17)
  },
  home2: {
    id: "home2",
    width: 1024,
    height: 1024,
    layers: "ldysf:view_home_plague_tree_complete",
    //viewparams=townCode:001
    styles: "sxc_css_home_plague_tree_complete_big", //(zoom>=17)
  },
  //正射图层
  home3: {
    id: "home3",
    // width: 1024,
    // height: 1024,
    layers: "ldysf:dom_d1",
    //viewparams=townCode:001
    // styles: "sxc_css_home_plague_tree_complete_big", //(zoom>=17)
  },
  analysis0: {
    id: "analysis0",
    layerMap: {
      plague_tree: "ldysf:view_analysis_plague_tree", //疫木
    },
  },
  analysis1: {
    id: "analysis1",
    width: 1024,
    height: 1024,
    layerMap: {
      /* 分析决策-右侧上 */
      // analysis_plague_tree: "ldysf:view_analysis_plague_tree", //疫木
      infection: "ldysf:view_analysis_infection", //感染小班
      //viewparams=townCode:001
      uninfection: "ldysf:view_analysis_uninfection", //未感染小班
      //viewparams=townCode:001
    },
  },
  analysis2: {
    id: "analysis2",
    layerMap: {
      /* 分析决策-右侧下 */
      priority: "ldysf:view_analysis_priority", //除治优先级
      difficulty: "ldysf:view_analysis_difficulty", //除治难易程度
      //styles=sxc_css_analysis_difficulty_(1-3)
      //viewparams=townCode:001;level:I级
      none: "ldysf:view_analysis_none", //无
    },
  },
  progress: {
    id: "progress",
    layerMap: {
      infection: "ldysf:view_progress_infection",
      complete: "ldysf:view_progress_complete",
      uncomplete: "ldysf:view_progress_uncomplete",
    },
  },
  verification: {
    id: "verification",
    layerMap: {
      /* 核查验收-效果验收 */
      total: "ldysf:view_verification_total",
      accept: "ldysf:view_verification_accept",
      unaccept: "ldysf:view_verification_unaccept",
      //viewparams=townCode:001
    },
  },
  check: {
    id: "check",
    layerMap: {
      /* 费用结算-小班费用结算进度 */
      complete: "ldysf:view_check_complete",
      incomplete: "ldysf:view_check_incomplete",
      //viewparams=teamList:1\,2
    },
  },
  contour: {
    id: "contour",
    layers: 'ldysf:ld-contour-line'
  }
};
