import { Users, ShieldCheck, UserCircle, Building2 } from "lucide-react";

export const API_BASE_URL = "http://localhost:3000/api/v1";

export const navItems = [
  {
    href: "/users",
    label: "Users",
    icon: <UserCircle className="w-4 h-4" />,
  },
  {
    href: "/roles",
    label: "Roles",
    icon: <Users className="w-4 h-4" />,
  },
  {
    href: "/permissions",
    label: "Permissions",
    icon: <ShieldCheck className="w-4 h-4" />,
  },
  {
    href: "/hospitals",
    label: "Hospitals",
    icon: <Building2 className="w-4 h-4" />,
  },
];
