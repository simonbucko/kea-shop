<script>
  import Button, { Label } from "@smui/button";
  import { navigate } from "svelte-navigator";
  import { PRODUCT } from "../../routing/constants";
  export let name;
  export let price;
  export let productId;
  export let src;
</script>

<div class="card">
  <img {src} alt={name} />
  <div>
    <b>
      {name}
    </b>
  </div>
  <div>{price} &euro;</div>
  <div class="bottom">
    <Button
      variant="raised"
      on:click={() => navigate(`${PRODUCT}/${productId}`)}
    >
      <Label>Details</Label>
    </Button>
  </div>
</div>

<style>
  .card {
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    border-radius: 12px;
    overflow: hidden;
  }
  img {
    width: 100%;
    aspect-ratio: 16/9;
    object-fit: cover;
  }
  div {
    padding: 8px;
  }
  .bottom {
    display: flex;
    justify-content: flex-end;
  }
</style>
