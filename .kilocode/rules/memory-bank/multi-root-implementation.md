# Multi-Root Workspace Implementation Plan

## Problem Statement

**Issue #822**: @ mentions in Kilo Code's chatbox only show files from the first workspace in multi-root workspace configurations, limiting functionality for users working with complex project setups.

**Root Cause**: The codebase uses `vscode.workspace.workspaceFolders[0]` and `getWorkspacePath()` (which returns only the first workspace) throughout the file search and workspace tracking systems.

## Implementation Progress

### ✅ Phase -1: Centralization (COMPLETED)

**Commit**: `refactor: centralize all workspaceFolders[0] access through getWorkspacePath()`

Replaced all direct `workspaceFolders[0]` access with centralized `getWorkspacePath()` calls:

- `src/services/mcp/McpHub.ts` (2 locations)
- `src/utils/autoLaunchingTask.ts`
- `src/core/webview/webviewMessageHandler.ts`

### ✅ Phase 0: Infrastructure (COMPLETED)

**Commit**: `feat: add multi-workspace path utilities (no behavior change)`

Added multi-workspace utilities to `src/utils/path.ts`:

- `getAllWorkspacePaths()`: Returns all workspace folder paths
- `getWorkspaceForPath()`: Finds workspace containing a specific file path
- `resolvePathInWorkspace()`: Resolves relative paths within specific workspaces

### ✅ Phase 1: Enhanced File Search (COMPLETED - 3 commits)

**Commits**:

- `feat: add workspace context to FileResult interface`
- `feat: add searchAllWorkspaceFiles function (no behavior change)`
- `feat: enable multi-workspace file search in @ mentions`

Enhanced file search system:

- Updated `FileResult` interface with `workspaceName?: string` field
- Added `searchAllWorkspaceFiles()` function for cross-workspace searching
- Updated webview message handler to use multi-workspace search
- **Key Design Decision**: Workspace prefixing (`workspace1:path`) only used in UI contexts

### ✅ Phase 2: Workspace Tracking (COMPLETED)

**Commit**: `feat: update WorkspaceTracker for multi-workspace support`

Updated WorkspaceTracker with critical design refinement:

- **Key Change**: File paths remain relative (e.g., `src/file.ts`) for downstream compatibility
- Added `workspaceInfo` field to provide workspace context to webview
- Multi-workspace file collection from all workspace folders
- Extended `ExtensionMessage.ts` with `WorkspaceInfo` and `WorkspaceFolder` types

**Critical Design Decision**: Workspace prefixing only occurs in UI contexts (@ mentions dropdown), not in core file tracking, to maintain downstream tool compatibility.

## Implementation Phases (Remaining)

### Phase 3: @ Mention System (2 behavioral commits)

#### Step 3.1: Workspace-Prefixed Path Support

**Goal**: Update @ mention parsing to handle workspace-prefixed paths

**Changes to `src/core/mentions/index.ts`**:

- Update `parseMentions()` to detect workspace-prefixed paths (`workspace1:/path/to/file`)
- Use `resolvePathInWorkspace()` for path resolution
- Handle workspace context in file content retrieval

**Commit**: `feat: support workspace-prefixed paths in @ mentions`

#### Step 3.2: UI Enhancements

**Goal**: Add workspace headers to @ mention dropdown

**Changes to `webview-ui/src/utils/context-mentions.ts`**:

- Add `WorkspaceHeader` to `ContextMenuOptionType` enum
- Update `getContextMenuOptions()` to group files by workspace
- Add workspace headers (📁 workspace name) in dropdown
- Handle workspace context in file options

**Commit**: `feat: add workspace headers to @ mention dropdown`

### Phase 4: Environment Details (1 enhancement commit)

**Goal**: Include files from all workspaces in task context.

**Changes to `src/core/environment/getEnvironmentDetails.ts`**:

- Use `getAllWorkspacePaths()` instead of single workspace
- For multi-workspace: show each workspace as separate section
- Distribute file limits across workspaces

**Commit**: `feat: include all workspaces in environment details`

## Success Criteria

✅ @ mentions show files from all workspace folders  
✅ File search works across all workspaces  
✅ Clear workspace identification in UI  
✅ No regression in single-workspace scenarios  
✅ Performance remains acceptable with multiple workspaces

## Scope Limitations

- **Kilo Code Configuration**: `.kilocode/` folder access remains first-workspace only
- **MCP Services**: Will be addressed in follow-up work
- **Auto-launching Tasks**: Will be addressed in follow-up work

## Key Design Decisions Made

1. **Relative Paths in Core**: File paths remain relative throughout core systems for downstream compatibility
2. **Workspace Prefixing in UI Only**: Workspace prefixes (`workspace1:path`) only used in UI contexts like @ mentions
3. **Workspace Context via Metadata**: Workspace information provided through separate fields (`workspaceInfo`, `workspaceName`) rather than path prefixing
4. **Backward Compatibility**: Single workspace scenarios continue to work exactly as before
