<script>
  import { onDestroy, onMount } from "svelte";
  import axios from "axios";
  import { SERVER_API_URL, SERVER_SOCKET_URL } from "../../common/constants";
  import io from "socket.io-client";
  import { user } from "../../store/store";
  import Loader from "../../common/Loader.svelte";
  import Button, { Label } from "@smui/button";
  import { navigate } from "svelte-navigator";
  import { CHAT_ROOM } from "../../routing/constants";

  let chatRooms = [];
  let isLoadingChatRooms = true;
  let socket;

  onDestroy(() => {
    socket.disconnect();
  });

  onMount(async () => {
    socket = io(`${SERVER_SOCKET_URL}/chatrooms`);
    socket.on("connect", () => {
      setupSocketListeners();
    });
    //get chatrooms
    const {
      data: { data },
    } = await axios.get(`${SERVER_API_URL}/chatrooms`, {
      headers: {
        Authorization: `Bearer ${$user.token}`,
      },
    });
    chatRooms = data.chatRooms;
    isLoadingChatRooms = false;
  });

  const setupSocketListeners = () => {
    socket.on("new-active-chat-room", (chatRoom) => {
      chatRooms = [chatRoom, ...chatRooms];
    });
    socket.on("new-unread-messages", (roomId) => {
      chatRooms = chatRooms.map((chatRoom) => {
        if (chatRoom._id === roomId) {
          return {
            ...chatRoom,
            hasUnreadMessages: true,
          };
        } else return chatRoom;
      });
    });
    socket.on("new-messages-read", (roomId) => {
      chatRooms = chatRooms.map((chatRoom) => {
        if (chatRoom._id === roomId) {
          return {
            ...chatRoom,
            hasUnreadMessages: false,
          };
        } else return chatRoom;
      });
    });
  };
</script>

<main>
  <div class="wrapper">
    <h2>Chat Rooms</h2>
    <p>Here you can see overview of all active support chat rooms</p>
    {#if isLoadingChatRooms}
      <Loader />
    {:else if !!chatRooms.length}
      <div class="itemsWrapper">
        {#each chatRooms as chatRoom}
          <div class="card">
            <div class="cardRowWrapper">
              <h3>Customer: {chatRoom.userName}</h3>
              {#if chatRoom.hasUnreadMessages}
                <span class="unreadMessages"> Unread Messages </span>
              {/if}
            </div>
            <div class="cardRowWrapper">
              <p>Category: {chatRoom.category}</p>
              <Button
                variant="raised"
                on:click={() => navigate(`${CHAT_ROOM}/${chatRoom.socketId}`)}
              >
                <Label>Reply</Label>
              </Button>
            </div>
          </div>
        {/each}
      </div>
    {:else}
      <p>There are no active chat rooms!</p>
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
  .card {
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    border-radius: 12px;
    overflow: hidden;
    padding: 16px;
  }
  .cardRowWrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .unreadMessages {
    border: 3px solid var(--secondary-color);
    border-radius: 100px;
    padding: 4px 16px;
    color: var(--secondary-color);
    animation-name: scaling;
    animation-duration: 0.8s;
    animation-iteration-count: infinite;
    animation-direction: alternate;
  }
  @keyframes scaling {
    0% {
      transform: scale(1);
    }
    100% {
      transform: scale(1.1);
    }
  }
</style>
