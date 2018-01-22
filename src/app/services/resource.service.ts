import {Injectable} from "@angular/core";
import {BaseService} from "./base.service";

@Injectable()
export class ResourceService {
  constructor(private baseService: BaseService) {}

  public upload_file(key: string, token: string, file: File) {
    const fd = new FormData();
    fd.append('key', key);
    fd.append('token', token);
    fd.append('file', file);
    return this.baseService
      .post_qn(fd);
  }

  public get_upload_token(res_id: number, data: {filename: string}) {
    return this.baseService
      .get(`/api/res/${res_id}/token`, data);
  }

  public get_res_info(path: Array<any>, data: {visit_key: string}) {
    const slug = BaseService.path_to_slug(path);
    return this.baseService
      .get(`/api/res/${slug}`, data);
  }

  public get_root_res() {
    return this.baseService
      .get('/api/res/');
  }

  public create_folder(res_id: number, data: {folder_name: string}) {
    return this.baseService
      .post(`/api/res/${res_id}/folder`, data);
  }

  public get_visit_key(res_id: number) {
    return this.baseService
      .get(`/api/res/${res_id}/vk`, null);
  }

  public get_dl_link(path: Array<any>, data: {visit_key: string}) {
    const slug = BaseService.path_to_slug(path);
    return this.baseService
      .get(`/api/res/${slug}/dl`, data);
  }

  public modify_res_info(path: Array<any>, data: {rname: string, status: number, description: string, visit_key: string}) {
    const slug = BaseService.path_to_slug(path);
    return this.baseService
      .put(`/api/res/${slug}`, data);
  }
}
