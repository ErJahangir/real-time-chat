import { Image, Send, X } from "lucide-react";
import React, { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePrev, setImagePrev] = useState(null);
  const { sendMessage } = useChatStore();
  const fileInputRef = useRef(null);

  const handeImage = (e) => {
    const file = e.target.files[0];

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePrev(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePrev(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePrev) return;
    try {
      await sendMessage({
        text: text.trim(),
        image: imagePrev,
      });
      setText("");
      setImagePrev(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.log("failed to send message");
    }
  };

  // console.log(imagePrev);

  return (
    <div className="p-4 w-full">
      {imagePrev && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePrev}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handeImage}
          />

          <button
            type="button"
            className={`hidden sm:flex btn btn-circle
                     ${imagePrev ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() && !imagePrev}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;