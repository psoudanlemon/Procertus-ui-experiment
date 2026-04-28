import type { RequestPackageReviewRequesterPresentation } from "@procertus-ui/ui-certification";
import type { MockPrototypeSession } from "@procertus-ui/ui-pt1-prototype";

/** Maps the mock authenticated session into review-step requester copy (Dutch UI). */
export function reviewRequesterFromSession(
  session: MockPrototypeSession | null,
): RequestPackageReviewRequesterPresentation {
  const user = session?.user;
  return {
    context: {
      requesterName: user?.displayName ?? "Prototype gebruiker",
      requesterEmail: user?.email ?? "gebruiker@voorbeeld.proc",
      organizationName: user?.representedOrganization.name ?? "Vertegenwoordigde organisatie",
      organizationDetails: user ? (
        <span className="block text-sm leading-normal">
          Workspace: {user.homeOrganization.name}
          {user.role ? (
            <>
              {" "}
              · Rol: {user.role}
            </>
          ) : null}
        </span>
      ) : (
        <span className="text-sm italic">Geen actieve sessie — prototypewaarden getoond.</span>
      ),
    },
    sectionTitle: "Aanvrager en organisatie",
    requesterLabel: "Ingediend door",
    requesterEmailLabel: "E-mail",
    organizationLabel: "Organisatie (vertegenwoordigd)",
  };
}
