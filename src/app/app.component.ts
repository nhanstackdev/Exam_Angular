import { Component } from '@angular/core';
import { AppService, SidebarItems, Transaction } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Asm';

  transactions: Transaction[] = [];
  sidebarItems: SidebarItems[] = [];

  isSidebarHovered = false;
  isSidebarPinned = false;

  activeParentIndex: number | null = null;
  activeSubIndex: number | null = null;

  constructor(private transactionService: AppService) { }

  ngOnInit(): void {
    this.transactionService.getAll().subscribe(data => {
      this.transactions = data;
    });
    this.transactionService.getMenu().subscribe(data => {
      this.sidebarItems = data;
    })
  }

  onSidebarHover(state: boolean) {
    if (!this.isSidebarPinned) {
      this.isSidebarHovered = state;
    }
  }

  toggleSubmenu(index: number): void {
    if (this.activeParentIndex === index) {
      this.activeParentIndex = null;
      this.activeSubIndex = null;
    } else {
      this.activeParentIndex = index;
      this.activeSubIndex = null;
    }
  }

  setActiveSubmenu(parentIndex: number, subIndex: number, event: Event) {
    event.stopPropagation();
    this.activeParentIndex = parentIndex;
    this.activeSubIndex = subIndex;
  }

  isItemOpen(index: number): boolean {
    return this.isSidebarHovered && this.activeParentIndex === index;
  }

  isParentActive(index: number): boolean {
    return this.activeParentIndex === index;
  }

  isSubActive(parentIndex: number, subIndex: number): boolean {
    return this.activeParentIndex === parentIndex && this.activeSubIndex === subIndex;
  }
  toggleSidebarPin(event: Event) {
    event.stopPropagation();
    this.isSidebarPinned = !this.isSidebarPinned;
  }
}
