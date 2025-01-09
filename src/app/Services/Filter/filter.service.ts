import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  filters: any = {};
  pagination: any = { currentPage: 1, itemsPerPage: 10 };
  constructor() { }

  setFilters(filters: any) {
    this.filters = { ...filters };
  }

  getFilters() {
    return this.filters;
  }

  setPagination(pagination: any) {
    this.pagination = { ...pagination };
  }

  getPagination() {
    return this.pagination;
  }
}
