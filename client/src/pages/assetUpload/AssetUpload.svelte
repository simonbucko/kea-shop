<script>
  import { SERVER_API_URL } from "../../common/constants";
</script>

<main>
  <div class="wrapper">
    <form
      action={`${SERVER_API_URL}/assets`}
      method="POST"
      enctype="multipart/form-data"
    >
      <input
        type="file"
        name="asset"
        placeholder="asset"
        accept="image/png, image/jpeg"
      />

      <button type="submit">submit</button>
    </form>
  </div>
</main>

<style>
  main,
  .wrapper {
    height: 100%;
    max-width: 1000px;
    margin: auto;
  }

  form {
    margin-top: 48px;
  }
</style>
