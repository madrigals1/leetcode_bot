Table of Contents:
- [Error with SQLite3 package installation](#ErrorwithSQLite3packageinstallation)

### Error with SQLite3 package installation

- [StackOverflow link](https://stackoverflow.com/questions/65758025/cant-install-sqlite3-dependency-with-npm)

```
npm WARN deprecated request@2.88.2: request has been deprecated, see https://github.com/request/request/issues/3142
npm WARN deprecated har-validator@5.1.5: this library is no longer supported

> sqlite3@5.0.1 install /home/kevinlopez/Documents/Projects/wsky-be/node_modules/sqlite3
> node-pre-gyp install --fallback-to-build

node-pre-gyp WARN Using request for node-pre-gyp https download 
node-pre-gyp WARN Tried to download(403): https://mapbox-node-binary.s3.amazonaws.com/sqlite3/v5.0.1/napi-v6-linux-x64.tar.gz 
node-pre-gyp WARN Pre-built binaries not found for sqlite3@5.0.1 and node@14.15.4 (node-v83 ABI, glibc) (falling back to source compile with node-gyp) 
make: Entering directory '/home/kevinlopez/Documents/Projects/wsky-be/node_modules/sqlite3/build'
  CC(target) Release/obj.target/nothing/../node-addon-api/nothing.o
  AR(target) Release/obj.target/../node-addon-api/nothing.a
  COPY Release/nothing.a
  ACTION deps_sqlite3_gyp_action_before_build_target_unpack_sqlite_dep Release/obj/gen/sqlite-autoconf-3320300/sqlite3.c
/bin/sh: 1: python: not found
make: *** [deps/action_before_build.target.mk:13: Release/obj/gen/sqlite-autoconf-3320300/sqlite3.c] Error 127
make: Leaving directory '/home/kevinlopez/Documents/Projects/wsky-be/node_modules/sqlite3/build'
gyp ERR! build error 
gyp ERR! stack Error: `make` failed with exit code: 2
gyp ERR! stack     at ChildProcess.onExit (/usr/lib/node_modules/npm/node_modules/node-gyp/lib/build.js:194:23)
gyp ERR! stack     at ChildProcess.emit (events.js:315:20)
gyp ERR! stack     at Process.ChildProcess._handle.onexit (internal/child_process.js:277:12)
gyp ERR! System Linux 5.8.0-7630-generic
gyp ERR! command "/usr/bin/node" "/usr/lib/node_modules/npm/node_modules/node-gyp/bin/node-gyp.js" "build" "--fallback-to-build" "--module=/home/kevinlopez/Documents/Projects/wsky-be/node_modules/sqlite3/lib/binding/napi-v6-linux-x64/node_sqlite3.node" "--module_name=node_sqlite3" "--module_path=/home/kevinlopez/Documents/Projects/wsky-be/node_modules/sqlite3/lib/binding/napi-v6-linux-x64" "--napi_version=7" "--node_abi_napi=napi" "--napi_build_version=6" "--node_napi_label=napi-v6"
gyp ERR! cwd /home/kevinlopez/Documents/Projects/wsky-be/node_modules/sqlite3
gyp ERR! node -v v14.15.4
gyp ERR! node-gyp -v v5.1.0
gyp ERR! not ok 
node-pre-gyp ERR! build error 
node-pre-gyp ERR! stack Error: Failed to execute '/usr/bin/node /usr/lib/node_modules/npm/node_modules/node-gyp/bin/node-gyp.js build --fallback-to-build --module=/home/kevinlopez/Documents/Projects/wsky-be/node_modules/sqlite3/lib/binding/napi-v6-linux-x64/node_sqlite3.node --module_name=node_sqlite3 --module_path=/home/kevinlopez/Documents/Projects/wsky-be/node_modules/sqlite3/lib/binding/napi-v6-linux-x64 --napi_version=7 --node_abi_napi=napi --napi_build_version=6 --node_napi_label=napi-v6' (1)
node-pre-gyp ERR! stack     at ChildProcess.<anonymous> (/home/kevinlopez/Documents/Projects/wsky-be/node_modules/sqlite3/node_modules/node-pre-gyp/lib/util/compile.js:83:29)
node-pre-gyp ERR! stack     at ChildProcess.emit (events.js:315:20)
node-pre-gyp ERR! stack     at maybeClose (internal/child_process.js:1048:16)
node-pre-gyp ERR! stack     at Process.ChildProcess._handle.onexit (internal/child_process.js:288:5)
node-pre-gyp ERR! System Linux 5.8.0-7630-generic
node-pre-gyp ERR! command "/usr/bin/node" "/home/kevinlopez/Documents/Projects/wsky-be/node_modules/sqlite3/node_modules/.bin/node-pre-gyp" "install" "--fallback-to-build"
node-pre-gyp ERR! cwd /home/kevinlopez/Documents/Projects/wsky-be/node_modules/sqlite3
node-pre-gyp ERR! node -v v14.15.4
node-pre-gyp ERR! node-pre-gyp -v v0.11.0
node-pre-gyp ERR! not ok 
Failed to execute '/usr/bin/node /usr/lib/node_modules/npm/node_modules/node-gyp/bin/node-gyp.js build --fallback-to-build --module=/home/kevinlopez/Documents/Projects/wsky-be/node_modules/sqlite3/lib/binding/napi-v6-linux-x64/node_sqlite3.node --module_name=node_sqlite3 --module_path=/home/kevinlopez/Documents/Projects/wsky-be/node_modules/sqlite3/lib/binding/napi-v6-linux-x64 --napi_version=7 --node_abi_napi=napi --napi_build_version=6 --node_napi_label=napi-v6' (1)
npm WARN wsky-be@1.0.0 No description
npm WARN wsky-be@1.0.0 No repository field.
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: fsevents@2.3.1 (node_modules/fsevents):
npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for fsevents@2.3.1: wanted {"os":"darwin","arch":"any"} (current: {"os":"linux","arch":"x64"})

npm ERR! code ELIFECYCLE
npm ERR! errno 1
npm ERR! sqlite3@5.0.1 install: `node-pre-gyp install --fallback-to-build`
npm ERR! Exit status 1
npm ERR! 
npm ERR! Failed at the sqlite3@5.0.1 install script.
npm ERR! This is probably not a problem with npm. There is likely additional logging output above.

npm ERR! A complete log of this run can be found in:
npm ERR!     /home/kevinlopez/.npm/_logs/2021-01-17T06_26_58_042Z-debug.log
```

Resolution:
- Ubuntu
    ```shell script
    sudo apt-get install python-dev
    ```