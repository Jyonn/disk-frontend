import {Injectable} from "@angular/core";
import {BaseService} from "./base.service";
import {Resource} from "../models/res/resource";

@Injectable()
export class ResourceService {
  constructor(private baseService: BaseService) {}

  public static storeVK(path: string, visit_key) {
    window.localStorage.setItem(`vk-${path}`, visit_key);
  }

  public static loadVK(path: string) {
    return window.localStorage.getItem(`vk-${path}`);
  }

  public static clearVK(path: string) {
    window.localStorage.removeItem(`vk-${path}`);
  }

  public api_upload_file(key: string, token: string, file: File) {
    const fd = new FormData();
    fd.append('key', key);
    fd.append('token', token);
    fd.append('file', file);
    return this.baseService
      .post_qn(fd);
  }

  public api_get_upload_token(res_str_id: string, data: {filename: string}) {
    return this.baseService
      .get(`/api/res/${res_str_id}/token`, data);
  }

  public api_get_cover_token(res_str_id: string, data: {filename: string}) {
    return this.baseService
      .get(`/api/res/${res_str_id}/cover`, data);
  }

  public api_get_base_res_info(path: string) {
    return this.baseService
      .get(`/api/res/${path}/base`);
  }

  public api_get_res_info(path: string, data: {visit_key: string}) {
    return this.baseService
      .get(`/api/res/${path}`, data);
  }

  public api_get_root_res() {
    return this.baseService
      .get('/api/res/');
  }

  public api_create_folder(res_str_id: string, data: {folder_name: string}) {
    return this.baseService
      .post(`/api/res/${res_str_id}/folder`, data);
  }

  public api_create_link(res_str_id: string, data: {link_name: string, link: string}) {
    return this.baseService
      .post(`/api/res/${res_str_id}/link`, data);
  }

  public api_modify_res_info(path: string,
                             data: {rname: string, status: number, description: string, visit_key: string, right_bubble: boolean}) {
    // const res_str_id = path[path.length - 1];
    return this.baseService
      .put(`/api/res/${path}`, data);
  }

  public api_delete_res(path: string) {
    return this.baseService
      .del(`/api/res/${path}`);
  }
}
