import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild
} from "@angular/core";
import {UserService} from "../../services/user.service";
import {Resource} from "../../models/res/resource";
import {Router} from "@angular/router";
import {FootBtnService} from "../../services/foot-btn.service";

@Component({
  selector: 'app-res-nav',
  templateUrl: './res-nav.component.html',
  styleUrls: [
    '../../../assets/css/icon-fonts.css',
    '../../../assets/css/nav.less',
  ]
})
export class ResNavComponent implements AfterViewInit, OnChanges {
  @Input() resource: Resource;
  @Input() is_mine: boolean;
  @Input() zip_nav: boolean;
  @Input() search_mode: boolean;
  @Input() search_value: string;
  @ViewChild('searchInput') searchInputRef: ElementRef<HTMLInputElement>;
  @ViewChild('renameInput') renameInputRef: ElementRef<HTMLInputElement>;
  @ViewChild('titleViewport') titleViewportRef: ElementRef<HTMLDivElement>;
  @ViewChild('titleTrack') titleTrackRef: ElementRef<HTMLDivElement>;
  @ViewChild('titleText') titleTextRef: ElementRef<HTMLDivElement>;
  @Output() onGoParent = new EventEmitter();
  @Output() onGoLogin = new EventEmitter();
  @Output() onOpenSearch = new EventEmitter<void>();
  @Output() onCollapseSearch = new EventEmitter<void>();
  @Output() onSearchValue = new EventEmitter<string>();
  @Output() onClearSearch = new EventEmitter<void>();
  @Output() onRename = new EventEmitter<string>();
  show_menu: boolean;
  pending_search_focus: boolean;
  pending_rename_focus: boolean;
  title_is_overflowing: boolean;
  title_shift: number;
  renaming_title: boolean;
  rename_draft: string;

  constructor(
    public userService: UserService,
    public footBtnService: FootBtnService,
    public router: Router,
  ) {
    this.show_menu = false;
    this.pending_search_focus = false;
    this.pending_rename_focus = false;
    this.title_is_overflowing = false;
    this.title_shift = 0;
    this.renaming_title = false;
    this.rename_draft = '';
  }

  ngAfterViewInit() {
    this.refresh_title_overflow();
    this.focus_search_if_needed();
    this.focus_rename_if_needed();
  }

  ngOnChanges(_: SimpleChanges) {
    setTimeout(() => {
      this.refresh_title_overflow();
      this.focus_search_if_needed();
      this.focus_rename_if_needed();
      if (!this.renaming_title && this.resource?.rname != null) {
        this.rename_draft = this.resource.rname;
      }
    });
  }

  dismiss_menu() {
    if (this.show_menu) {
      this.show_menu = false;
    }
  }

  @HostListener('window:resize')
  onWindowResize() {
    this.refresh_title_overflow();
  }

  @HostListener('document:keydown', ['$event'])
  onDocumentKeydown(event: KeyboardEvent) {
    if (!this.show_search_control || this.isEditableTarget(event.target)) {
      return;
    }
    if (event.key === '/') {
      event.preventDefault();
      this.open_search(event);
      return;
    }
    if (event.key === 'Escape' && this.search_mode) {
      event.preventDefault();
      this.collapse_search(event);
    }
  }

  start_rename($event?: Event) {
    $event?.preventDefault();
    $event?.stopPropagation();
    if (!this.is_mine || !this.resource) {
      return;
    }
    this.renaming_title = true;
    this.rename_draft = this.resource.rname || '';
    this.pending_rename_focus = true;
  }

  cancel_rename($event?: Event) {
    $event?.preventDefault();
    $event?.stopPropagation();
    this.renaming_title = false;
    this.pending_rename_focus = false;
    this.rename_draft = this.resource?.rname || '';
  }

