"use client"; // Important: Add "use client" directive

import { useRouter } from "next/navigation"; // Correct import for Next.js 13

export default function GraphBtn() {
  const router = useRouter(); // Move useRouter call to component's body

  const handleClick = () => {
    router.push("/chart");
  };

  return (
    <button
      type="submit"
      onClick={handleClick}
      className="w-full bg-orange-600 text-white p-2 mt-2 rounded-lg"
    >
      Show Crypto Graph
    </button>
  );
}