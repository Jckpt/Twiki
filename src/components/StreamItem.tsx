import { PersonIcon } from "@radix-ui/react-icons"
import React from "react"

const StreamItem = ({
  stream: { user_login, user_name, viewer_count, title, game_name }
}) => {
  return (
    <a
      key={user_login}
      href={`https://twitch.tv/${user_login}`}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-neutral-900 items-center flex justify-start p-2 hover:bg-neutral-800">
      <div className="h-[54px] w-[96px] flex items-center">
        <img
          src={`https://static-cdn.jtvnw.net/previews-ttv/live_user_${user_login}-96x54.jpg`}
          alt="stream preview"
          className="h-fit"
        />
      </div>
      <div className="flex w-full flex-col pl-1.5">
        <div className="flex justify-between">
          <h1 className="text-white text-sm font-bold">{user_name}</h1>
          <div className="text-red-600 flex flex-row items-center">
            <PersonIcon /> {viewer_count}
          </div>
        </div>
        <div
          className="text-gray-300 w-52 overflow-ellipsis overflow-hidden whitespace-nowrap"
          title={title}>
          {title}
        </div>
        <div className="text-gray-300">{game_name}</div>
      </div>
    </a>
  )
}

export default StreamItem