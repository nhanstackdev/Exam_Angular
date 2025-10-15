import { AfterViewInit, Directive, ElementRef, Input, OnDestroy, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appStickyCols]'
})
export class StickyColsDirective implements AfterViewInit, OnDestroy {
  @Input('appStickyCols') stickyCols: string[] = [];
  private observer!: MutationObserver;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    const table: HTMLElement = this.el.nativeElement.closest('table') || this.el.nativeElement;
    if (!table) return;

    this.renderer.setStyle(table, 'position', 'relative');
    this.renderer.setStyle(table, 'border-collapse', 'separate');

    // Quan sát DOM trong table (tbody render lại khi *ngFor thay đổi)
    this.observer = new MutationObserver(() => {
      this.applySticky(table);
    });

    this.observer.observe(table, { childList: true, subtree: true });

    // Lần đầu chạy
    this.applySticky(table);
  }

  private applySticky(table: HTMLElement): void {
    if (!this.stickyCols?.length) return;

    let offsetLeft = 0;

    this.stickyCols.forEach((colName) => {
      const selector = `[name="${colName}"]`;
      const cells = table.querySelectorAll(selector);
      if (cells.length === 0) return;

      const firstCell = cells[0] as HTMLElement;
      const width = firstCell.offsetWidth || firstCell.getBoundingClientRect().width;

      cells.forEach((cell) => {
        const c = cell as HTMLElement;
        this.renderer.setStyle(c, 'position', 'sticky');
        this.renderer.setStyle(c, 'left', `${offsetLeft}px`);
        this.renderer.setStyle(c, 'z-index', this.isHeader(c) ? 20 : 0);
        // this.renderer.setStyle(c, 'background', this.isHeader(c) ? '#f8f9fa' : '#fff');
        this.renderer.setStyle(c, 'box-shadow', '2px 0 4px rgba(0,0,0,0.05)');
      });

      offsetLeft += width;
    });
  }

  private isHeader(el: HTMLElement): boolean {
    return el.tagName.toLowerCase() === 'th' || !!el.closest('thead');
  }

  ngOnDestroy(): void {
    if (this.observer) this.observer.disconnect();
  }
}
