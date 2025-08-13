"use client";

import { useState } from "react";

export default function ContactPage() {
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");

    const handleMailTo = () => {
        const subject = encodeURIComponent(`[Stiktify] Message from ${name || "User"}`);
        const body = encodeURIComponent(message);
        window.location.href = `mailto:support@stiktify.com?subject=${subject}&body=${body}`;
    };

    return (
        <div className="min-h-screen main-layout px-6 py-10 text-white">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Contact Us</h1>

                <div className="bg-[#18182c] rounded-xl p-6 space-y-4">
                    <div>
                        <label className="block text-sm text-purple-300 mb-1">Name</label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-transparent border border-purple-700 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
                            placeholder="Your name"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-purple-300 mb-1">Message</label>
                        <textarea
                            rows={5}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full bg-transparent border border-purple-700 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
                            placeholder="What would you like to tell us?"
                        />
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleMailTo}
                            className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 transition"
                        >
                            Send Email
                        </button>
                        <a
                            href="mailto:support@stiktify.com"
                            className="px-4 py-2 rounded-lg bg-[#2a2b4a] hover:bg-[#34355a] transition"
                        >
                            Open Email Client
                        </a>
                    </div>
                    <p className="text-sm text-purple-300">
                        Or email us directly:{" "}
                        <a className="text-purple-400 underline" href="mailto:support@stiktify.com">
                            support@stiktify.com
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}