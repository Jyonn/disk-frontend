import { Component, OnInit } from "@angular/core";
import { Meta } from "@angular/platform-browser";
import { Info } from "../../models/base/info";
import { BaseService } from "../../services/base.service";

interface CliCommandSection {
  label: string;
  title: string;
  note: string;
  commands: string[];
}

interface CliSideAction {
  label: string;
  title: string;
  command: string;
}

@Component({
  templateUrl: "./cli.component.html",
  styleUrls: [
    "../../../assets/css/cli.less",
  ],
})
export class CliComponent implements OnInit {
  installCommands = [
    "cd ~/Projects/Apps/Disk/disk-cli",
    "pip install -e .",
  ];

  authCommands = [
    "htx login --print-url",
    "htx login",
    "htx whoami",
  ];

  listCommands = [
    "htx ls",
    "htx ls /Photos/2024",
    "htx ls @Ab12Cd",
  ];

  transferCommands = [
    "htx upload ./report.pdf /Docs",
    "htx upload ./albums /Photos",
    "htx download @Ab12Cd ./downloads/report.pdf",
    "htx download @Ef34Gh ./downloads/Archive",
  ];

  adminCommands = [
    "htx mkdir Archive @Ab12Cd",
    "htx mv /Photos/new-name.jpg /Archive",
    "htx rm --recursive /Archive",
  ];

  commandSections: CliCommandSection[] = [
    {
      label: "bootstrap",
      title: "安装与环境",
      note: "先进入项目目录，再用 editable 方式安装，便于本地联调和持续迭代。",
      commands: this.installCommands,
    },
    {
      label: "auth",
      title: "SSO 认证",
      note: "通过浏览器完成登录，CLI 会接管 token，之后就能直接列目录、上传和下载。",
      commands: this.authCommands,
    },
    {
      label: "listing",
      title: "列目录",
      note: "既支持路径，也支持 @资源ID。资源页里复制 `htx ls @resid` 后，可以回到终端继续浏览。",
      commands: this.listCommands,
    },
    {
      label: "transfer",
      title: "上传与下载",
      note: "本地文件、目录和远端资源都能双向流动，更适合已经习惯 shell 工作流的用户。",
      commands: this.transferCommands,
    },
    {
      label: "ops",
      title: "目录操作",
      note: "创建目录、移动文件、递归删除这些常见动作，都保持和命令行心智一致。",
      commands: this.adminCommands,
    },
  ];

  sideActions: CliSideAction[] = [
    {
      label: "list",
      title: "展示目录",
      command: "htx ls @Ab12Cd",
    },
    {
      label: "upload",
      title: "上传到当前目录",
      command: "htx upload ./release.tar.gz @Ab12Cd",
    },
    {
      label: "download",
      title: "下载到本地",
      command: "htx download @Ab12Cd ./downloads/Archive",
    },
  ];

  workflow = [
    "通过 SSO 完成认证，CLI 自动持有可用 token。",
    "在资源页复制 `htx ls @资源ID`，回到终端无缝继续浏览。",
    "把本地文件、目录或远端资源接入同一条 shell 工作流。",
  ];

  capabilities = [
    "SSO token",
    "@resource id",
    "path listing",
    "upload + download",
    "mkdir / mv / rm",
  ];

  get quickStartCommand() {
    return "htx login --print-url";
  }

  constructor(
    private meta: Meta,
  ) {}

  ngOnInit() {
    this.meta.updateTag({name: "description", content: "htx 是浑天匣的命令行客户端，支持 SSO 登录、目录列举、上传、下载与目录操作。"});
  }

  copySuccess(text = "命令已复制") {
    BaseService.info_center.next(new Info({text, type: Info.TYPE_SUCC}));
  }

  copyError() {
    BaseService.info_center.next(new Info({text: "复制失败", type: Info.TYPE_WARN}));
  }
}
