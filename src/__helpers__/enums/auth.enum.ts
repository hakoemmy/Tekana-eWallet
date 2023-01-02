export enum STRATEGY {
    LOCAL = 'local',
    JWT_AT = 'jwt',
    JWT_RT = 'jwt-refresh',
  }
  
  export enum STRATEGY_LOCAL {
    usernameField = 'emailOrUsername',
    passwordField = 'password',
  }
  
  export enum JWT_COOKIE_NAME {
    AT = 'Authentication',
    RT = 'Refresh',
  }
  