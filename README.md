# b64folder

   ## Installation

   Go to the [marketplace](https://marketplace.visualstudio.com/items?itemName=cirnovsky.b64folder) and install it.

   ## Usage

   1. `b64folder.fold`: Call "Fold Base64 Code" to fold all occurrences.
   2. `b64folder.unfold`: Call "Unfold Base64 Code" to unfold all occurrences.
   3. On-save fold: Every time the file is saved, all occurrences are folded.
   4. On-close unfold: When the file is closed, all occurrences are unfolded. **⚠ But not the case with closing the entire VS Code program, in which situation all folded occurrences are left with a placeholder and could not be recovered if you do not have an undo history.**
