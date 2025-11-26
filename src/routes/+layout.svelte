<script lang="ts">
  import '../lib/styles/common.css';
  
  const VERSION = "0.6.5";
</script>

<slot />

<footer class="footer">
  <span class="version">{VERSION}</span>
</footer>

<style>
  .footer {
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    padding: 0.5rem 1rem;
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 20px;
    backdrop-filter: blur(10px);
    z-index: 1000;
  }

  .version {
    font-size: 0.9rem;
    color: #665;
    font-weight: 500;
  }
</style>