  submit_rename($event?: Event) {
    $event?.preventDefault();
    $event?.stopPropagation();
    if (!this.renaming_title || !this.resource) {
      return;
    }
    const next_name = (this.rename_draft || '').trim();
    if (!next_name) {
      this.cancel_rename();
      return;
    }
    if (next_name === this.resource.rname) {
      this.cancel_rename();
      return;
    }
    this.renaming_title = false;
    this.pending_rename_focus = false;
    this.onRename.emit(next_name);
  }

  open_search($event) {
    $event.cancelBubble = true;
    $event.stopPropagation();
    this.pending_search_focus = true;
    if (!this.search_mode) {
      this.onOpenSearch.emit();
      return;
    }
    this.focus_search_if_needed();
  }

  collapse_search($event) {
    $event.cancelBubble = true;
    $event.stopPropagation();
    if (!this.search_mode) {
      return;
    }
    this.onCollapseSearch.emit();
  }

  update_search(value: string, $event = null) {
    if ($event) {
      $event.cancelBubble = true;
      $event.stopPropagation();
    }
    this.onSearchValue.emit(value);
  }

  clear_search($event) {
    $event.cancelBubble = true;
    $event.stopPropagation();
    this.onClearSearch.emit();
    this.pending_search_focus = false;
    this.onCollapseSearch.emit();
  }

  on_search_blur() {
    if (this.search_value) {
      return;
    }
    this.onCollapseSearch.emit();
  }

  go_parent($event) {
    $event.cancelBubble = true;
    $event.stopPropagation();
    this.onGoParent.emit();
  }

  go_login($event) {
    $event.cancelBubble = true;
    $event.stopPropagation();
    // this.router.navigate(['/user', 'login', 'next', this.router.url]);
    window.location.href = this.userService.oauth_uri + '&state=' + encodeURI(this.router.url);
  }

  click_avatar($event) {
    $event.cancelBubble = true;
    $event.stopPropagation();
    this.show_menu = !this.show_menu;
  }

  menu_handler($event, s: string) {
    $event.cancelBubble = true;
    $event.stopPropagation();
    if (s === 'mine') {
      this.router.navigate(['/res', this.userService.user.rootRes]);
    } else if (s === 'profile') {
      window.location.href = `https://sso.6-79.cn/user/info-modify?from=https%3A%2F%2Fd.6-79.cn%2F/user/refresh`;
    } else if (s === 'code') {
      window.open('https://github.com/lqj679ssn/disk-frontend');
    } else if (s === 'tips') {
      this.show_menu = false;
      this.footBtnService.activate_btn(this.footBtnService.foot_btn_tips);
    } else if (s === 'updates') {
      this.show_menu = false;
      this.footBtnService.activate_btn(this.footBtnService.foot_btn_update);
    }
  }

  get show_search_control() {
    return !!this.resource?.is_folder;
  }

  private focus_search_if_needed() {
    if (!this.pending_search_focus || !this.search_mode || !this.searchInputRef) {
      return;
    }
    const input = this.searchInputRef.nativeElement;
    input.focus();
    input.select();
    this.pending_search_focus = false;
  }

  private focus_rename_if_needed() {
    if (!this.pending_rename_focus || !this.renaming_title || !this.renameInputRef) {
      return;
    }
    const input = this.renameInputRef.nativeElement;
    input.focus();
    input.select();
    this.pending_rename_focus = false;
  }

  private refresh_title_overflow() {
    if (this.renaming_title || !this.titleViewportRef || !this.titleTrackRef || !this.titleTextRef) {
      return;
    }
    const viewport = this.titleViewportRef.nativeElement;
    const title = this.titleTextRef.nativeElement;
    const overflow = Math.max(title.scrollWidth - viewport.clientWidth, 0);
    this.title_shift = -overflow;
    this.title_is_overflowing = overflow > 6;
  }

  private isEditableTarget(target: EventTarget | null) {
    const element = target as HTMLElement | null;
    if (!element) {
      return false;
    }
    const tag_name = element.tagName?.toLowerCase();
    return !!(element.isContentEditable || tag_name === 'input' || tag_name === 'textarea');
  }
}
