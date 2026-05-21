import {
  ProcertusCategorizationTreeView,
  useProcertusCategorizationDoc,
} from "@procertus-ui/ui-certification";
import { H1, P } from "@procertus-ui/ui";

export function CategorizationDemoPage() {
  const doc = useProcertusCategorizationDoc();

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6">
      <div>
        <H1>Product categorization</H1>
        <P className="text-muted-foreground">
          Browse the PROCERTUS decision tree (demo data from the shared categorization package).
        </P>
      </div>
      <ProcertusCategorizationTreeView doc={doc} />
    </div>
  );
}
