export class DiskErrorService {
  FAIL_QINIU = 2033;
  QINIU_UNAUTHORIZED = 2032;
  ERROR_REQUEST_QINIU = 2031;
  ERROR_DELETE_ROOT_FOLDER = 2030;
  REQUIRE_EMPTY_FOLDER = 2029;
  ERROR_RESOURCE_ID = 2028;
  ERROR_CREATE_LINK = 2027;
  NOT_YOUR_RESOURCE = 2026;
  REQUIRE_FATHER_OR_ROOT_DELETE = 2025;
  PASSWORD_CHANGED = 2024;
  ERROR_RESOURCE_RELATION = 2023;
  ERROR_RESOURCE_TYPE = 2022;
  INVALID_PASSWORD = 2021;
  INVALID_USERNAME = 2020;
  INVALID_RNAME = 2019;
  REQUIRE_FILE = 2018;
  ERROR_GET_ROOT_FOLDER = 2017;
  PARENT_NOT_BELONG = 2016;
  NOT_READABLE = 2015;
  ERROR_FILE_PARENT = 2014;
  NOT_FOUND_RESOURCE = 2013;
  ERROR_RESOURCE_STATUS = 2012;
  UNAUTH_CALLBACK = 2011;
  USERNAME_EXIST = 2010;
  JWT_EXPIRED = 2009;
  ERROR_JWT_FORMAT = 2008;
  JWT_PARAM_INCOMPLETE = 2007;
  REQUIRE_DICT = 2006;
  ERROR_CREATE_USER = 2005;
  REQUIRE_GRANT = 2004;
  ERROR_CREATE_FOLDER = 2003;
  ERROR_CREATE_FILE = 2002;
  ERROR_PASSWORD = 2001;
  NOT_FOUND_USER = 2000;

  ERROR_PROCESS_FUNC = 1011;
  ERROR_TUPLE_FORMAT = 1010;
  REQUIRE_ROOT = 1009;
  ERROR_VALIDATION_FUNC = 1008;
  ERROR_PARAM_FORMAT = 1007;
  REQUIRE_BASE64 = 1006;
  ERROR_METHOD = 1005;
  STRANGE = 1004;
  REQUIRE_LOGIN = 1003;
  REQUIRE_JSON = 1002;
  REQUIRE_PARAM = 1001;
  ERROR_NOT_FOUND = 1000;
  OK = 0;

  ERROR_DICT = [
    [this.FAIL_QINIU, "未知原因导致的七牛端操作错误"],
    [this.QINIU_UNAUTHORIZED, "七牛端身份验证错误"],
    [this.ERROR_REQUEST_QINIU, "七牛请求错误"],
    [this.ERROR_DELETE_ROOT_FOLDER, "无法删除用户根目录"],
    [this.REQUIRE_EMPTY_FOLDER, "非空目录无法删除"],
    [this.ERROR_RESOURCE_ID, "错误的资源ID"],
    [this.ERROR_CREATE_LINK, "创建链接错误"],
    [this.NOT_YOUR_RESOURCE, "没有操作权限"],
    [this.REQUIRE_FATHER_OR_ROOT_DELETE, "不是管理员或父用户，无法删除"],
    [this.PASSWORD_CHANGED, "密码已改变，需要重新获取token"],
    [this.ERROR_RESOURCE_RELATION, "错误的资源逻辑关系"],
    [this.ERROR_RESOURCE_TYPE, "错误的资源类型"],
    [this.INVALID_PASSWORD, "密码长度应在6-16个字符之内且无非法字符"],
    [this.INVALID_USERNAME, "用户名只能包含字母数字和下划线"],
    [this.INVALID_RNAME, "资源名称不能包含非法字符（\\/*:\'\"|<>?等）"],
    [this.REQUIRE_FILE, "需要文件资源"],
    [this.ERROR_GET_ROOT_FOLDER, "无法读取根目录"],
    [this.PARENT_NOT_BELONG, "无法在他人目录下创建"],
    [this.NOT_READABLE, "没有读取权限"],
    [this.ERROR_FILE_PARENT, "文件资源不能成为父目录"],
    [this.NOT_FOUND_RESOURCE, "不存在的资源"],
    [this.ERROR_RESOURCE_STATUS, "错误的资源公开信息"],
    [this.UNAUTH_CALLBACK, "未经授权的回调函数"],
    [this.USERNAME_EXIST, "已存在的用户名"],
    [this.JWT_EXPIRED, "身份认证过期"],
    [this.ERROR_JWT_FORMAT, "身份认证token错误"],
    [this.JWT_PARAM_INCOMPLETE, "身份认证token缺少参数"],
    [this.REQUIRE_DICT, "需要字典数据"],
    [this.ERROR_CREATE_USER, "创建用户错误"],
    [this.REQUIRE_GRANT, "需要可创建用户权限"],
    [this.ERROR_CREATE_FOLDER, "创建目录错误"],
    [this.ERROR_CREATE_FILE, "创建文件错误"],
    [this.ERROR_PASSWORD, "错误的用户名或密码"],
    [this.NOT_FOUND_USER, "不存在的用户"],

    [this.ERROR_PROCESS_FUNC, "参数预处理函数错误"],
    [this.ERROR_TUPLE_FORMAT, "属性元组格式错误"],
    [this.REQUIRE_ROOT, "需要管理员登录"],
    [this.ERROR_VALIDATION_FUNC, "错误的参数验证函数"],
    [this.ERROR_PARAM_FORMAT, "错误的参数格式"],
    [this.REQUIRE_BASE64, "参数需要base64编码"],
    [this.ERROR_METHOD, "错误的HTTP请求方法"],
    [this.STRANGE, "未知错误"],
    [this.REQUIRE_LOGIN, "需要登录"],
    [this.REQUIRE_JSON, "需要JSON数据"],
    [this.REQUIRE_PARAM, "缺少参数"],
    [this.ERROR_NOT_FOUND, "不存在的错误"],
    [this.OK, "没有错误"],
  ];
}
