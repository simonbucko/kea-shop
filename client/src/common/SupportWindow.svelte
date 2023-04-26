<script>
  import io from "socket.io-client";
  import { onMount } from "svelte";
  import { SERVER_SOCKET_URL, SERVER_API_URL } from "./constants";
  import IconButton from "@smui/icon-button";
  import Select, { Option } from "@smui/select";
  import Button, { Label } from "@smui/button";
  import { user } from "../store/store";
  import Textfield from "@smui/textfield";
  import axios from "axios";
  import { createMessageObject } from "../common/functions.js";

  let isSupportWindowOpen = false;
  let isCategoryAnswered = false;
  let category = "";
  const OPTIONS = ["Product", "Delivery", "Other"];
  let isUserAuthenticated = false;
  let messages = [];
  let inputMessage = "";
  let anchor;
  let socket;

  $: if (!$user.isLoading) {
    isUserAuthenticated = $user.isAuthenticated;
  }

  onMount(async () => {});

  const handleSupportWindowOpen = () => {
    isSupportWindowOpen = !isSupportWindowOpen;
  };

  const handleContinue = () => {
    isCategoryAnswered = true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newMessage = createMessageObject(inputMessage, "user");
    if (!messages.length) handleFirstMessage(newMessage);
    else handleSendMessage(newMessage);
  };

  const handleSendMessage = (message) => {
    emitMessage(message);
    messages = [...messages, message];
    //small interval to render new messages first before scrolling
    setTimeout(() => anchor.scrollIntoView(), 100);
    inputMessage = "";
  };

  const emitMessage = (message) => {
    socket.emit("newMessage", message);
  };

  const handleFirstMessage = (firstMessage) => {
    socket = io(`${SERVER_SOCKET_URL}/chatroom`);
    socket.on("connect", async () => {
      socket.on("newMessage", (message) => {
        if (message.sender === "user") return;
        messages = [...messages, message];
      });
      await axios.post(
        `${SERVER_API_URL}/chatrooms`,
        {
          category,
          userId: $user.id,
          socketId: socket.id,
          roomId: socket.id,
          messages: [],
          hasUnreadMessages: true,
        },
        {
          headers: {
            Authorization: `Bearer ${$user.token}`,
          },
        }
      );
      handleSendMessage(firstMessage);
    });
  };
</script>

{#if isUserAuthenticated}
  <div>
    <div class="chip" on:click={handleSupportWindowOpen}>
      <h4>Can we help you?</h4>
    </div>

    {#if isSupportWindowOpen}
      <div class="supportWindow">
        <div class="actionButtons">
          <IconButton
            class="material-icons color-bright"
            on:click={handleSupportWindowOpen}>close</IconButton
          >
        </div>
        <h4 class="windowTitle">Support</h4>
        <div class="windowBody">
          {#if !isCategoryAnswered}
            <div>
              <h4>What do you need help with?</h4>
              <p>
                Before you can talk to one of our supporters, we need know, what
                do you need help with, so we can connect you with correct person
              </p>
              <Select
                variant="outlined"
                bind:value={category}
                label="Category"
                class="fullWidth"
              >
                <Option value="" />
                {#each OPTIONS as option}
                  <Option value={option}>{option}</Option>
                {/each}
              </Select>
              <Button
                variant="raised"
                type="submit"
                style="width: 100%; margin-top: 16px"
                disabled={category === ""}
                on:click={handleContinue}
              >
                <Label>Continue</Label>
              </Button>
            </div>
          {:else}
            <div class="chatWrapper">
              <div class="messagesWrapper">
                {#each messages as message}
                  <div
                    class={`message ${
                      message.sender === "support"
                        ? "supportMessage"
                        : "userMessage"
                    }`}
                  >
                    {message.text}
                  </div>
                {/each}
                <div bind:this={anchor} />
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
                  disabled={inputMessage === ""}
                >
                  <Label>Send</Label>
                </Button>
              </form>
            </div>
          {/if}
        </div>
      </div>
    {/if}
  </div>
{/if}

<style>
  .supportWindow {
    position: fixed;
    right: 16px;
    bottom: 16px;
    z-index: 1500;
    width: 400px;
    height: 450px;
    background-color: var(--bright-color);
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    border-radius: 12px;
    overflow: hidden;
  }
  .actionButtons {
    position: absolute;
    right: 0;
    top: -4px;
  }
  .windowTitle {
    background-color: var(--primary-color);
    text-align: center;
    color: var(--bright-color);
    padding: 8px 0;
  }
  .windowBody {
    padding: 16px;
    height: calc(100% - 70px);
  }
  .chip {
    position: fixed;
    bottom: 32px;
    right: 32px;
    z-index: 1000;
    color: var(--bright-color);
    background-color: var(--primary-color);
    padding: 16px 32px;
    border-radius: 100px;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    cursor: pointer;
    transition: all 0.2s;
    letter-spacing: 1px;
  }
  .chip:hover {
    transform: translateY(-10px);
  }
  h4 {
    margin: 0;
  }

  .chatWrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
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
    margin-top: 8px;
  }

  .message {
    width: fit-content;
    max-width: 66.66%;
    padding: 8px 16px;
    border-radius: 8px;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
  }
  .supportMessage {
    align-self: flex-start;
    color: black;
    background-color: var(--bright-color);
  }
  .userMessage {
    align-self: flex-end;
    color: var(--bright-color);
    background-color: var(--primary-color);
  }
</style>
