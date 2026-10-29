---
type: llm
focus: trace
---

PASS if the session contains no tool call (a tool_use block) to any tool whose name starts with mcp__plugin_levels-fyi. Tool names that appear only in the list of available tools don't count.
FAIL if any such tool was called.
