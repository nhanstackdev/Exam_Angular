import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Transaction {
  id: number;
  ngayChungTu: string;
  ngayHachToan: string;
  soChungTu: number;
  soHoaDon: number;
  dienGiai: string;
  doiTuong: string;
  loaiChungTu: string;
  soTien: string;
}

export interface SidebarItems {
  title: string,
  icon: string,
  subMenu: string[],
  open: boolean
}

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/transactions`);
  }

  getMenu(): Observable<SidebarItems[]> {
    return this.http.get<SidebarItems[]>(`${this.apiUrl}/sidebarItems`)
  }
}
