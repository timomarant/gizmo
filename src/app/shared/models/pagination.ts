export interface IPagination {
  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
  previousPageLink: string;
  nextPageLink: string;
}
