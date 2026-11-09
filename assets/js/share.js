(() => {
  const row = document.querySelector(".share-row");
  if (!row) {
    return;
  }

  const url = row.dataset.url;
  const title = row.dataset.title;
  const copyButton = row.querySelector(".share-copy");
  const shareButton = row.querySelector(".share-native");
  const status = row.querySelector(".share-status");

  if (navigator.clipboard && navigator.clipboard.writeText) {
    let resetTimer;
    copyButton.hidden = false;
    copyButton.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(url);
      } catch (error) {
        return;
      }
      copyButton.classList.add("is-copied");
      status.textContent = "Link copied";
      clearTimeout(resetTimer);
      resetTimer = setTimeout(() => {
        copyButton.classList.remove("is-copied");
        status.textContent = "";
      }, 2000);
    });
  }

  if (navigator.share) {
    shareButton.hidden = false;
    shareButton.addEventListener("click", async () => {
      try {
        await navigator.share({ title, url });
      } catch (error) {
        if (error.name !== "AbortError") {
          throw error;
        }
      }
    });
  }
})();
