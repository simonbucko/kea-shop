<script>
  import { useNavigate } from "svelte-navigator";
  import { user } from "../store/store";
  import { HOME } from "../routing/constants";

  const navigate = useNavigate();

  $: if (!$user.isLoading && !$user.isAdmin) {
    navigate(HOME, {
      replace: true,
    });
  }
</script>

{#if !$user.isLoading && $user.isAdmin}
  <slot />
{/if}
