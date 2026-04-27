import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@procertus-ui/ui";
import { RequestPackageReview } from "@procertus-ui/ui-certification";
import { useMockPrototypeSession } from "@procertus-ui/ui-pt1-prototype";

export function OrganizationPage() {
  const session = useMockPrototypeSession();
  const represented = session?.user.representedOrganization.name ?? "Prototype organization";
  const home = session?.user.homeOrganization.name ?? "Prototype workspace";

  return (
    <div className="mx-auto grid w-full max-w-5xl gap-4 px-4 py-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <RequestPackageReview
        title="Organisatie"
        description="Stub voor de organisatiecontext die na onboarding wordt hergebruikt bij nieuwe aanvragen."
        rows={[
          { id: "represented", label: "Vertegenwoordigde organisatie", value: represented },
          { id: "workspace", label: "Workspace", value: home },
          { id: "status", label: "Klantstatus", value: "Intake actief · KYC in behandeling" },
        ]}
      />
      <Card>
        <CardHeader>
          <CardTitle>Later in scope</CardTitle>
          <CardDescription>
            Rollen, rechten en echte organisatie-switching worden niet in dit prototype uitgewerkt.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Deze pagina bewijst alleen dat de authenticated shell een app-eigen navigatiemodel heeft.
        </CardContent>
      </Card>
    </div>
  );
}
