StringLitWrapper
================

Small tool for wrapping long string literals in source code.  Runs entirely in the browser--your code is never transmitted anywhere. 

When you want to include a long string literal in your C-language-family code, but you want to respect a line-width convention.

The motivation here comes from LPC coding (MUDs) where it's much more common for long string literals to be embedded in the code than be loaded in from a resource file.

##Example

StringLitWrapper can turn the following:

    void init() {
        set_room_desc("You are standing in an open field west of a white house, with a boarded front door.\nThere is a small mailbox here.")
    }

into the much more terminal-friendly:

    void init() {
        set_room_desc("You are standing in an open field west of a white house, "
                      "with a boarded front door.\nThere is a small mailbox here.")
    }
    
Just drop your code into the textarea and go.
