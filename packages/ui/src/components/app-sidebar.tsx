"use client";

import * as React from "react";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DashboardSquare01Icon,
  Menu01Icon,
  AnalyticsUpIcon,
  Folder01Icon,
  UserGroupIcon,
  Camera01Icon,
  File01Icon,
  Setting06Icon,
  HelpCircleIcon,
  Search01Icon,
  DatabaseIcon,
  FileAttachmentIcon,
  ComputerTerminal01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: <HugeiconsIcon icon={DashboardSquare01Icon} />,
    },
    {
      title: "Lifecycle",
      url: "#",
      icon: <HugeiconsIcon icon={Menu01Icon} />,
    },
    {
      title: "Analytics",
      url: "#",
      icon: <HugeiconsIcon icon={AnalyticsUpIcon} />,
    },
    {
      title: "Projects",
      url: "#",
      icon: <HugeiconsIcon icon={Folder01Icon} />,
    },
    {
      title: "Team",
      url: "#",
      icon: <HugeiconsIcon icon={UserGroupIcon} />,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: <HugeiconsIcon icon={Camera01Icon} />,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: <HugeiconsIcon icon={File01Icon} />,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: <HugeiconsIcon icon={File01Icon} />,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: <HugeiconsIcon icon={Setting06Icon} />,
    },
    {
      title: "Get Help",
      url: "#",
      icon: <HugeiconsIcon icon={HelpCircleIcon} />,
    },
    {
      title: "Search",
      url: "#",
      icon: <HugeiconsIcon icon={Search01Icon} />,
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: <HugeiconsIcon icon={DatabaseIcon} />,
    },
    {
      name: "Reports",
      url: "#",
      icon: <HugeiconsIcon icon={FileAttachmentIcon} />,
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: <HugeiconsIcon icon={File01Icon} />,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:p-1.5!">
              <a href="#">
                <HugeiconsIcon icon={ComputerTerminal01Icon} className="size-5!" />
                <span className="text-base font-semibold">Acme Inc.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
