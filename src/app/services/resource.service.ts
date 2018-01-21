import {Injectable} from "@angular/core";
import {BaseService} from "./base.service";

@Injectable()
export class ResourceService {
  constructor(private baseService: BaseService) {}

  public get_upload_token(data: {filename: string, parent_id: number, status: number}) {
    return this.baseService
      .get('/api/res/token', data);
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

  public create_folder(path: Array<any>, data: {folder_name: string, description: string, status: number}) {
    const slug = BaseService.path_to_slug(path);
    return this.baseService
      .post(`/api/res/${slug}`, data);
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
