const BASE_URL = 'http://localhost:8081/'

export default {

  STOP_API_URL: BASE_URL,

  GET_ALL_BOTS: BASE_URL + "bot",
  FIND_BOT_BY_ID: BASE_URL + "bot/find/byid/{botId}",
  FIND_BOTS_BY_BRANCH: BASE_URL + "bot/find/bybranch/{branchId}",
  CREATE_BOT: BASE_URL + "bot",
  UPDATE_BOT: BASE_URL + "bot/{botId}",
  DELETE_BOT: BASE_URL + "bot/{botId}",

  GET_ALL_BRANCHES: BASE_URL + "branch",
  FIND_BRANCH_BY_CODE: BASE_URL + "branch/find/bycode?code=",
  FIND_BRANCH_BY_ID: BASE_URL + "branch/find/byid/{branchId}",
  FIND_BRANCHES_BY_USER: BASE_URL + "branch/find/byuser/{userId}",
  CREATE_BRANCH: BASE_URL + "branch",
  UPDATE_BRANCH: BASE_URL + "branch/{branchId}",
  DELETE_BRANCH: BASE_URL + "branch/{branchId}",

  GET_ALL_USERS: BASE_URL + "user",
  FIND_USER_BY_NAME: BASE_URL + "user/find/byname?name=",
  FIND_USER_BY_UID: BASE_URL + "user/find/byuid/{uid}",
  FIND_USERS_BY_BRANCH: BASE_URL + "user/find/bybranch/{branchId}",
  ADD_BRANCH_TO_USER: BASE_URL + "user/{userId}/addbranch?code=",
  CREATE_USER: BASE_URL + "user",
  UPDATE_USER: BASE_URL + "user/{userId}",
  DELETE_USER: BASE_URL + "user/{userId}",

  GET_ALL_CHATROOMS: BASE_URL + "chatroom",
  FIND_CHATROOM: BASE_URL + "chatroom/find/{userId}/{branchId}/{botId}",
  FIND_CHATROOMS_BY_BOT: BASE_URL + "chatroom/find/bybot/{botId}",
  FIND_ALL_CHATS: BASE_URL + "chatroom/{chatRoomId}/chats?limit=",
  CREATE_CHATROOM: BASE_URL + "chatroom",

}