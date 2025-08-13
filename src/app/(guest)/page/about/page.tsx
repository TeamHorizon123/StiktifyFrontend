import { Metadata } from "next";

export const metadata: Metadata = {
    title: "About | Stiktify",
    description: "About Stiktify and our mission.",
};

export default function AboutPage() {
    return (
        <div className="min-h-screen main-layout px-6 py-10 text-white">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-4">About</h1>
                <p className="text-purple-200 mb-8">
                    Stiktify is a platform where you can discover short videos, music, and connect with a creative community.
                </p>

                <section className="bg-[#18182c] rounded-xl p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-2">Our Mission</h2>
                    <p className="text-purple-300">
                        Empower creators and bring music closer to everyone with a modern and safe experience.
                    </p>
                </section>

                <section className="bg-[#18182c] rounded-xl p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-2">Core Values</h2>
                    <ul className="list-disc list-inside text-purple-300 space-y-1">
                        <li>Respect user privacy and data</li>
                        <li>Encourage creativity, honor artists</li>
                        <li>Fast, stable, and user-friendly experience</li>
                    </ul>
                </section>

                <section className="bg-[#18182c] rounded-xl p-6">
                    <h2 className="text-xl font-semibold mb-2">Contact</h2>
                    <p className="text-purple-300">
                        Email: <a className="text-purple-400 underline" href="mailto:support@stiktify.com">support@stiktify.com</a>
                    </p>
                </section>
            </div>
        </div>
    );
}