export const URL_API_USERS_REGEX = /\/api\/users/;
export const URL_API_LISTS_REGEX = /\/api\/lists/;
export const URL_API_TASKS_REGEX = /\/api\/tasks/;
export const UUID_USERS_PATH_NAME_REGEX =
  /\/api\/users\/[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}/;
export const UUID_LISTS_PATH_NAME_REGEX =
  /\/api\/lists\/[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}/;
export const UUID_LISTS_BY_USER_PATH_NAME_REGEX =
  /\/api\/lists\/user\/[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}/;
export const UUID_TASKS_PATH_NAME_REGEX =
  /\/api\/tasks\/[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}/;
export const UUID_TASKS_BY_LIST_PATH_NAME_REGEX =
  /\/api\/tasks\/list\/[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}/;
export const USERS_URL_PATHNAME = "/api/users";
export const USERS_AUTH_URL_PATHNAME = "/api/users/auth";
export const LISTS_URL_PATHNAME = "/api/lists";
export const TASKS_URL_PATHNAME = "/api/tasks";
export const TOKEN_EXPIRATION_TIME = "1d";
