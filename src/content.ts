const addCopyButtons = (): void => {
  const commentsList = document.querySelector(
    ".comments-list"
  ) as HTMLElement | null;
  if (!commentsList) {
    console.log("No comments list found");
    return;
  }

  const comments = commentsList.querySelectorAll(".comment");

  comments.forEach((comment) => {
    const title = comment.querySelector(".comment-title") as HTMLElement | null;

    if (title && !title.querySelector("button.copy-button")) {
      console.log("Adding button to:", title);

      // Create the Copy button
      const copyButton = document.createElement("button");
      copyButton.innerText = "Copy";
      copyButton.classList.add("copy-button");
      copyButton.style.marginLeft = "10px";

      // Add click event listener to the Copy button
      copyButton.addEventListener("click", () => {
        const richTextEditor = comment.querySelector(
          ".ProseMirror"
        ) as HTMLElement | null;
        if (richTextEditor) {
          // Convert rich text to plain text with line breaks
          const textToCopy = convertRichTextToPlainText(richTextEditor);
          navigator.clipboard
            .writeText(textToCopy)
            .then(() => {
              console.log("Text copied to clipboard");
            })
            .catch((err) => {
              console.error("Failed to copy text: ", err);
            });
        }
      });

      title.appendChild(copyButton);
    }
  });
};

// Function to convert rich text to plain text with line breaks
const convertRichTextToPlainText = (element: HTMLElement): string => {
  let text = "";

  element.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      // Add text content
      text += node.textContent;
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      if (el.tagName === "BR" || el.tagName === "DIV" || el.tagName === "P") {
        // Add a line break for certain tags
        text += "\n";
      }
      // Recursively process child nodes
      text += convertRichTextToPlainText(el);
    }
  });

  return text.trim();
};

// Use MutationObserver to handle dynamic loading of comments
const observer = new MutationObserver(() => {
  addCopyButtons();
});

observer.observe(document.body, { childList: true, subtree: true });

// Initial run
addCopyButtons();
