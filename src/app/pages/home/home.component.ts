import { HomeService } from './home.service';
import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { SidebarItems, Transaction } from './home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  title = 'Asm';

  rangeDates: Date[] = [];
  transactions: Transaction[] = [];
  sidebarItems: SidebarItems[] = [];
  pagedTransactions: Transaction[] = [];

  currentPage: number = 1;
  pageSize: number = 15;
  totalPages: number = 0;
  visiblePages: number[] = [];

  isSidebarHovered = false;
  isSidebarPinned = false;
  isOptionsOpen = false;
  isMobileSidebarOpen = false;

  toggles = {
    isOptionsOpen: false,
    isFillter: false,
    isSetting: false,
    isCalendar: false
  };

  activeParentIndex: number | null = null;
  activeSubIndex: number | null = null;

  constructor(
    private transactionService: HomeService,
    private primengConfig: PrimeNGConfig
  ) { }

  ngOnInit(): void {
    this.transactionService.getAll().subscribe(data => {
      this.transactions = data;
      this.totalPages = Math.ceil(this.transactions.length / this.pageSize);
      this.updatePagedTransactions();
      this.updateVisiblePages();
    });
    this.transactionService.getMenu().subscribe(data => {
      this.sidebarItems = data;
    })

    this.primengConfig.setTranslation({
      monthNames: [
        "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
        "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
      ],
    })
  }

  // pagination
  updatePagedTransactions() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedTransactions = this.transactions.slice(start, end);
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePagedTransactions();
    this.updateVisiblePages();
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagedTransactions();
      this.updateVisiblePages();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagedTransactions();
      this.updateVisiblePages();
    }
  }

  updateVisiblePages() {
    const total = this.totalPages;
    const current = this.currentPage;

    if (total <= 6) {
      this.visiblePages = Array.from({ length: total }, (_, i) => i + 1);
    } else {
      if (current <= 3) {
        this.visiblePages = [1, 2, 3, 4, 0, total]; // 0 = dấu ...
      } else if (current >= total - 2) {
        this.visiblePages = [1, 0, total - 3, total - 2, total - 1, total];
      } else {
        this.visiblePages = [1, 0, current - 1, current, current + 1, 0, total];
      }
    }
  }

  // sidebar
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

  toggleMobileSidebar(): void {
    this.isMobileSidebarOpen = !this.isMobileSidebarOpen;
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

  toggleOpenClose(name: keyof typeof this.toggles) {
    this.toggles[name] = !this.toggles[name];
  }

}
