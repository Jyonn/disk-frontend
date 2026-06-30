import { Component, OnInit } from "@angular/core";
import { Meta } from "@angular/platform-browser";

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

  useCases = [
    "用 SSO 登录后直接拿到后端 token，不需要手抄 cookie。",
    "按路径或 `@资源ID` 列目录，适合从资源页复制命令回终端继续操作。",
    "上传本地文件、目录，或把远程文件夹递归下载到本地。",
  ];

  constructor(private meta: Meta) {}

  ngOnInit() {
    this.meta.updateTag({name: "description", content: "htx 是浑天匣的命令行客户端，支持 SSO 登录、目录列举、上传与下载。"});
  }
}
