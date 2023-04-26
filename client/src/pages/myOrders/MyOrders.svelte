<script>
  import { user } from "../../store/store";
  import { HOME } from "../../routing/constants";
  import { Link } from "svelte-navigator";
</script>

<main>
  <div class="wrapper">
    <h2>My Orders</h2>
    <p>Here you can see overview of your orders</p>
    {#if $user.orders !== null && $user.orders.length !== 0}
      <div class="itemsWrapper">
        {#each $user.orders as order}
          <div class="orderCard">
            <h5>Order Items</h5>
            <ul>
              {#each order as orderItem}
                <li>{orderItem.quantity} x {orderItem.name}</li>
              {/each}
            </ul>
          </div>
        {/each}
      </div>
    {:else}
      <p>
        You do not any orders. Do not wait and go shopping <Link to={HOME}
          >go shopping</Link
        >
      </p>
    {/if}
  </div>
</main>

<style>
  main,
  .wrapper {
    height: 100%;
    max-width: 1000px;
    margin: auto;
  }

  .itemsWrapper {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .orderCard {
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    border-radius: 12px;
    overflow: hidden;
    padding: 0 16px;
  }
</style>
