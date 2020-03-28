export interface ICustomerForList {
  id: number;
  name: string;
  address?: string; 
  phone?: string; 
  email?: string; 
  isFavourite: boolean;
}