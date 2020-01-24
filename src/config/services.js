const BASE_URL = 'http://localhost:8081/'

export default {

  STOP_API_URL: BASE_URL,
  GET_ALL_BOTS: BASE_URL + "bot",
  CREATE_BOT: BASE_URL + "bot",
  UPDATE_BOT: BASE_URL + "bot/{botId}",
  DELETE_BOT: BASE_URL + "bot/{botId}",

  GET_ALL_BRANCHES: BASE_URL + "branch",
  CREATE_BRANCH: BASE_URL + "branch",
  UPDATE_BRANCH: BASE_URL + "branch/{branchId}",
  DELETE_BRANCH: BASE_URL + "branch/{branchId}",

  GET_ALL_USERS: BASE_URL + "user",
  FIND_USER_BY_NAME: BASE_URL + "user/find/byname?name=",
  CREATE_USER: BASE_URL + "user"
}