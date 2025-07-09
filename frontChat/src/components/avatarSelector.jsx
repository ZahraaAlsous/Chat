import React, { useState } from "react";

const animalAvatars = [
  { seed: "dog", label: "🐶" },
  { seed: "monkey", label: "🐵" },
  { seed: "cat", label: "🐱" },
  { seed: "fox", label: "🦊" },
  { seed: "panda", label: "🐼" },
  { seed: "lion", label: "🦁" },
  { seed: "rabbit", label: "🐰" },
  { seed: "tiger", label: "🐯" },
];

export default function AvatarSelector({ onSelectAvatar }) {
  const [selectedAvatar, setSelectedAvatar] = useState(null);

  const handleAvatarSelect = (avatarSeed) => {
    setSelectedAvatar(avatarSeed);
    onSelectAvatar(avatarSeed);
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Choose an Avatar</h2>
      <div className="grid grid-cols-4 gap-3">
        {animalAvatars.map(({ seed, label }) => (
          <button
            key={seed}
            onClick={() => handleAvatarSelect(seed)}
            className={`p-1 rounded-full border-2 ${
              selectedAvatar === seed ? "border-blue-500" : "border-transparent"
            }`}
          >
            <img
              src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}`}
              alt={label}
              className="w-16 h-16 rounded-full"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
