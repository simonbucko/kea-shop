<script>
  import axios from "axios";
  import { onMount } from "svelte";
  import { SERVER_API_URL } from "../../common/constants";
  import Loader from "../../common/Loader.svelte";
  import LayoutGrid, { Cell } from "@smui/layout-grid";
  import Card from "./Card.svelte";
  import SearchFilter from "./SearchFilter.svelte";
  import Pagination from "./Pagination.svelte";

  let products = [];
  let isLoadingProducts = true;
  let totalProductsCount;
  let page = 1;
  const LIMIT = 12;
  let lastSearchObj;

  onMount(async () => {
    try {
      const {
        data: { data },
      } = await axios.get(`${SERVER_API_URL}/products`, {
        params: { page, limit: LIMIT },
      });
      products = data.products;
      totalProductsCount = data.totalCount;
    } catch (error) {
      console.log(error);
    } finally {
      isLoadingProducts = false;
    }
  });

  const handleSearch = async (searchObj) => {
    try {
      lastSearchObj = { ...searchObj };
      isLoadingProducts = true;
      page = 1;
      const {
        data: { data },
      } = await axios.get(`${SERVER_API_URL}/products`, {
        params: { page, limit: LIMIT, ...searchObj },
      });
      products = data.products;
      totalProductsCount = data.totalCount;
    } catch (error) {
      console.log(error);
    } finally {
      isLoadingProducts = false;
    }
  };

  const handlePageChange = async (newPage) => {
    try {
      isLoadingProducts = true;
      const {
        data: { data },
      } = await axios.get(`${SERVER_API_URL}/products`, {
        params: { page: newPage, limit: LIMIT, ...lastSearchObj },
      });
      products = data.products;
      totalProductsCount = data.totalCount;
      page = newPage;
    } catch (error) {
      console.log(error);
    } finally {
      isLoadingProducts = false;
      window.scrollTo(0, 0);
    }
  };
</script>

<main>
  <SearchFilter onSearch={handleSearch} />
  <div class="wrapper">
    {#if isLoadingProducts}
      <Loader />
    {:else if products.length === 0}
      <div class="emptyStateMessage">
        No product were found for you search. Check you spelling and try again
      </div>
    {:else}
      <LayoutGrid>
        {#each products as product}
          <Cell>
            <Card
              name={product.name}
              productId={product._id}
              price={product.price}
              src={product.imgUrl}
            />
          </Cell>
        {/each}
      </LayoutGrid>
      <Pagination
        currentPage={page}
        lastPage={Math.ceil(totalProductsCount / LIMIT)}
        onPageChange={handlePageChange}
      />
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
  .emptyStateMessage {
    padding: 0 26px;
    text-align: center;
  }
</style>
