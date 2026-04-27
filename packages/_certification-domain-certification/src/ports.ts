import type {
  CertificationCustomerContext,
  CertificationRequestPackage,
  CertificationRequestSession,
  CertificationRequestDraft,
  CertificationRequestIntentId,
  CreateCertificationCustomerContext,
  CreateCertificationRequestPackage,
  CreateCertificationRequestSession,
  UpdateCertificationCustomerContext,
  UpdateCertificationRequestPackage,
  UpdateCertificationRequestSession,
} from "./entities";

export type CertificationListInput = {
  readonly page?: number;
  readonly pageSize?: number;
};

export type CertificationPage<TEntity> = {
  readonly items: readonly TEntity[];
  readonly page: number;
  readonly pageSize: number;
  readonly total: number;
};

export interface CertificationCrudPort<TEntity, TCreateInput, TUpdateInput> {
  readonly create: (input: TCreateInput) => Promise<TEntity>;
  readonly getById: (id: string) => Promise<TEntity | undefined>;
  readonly list: (input?: CertificationListInput) => Promise<CertificationPage<TEntity>>;
  readonly update: (id: string, input: TUpdateInput) => Promise<TEntity>;
  readonly remove: (id: string) => Promise<void>;
}

export type CertificationRequestSessionPort = CertificationCrudPort<
  CertificationRequestSession,
  CreateCertificationRequestSession,
  UpdateCertificationRequestSession
>;

export type CertificationCustomerContextPort = CertificationCrudPort<
  CertificationCustomerContext,
  CreateCertificationCustomerContext,
  UpdateCertificationCustomerContext
>;

export type CertificationRequestPackagePort = CertificationCrudPort<
  CertificationRequestPackage,
  CreateCertificationRequestPackage,
  UpdateCertificationRequestPackage
>;

export type CertificationRequestPersistencePort = {
  readonly sessions: CertificationRequestSessionPort;
  readonly customerContexts: CertificationCustomerContextPort;
  readonly packages: CertificationRequestPackagePort;
  readonly createDraftFromIntent: (input: {
    readonly intent: CertificationRequestIntentId;
    readonly label: string;
    readonly shortLabel: string;
  }) => Promise<CertificationRequestDraft>;
};
