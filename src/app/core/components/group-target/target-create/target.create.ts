export class TargetUsers {
  id!: number;
  userId!: string;
  yearlyTarget!: number;
  currencyId!: number;
  year!: string;
  isMonthly!: boolean;
  monthlyViewModels!: monthModel[];
}

export class TargetUsersGroup {
  id!: number;
  groupNameId!: number;
  yearlyTarget!: number;
  currencyId!: number;
  year!: string;
  isMonthly!: boolean;
  monthlyViewModels!: monthModel[];
}

export class TargetContacts {
  id!: number;
  contactsId!: number;
  yearlyTarget!: number;
  currencyId!: number;
  year!: string;
  isMonthly!: boolean;
  monthlyViewModels!: monthModel[];
}
export class TargetSites {
  id!: number;
  siteId!: number;
  yearlyTarget!: number;
  currencyId!: number;
  year!: string;
  isMonthly!: boolean;
  monthlyViewModels!: monthModel[];
}
export class TargetProducts {
  id!: number;
  productId!: number;
  yearlyTarget!: number;
  currencyId!: number;
  year!: string;
  isMonthly!: boolean;
  monthlyViewModels!: monthModel[];
}

export class monthModel {
  month!: string;
  monthlyTarget!: number;
}
export class TargetContactsGroup {
  id!: number;
  contactsGroupNameId!: number;
  yearlyTarget!: number;
  currencyId!: number;
  year!: string;
  isMonthly!: boolean;
  monthlyViewModels!: monthModel[];
}
export class TargetSitesGroup {
  id!: number;
  sitesGroupNameId!: number;
  yearlyTarget!: number;
  currencyId!: number;
  year!: string;
  isMonthly!: boolean;
  monthlyViewModels!: monthModel[];
}
export class TargetProductsGroup {
  id!: number;
  productsGroupNameId!: number;
  yearlyTarget!: number;
  currencyId!: number;
  year!: string;
  isMonthly!: boolean;
  monthlyViewModels!: monthModel[];
}