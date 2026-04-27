import type {
  CertificationCustomerContext,
  CertificationCustomerContextPort,
  CertificationRequestDraft,
  CertificationRequestIntentId,
  CertificationListInput,
  CertificationPage,
  CertificationRequestPackage,
  CertificationRequestPackagePort,
  CertificationRequestPersistencePort,
  CertificationRequestSession,
  CertificationRequestSessionPort,
  CreateCertificationCustomerContext,
  CreateCertificationRequestPackage,
  CreateCertificationRequestSession,
  UpdateCertificationCustomerContext,
  UpdateCertificationRequestPackage,
  UpdateCertificationRequestSession,
} from "@procertus-ui/domain-certification";

const nowIso = () => new Date().toISOString();

const createId = (prefix: string) =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? `${prefix}-${crypto.randomUUID()}`
    : `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;

export type CertificationRequestBackend = CertificationRequestPersistencePort & {
  readonly sessionId: string;
  readonly getCurrentSession: () => CertificationRequestSession;
  readonly subscribe: (listener: () => void) => () => void;
  readonly updateCurrentSession: (
    input:
      | UpdateCertificationRequestSession
      | ((session: CertificationRequestSession) => UpdateCertificationRequestSession),
  ) => CertificationRequestSession;
  readonly resetCurrentSession: (input?: CreateCertificationRequestSession) => CertificationRequestSession;
};

export type CertificationStorageState = {
  readonly sessions: Record<string, CertificationRequestSession>;
  readonly customerContexts: Record<string, CertificationCustomerContext>;
  readonly packages: Record<string, CertificationRequestPackage>;
};

export type StoreRef = {
  state: CertificationStorageState;
};

export const emptyCertificationStorageState = (): CertificationStorageState => ({
  sessions: {},
  customerContexts: {},
  packages: {},
});

function pageItems<TEntity>(
  entities: Record<string, TEntity>,
  input: CertificationListInput = {},
): CertificationPage<TEntity> {
  const page = input.page ?? 1;
  const pageSize = input.pageSize ?? 50;
  const items = Object.values(entities);
  const start = Math.max(0, page - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    page,
    pageSize,
    total: items.length,
  };
}

function makeSession(input: CreateCertificationRequestSession): CertificationRequestSession {
  const timestamp = nowIso();
  return {
    id: input.id ?? createId("cert-session"),
    mode: input.mode,
    activeStep: input.activeStep ?? 0,
    intent: input.intent,
    expandedIds: [...(input.expandedIds ?? [])],
    searchValue: input.searchValue ?? "",
    hideUnavailableProducts: input.hideUnavailableProducts ?? false,
    selectedProductId: input.selectedProductId,
    selectedEntryIds: [...(input.selectedEntryIds ?? [])],
    requestText: input.requestText ?? "",
    drafts: [...(input.drafts ?? [])],
    customerContextId: input.customerContextId,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

function makeCustomerContext(input: CreateCertificationCustomerContext): CertificationCustomerContext {
  const timestamp = nowIso();
  return {
    id: createId("cert-customer"),
    representativeName: input.representativeName,
    representativeEmail: input.representativeEmail,
    organizationName: input.organizationName,
    country: input.country,
    vatNumber: input.vatNumber,
    address: input.address,
    kycNotes: input.kycNotes,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

function makePackage(input: CreateCertificationRequestPackage): CertificationRequestPackage {
  const timestamp = nowIso();
  return {
    id: createId("cert-package"),
    sessionId: input.sessionId,
    customerContextId: input.customerContextId,
    draftIds: [...input.draftIds],
    status: input.status,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

function makeDraftFromIntent(input: {
  readonly intent: CertificationRequestIntentId;
  readonly label: string;
  readonly shortLabel: string;
}): CertificationRequestDraft {
  return {
    id: createId(`draft-${input.intent}`),
    entryId: input.intent,
    label: input.label,
    shortLabel: input.shortLabel,
  };
}

function createSessionPort(ref: StoreRef, emit: () => void): CertificationRequestSessionPort {
  return {
    create: async (input) => {
      const entity = makeSession(input);
      ref.state = { ...ref.state, sessions: { ...ref.state.sessions, [entity.id]: entity } };
      emit();
      return entity;
    },
    getById: async (id) => ref.state.sessions[id],
    list: async (input) => pageItems(ref.state.sessions, input),
    update: async (id, input) => {
      const current = ref.state.sessions[id];
      if (!current) throw new Error(`Certification request session not found: ${id}`);
      const entity = { ...current, ...input, updatedAt: nowIso() };
      ref.state = { ...ref.state, sessions: { ...ref.state.sessions, [id]: entity } };
      emit();
      return entity;
    },
    remove: async (id) => {
      const { [id]: _removed, ...sessions } = ref.state.sessions;
      ref.state = { ...ref.state, sessions };
      emit();
    },
  };
}

function createCustomerContextPort(
  ref: StoreRef,
  emit: () => void,
): CertificationCustomerContextPort {
  return {
    create: async (input) => {
      const entity = makeCustomerContext(input);
      ref.state = {
        ...ref.state,
        customerContexts: { ...ref.state.customerContexts, [entity.id]: entity },
      };
      emit();
      return entity;
    },
    getById: async (id) => ref.state.customerContexts[id],
    list: async (input) => pageItems(ref.state.customerContexts, input),
    update: async (id, input: UpdateCertificationCustomerContext) => {
      const current = ref.state.customerContexts[id];
      if (!current) throw new Error(`Certification customer context not found: ${id}`);
      const entity = { ...current, ...input, updatedAt: nowIso() };
      ref.state = {
        ...ref.state,
        customerContexts: { ...ref.state.customerContexts, [id]: entity },
      };
      emit();
      return entity;
    },
    remove: async (id) => {
      const { [id]: _removed, ...customerContexts } = ref.state.customerContexts;
      ref.state = { ...ref.state, customerContexts };
      emit();
    },
  };
}

function createPackagePort(ref: StoreRef, emit: () => void): CertificationRequestPackagePort {
  return {
    create: async (input) => {
      const entity = makePackage(input);
      ref.state = { ...ref.state, packages: { ...ref.state.packages, [entity.id]: entity } };
      emit();
      return entity;
    },
    getById: async (id) => ref.state.packages[id],
    list: async (input) => pageItems(ref.state.packages, input),
    update: async (id, input: UpdateCertificationRequestPackage) => {
      const current = ref.state.packages[id];
      if (!current) throw new Error(`Certification request package not found: ${id}`);
      const entity = { ...current, ...input, updatedAt: nowIso() };
      ref.state = { ...ref.state, packages: { ...ref.state.packages, [id]: entity } };
      emit();
      return entity;
    },
    remove: async (id) => {
      const { [id]: _removed, ...packages } = ref.state.packages;
      ref.state = { ...ref.state, packages };
      emit();
    },
  };
}

export function createCertificationBackendFromRef({
  ref,
  sessionId,
  initialSession,
  persist,
}: {
  ref: StoreRef;
  sessionId: string;
  initialSession: CreateCertificationRequestSession;
  persist?: (state: CertificationStorageState) => void;
}): CertificationRequestBackend {
  const listeners = new Set<() => void>();
  const emit = () => {
    persist?.(ref.state);
    listeners.forEach((listener) => listener());
  };

  if (!ref.state.sessions[sessionId]) {
    const session = makeSession({ ...initialSession, id: sessionId });
    ref.state = { ...ref.state, sessions: { ...ref.state.sessions, [sessionId]: session } };
    persist?.(ref.state);
  }

  const sessions = createSessionPort(ref, emit);
  const customerContexts = createCustomerContextPort(ref, emit);
  const packages = createPackagePort(ref, emit);

  return {
    sessionId,
    sessions,
    customerContexts,
    packages,
    createDraftFromIntent: async (input) => {
      const draft = makeDraftFromIntent(input);
      const current = ref.state.sessions[sessionId] ?? makeSession({ ...initialSession, id: sessionId });
      const next = {
        ...current,
        drafts: current.drafts.length === 0 ? [draft] : current.drafts,
        activeStep: Math.max(current.activeStep, 1),
        updatedAt: nowIso(),
      };
      ref.state = { ...ref.state, sessions: { ...ref.state.sessions, [sessionId]: next } };
      emit();
      return draft;
    },
    getCurrentSession: () => ref.state.sessions[sessionId] ?? makeSession({ ...initialSession, id: sessionId }),
    subscribe: (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    updateCurrentSession: (input) => {
      const current = ref.state.sessions[sessionId] ?? makeSession({ ...initialSession, id: sessionId });
      const patch = typeof input === "function" ? input(current) : input;
      const next = { ...current, ...patch, updatedAt: nowIso() };
      ref.state = { ...ref.state, sessions: { ...ref.state.sessions, [sessionId]: next } };
      emit();
      return next;
    },
    resetCurrentSession: (input) => {
      const next = makeSession({ ...initialSession, ...input, id: sessionId });
      ref.state = { ...ref.state, sessions: { ...ref.state.sessions, [sessionId]: next } };
      emit();
      return next;
    },
  };
}
