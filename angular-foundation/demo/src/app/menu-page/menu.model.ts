export interface MenuItem {
  routerLink: string | any[];
  title: string;
}

export type MenuItems = MenuItem[];

export interface Menu {
  title: string;
  items: MenuItems;
}