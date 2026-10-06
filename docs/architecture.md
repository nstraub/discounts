# Architecture: containers and deployment

C4 container and component diagrams of the deployed app, a sequence for publishing a discount, and the
pipeline that deploys it.

## Containers

The backend is one process: it serves the built web app (static files) and the API. The browser loads
the page from it, and the page calls the API on the same origin. The backend reads and writes
Postgres.

```mermaid
C4Container
  title Containers of the deployed app

  Person(visitor, "Visitor", "Reads and sets the greeting")

  System_Boundary(app, "app (docker-compose.production.yml)") {
    Container(webApp, "Web app", "Vue 3, Vite", "The built pages, served as static files by the backend; runs in the browser")
    Container(backend, "Backend", "NestJS 12, Node 26", "Serves the web app and the API: GET and PUT /greeting, GET and POST /discounts")
    ContainerDb(database, "Database", "PostgreSQL 16", "Schema app: the greetings and discounts tables; migrated on each deploy")
  }

  Rel(visitor, webApp, "Uses", "Browser")
  Rel(webApp, backend, "Loads from, and calls the API of", "HTTP, same origin")
  Rel(backend, database, "Reads and writes", "SQL, one connection pool")
```

Port 3000 inside the container is published on `127.0.0.1:${APP_HOST_PORT:-8080}`. The container's
command runs `migrate.js` (the migrator) and then `main.js`; on SIGTERM the backend closes its pool and
exits.

## Components of the discounts context

The backend's one bounded context, `src/discounts/`. The domain (`application/domain/`) owns two ports,
the repository and the domain-event publisher; `infra/` holds their adapters, so the dependencies
point inward. The web app is one page, `#/`, which lists the published discounts and offers the form
to publish one; the walking skeleton's greeting page is `#/walking-skeleton` (hash routing, so a
reload of the statically served app keeps its route).

```mermaid
C4Component
  title Components of the discounts context

  Container_Boundary(web, "Web app (Vue 3)") {
    Component(view, "DiscountsView", "Vue view", "Loads the published discounts when the page opens")
    Component(list, "PublishedDiscounts", "Vue component", "One entry per discount: item, rate as written followed by %, store name and address")
    Component(form, "PublishDiscountForm", "Vue component", "Captioned inputs for the four pieces; clears itself once published")
    Component(changeForm, "ChangeRateForm", "Vue component", "One per listed discount: a new rate and a button to change it")
    Component(store, "discounts store", "Pinia", "publish(), load() and changeRate(); goes through RestApi, and reloads the list after a change")
  }

  Container_Boundary(backend, "Backend (NestJS)") {
    Component(controller, "DiscountsController", "NestJS controller", "POST /discounts answers 201 with Location; PATCH /discounts/:id answers 204; GET /discounts lists")
    Component(parsedBy, "ParsedBy", "Nest pipe, zod", "Parses the request against the shared schema; a failure is a 400 requestRejection")
    Component(service, "DiscountService", "Application service", "publish(), changeRate() and published()")
    Component(factory, "DiscountFactory", "Domain factory", "create() gives a new identity; reconstitute() rebuilds a kept discount")
    Component(discount, "Discount", "Aggregate", "Holds its id and DiscountDetails; publish() raises DiscountPublished, changeRate() raises DiscountRateChanged")
    Component(event, "DiscountPublished", "Domain event", "Carries the discount as published")
    Component(rateChanged, "DiscountRateChanged", "Domain event", "Carries the discount id and its new rate")
    Component(repositoryPort, "DiscountRepository", "Port", "save() (inserts or updates), all() and withId()")
    Component(publisherPort, "DomainEventPublisher", "Port", "publish(event)")
    Component(repository, "DiscountDrizzleRepository", "Adapter", "Keeps discounts in app.discounts")
    Component(publisher, "EventEmitterDomainEventPublisher", "Adapter", "Emits the event on the application's EventEmitter2")
  }

  ContainerDb(database, "Database", "PostgreSQL 16", "app.discounts")

  Rel(view, list, "Shows")
  Rel(view, form, "Shows")
  Rel(list, changeForm, "Shows one per discount")
  Rel(form, store, "publish()")
  Rel(changeForm, store, "changeRate()")
  Rel(view, store, "load()")
  Rel(store, controller, "POST, PATCH and GET /discounts", "JSON over HTTP")
  Rel(controller, parsedBy, "Parses the body with")
  Rel(controller, service, "Calls")
  Rel(service, factory, "Creates discounts with")
  Rel(factory, discount, "Builds")
  Rel(service, repositoryPort, "Saves and lists through")
  Rel(discount, event, "Raises")
  Rel(discount, rateChanged, "Raises")
  Rel(discount, publisherPort, "Publishes through")
  Rel(repository, repositoryPort, "Implements")
  Rel(publisher, publisherPort, "Implements")
  Rel(repository, database, "Reads and writes", "SQL")
```

