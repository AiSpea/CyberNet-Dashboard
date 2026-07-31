# Dokploy production deployment

This repository is the single Git source for the CyberNet control plane on
Dokploy. GitHub Actions builds the customized Dashboard image, and the Compose
project pulls that image and starts the combined NetBird server. The combined
server contains Management, Signal, Relay, embedded identity, and STUN;
Dokploy's existing Traefik installation continues to terminate TLS and route
the public hostname.

The long-running application containers are:

- `dashboard`: the CyberNet-branded static Dashboard built from this repository.
- `netbird-server`: NetBird `0.76.0`, pinned by image digest.

The two `*-preflight` services are one-shot guards. They make a deployment fail
before the server starts if the existing configuration or database volume is
missing. They do not create or overwrite either volume.

## Dokploy settings

Configure the existing Compose service with the Dokploy GitHub provider that is
authorized for the `AiSpea-Base` organization:

- Owner: `AiSpea`
- Repository: `CyberNet-Dashboard`
- Branch: `main`
- Compose path: `deploy/compose.dokploy.yml`
- Dokploy repository auto deploy: disabled (GitHub Actions triggers deployment
  only after the matching GHCR image is published)
- Environment: copy `deploy/.env.example` into Dokploy and verify every value

GitHub Actions publishes `ghcr.io/aispea/cybernet-dashboard:main`, then calls
Dokploy's Compose deployment API. This ordering prevents Dokploy from
redeploying before the matching image exists. Configure these repository
settings:

- Secret `DOKPLOY_API_TOKEN`
- Variable `DOKPLOY_COMPOSE_ID`
- Variable `DOKPLOY_AUTODEPLOY_ENABLED`

Keep `DOKPLOY_AUTODEPLOY_ENABLED=false` until the first manual production
cutover and verification are complete. Set it to `true` afterward to enable
automatic deployment after successful pushes to `main`. The GHCR package must
be public, or Dokploy must have read credentials for `ghcr.io`.

The weekly upstream-sync workflow always prepares and pushes the
`automation/upstream-sync` review branch. The AiSpea organization currently
blocks pull-request creation by the default Actions token, so the workflow
prints a compare link in its summary. Add an optional repository-scoped
`UPSTREAM_SYNC_TOKEN` secret if automatic PR creation is enabled later.

## Migration safety

The current production state lives in these external Docker volumes:

- `netbird-crqe4l_netbird_data`
- `netbird-crqe4l_netbird_config`

The Compose file deliberately requires their names through
`NETBIRD_DATA_VOLUME` and `NETBIRD_CONFIG_VOLUME`. Never remove `external:
true`, rename the values, or accept a newly created empty volume during the
migration.

Before the first production cutover:

1. Back up both volumes and test that the backup can be read.
2. Deploy this Compose on a temporary hostname with the same external volumes
   mounted read-only for inspection, or stop the old server before allowing
   the new server write access. Never run two server writers against the same
   SQLite database.
3. Confirm `/healthz` returns `200`, `/api/accounts` returns `401` before login,
   the OIDC discovery endpoint under `/oauth2` works, and `/relay` performs a
   WebSocket upgrade.
4. Stop the old Raw Compose server and dashboard, then deploy this project with
   `CYBERNET_DOMAIN=cybernet.aisp24.com`.
5. Verify login, peer listing, a new client connection, SSH, network routes,
   exit-node routing, and local-network access.

Only after those checks should the old Raw Compose definition and its stopped
containers be removed. Keep both external volumes and at least one verified
backup. Dokploy's Traefik project is shared infrastructure and must not be
deleted.

## Same-origin route contract

Traefik sends these high-priority paths to the combined server:

- h2c gRPC: `/signalexchange.SignalExchange/`,
  `/management.ManagementService/`, and `/management.ProxyService/`
- HTTP/WebSocket: `/relay`, `/ws-proxy/`, `/api`, and `/oauth2`

The host-only rule has priority `1` and sends every other request to the
Dashboard. This routing contract keeps the existing client and login URLs
unchanged.

## Updating and rolling back

Changes merged to `main` run type-checking, a static build, and a multi-platform
container publish. When the repository deployment variable is enabled, the
workflow asks Dokploy to pull the newly published `main` image and redeploy.

For a Dashboard-only rollback, select an earlier Git commit or an immutable
`sha-*` GHCR image. The compatible upstream fallback is:

```text
netbirdio/dashboard:v2.90.8@sha256:6b3df5d07cbcf8fb81a6a18bb99fadb220e66a554c0e0fe71cd17a93c15769b1
```

Do not roll the server database backward by replacing or deleting the data
volume. Restore a tested backup only as a deliberate incident-recovery action.
