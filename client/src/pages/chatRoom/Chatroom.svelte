<script>
  import { onDestroy, onMount } from "svelte";
  import axios from "axios";
  import { SERVER_API_URL, SERVER_SOCKET_URL } from "../../common/constants";
  import io from "socket.io-client";
  import { user } from "../../store/store";
  import Loader from "../../common/Loader.svelte";
  import Button, { Label } from "@smui/button";
  import { useParams } from "svelte-navigator";
  import { createMessageObject } from "../../common/functions.js";
  import Textfield from "@smui/textfield";

  const params = useParams();
  let chatRoom = null;
  let messages;
  let isLoadingChatRoom = true;
  let socket;
  let anchor;
  let inputMessage = "";
  let userHasDisconnected = false;

  onDestroy(() => {
    socket.emit("leaveRoom", $params.socketId);
    socket.disconnect();
  });

  onMount(async () => {
    socket = io(`${SERVER_SOCKET_URL}/chatroom`);
    socket.on("connect", () => {
      setupSocketListeners();
      socket.emit("joinRoom", $params.socketId);
    });

    //get chatroom data
    const {
      data: { data },
    } = await axios.get(`${SERVER_API_URL}/chatrooms/${$params.socketId}`, {
      headers: {
        Authorization: `Bearer ${$user.token}`,
      },
    });

    //mark messages read
    await axios.patch(
      `${SERVER_API_URL}/chatrooms/${$params.socketId}/messages/read`,
      {},
      {
        headers: {
          Authorization: `Bearer ${$user.token}`,
        },
      }
    );

    chatRoom = data.chatRoom;
    messages = chatRoom.messages;
    isLoadingChatRoom = false;
  });

  const setupSocketListeners = () => {
    socket.on("newMessage", (message) => {
      if (message.sender === "support") return;
      messages = [...messages, message];
    });
    socket.on("userDisconnected", () => {
      userHasDisconnected = true;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newMessage = createMessageObject(inputMessage, "support");
    handleSendMessage(newMessage);
  };

  const handleSendMessage = (message) => {
    emitMessage(message);
    messages = [...messages, message];
    //small interval to render new messages first before scrolling
    setTimeout(() => anchor.scrollIntoView(), 100);
    inputMessage = "";
  };

  const emitMessage = (message) => {
    socket.emit("newMessage", message, $params.socketId);
  };
</script>

<main>
  <div class="wrapper">
    <h2>Chat Room</h2>
    <p>Here you can respond to user's questions</p>
    {#if isLoadingChatRoom}
      <Loader />
    {:else if chatRoom !== null}
      <p>User's name: {chatRoom.userName}</p>
      <p>Category: {chatRoom.category}</p>
      <div class="chatWrapper">
        <div class="messagesWrapper">
          {#each messages as message}
            <div
              class={`message ${
                message.sender === "support" ? "supportMessage" : "userMessage"
              }`}
            >
              {message.text}
            </div>
          {/each}
          {#if userHasDisconnected}
            <div class="disconnectedMessage">
              User has disconnected. You can leave chat now.
            </div>
          {/if}
          <div bind:this={anchor} />
        </div>
      </div>
      <form class="inputWrapper" on:submit={handleSubmit}>
        <Textfield
          variant="outlined"
          bind:value={inputMessage}
          style="height: 100%; flex: 1"
        />
        <Button
          variant="raised"
          type="submit"
          disabled={inputMessage === "" || userHasDisconnected}
        >
          <Label>Send</Label>
        </Button>
      </form>
    {:else}
      <p>Requested chat is no longer active or it could not be found</p>
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
  .chatWrapper {
    height: 60%;
    border: 1px solid rgba(149, 157, 165, 0.2);
    border-radius: 12px;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    padding: 16px;
    display: flex;
    flex-direction: column;
  }

  .messagesWrapper {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .inputWrapper {
    display: flex;
    height: 36px;
  }
  .message {
    width: fit-content;
    max-width: 33.33%;
    padding: 8px 16px;
    border-radius: 8px;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
  }
  .userMessage {
    align-self: flex-start;
    color: black;
    background-color: var(--bright-color);
  }
  .supportMessage {
    align-self: flex-end;
    color: var(--bright-color);
    background-color: var(--primary-color);
  }
  .disconnectedMessage {
    text-align: center;
    color: gray;
  }
</style>
