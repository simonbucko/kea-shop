<script>
  import Button, { Label } from "@smui/button";
  import Textfield from "@smui/textfield";
  import Menu from "@smui/menu";
  import List, { Item, Text } from "@smui/list";

  export let onSearch;
  let searchText = "";
  let filterMenu;
  let priceOrder = "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    onSearch({ priceOrder, searchText });
  };

  const handleOrderChange = (order) => {
    priceOrder = order;
    onSearch({ priceOrder, searchText });
  };
</script>

<section>
  <form class="inputWrapper" on:submit={handleSubmit}>
    <Textfield
      variant="outlined"
      bind:value={searchText}
      style="height: 100%; flex: 1"
    />
    <Button variant="raised" type="submit">
      <Label>Search</Label>
    </Button>
  </form>
  <div>
    <Button
      variant="raised"
      class="material-icons"
      on:click={() => filterMenu.setOpen(true)}>Order</Button
    >
    <Menu bind:this={filterMenu}>
      <List>
        <Item on:SMUI:action={() => handleOrderChange("ASC")}>
          <Text>Lowest Price</Text>
        </Item>
        <Item on:SMUI:action={() => handleOrderChange("DESC")}>
          <Text>Highest Price</Text>
        </Item>
      </List>
    </Menu>
  </div>
</section>

<style>
  section {
    padding: 0 26px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .inputWrapper {
    display: flex;
    height: 36px;
    margin: 32px 0;
    flex: 1;
  }
</style>
