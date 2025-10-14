import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appSticky]'
})
export class StickyDirective {
  @Input('appSticky') position: 'left' | 'right' = 'left';
  @Input() offset: string | number = 0;
  @Input() bgColor: string = '#fff';
  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnInit(): void {
    const element = this.el.nativeElement;

    this.renderer.setStyle(element, 'position', 'sticky');
    this.renderer.setStyle(element, 'z-index', '3');
    this.renderer.setStyle(element, 'background-color', this.bgColor);

    let offsetPx = 0;

    if (typeof this.offset === 'string' && isNaN(+this.offset)) {
      const prev = document.getElementById(this.offset);
      if (prev) {
        offsetPx = prev.offsetLeft + prev.offsetWidth;
      }
    } else {
      offsetPx = Number(this.offset);
    }

    if (this.position === 'left') {
      this.renderer.setStyle(element, 'left', `${offsetPx}px`);
    }

    if (this.position === 'right') {
      this.renderer.setStyle(element, 'right', `${offsetPx}px`);
    }
  }
}
