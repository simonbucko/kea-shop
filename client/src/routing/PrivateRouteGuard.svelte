<script>
  import { useNavigate } from "svelte-navigator";
  import { user } from "../store/store";
  import { HOME } from "../routing/constants";

  const navigate = useNavigate();

  $: if (!$user.isLoading && !$user.isAuthenticated) {
    navigate(HOME, {
      replace: true,
    });
  }
</script>

{#if !$user.isLoading && $user.isAuthenticated}
  <slot />
{/if}