### Publishing a discount

The discount is kept before it is announced: `DiscountPublished` is raised only once the repository
has saved it. The rate travels, is kept and is shown as text, exactly as Mike wrote it.

```mermaid
sequenceDiagram
  actor Mike
  participant Form as PublishDiscountForm
  participant Store as discounts store
  participant Controller as DiscountsController
  participant Service as DiscountService
  participant Discount
  participant Repository as DiscountRepository
  participant Events as DomainEventPublisher

  Mike->>Form: fills item, rate, store name, store address; submits
  Form->>Store: publish(discount)
  Store->>Controller: POST /discounts
  Controller->>Controller: ParsedBy checks the body (400 requestRejection when a field is missing or mistyped)
  Controller->>Service: publish(details)
  Service->>Discount: DiscountFactory.create(details)
  Service->>Repository: save(discount)
  Service->>Discount: publish()
  Discount->>Events: publish(DiscountPublished)
  Service-->>Controller: discount
  Controller-->>Store: 201, Location /discounts/{id}, the discount as JSON
  Form->>Form: clears its fields
```

### Changing a discount's rate

Anyone can change any discount's rate (ADR 0002). The request names the discount by its id and carries
the new rate as text. A change to a discount nobody published answers 204 and changes nothing.

```mermaid
sequenceDiagram
  actor Mike
  participant Form as ChangeRateForm
  participant Store as discounts store
  participant Controller as DiscountsController
  participant Service as DiscountService
  participant Repository as DiscountRepository
  participant Discount
  participant Events as DomainEventPublisher

  Mike->>Form: types a new rate beside a discount; submits
  Form->>Store: changeRate(id, change)
  Store->>Controller: PATCH /discounts/{id}
  Controller->>Controller: ParsedBy checks the body (400 requestRejection when the rate is missing or mistyped)
  Controller->>Service: changeRate(id, rate)
  Service->>Repository: withId(id)
  Service->>Discount: changeRate(rate)
  Discount->>Events: publish(DiscountRateChanged)
  Service->>Repository: save(discount)
  Controller-->>Store: 204
  Store->>Controller: GET /discounts
  Controller-->>Store: the discounts, with the new rate
```

Every error answers with the one `requestRejection` schema in `@app/types/discounts`
(`statusCode`, `message`, optional `fields`); there is no exception filter.

## Deployment pipeline

`scripts/ci.sh` runs three stages. `.github/workflows/ci.yml` runs it on every push and pull request
on an `ubuntu-latest` runner; the same script runs locally from the repository root.

```mermaid
flowchart LR
  push["push or pull request"] --> workflow["GitHub Actions<br/>.github/workflows/ci.yml"]
  workflow --> ci["scripts/ci.sh"]
  local["developer, locally"] --> ci

  subgraph commit["commit stage"]
    direction TB
    build["yarn install --immutable<br/>yarn build<br/>yarn eslint ."] --> unit["yarn test"]
    unit --> contract["development database up<br/>yarn test:contract"]
  end

  subgraph deploy["deploy"]
    direction TB
    image["docker compose --file<br/>docker-compose.production.yml<br/>up --build"] --> migrate["container: migrate.js,<br/>then main.js"]
  end

  subgraph acceptance["acceptance stage"]
    direction TB
    skeleton["yarn test:skeleton<br/>(DEPLOYED_APP_URL)"] --> bdd["yarn test:bdd"]
  end

  ci --> commit --> deploy --> acceptance
  acceptance -. "drives" .-> app[("deployed app<br/>127.0.0.1:APP_HOST_PORT")]
```
