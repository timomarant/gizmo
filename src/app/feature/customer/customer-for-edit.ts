export class CustomerForEdit {
  id: number;
  name: string; 
  address?: string; 
  countryTwoLetterCode?: string; 
  postalCode?: string;   
  city?: string;  
  vatNumber?: string; 
  phoneOne?: string; 
  phoneTwo?: string; 
  phoneThree?: string; 
  emailOne?: string; 
  emailTwo?: string; 
  emailThree?: string; 
  isDeleted: boolean;
}