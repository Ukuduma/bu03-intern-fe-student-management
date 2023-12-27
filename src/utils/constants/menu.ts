import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { ConfigurationRoutes } from '../../routes';
import { Role } from "../constants";

export interface MenuItemTypes {
  key: string;
  label: string;
  isTitle?: boolean;
  icon?: any;
  url?: string;
  badge?: {
    variant: string;
    text: string;
  };
  parentKey?: string;
  target?: string;
  children?: MenuItemTypes[];
  roles?: Role[];
}

const MENU_ITEMS: MenuItemTypes[] = [
  { key: "navigation", label: "Navigation", isTitle: true },
  {
    key: "courses",
    label: "Courses",
    url: "/courses", // Điều hướng đến trang "Courses"
    icon: faEnvelope,
  },
];

export { MENU_ITEMS };
