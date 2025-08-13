import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms of Service | Stiktify",
    description: "Stiktify Terms of Service.",
};

export default function TermsPage() {
    return (
        <div className="min-h-screen main-layout px-6 py-10 text-white">
            <div className="max-w-4xl mx-auto space-y-6">
                <h1 className="text-3xl font-bold">Terms of Service</h1>
                <section className="bg-[#18182c] rounded-xl p-6">
                    <h2 className="text-xl font-semibold mb-2">1. Acceptance of Terms</h2>
                    <p className="text-purple-300">
                        By using Stiktify, you agree to comply with these terms and related policies.
                    </p>
                </section>
                <section className="bg-[#18182c] rounded-xl p-6">
                    <h2 className="text-xl font-semibold mb-2">2. User Content</h2>
                    <ul className="list-disc list-inside text-purple-300 space-y-1">
                        <li>No violation of law, copyright, or privacy rights.</li>
                        <li>No posting of hateful, violent, or pornographic content.</li>
                        <li>Stiktify reserves the right to remove violating content.</li>
                    </ul>
                </section>
                <section className="bg-[#18182c] rounded-xl p-6">
                    <h2 className="text-xl font-semibold mb-2">3. Intellectual Property</h2>
                    <p className="text-purple-300">
                        Brand, interface, and resources belong to Stiktify. Content posted by users belongs to the respective users.
                    </p>
                </section>
            </div>
        </div>
    );
}