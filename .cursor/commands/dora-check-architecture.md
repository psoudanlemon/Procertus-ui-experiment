Check codebase architecture for issues using dora.

1. Run `dora cycles` to find circular dependencies
2. Run `dora coupling --threshold 5` to find tightly coupled files
3. Run `dora complexity --sort complexity` to identify high-risk files
4. Summarize findings and suggest improvements
