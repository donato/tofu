# Strategy

Our goal is to make tofu as pluggable as possible. In order to do this we must first decide
which functionalities will be core behavior and which will be extensions

Phase 1. (Core)
Initialize client-data-store, check for updates, initialize plugin manager

Phase 2. (Core)
Parse current page into metadata, stored locally

Phase 3. (Core and/or Plugin)
Persist data on server

Phase 4. (Plugin)
Reformat the page, supplement it with additional information from server or local-storage

