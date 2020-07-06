# Inspiration
Tofu is this weird food substance. It's honestly a little bland, but the beauty of tofu is that it can be made to taste like anything. A pinch of this, a dash of that and you can create any flavor in the world. This KoC extension is meant to be as bland and customizable as possible. It's core functionality will be as simple as possible. But plugins can be used to add any feature imaginable (within the rules!).

# Strategy

At the most extreme interpretation, Tofu would be just a plugin-manager which does nothing by default. However, in practice some functionality is necessary for every plugin, and would create dependencies across them. Thus there is a balance to be made between putting some features in plugins versus the Core.

**Core** _Phase 1_
  * Initialize a client-side data-store
  * Install a plugin-manager, with a control-panel
  * Check for updates
  * KoC Page parsing
  * Authentication & Logging (should this be a plugin?)
  * Logging (should this be a plugin?)


**Plugins** _Phase 2_
  * Any UI re-formatting or reorganizing
  * Any supplemental information


## Directory format
  - /src/assets/ : Assets which are files which aren't edited, but are downloaded and updated infrequently
    - /libs/
    - /img/
  - /src/core
    - /control-panel : The UI for authentication and the plugin-manager
    - /pages : One page for each KoC page to handle all parsing
    - /utils : Reusable code snippets and libraries
  - /src/css/
  - /src/plugins/
  - /src/templates/
 