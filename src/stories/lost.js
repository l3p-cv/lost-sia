const initIsNavBarVisible = localStorage.getItem("isNavBarVisible") === "true";
const INITIAL_STATE = {
  isNavBarVisible:
    initIsNavBarVisible === undefined ? true : initIsNavBarVisible,
  version: "",
  settings: {
    autoLogoutWarnTime: 300,
    autoLogoutTime: 3600,
    isDevMode: true,
  },
  jupyterLabUrl: "",
};

const TYPES = {
  SET_NAVBAR_VISIBLE: "SET_NAVBAR_VISIBLE",
  SET_SETTINGS: "SET_SETTINGS",
  LOAD_SETTINGS: "LOAD_SETTINGS",
  SET_ROLES: "SET_ROLES",
  SET_VERSION: "SET_VERSION",
  SET_JUPYTER_LAB_URL: "SET_JUPYTER_LAB_URL",
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case TYPES.SET_NAVBAR_VISIBLE:
      localStorage.setItem("isNavBarVisible", action.payload);
      return {
        ...state,
        isNavBarVisible: action.payload,
      };
    case TYPES.SET_SETTINGS:
      return {
        ...state,
        settings: action.payload,
      };
    case TYPES.SET_ROLES:
      return {
        ...state,
        roles: action.payload,
      };
    case TYPES.SET_VERSION:
      return {
        ...state,
        version: action.payload,
      };
    case TYPES.SET_JUPYTER_LAB_URL:
      return {
        ...state,
        jupyterLabUrl: action.payload,
      };
    default:
      return state;
  }
}
