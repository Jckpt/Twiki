//@ts-ignore
import Logo from "data-url:./images/icon.png"

import { Storage } from "@plasmohq/storage"

import {
  type TwitchResponse,
  type TwitchStream,
  type UserTwitchKey
} from "~lib/types/twitchTypes"
import {
  createNotification,
  createNotificationMultipleStreams,
  justWentLive
} from "~lib/util/helperFunc"

import { getTwitchStreamer, twitchFetcher } from "./lib/util/fetcher"

chrome.alarms.onAlarm.addListener(() => {
  refresh()
})

chrome.runtime.onStartup.addListener(async () => {
  console.log("Starting up..")
  const storageLocal = new Storage({
    area: "local"
  })
  storageLocal.remove("followedLive")

  refresh()
})

const refresh = async () => {
  console.log("Refreshing..")
  try {
    const storage = new Storage()
    const storageLocal = new Storage({
      area: "local"
    })
    const followedLive =
      await storageLocal.get<TwitchResponse<TwitchStream>>("followedLive")
    const userTwitchKey = await storage.get<UserTwitchKey>("userTwitchKey")
    const notificationsEnabled = await storage.get<boolean>(
      "notificationsEnabled"
    )
    if (!userTwitchKey) {
      console.log("No userTwitchKey")
      return
    }

    const refreshedLive = await twitchFetcher([
      `https://api.twitch.tv/helix/streams/followed?user_id=${userTwitchKey?.user_id}`,
      userTwitchKey
    ])
    await storageLocal.set("followedLive", refreshedLive)
    chrome.action.setBadgeText({ text: refreshedLive.data.length.toString() })
    chrome.action.setBadgeBackgroundColor({ color: "#737373" })
    if (!followedLive) {
      console.log("No followedLive")
      return
    }

    const newLiveChannels = await justWentLive(
      followedLive.data,
      refreshedLive.data
    )

    if (!notificationsEnabled || newLiveChannels.length <= 0) {
      console.log("Notifications disabled or no followed channels")
      return
    }
    if (newLiveChannels.length == 1) {
      const liveChannel = newLiveChannels[0]
      const { profile_image_url } = await getTwitchStreamer(
        userTwitchKey,
        liveChannel.user_id
      )

      createNotification(liveChannel, profile_image_url)
    }
    if (newLiveChannels.length > 1) {
      createNotificationMultipleStreams(newLiveChannels, Logo)
    }
  } catch (error) {
    console.error("Error fetching Twitch data:", error)
  } finally {
    console.log("refresh alarm created")
    chrome.alarms.create("refresh", {
      delayInMinutes: 1.5
    })
  }
}

refresh()
