<script>
  import Routing from "./routing/Routing.svelte";
  import axios from "axios";
  import { SERVER_API_URL } from "./common/constants";
  import { user, defaultUser } from "./store/store";
  const authenticate = async () => {
    user.set({
      ...$user,
      isLoading: true,
    });
    const token = sessionStorage.getItem("token");
    if (token !== null) {
      try {
        const {
          data: { data },
        } = await axios.get(`${SERVER_API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        user.set({
          ...data.user,
          isLoading: false,
          isAuthenticated: true,
        });
        sessionStorage.setItem("token", data.user.token);
      } catch (error) {
        console.log(error);
      }
    } else {
      user.set(defaultUser);
    }
  };
  authenticate();
</script>

<Routing />
