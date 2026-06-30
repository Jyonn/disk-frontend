import { Component, ElementRef, Input, OnChanges } from "@angular/core";
import { marked } from "marked";
import Prism from "prismjs";

import "prismjs/components/prism-csharp";
import "prismjs/components/prism-css";

marked.setOptions({
  breaks: true,
  gfm: true,
});

@Component({
  selector: "markdown",
  template: `<article class="markdown-shell" [innerHTML]="rendered"></article>`,
})
export class MarkdownComponent implements OnChanges {
  @Input() data: string;

  rendered = "";

  constructor(private elementRef: ElementRef<HTMLElement>) {}

  ngOnChanges() {
    const markdown = this.data || "";
    this.rendered = marked.parse(markdown) as string;

    queueMicrotask(() => {
      Prism.highlightAllUnder(this.elementRef.nativeElement);
    });
  }
}
