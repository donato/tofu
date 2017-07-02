# Strategy

Our goal is to make tofu as pluggable as possible. In order to do this we must first decide
which functionalities will be core behavior and which will be extensions

Phase 1. (Core)
Initialize client-data-store, control-panel, check for updates, initialize plugin manager

Phase 2. (Core)
Parse current page into metadata, stored locally

Phase 3. (Plugin)
Reformat the page, supplement it with additional information from server or local-storage, persist data on server




## Directory format
/assets/ - Assets which are files which aren't edited, but are downloaded and updated infrequently
/assets/libs/
/assets/img/
/css/
/templates/

/core/
/core/control-panel/
/core/pages/
/core/utils/

/plugins/
 