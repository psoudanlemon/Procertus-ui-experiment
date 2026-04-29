import type { MockPrototypeUser } from "@procertus-ui/ui-pt1-prototype";

export const MOCK_PROTOTYPE_USERS: MockPrototypeUser[] = [
  {
    id: "demo-jane",
    displayName: "Jane Doe",
    email: "jane.doe@procertus.example",
    role: "Extranet coordinator",
    homeOrganization: { id: "org-procertus", name: "PROCERTUS" },
    representedOrganization: { id: "org-acme", name: "Acme Packaging BV" },
    organizations: [
      { id: "org-procertus", name: "PROCERTUS" },
      { id: "org-acme", name: "Acme Packaging BV" },
    ],
  },
  {
    id: "demo-liam",
    displayName: "Liam Chen",
    email: "liam.chen@acme.example",
    role: "Plant quality lead",
    homeOrganization: { id: "org-acme", name: "Acme Packaging BV" },
    representedOrganization: { id: "org-acme", name: "Acme Packaging BV" },
  },
  {
    id: "demo-sofia",
    displayName: "Sofia Martens",
    email: "sofia@greenleaf.example",
    role: "Sustainability officer",
    homeOrganization: { id: "org-greenleaf", name: "GreenLeaf Ingredients" },
    representedOrganization: { id: "org-northwind", name: "Northwind Foods" },
  },
];
