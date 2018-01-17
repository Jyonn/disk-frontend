import {Injectable} from "@angular/core";
import {BaseService} from "./base.service";

@Injectable()
export class ResourceService {
  constructor(private baseService: BaseService) {}

  private static path_to_slug(path: Array<any>) {
    return path.join('-');
  }

  public get_upload_token(filename: string, parent_id: number, status: number) {
    const data = {
      filename: filename,
      parent_id: parent_id,
      status: status,
    };
    return this.baseService
      .get('/api/res/token', data);
  }

  public get_res_info(path: Array<any>, visit_key: string) {
    const slug = ResourceService.path_to_slug(path);
    const data = {
      visit_key: visit_key,
    };
    return this.baseService
      .get(`/api/res/${slug}`, data);
  }

  public get_root_res() {
    return this.baseService
      .get('/api/res/');
  }

  public create_folder(path: Array<any>, folder_name: string, description: string, status: number) {
    const slug = ResourceService.path_to_slug(path);
    const data = {
      folder_name: folder_name,
      description: description,
      status: status,
    };
    return this.baseService
      .post(`/api/res/${slug}`, data);
  }

  public get_visit_key(path: Array<any>) {
    const slug = ResourceService.path_to_slug(path);
    return this.baseService
      .get(`/api/res/${slug}/vk`, null);
  }

  public get_dl_link(path: Array<any>, visit_key: string) {
    const slug = ResourceService.path_to_slug(path);
    const data = {
      visit_key: visit_key,
    };
    return this.baseService
      .get(`/api/res/${slug}/dl`, data);
  }
}
