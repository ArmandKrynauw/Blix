<!-- Renders a custom webview defined, for instance, by a plugin -->
<script>
  export let src = "";
</script>

<webview
  on:console-message="{(e) => {
    console.log('Guest page logged a message:', e.message);
  }}"
  src="{src}"></webview>
