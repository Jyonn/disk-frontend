import { Directive, EventEmitter, HostListener, Input, Output } from "@angular/core";

@Directive({
  selector: "[ngxClipboard]",
})
export class ClipboardCopyDirective {
  @Input() cbContent: string;
  @Output() cbOnError = new EventEmitter<void>();
  @Output() cbOnSuccess = new EventEmitter<void>();

  @HostListener("click")
  async copy() {
    const text = this.cbContent || "";

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        this.fallbackCopy(text);
      }
      this.cbOnSuccess.emit();
    } catch (error) {
      console.error(error);
      this.cbOnError.emit();
    }
  }

  private fallbackCopy(text: string) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    const ok = document.execCommand("copy");
    document.body.removeChild(textArea);
    if (!ok) {
      throw new Error("Copy failed");
    }
  }
}
