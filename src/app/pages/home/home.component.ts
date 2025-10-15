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

  displayRange: string = '';
  dateRange: Date[] | null = null;
  rangeDates: Date[] = [];
  transactions: Transaction[] = [];
  sidebarItems: SidebarItems[] = [];
  pagedTransactions: Transaction[] = [];

  selectedOption: any = null;
  selectOptions = [
    { label: 'Hôm nay', value: 'today' },
    { label: 'Ngày mai', value: 'tomorrow' },
    { label: 'Tháng 1', value: 1 },
    { label: 'Tháng 2', value: 2 },
    { label: 'Tháng 3', value: 3 },
    { label: 'Tháng 4', value: 4 },
    { label: 'Tháng 5', value: 5 },
    { label: 'Tháng 6', value: 6 },
    { label: 'Tháng 7', value: 7 },
    { label: 'Tháng 8', value: 8 },
    { label: 'Tháng 9', value: 9 },
    { label: 'Tháng 10', value: 10 },
    { label: 'Tháng 11', value: 11 },
    { label: 'Tháng 12', value: 12 },
  ];

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

  // format calendar
  autoFormatRange(event: any) {
    let value: string = event.target.value.replace(/\D/g, '');
    let formatted = '';

    // format ngày đầu
    if (value.length > 0) formatted = value.substring(0, 2);
    if (value.length > 2) formatted += '/' + value.substring(2, 4);
    if (value.length > 4) formatted += '/' + value.substring(4, 8);

    // format ngày thứ 2
    if (value.length > 8) formatted += ' - ' + value.substring(8, 10);
    if (value.length > 10) formatted += '/' + value.substring(10, 12);
    if (value.length > 12) formatted += '/' + value.substring(12, 16);

    event.target.value = formatted;
    this.displayRange = formatted;

    // Khi nhập đủ 16 ký tự → tạo 2 Date object
    if (value.length === 16) {
      const start = this.parseDate(value.substring(0, 8));
      const end = this.parseDate(value.substring(8, 16));

      if (start && end) {
        this.dateRange = [start, end];
      }
    }
  }

  onCalendarChange(range: (Date | null)[]) {
    if (range && range.length === 2 && range[0] && range[1]) {
      const d1 = this.formatDate(range[0]);
      const d2 = this.formatDate(range[1]);
      this.displayRange = `${d1} - ${d2}`;
    }
  }

  selectToday() {
    const today = new Date();
    this.selectedOption = 'today';
    this.dateRange = [today, today];
  }

  onSelect(opt: any) {
    this.selectedOption = opt.value;
    const today = new Date();

    if (opt.value === 'today') {
      this.dateRange = [today, today];
    }
    else if (opt.value === 'tomorrow') {
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);
      this.dateRange = [tomorrow, tomorrow];
    }
    else if (typeof opt.value === 'number') {
      const year = today.getFullYear();
      const start = new Date(year, opt.value - 1, 1);
      const end = new Date(year, opt.value, 0);
      const d1 = this.formatDate(start);
      const d2 = this.formatDate(end);
      this.displayRange = `${d1} - ${d2}`;
      this.dateRange = [start, end];
    }
  }

  private parseDate(value: string): Date | null {
    const day = parseInt(value.substring(0, 2));
    const month = parseInt(value.substring(2, 4)) - 1;
    const year = parseInt(value.substring(4, 8));
    const date = new Date(year, month, day);
    return isNaN(date.getTime()) ? null : date;
  }

  private formatDate(date: Date): string {
    const dd = ('0' + date.getDate()).slice(-2);
    const mm = ('0' + (date.getMonth() + 1)).slice(-2);
    const yyyy = date.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  }

  // open and close
  toggleOpenClose(name: keyof typeof this.toggles) {
    this.toggles[name] = !this.toggles[name];
    if(name === "isCalendar") {
      this.selectToday()
    }
  }
}
