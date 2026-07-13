"""
WebDAV 服务
配置文件：config.ini
已修复所有导入错误、参数错误
"""
import configparser
import os
import logging
from wsgidav import util
from wsgidav.wsgidav_app import WsgiDAVApp
from wsgidav.fs_dav_provider import FilesystemProvider
from wsgidav.server.ext_wsgiutils_server import Server

# 读取配置文件
config = configparser.ConfigParser()
config.read("config.ini", encoding="utf-8")

# 加载配置
HOST = config.get("WebDAV", "host")
PORT = config.getint("WebDAV", "port")
ROOT_PATH = config.get("WebDAV", "root_path")
ENABLE_AUTH = config.getboolean("Auth", "enable_auth")
USERNAME = config.get("Auth", "username")
PASSWORD = config.get("Auth", "password")
DEBUG = config.getboolean("Log", "debug")

def create_webdav_app():
    provider = FilesystemProvider(ROOT_PATH)
    webdav_config = {
        "host": HOST,
        "port": PORT,
        "provider_mapping": {"/": provider},
        "simple_dc": {"user_mapping": {}},
        "logging": {
            "enable": DEBUG,
            "level": "debug" if DEBUG else "info",
        },
    }

    # 认证配置
    if ENABLE_AUTH:
        def auth_check(environ, realm, user, pwd):
            return user == USERNAME and pwd == PASSWORD

        webdav_config.update({
            "http_authenticator": {
                "domain_controller": None,
                "accept_basic": True,
                "accept_digest": False,
                "default_to_digest": False,
            },
            "auth_middleware": "digest",
            "check_auth": auth_check,
        })
    return WsgiDAVApp(webdav_config)

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger("webdav_server")

    # 自动创建目录
    if not os.path.exists(ROOT_PATH):
        util.mkdir_p(ROOT_PATH)
        logger.info(f"自动创建目录：{ROOT_PATH}")

    app = create_webdav_app()

    logger.info("=" * 50)
    logger.info("WebDAV 服务启动成功")
    logger.info(f"访问地址：http://{HOST}:{PORT}")
    logger.info(f"共享目录：{os.path.abspath(ROOT_PATH)}")
    if ENABLE_AUTH:
        logger.info(f"账号：{USERNAME}  密码：{PASSWORD}")
    logger.info("按 Ctrl+C 停止服务")
    logger.info("=" * 50)

    # ✅ 终极修复：正确启动服务器
    server = Server(app, host=HOST, port=PORT)
    server.serve_forever()


